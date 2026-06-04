"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { maquinaSyncService } from "@/services/maquinaSyncService";

export default function SyncPlacaDialog({ maquinaId, iconSize = 32 }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parando, setParando] = useState(false);
  const [desconectando, setDesconectando] = useState(false);
  const [codigo, setCodigo] = useState(null);
  const [expiraEm, setExpiraEm] = useState(null);
  const [placaUid, setPlacaUid] = useState(null);
  const [statusSync, setStatusSync] = useState(null);

  const conectado = statusSync === "Concluida" && Boolean(placaUid);
  const emProgresso = statusSync && statusSync !== "Concluida";

  const expiraLabel = useMemo(() => {
    if (!expiraEm) return null;
    const dt = new Date(expiraEm);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }, [expiraEm]);

  const limparStatusLocal = useCallback(() => {
    setCodigo(null);
    setExpiraEm(null);
    setPlacaUid(null);
    setStatusSync(null);
  }, []);

  const aplicarStatus = useCallback((resp, { notificarConexao = false } = {}) => {
    if (resp?.status === "Concluida") {
      setCodigo(resp?.pairing_code ?? null);
      setExpiraEm(resp?.expires_at ?? null);
      setPlacaUid(resp?.board_uid ?? null);
      setStatusSync(resp?.status ?? null);

      if (notificarConexao && resp?.board_uid) {
        toast.success("Placa conectada com sucesso!", {
          description: `UID: ${resp.board_uid}`,
          duration: 5000,
        });
      }
      return;
    }

    if (resp?.status === "SemSessao") {
      limparStatusLocal();
      return;
    }

    setCodigo(resp?.pairing_code ?? null);
    setExpiraEm(resp?.expires_at ?? null);
    setPlacaUid(resp?.board_uid ?? null);
    setStatusSync(resp?.status ?? null);
  }, [limparStatusLocal]);

  useEffect(() => {
    let ativo = true;

    async function carregarStatusInicial() {
      try {
        const resp = await maquinaSyncService.obterStatusSincronizacaoPlaca(maquinaId);
        if (ativo) aplicarStatus(resp);
      } catch {
        // O icone de sincronizacao continua disponivel se a consulta inicial falhar.
      }
    }

    if (maquinaId) carregarStatusInicial();

    return () => {
      ativo = false;
    };
  }, [aplicarStatus, maquinaId]);

  useEffect(() => {
    if (!emProgresso) return undefined;

    let ativo = true;

    async function consultarStatus() {
      try {
        const resp = await maquinaSyncService.obterStatusSincronizacaoPlaca(maquinaId);
        if (ativo) aplicarStatus(resp, { notificarConexao: true });
      } catch {
        // Mantem a janela aguardando; erros temporarios de rede nao cancelam o pareamento.
      }
    }

    consultarStatus();
    const intervalId = window.setInterval(consultarStatus, 2000);

    return () => {
      ativo = false;
      window.clearInterval(intervalId);
    };
  }, [aplicarStatus, emProgresso, maquinaId]);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);

    if (!nextOpen && !conectado) {
      limparStatusLocal();
      setLoading(false);
      setParando(false);
      setDesconectando(false);
    }
  }

  async function iniciar() {
    try {
      setLoading(true);
      const resp = await maquinaSyncService.iniciarSincronizacaoPlaca(maquinaId);
      aplicarStatus(resp, { notificarConexao: resp?.status === "Concluida" });
      if (resp?.status !== "Concluida") {
        toast.success("Sessao de sincronizacao iniciada. Pressione o botao Setup da placa por 3 segundos.");
      }
    } catch (e) {
      toast.error(e?.message || "Nao foi possivel iniciar a sincronizacao.");
    } finally {
      setLoading(false);
    }
  }

  async function parar() {
    try {
      setParando(true);
      await maquinaSyncService.pararSincronizacaoPlaca(maquinaId);
      limparStatusLocal();
      toast.success("Sincronizacao cancelada.");
    } catch (e) {
      toast.error(e?.message || "Nao foi possivel cancelar a sincronizacao.");
    } finally {
      setParando(false);
    }
  }

  async function desconectar() {
    try {
      setDesconectando(true);
      await maquinaSyncService.desconectarPlacaMaquina(maquinaId);
      limparStatusLocal();
      setOpen(false);
      toast.success("Placa desconectada da maquina.");
    } catch (e) {
      toast.error(e?.message || "Nao foi possivel desconectar a placa.");
    } finally {
      setDesconectando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={conectado ? "text-[var(--trash)] cursor-pointer" : "text-[var(--pencil)] cursor-pointer"}
        aria-label={conectado ? "Desconectar placa" : "Sincronizar placa"}
      >
        {conectado ? <X size={iconSize} /> : <RefreshCw size={iconSize} />}
      </DialogTrigger>

      <DialogContent>
        {conectado ? (
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-blue-900">Desconectar placa</div>

            <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <div className="text-sm font-semibold">Placa sincronizada nesta maquina</div>
                <div className="text-xs text-emerald-800">UID: {placaUid}</div>
              </div>
            </div>

            <div className="text-sm text-gray-700">
              Ao desconectar, esta placa deixa de registrar eventos nesta maquina ate ser sincronizada novamente.
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" disabled={desconectando} onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" disabled={desconectando} onClick={desconectar}>
                {desconectando ? "Desconectando..." : "Desconectar"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-blue-900">
              {emProgresso ? "Sincronizacao em progresso" : "Sincronizar placa"}
            </div>

            <div className="text-sm text-gray-700">
              <div className="mb-2 font-semibold">Como fazer</div>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Pressione o botao <span className="font-semibold">Setup</span> da placa por 3 segundos.</li>
                <li>Clique em <span className="font-semibold">Iniciar sincronizacao</span> nesta maquina.</li>
                <li>As duas etapas podem ser feitas em qualquer ordem dentro de poucos minutos.</li>
              </ol>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={emProgresso ? "destructive" : "default"}
                disabled={loading || parando}
                onClick={emProgresso ? parar : iniciar}
                className="gap-2"
              >
                {loading ? "Iniciando..." : parando ? "Parando..." : emProgresso ? "Parar sincronizacao" : "Iniciar sincronizacao"}
              </Button>

              {codigo ? (
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600">Aguardando placa</div>
                  <div className="text-2xl font-bold tracking-widest text-blue-900">{placaUid ?? codigo}</div>
                  {expiraLabel ? (
                    <div className="text-xs text-gray-500">Expira as {expiraLabel}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
