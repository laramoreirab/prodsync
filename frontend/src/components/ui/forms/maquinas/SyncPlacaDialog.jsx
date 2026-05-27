"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { maquinaSyncService } from "@/services/maquinaSyncService";

export default function SyncPlacaDialog({ maquinaId, iconSize = 32 }) {
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState(null);
  const [expiraEm, setExpiraEm] = useState(null);

  const expiraLabel = useMemo(() => {
    if (!expiraEm) return null;
    const dt = new Date(expiraEm);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }, [expiraEm]);

  async function iniciar() {
    try {
      setLoading(true);
      const resp = await maquinaSyncService.iniciarSincronizacaoPlaca(maquinaId);
      setCodigo(resp?.pairing_code ?? null);
      setExpiraEm(resp?.expires_at ?? null);
      toast.success("Sessão de sincronização iniciada.");
    } catch (e) {
      toast.error(e?.message || "Não foi possível iniciar a sincronização.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setCodigo(null);
          setExpiraEm(null);
          setLoading(false);
        }
      }}
    >
      <DialogTrigger className="text-[var(--pencil)] cursor-pointer" aria-label="Sincronizar Placa">
        <RefreshCw size={iconSize} />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-semibold text-blue-900">Sincronizar Placa</div>

          <div className="text-sm text-gray-700">
            <div className="font-semibold mb-2">Como fazer</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Pressione o botão <span className="font-semibold">Setup</span> da placa por 3 segundos.</li>
              <li>A placa entrará em modo de emparelhamento.</li>
              <li>Clique em <span className="font-semibold">Iniciar sincronização</span> para gerar o código.</li>
              <li>Finalize o pareamento na placa informando o código exibido (válido por poucos minutos).</li>
            </ol>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="default" disabled={loading} onClick={iniciar}>
              {loading ? "Iniciando..." : "Iniciar sincronização"}
            </Button>
            {codigo ? (
              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Código</div>
                <div className="text-2xl font-bold tracking-widest text-blue-900">{codigo}</div>
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

