"use client"

import { NavMain } from "@/components/sidebar-components/sidebar-adm/nav-main"
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import {
  Calendar,
  Folders,
  Logs,
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
      collapsible="icon"
      style={{
        "--sidebar": "#00357a",
        "--sidebar-foreground": "#ffffff",
        "--sidebar-primary": "#ffffff",
        "--sidebar-primary-foreground": "#00357a",
        "--sidebar-accent": "rgba(255, 255, 255, 0.12)",
        "--sidebar-accent-foreground": "#ffffff",
        "--sidebar-border": "rgba(255, 255, 255, 0.18)",
        "--sidebar-ring": "rgba(255, 255, 255, 0.3)",
      }}
      {...props}>
      <SidebarContent className="py-1">
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
