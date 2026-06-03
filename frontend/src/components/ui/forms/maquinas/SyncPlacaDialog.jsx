"use client";

import { useMemo, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { maquinaSyncService } from "@/services/maquinaSyncService";

export default function SyncPlacaDialog({ maquinaId, iconSize = 32 }) {
  const [loading, setLoading] = useState(false);
  const [parando, setParando] = useState(false);
  const [codigo, setCodigo] = useState(null);
  const [expiraEm, setExpiraEm] = useState(null);
  const [placaUid, setPlacaUid] = useState(null);
  const [statusSync, setStatusSync] = useState(null);

  const expiraLabel = useMemo(() => {
    if (!expiraEm) return null;
    const dt = new Date(expiraEm);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }, [expiraEm]);

  const emProgresso = statusSync && statusSync !== "Concluida";

  useEffect(() => {
    if (!emProgresso) return undefined;

    let ativo = true;

    async function consultarStatus() {
      try {
        const resp = await maquinaSyncService.obterStatusSincronizacaoPlaca(maquinaId);
        if (!ativo) return;

        if (resp?.status === "Concluida") {
          setCodigo(resp?.pairing_code ?? null);
          setExpiraEm(resp?.expires_at ?? null);
          setPlacaUid(resp?.board_uid ?? null);
          setStatusSync(resp?.status ?? null);
          return;
        }

        if (resp?.status === "SemSessao") {
          setCodigo(null);
          setExpiraEm(null);
          setPlacaUid(null);
          setStatusSync(null);
        }
      } catch {
        // Mantem a janela aguardando; erros temporarios de rede nao devem cancelar o pareamento.
      }
    }

    consultarStatus();
    const intervalId = window.setInterval(consultarStatus, 2000);

    return () => {
      ativo = false;
      window.clearInterval(intervalId);
    };
  }, [emProgresso, maquinaId]);

  useEffect(() => {
    if (statusSync === "Concluida" && placaUid) {
      toast.success("Placa conectada com sucesso!", {
        description: `UID: ${placaUid}`,
        duration: 5000
      });
    }
  }, [statusSync, placaUid]);

  async function iniciar() {
    try {
      setLoading(true);
      const resp = await maquinaSyncService.iniciarSincronizacaoPlaca(maquinaId);
      setCodigo(resp?.pairing_code ?? null);
      setExpiraEm(resp?.expires_at ?? null);
      setPlacaUid(resp?.board_uid ?? null);
      setStatusSync(resp?.status ?? null);
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
      setCodigo(null);
      setExpiraEm(null);
      setPlacaUid(null);
      setStatusSync(null);
      toast.success("Sincronização cancelada.");
    } catch (e) {
      toast.error(e?.message || "Nao foi possivel cancelar a sincronizacao.");
    } finally {
      setParando(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setCodigo(null);
          setExpiraEm(null);
          setPlacaUid(null);
          setStatusSync(null);
          setLoading(false);
          setParando(false);
        }
      }}
    >
      <DialogTrigger className="text-[var(--pencil)] cursor-pointer" aria-label="Sincronizar placa">
        <RefreshCw size={iconSize} />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-semibold text-blue-900">
            {emProgresso ? "Sincronização em progresso" : "Sincronizar placa"}
          </div>

          <div className="text-sm text-gray-700">
            <div className="font-semibold mb-2">Como fazer</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Pressione o botao <span className="font-semibold">Setup</span> da placa por 3 segundos.</li>
              <li>Clique em <span className="font-semibold">Iniciar sincronização</span> nesta maquina.</li>
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
              {loading ? "Iniciando..." : parando ? "Parando..." : emProgresso ? "Parar sincronização" : "Iniciar sincronização"}
            </Button>
            {codigo ? (
              <div className="flex flex-col">
                <div className="text-sm text-gray-600">
                  {statusSync === "Concluida" ? "✓ Placa sincronizada" : "Aguardando placa"}
                </div>
                <div className="text-2xl font-bold tracking-widest text-blue-900">{placaUid ?? codigo}</div>
                {expiraLabel ? (
                  <div className="text-xs text-gray-500">Expira às {expiraLabel}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
