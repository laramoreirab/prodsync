"use client"

import { NavMain } from "@/components/sidebar-components/sidebar-adm/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import ProfileDropdown from "@/components/shadcn-space/blocks/topbar/dropdown-profile"
import {
  Calendar,
  PieChartIcon,
  RefreshCw,
  Users,
  Wrench,
} from "lucide-react"
import { ListBulletsIcon } from "@phosphor-icons/react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/gestor",
      icon: <PieChartIcon />,
    },
    {
      title: "Maquinas",
      url: "/gestor/maquinas",
      icon: <Wrench />,
    },
    {
      title: "Usuarios",
      url: "/gestor/usuarios",
      icon: <Users />,
    },
    {
      title: "Historico de Eventos",
      url: "/gestor/historicoEventos",
      icon: <Calendar />,
    },
    {
      title: "Ordem de Producao",
      url: "/gestor/ordensDeProducao",
      icon: <ListBulletsIcon size={32} />,
    },
    {
      title: "Andon",
      url: "/gestor/andon",
      icon: <RefreshCw />,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar
      collapsible="none"
      className="h-screen w-[280px] border-r border-white/20"
      style={{
        "--sidebar": "var(--azul-cobalto)",
        "--sidebar-foreground": "#ffffff",
        "--sidebar-primary": "#ffffff",
        "--sidebar-primary-foreground": "#00357a",
        "--sidebar-accent": "rgba(255, 255, 255, 0.12)",
        "--sidebar-accent-foreground": "#ffffff",
        "--sidebar-border": "rgba(255, 255, 255, 0.18)",
        "--sidebar-ring": "rgba(255, 255, 255, 0.3)",
      }}
      {...props}>
      <SidebarHeader className="px-5 py-6">
        <a href="#" className="inline-flex items-center">
          <img src="/logo.png" alt="Logo ProdSync" className="h-10 w-auto" />
        </a>
      </SidebarHeader>

      <SidebarContent className="py-1">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-4 pt-3">
        <ProfileDropdown
          align="end"
          trigger={
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-left text-white transition-colors hover:bg-white/20"
            >
              <img src="/userdefault.svg" alt="Usuario" className="h-8 w-8 rounded-full" />
              <span className="truncate text-sm font-medium">Minha conta</span>
            </button>
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
