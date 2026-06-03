"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
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
        className="relative h-10 rounded-md border border-transparent bg-transparent px-3 text-sidebar-foreground/95 transition-all duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-white before:opacity-0 before:transition-opacity before:duration-200 group-hover/sidebar:h-11 group-hover/sidebar:px-4 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:group-hover/sidebar:h-11 group-data-[collapsible=icon]:group-hover/sidebar:w-full group-data-[collapsible=icon]:group-hover/sidebar:justify-start group-data-[collapsible=icon]:group-hover/sidebar:px-4 hover:bg-white/12 data-[active=true]:text-sidebar-foreground data-[active=true]:before:opacity-100 data-[active=true]:hover:bg-white/12">
        <Link href={item.url}>
          <div className="flex size-5 shrink-0 items-center justify-center text-sidebar-foreground/90 transition-colors duration-300 [&_svg]:size-[1.1rem]">
            {item.icon}
          </div>
          <span className="font-semibold">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuButton
      tooltip={item.title}
      className="h-10 rounded-md bg-transparent px-3 text-sidebar-foreground/95 group-hover/sidebar:h-11 group-hover/sidebar:px-4 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:group-hover/sidebar:h-11 group-data-[collapsible=icon]:group-hover/sidebar:w-full group-data-[collapsible=icon]:group-hover/sidebar:justify-start group-data-[collapsible=icon]:group-hover/sidebar:px-4 hover:bg-white/12">
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