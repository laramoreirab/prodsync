"use client";

import { BellRing } from "lucide-react";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar/notification-dropdown";

const TITULOS = {
  adm: "Dashboard",
  gestor: "Dashboard",
  operador: "Dashboard",
  maquinas: "Maquinas",
  usuarios: "Usuarios",
  setores: "Setores",
  historicoEventos: "Historico de Eventos",
  ordensDeProducao: "Ordem de Producao",
  andon: "Andon",
  configuracoes: "Configuracoes",
};

function formatarTitulo(pathname) {
  if (!pathname) return "Painel";
  const segmentos = pathname.split("/").filter(Boolean);
  if (segmentos.length <= 1) return TITULOS[segmentos[0]] ?? "Dashboard";

  const alvo = segmentos[segmentos.length - 1];
  if (/^\d+$/.test(alvo) || /^\[.+\]$/.test(alvo)) {
    const anterior = segmentos[segmentos.length - 2];
    return TITULOS[anterior] ?? "Detalhes";
  }

  return TITULOS[alvo] ?? alvo.replace(/[-_]/g, " ");
}

export default function AppContentHeader() {
  const pathname = usePathname();
  const titulo = formatarTitulo(pathname);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4 dark:border-white/15">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{titulo}</h1>

      <NotificationDropdown
        defaultOpen={false}
        align="end"
        trigger={
          <div className="rounded-xl border border-black/10 bg-white/80 p-2.5 transition-colors hover:bg-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15">
            <BellRing className="size-5 text-zinc-900 dark:text-zinc-100" />
          </div>
        }
      />
    </div>
  );
}
