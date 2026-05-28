"use client"

import { NavMain } from "@/components/sidebar-components/sidebar-adm/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import ProfileDropdown from "@/components/shadcn-space/blocks/topbar/dropdown-profile"
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar/notification-dropdown"
import {
  BellRing,
  Calendar,
  Folders,
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
      url: "/adm",
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
      url: "/adm/historicoEventos",
      icon: <Calendar />,
    },
    {
      title: "Ordem de Producao",
      url: "/adm/ordensDeProducao",
      icon: <ListBulletsIcon size={32} />,
    },
    {
      title: "Andon",
      url: "/adm/andon",
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
      variant="sidebar"
      className="border-r border-[#D9E0EE]"
      style={{
        "--sidebar": "#0f3d84",
        "--sidebar-foreground": "#ffffff",
        "--sidebar-primary": "#1d4ed8",
        "--sidebar-primary-foreground": "#ffffff",
        "--sidebar-accent": "#2956a0",
        "--sidebar-accent-foreground": "#ffffff",
        "--sidebar-border": "#3462ac",
        "--sidebar-ring": "#93c5fd",
      }}
      {...props}>
      <SidebarHeader className="px-4 py-5 group-data-[collapsible=icon]:px-3">
        <a href="#" className="relative inline-flex h-16 items-center group-data-[collapsible=icon]:justify-center">
          <img src="/logo.png" alt="Logo ProdSync" className="h-12 w-auto max-w-[2.75rem] brightness-0 invert opacity-100 transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:opacity-0 group-data-[state=collapsed]/sidebar:scale-95 group-data-[state=collapsed]/sidebar:group-hover/sidebar:opacity-100 group-data-[state=collapsed]/sidebar:group-hover/sidebar:scale-100 group-hover/sidebar:max-w-none" />
          <img src="/logo.svg" alt="Logo ProdSync" className="absolute h-16 w-16 brightness-0 invert opacity-0 scale-95 transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:opacity-100 group-data-[state=collapsed]/sidebar:scale-100 group-data-[state=collapsed]/sidebar:group-hover/sidebar:opacity-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:scale-95" />
        </a>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-3 pt-2 group-data-[collapsible=icon]:px-2">
        <NotificationDropdown
          align="end"
          trigger={
            <div
              className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg border border-white/20 bg-white px-2 text-left text-[#0f3d84] shadow-sm transition-all duration-300 hover:bg-[#f5f8ff] group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-2"
            >
              <BellRing className="size-4 shrink-0" />
              <span className="text-xs font-semibold group-data-[state=collapsed]/sidebar:hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:inline">Notificacoes</span>
            </div>
          }
        />
        <ProfileDropdown
          align="end"
          trigger={
            <div
              className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg border border-white/20 bg-white px-2 text-left text-[#0f3d84] shadow-sm transition-all duration-300 hover:bg-[#f5f8ff] group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-2"
            >
              <img src="/userdefault.svg" alt="Usuario" className="h-6 w-6 shrink-0 rounded-full" />
              <span className="truncate text-xs font-semibold group-data-[state=collapsed]/sidebar:hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:inline">Minha conta</span>
            </div>
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
