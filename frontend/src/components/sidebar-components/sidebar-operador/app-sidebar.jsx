"use client";

import { useRef } from "react";
import { NavMain } from "@/components/sidebar-components/sidebar-adm/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import ProfileDropdown from "@/components/shadcn-space/blocks/topbar/dropdown-profile";
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar/notification-dropdown";
import {
  BellRing,
  Calendar,
  PieChartIcon,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { ListBulletsIcon } from "@phosphor-icons/react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/operador",
      icon: <PieChartIcon />,
    },
    {
      title: "Máquinas",
      url: "/operador/maquinas",
      icon: <Wrench />,
    },
    {
      title: "Histórico de Eventos",
      url: "/operador/historicoEventos",
      icon: <Calendar />,
    },
    {
      title: "Ordem de Produção",
      url: "/operador/ordensDeProducao",
      icon: <ListBulletsIcon size={32} />,
    },
    {
      title: "Andon",
      url: "/operador/andon",
      icon: <RefreshCw />,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { isMobile, open, setOpen } = useSidebar();
  const estavaAbertaRef = useRef(null);

  const handleNotificationOpenChange = (aberto) => {
    if (isMobile) return;

    if (aberto) {
      estavaAbertaRef.current = open;
      if (!open) setOpen(true);
      return;
    }

    if (estavaAbertaRef.current === false) {
      setOpen(false);
    }
    estavaAbertaRef.current = null;
  };

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
      {...props}
    >
      <SidebarHeader className="px-4 py-5 group-data-[collapsible=icon]:px-3">
        <a
          href="#"
          className="relative inline-flex h-16 items-center group-data-[collapsible=icon]:justify-center"
        >
          <img
            src="/logo.svg"
            alt="Logo ProdSync"
            className="h-12 w-auto max-w-11 brightness-0 invert opacity-100 transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:opacity-0 group-data-[state=collapsed]/sidebar:scale-95 group-data-[state=collapsed]/sidebar:group-hover/sidebar:opacity-100 group-data-[state=collapsed]/sidebar:group-hover/sidebar:scale-100 group-hover/sidebar:max-w-none"
          />
          <img
            src="/logo.svg"
            alt="Logo ProdSync"
            className="absolute h-16 w-16 brightness-0 invert opacity-0 scale-95 transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:opacity-100 group-data-[state=collapsed]/sidebar:scale-100 group-data-[state=collapsed]/sidebar:group-hover/sidebar:opacity-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:scale-95"
          />
        </a>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-3 pt-2 group-data-[collapsible=icon]:px-3">
        <NotificationDropdown
          align="end"
          onOpenChange={handleNotificationOpenChange}
          trigger={
            <div className="cursor-pointer  flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg px-2 text-left text-[#ffffff] transition-all duration-300 hover:bg-[#f5f8ff] hover:text-[#0f3d84] group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-2">
              <BellRing className="size-4 shrink-0" />
              <span className="text-sm font-semibold group-data-[state=collapsed]/sidebar:hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:inline">
                Notificações
              </span>
            </div>
          }
        />
        <ProfileDropdown
          align="end"
          onOpenChange={handleNotificationOpenChange}
          trigger={({ avatarSrc }) => (
            <div className="cursor-pointer  flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg px-2 text-left text-[#FFFFFF] transition-all duration-300 hover:bg-[#f5f8ff] hover:text-[#0f3d84] group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-2">
              <img
                src={avatarSrc}
                alt="Usuario"
                className="h-6 w-6 shrink-0 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/userdefault.svg";
                }}
              />
              <span className="truncate text-sm font-semibold group-data-[state=collapsed]/sidebar:hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:inline">
                Minha conta
              </span>
            </div>
          )}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
