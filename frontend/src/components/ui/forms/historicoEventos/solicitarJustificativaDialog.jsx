"use client";

import { useEffect, useState } from "react";
import { Loader2, BellRing } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { notificacaoService } from "@/services/notificacaoService";
import ModalSucessNotificacao from "./modalSucessNotificacao";

export function SolicitarJustificativaMenuItem({ idEvento, onSucesso }) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!aberto || sucesso || enviando) return;

    let cancelado = false;

    async function enviar() {
      if (!idEvento) {
        toast.error("Evento inválido para solicitar justificativa.");
        setAberto(false);
        return;
      }

      setEnviando(true);
      try {
        await notificacaoService.solicitarJustificativa(idEvento);
        if (!cancelado) {
          setSucesso(true);
          onSucesso?.();
        }
      } catch (error) {
        if (!cancelado) {
          toast.error(error.message || "Erro ao solicitar justificativa.");
          setAberto(false);
        }
      } finally {
        if (!cancelado) setEnviando(false);
      }
    }

    enviar();

    return () => {
      cancelado = true;
    };
  }, [aberto, sucesso, enviando, idEvento, onSucesso]);

  const handleOpenChange = (open) => {
    setAberto(open);
    if (!open) {
      setSucesso(false);
      setEnviando(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setAberto(true);
        }}
        className="cursor-pointer"
      >
        <BellRing className="mr-2 h-4 w-4" />
        Solicitar Justificativa
      </DropdownMenuItem>

      <Dialog open={aberto} onOpenChange={handleOpenChange}>
        <DialogContent>
          {enviando && !sucesso ? (
            <div className="flex flex-col items-center justify-center gap-3 p-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Enviando notificação ao operador...</p>
            </div>
          ) : sucesso ? (
            <ModalSucessNotificacao />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SolicitarJustificativaConteudo({ idsEventos, onSucesso }) {
  const [enviando, setEnviando] = useState(true);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function enviarLote() {
      const ids = (idsEventos ?? []).filter(Boolean);
      if (ids.length === 0) {
        toast.error("Selecione ao menos um evento.");
        setEnviando(false);
        return;
      }

      try {
        await Promise.all(ids.map((id) => notificacaoService.solicitarJustificativa(id)));
        if (ativo) {
          setSucesso(true);
          onSucesso?.();
        }
      } catch (error) {
        toast.error(error.message || "Erro ao solicitar justificativa.");
      } finally {
        if (ativo) setEnviando(false);
      }
    }

    enviarLote();

    return () => {
      ativo = false;
    };
  }, [idsEventos, onSucesso]);

  if (enviando && !sucesso) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Enviando notificações...</p>
      </div>
    );
  }

  if (sucesso) return <ModalSucessNotificacao />;

  return null;
}
