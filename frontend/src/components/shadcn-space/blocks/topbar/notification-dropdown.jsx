"use client";

import { isValidElement, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotificacoes } from "@/hooks/useNotificacoes";
import { getUserFromToken } from "@/lib/auth";
import { AlertTriangle, BellRing, Loader2, Settings2, X } from "lucide-react";

const ICONES_POR_TIPO = {
  Maquina_Parada: {
    icon: AlertTriangle,
    textColor: "stroke-red-500",
    bgColor: "bg-red-500/10",
  },
  Maquina_Setup: {
    icon: Settings2,
    textColor: "stroke-amber-500",
    bgColor: "bg-amber-500/10",
  },
  Solicitar_Justificativa: {
    icon: BellRing,
    textColor: "stroke-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

function formatarHora(dataIso) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterRotaNotificacao(tipoUsuario, notificacao) {
  if (tipoUsuario === "Operador") {
    const precisaJustificar =
      notificacao.tipo === "Solicitar_Justificativa" ||
      notificacao.tipo === "Maquina_Parada" ||
      notificacao.tipo === "Maquina_Setup";

    if (precisaJustificar) return "/operador/historicoEventos?justificar=1";
    return null;
  }

  if (tipoUsuario === "Gestor") return "/gestor/historicoEventos";
  if (tipoUsuario === "Adm") return "/adm/historicoEventos";

  return null;
}

const NotificationDropdown = ({ trigger, defaultOpen, align = "end", contagem, onOpenChange }) => {
  const router = useRouter();
  const [aberto, setAberto] = useState(defaultOpen ?? false);
  const { notificacoes, contagem: contagemNaoLidas, loading, marcarComoLida, marcarTodasComoLidas, excluir } =
    useNotificacoes();
  const tipoUsuario = getUserFromToken()?.tipo;

  const handleClickNotificacao = async (notificacao) => {
    if (!notificacao.lida) {
      await marcarComoLida(notificacao.id);
    }

    const rota = obterRotaNotificacao(tipoUsuario, notificacao);
    if (rota) {
      handleOpenChange(false);
      router.push(rota);
    }
  };

  const handleExcluir = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await excluir(id);
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  const badgeContagem = contagem ?? contagemNaoLidas ?? naoLidas;
  const triggerClassName = isValidElement(trigger) ? trigger.props?.className ?? "" : "";
  const triggerIsFullWidth = typeof triggerClassName === "string" && triggerClassName.includes("w-full");

  const handleOpenChange = (open) => {
    setAberto(open);
    onOpenChange?.(open);
  };

  return (
    <div className={cn("relative flex items-center justify-center", triggerIsFullWidth && "w-full")}>
      {badgeContagem > 0 && (
        <span className="pointer-events-none absolute -top-1 -right-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
          {badgeContagem > 99 ? "99+" : badgeContagem}
        </span>
      )}

      <DropdownMenu open={aberto} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn("relative flex items-center justify-center outline-none", triggerIsFullWidth && "w-full")}
            aria-label="Abrir notificações"
            onClick={(e) => e.stopPropagation()}
          >
            {trigger}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="p-0 ml-3  w-sm rounded-2xl data-open:slide-in-from-top-20! data-closed:slide-out-to-top-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <p className="text-base font-medium text-popover-foreground">Notificações</p>
              {badgeContagem > 0 && (
                <Badge className="h-5 bg-blue-600 font-normal leading-0 hover:bg-blue-600">
                  {badgeContagem} {badgeContagem === 1 ? "nova" : "novas"}
                </Badge>
              )}
            </DropdownMenuLabel>

            <div
              className="max-h-[min(420px,calc(100vh-14rem))] overflow-y-auto overscroll-contain pr-1"
              onWheel={(event) => event.stopPropagation()}
            >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notificacoes.length === 0 ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">Nenhuma notificação.</p>
            ) : (
              notificacoes.map((notificacao) => {
                const config =
                  ICONES_POR_TIPO[notificacao.tipo] ?? ICONES_POR_TIPO.Solicitar_Justificativa;
                const Icon = config.icon;
                const temRota = Boolean(obterRotaNotificacao(tipoUsuario, notificacao));

                return (
                  <div
                    key={notificacao.id}
                    className={cn(
                      "mx-1.5 my-1 flex items-center gap-1 rounded-lg p-1",
                      !notificacao.lida && "bg-blue-50/80 dark:bg-blue-950/30"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleClickNotificacao(notificacao)}
                      className={cn(
                        "flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md p-1 text-left outline-none",
                        temRota && "cursor-pointer hover:bg-muted/50",
                        !temRota && "cursor-default"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={cn("shrink-0 rounded-xl p-2.5", config.bgColor)}>
                          <Icon size={20} className={cn("size-5", config.textColor)} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-popover-foreground">
                              {notificacao.titulo}
                            </p>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {notificacao.mensagem}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {formatarHora(notificacao.criado_em)}
                      </p>
                    </button>

                    <button
                      type="button"
                      aria-label="Excluir notificação"
                      onClick={(e) => handleExcluir(e, notificacao.id)}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground outline-none hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                );
              })
            )}
            </div>

            {notificacoes.length > 0 && badgeContagem > 0 && (
              <div className="mx-1.5 my-1 p-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer rounded-xl"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    marcarTodasComoLidas();
                  }}
                >
                  Marcar todas como lidas
                </Button>
              </div>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationDropdown;
