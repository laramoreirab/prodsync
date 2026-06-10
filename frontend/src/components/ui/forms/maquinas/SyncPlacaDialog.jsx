"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CloudBackup, X } from "lucide-react";
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
        toast.success("Sessão de sincronização iniciada. Pressione o botão Setup da placa por 3 segundos.");
      }
    } catch (e) {
      toast.error(e?.message || "Não foi possível iniciar a sincronização.");
    } finally {
      setLoading(false);
    }
  }

  async function parar() {
    try {
      setParando(true);
      await maquinaSyncService.pararSincronizacaoPlaca(maquinaId);
      limparStatusLocal();
      toast.success("Sincronização cancelada.");
    } catch (e) {
      toast.error(e?.message || "Não foi possível cancelar a sincronização.");
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
      toast.error(e?.message || "Não foi possível desconectar a placa.");
    } finally {
      setDesconectando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={conectado ? "text-[#2d6645] cursor-pointer" : "text-[#2d6645] cursor-pointer"}
        aria-label={conectado ? "Desconectar placa" : "Sincronizar placa"}
      >
        {conectado ? <X size={iconSize} /> : <CloudBackup size={iconSize} />}
      </DialogTrigger>

      <DialogContent>
        {conectado ? (
          <div className="flex flex-col gap-4">
            <div className="text-4xl font-semibold text-blue-900">Desconectar placa</div>

            <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <div className="text-sm font-semibold">Placa sincronizada nesta maquina</div>
                <div className="text-xs text-emerald-800">UID: {placaUid}</div>
              </div>
            </div>

            <div className="text-sm text-gray-700">
              Ao desconectar, esta placa deixa de registrar eventos nesta maquina até ser sincronizada novamente.
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
            <div className="flex text-3xl font-semibold text-blue-900">
              <CloudBackup size={34} className="mr-2" />
              {emProgresso ? "Sincronização Em Progresso" : "Sincronizar Placa"}
            </div>

            <div className="px-8 py-2 mb-6">
              <div className="text-lg text-gray-700">
                <div className="mb-2 font-bold text-black">Como sincronizar</div>
                <ol className="list-decimal space-y-1 pl-5 marker:font-bold  marker:text-black font-medium ">
                  <li>Pressione o botão <span className="font-bold">Setup</span> da placa por 3 segundos.</li>
                  <li>Clique em <span className="font-bold">Iniciar sincronização</span> nesta máquina.</li>
                  <li>As duas etapas podem ser feitas em qualquer ordem dentro de poucos minutos.</li>
                </ol>
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <Button
                  variant={emProgresso ? "destructive" : "default"}
                  disabled={loading || parando}
                  onClick={emProgresso ? parar : iniciar}
                  className={`gap-2 transition-all mt-6 ${!emProgresso
                    ? "cursor-pointer bg-[#002866] hover:bg-[#003891] hover:scale-105 transition-all text-lg py-2 px-5 h-auto"
                    : "cursor-pointer text-lg py-2 px-5 h-auto hover:scale-105 h-auto transition-all"
                    }`}
                >
                  {loading ? "Iniciando Sincronização..." : parando ? "Parando Sincronização..." : emProgresso ? "Parar sincronização" : "Iniciar sincronização"}
                </Button>

                {codigo ? (
                  <div className="flex flex-col text-center">
                    <div className="text-sm text-gray-600">Aguardando placa</div>
                    <div className="text-2xl font-bold tracking-widest text-blue-900">{placaUid ?? codigo}</div>
                    {expiraLabel ? (
                      <div className="text-xs text-gray-500">Expira às {expiraLabel}</div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>



          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
