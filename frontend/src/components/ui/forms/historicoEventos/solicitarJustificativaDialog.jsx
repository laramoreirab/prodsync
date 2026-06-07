"use client";

import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { notificacaoService } from "@/services/notificacaoService";
import ModalSucessNotificacao from "./modalSucessNotificacao";

export function SolicitarJustificativaMenuItem({ idEvento, onSucesso, children }) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const solicitar = async () => {
    if (enviando) return;

    if (!idEvento) {
      toast.error("Evento inválido para solicitar justificativa.");
      return;
    }

    setSucesso(false);
    setEnviando(true);

    try {
      await notificacaoService.solicitarJustificativa(idEvento);
      setSucesso(true);
      setAberto(true);
      onSucesso?.();
    } catch (error) {
      toast.error(error.message || "Erro ao solicitar justificativa.");
      setAberto(false);
    } finally {
      setEnviando(false);
    }
  };

  const handleOpenChange = (open) => {
    setAberto(open);
    if (!open) {
      setSucesso(false);
      setEnviando(false);
    }
  };

  const handleSelect = (event) => {
    event.preventDefault();
    solicitar();
  };

  const trigger = isValidElement(children) ? (
    cloneElement(children, {
      disabled: enviando || children.props.disabled,
      onSelect: (event) => {
        children.props.onSelect?.(event);
        handleSelect(event);
      },
    })
  ) : (
    <DropdownMenuItem onSelect={handleSelect} disabled={enviando} className="cursor-pointer">
      {enviando ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BellRing className="mr-2 h-4 w-4" />
      )}
      {enviando ? "Solicitando..." : "Solicitar Justificativa"}
    </DropdownMenuItem>
  );

  return (
    <>
      {trigger}

      <Dialog open={aberto} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle className="sr-only">Solicitar justificativa</DialogTitle>
          {sucesso ? <ModalSucessNotificacao /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SolicitarJustificativaConteudo({ idsEventos, onSucesso }) {
  const [enviando, setEnviando] = useState(true);
  const [sucesso, setSucesso] = useState(false);
  const onSucessoRef = useRef(onSucesso);
  const idsKey = useMemo(
    () => (idsEventos ?? []).filter(Boolean).join(","),
    [idsEventos]
  );

  useEffect(() => {
    onSucessoRef.current = onSucesso;
  }, [onSucesso]);

  useEffect(() => {
    let ativo = true;

    async function enviarLote() {
      const ids = idsKey.split(",").filter(Boolean);
      if (ids.length === 0) {
        toast.error("Selecione ao menos um evento.");
        setEnviando(false);
        return;
      }

      try {
        await Promise.all(ids.map((id) => notificacaoService.solicitarJustificativa(id)));
        if (ativo) {
          setSucesso(true);
          onSucessoRef.current?.();
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
  }, [idsKey]);

  if (enviando && !sucesso) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12">
        <DialogTitle className="sr-only">Solicitar justificativas</DialogTitle>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Enviando notificações...</p>
      </div>
    );
  }

  if (sucesso) return <ModalSucessNotificacao />;

  return null;
}
