"use client"

import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function NavMainItem({
  item,
  pathname,
}) {
  const isRoute = item.url?.startsWith("/")
  const isDashboardRoot = isRoute && /^\/(adm|gestor|operador)$/.test(item.url)
  const isActive = isRoute
    ? isDashboardRoot
      ? pathname === item.url
      : pathname === item.url || pathname?.startsWith(`${item.url}/`)
    : false

  if (isRoute) {
    return (
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActive}
        className="h-10 rounded-xl border border-transparent bg-transparent px-3 text-sidebar-foreground/95 transition-all duration-300 group-hover/sidebar:h-11 group-hover/sidebar:px-4 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center hover:bg-white/12 data-[active=true]:!border-white/20 data-[active=true]:!bg-white/22 data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-[inset_3px_0_0_0_rgba(255,255,255,0.95)] data-[active=true]:hover:!bg-white/22 group-data-[collapsible=icon]:data-[active=true]:!border-[#bfdbfe] group-data-[collapsible=icon]:data-[active=true]:!bg-[#dbeafe] group-data-[collapsible=icon]:data-[active=true]:!text-[#0f3d84] group-data-[collapsible=icon]:data-[active=true]:shadow-[0_0_0_1px_rgba(255,255,255,0.45)]">
        <a href={item.url}>
          <div className="flex size-5 shrink-0 items-center justify-center text-sidebar-foreground/90 transition-colors duration-300 group-data-[collapsible=icon]:data-[active=true]:text-[#0f3d84] [&_svg]:size-[1.1rem]">
            {item.icon}
          </div>
          <span className="font-semibold">{item.title}</span>
        </a>
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuButton
      tooltip={item.title}
      className="h-10 rounded-xl bg-transparent px-3 text-sidebar-foreground/95 group-hover/sidebar:h-11 group-hover/sidebar:px-4 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center hover:bg-white/12">
      <div className="flex size-5 shrink-0 items-center justify-center text-sidebar-foreground [&_svg]:size-[1.1rem]">
        {item.icon}
      </div>
      <span className="font-medium">{item.title}</span>
    </SidebarMenuButton>
  )
}

export function NavMain({
  items
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="gap-2 px-2 py-3 group-data-[collapsible=icon]:px-1">
      <SidebarGroupLabel className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/65">
        ProdSync
      </SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavMainItem item={item} pathname={pathname} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
