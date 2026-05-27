"use client";

import { BellRing } from "lucide-react";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E7EDF7] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-9 rounded-lg border border-[#E5EBF5] bg-white text-[#0f3d84] shadow-sm hover:bg-[#f8faff] hover:text-[#0f3d84]" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a]">{titulo}</h1>
          <span className="mt-1 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa]" />
        </div>
      </div>

      <NotificationDropdown
        defaultOpen={false}
        align="end"
        trigger={
          <div className="rounded-xl border border-[#E5EBF5] bg-white p-2.5 shadow-sm transition-colors hover:bg-[#f8faff]">
            <BellRing className="size-5 text-[#0f172a]" />
          </div>
        }
      />
    </div>
  );
}
