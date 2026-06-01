"use client"

import { useEffect, useMemo, useState } from "react"
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
  PieChartIcon,
  RefreshCw,
  Wrench,
} from "lucide-react"
import { ListBulletsIcon } from "@phosphor-icons/react"
import { apiFetch } from "@/lib/api"
import { getUserFromToken } from "@/lib/auth"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/operador",
      icon: <PieChartIcon />,
    },
    {
      title: "Maquinas",
      url: "/operador/maquinas",
      icon: <Wrench />,
    },
    {
      title: "Historico de Eventos",
      url: "/operador/historicoEventos",
      icon: <Calendar />,
    },
    {
      title: "Ordem de Producao",
      url: "/operador/ordensDeProducao",
      icon: <ListBulletsIcon size={32} />,
    },
    {
      title: "Andon",
      url: "/operador/andon",
      icon: <RefreshCw />,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const [maquinaUrl, setMaquinaUrl] = useState("/operador/maquinas")

  useEffect(() => {
    let ativo = true

    async function carregarMaquinaOperador() {
      const usuario = getUserFromToken()
      const idOperador = usuario?.id_usuario

      if (!idOperador) return

      try {
        const resposta = await apiFetch(`/api/maquinas/obter-maquina-operador/${idOperador}`)
        const idMaquina = resposta?.id_maquina ?? resposta?.dados?.id_maquina

        if (ativo && idMaquina) {
          setMaquinaUrl(`/operador/maquinas/${idMaquina}`)
        }
      } catch (error) {
        console.error("Erro ao carregar maquina do operador:", error)
      }
    }

    carregarMaquinaOperador()

    return () => {
      ativo = false
    }
  }, [])

  const navMain = useMemo(
    () =>
      data.navMain.map((item) =>
        item.title === "Maquinas"
          ? { ...item, url: maquinaUrl }
          : item
      ),
    [maquinaUrl]
  )

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
      <SidebarHeader className="px-3 py-5">
        <a href="#" className="flex h-16 w-full items-center px-3 transition-[padding] duration-300 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-3">
          <img src="/logo.svg" alt="Logo ProdSync" className="h-12 w-auto max-w-none brightness-0 invert transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:max-w-[2.75rem] group-data-[state=collapsed]/sidebar:group-hover/sidebar:max-w-none" />
        </a>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="p-3 pt-2 group-data-[collapsible=icon]:px-3">
        <NotificationDropdown
          align="end"
          trigger={
            <div
              className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-md bg-transparent px-3 text-left text-sidebar-foreground/95 transition-all duration-300 hover:bg-white/12 group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-3"
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
              className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-md bg-transparent px-3 text-left text-sidebar-foreground/95 transition-all duration-300 hover:bg-white/12 group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-3"
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
