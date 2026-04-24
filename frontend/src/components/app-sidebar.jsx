"use client"

import { NavMain } from "@/components/nav-main"
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/adm/DashboardGeralEmpresaADM",
      icon: <PieChartIcon />,
    },
    {
      title: "Maquinas",
      url: "/adm/maquinas",
      icon: <Wrench />,
    },
    {
      title: "Usuarios",
      url: "/adm/usuarios",
      icon: <Users />,
    },
    {
      title: "Setores",
      url: "/adm/setores",
      icon: <Folders />,
    },
    {
      title: "Historico de Eventos",
      url: "#",
      icon: <Calendar />,
    },
    {
      title: "Ordem de Producao",
      url: "#",
      icon: <Logs />,
    },
    {
      title: "Andon",
      url: "#",
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
