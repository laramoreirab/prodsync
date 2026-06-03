"use client";
import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MenuIcon, PanelLeftIcon } from "lucide-react"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "5.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }

    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [setOpenProp, open])

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((open) => !open)
      return
    }

    setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar])

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style
          }
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className
        )}
        {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "floating",
  collapsible = "icon", 
  className,
  children,
  dir,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const touchStartXRef = React.useRef(null)
  const touchStartYRef = React.useRef(null)

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpenMobile(true)}
          className="fixed left-3 top-3 z-40 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#0f3d84] shadow-[0_8px_20px_rgba(15,23,42,0.22)] md:hidden"
        >
          <MenuIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Abrir menu lateral"
          onClick={() => setOpenMobile(true)}
          onTouchStart={(event) => {
            const touch = event.touches[0]
            touchStartXRef.current = touch.clientX
            touchStartYRef.current = touch.clientY
          }}
          onTouchEnd={(event) => {
            if (touchStartXRef.current === null || touchStartYRef.current === null) return
            const touch = event.changedTouches[0]
            const deltaX = touch.clientX - touchStartXRef.current
            const deltaY = Math.abs(touch.clientY - touchStartYRef.current)
            if (deltaX > 36 && deltaY < 36) {
              setOpenMobile(true)
            }
            touchStartXRef.current = null
            touchStartYRef.current = null
          }}
          className="fixed left-0 top-0 z-30 h-svh w-[15px] bg-transparent md:hidden"
        />
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            dir={dir}
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            className="w-(--sidebar-width) border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground shadow-[0_18px_40px_rgba(15,23,42,0.25)] [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE
              }
            }
            side={side}>
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  const isIconMode = collapsible === "icon"

  if (variant === "floating") {
    return (
      <div
        className="group/sidebar peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        data-slot="sidebar">
        <div
          data-slot="sidebar-container"
          data-side={side}
          className={cn(
            "sticky top-24 hidden shrink-0 self-start transition-[width] duration-500 ease-in-out md:flex",
            "group-data-[side=right]/sidebar:ml-auto",
            isIconMode
              ? "w-(--sidebar-width) group-data-[state=collapsed]/sidebar:w-[calc(var(--sidebar-width-icon)+1rem)] group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-(--sidebar-width)"
              : "w-(--sidebar-width) group-data-[collapsible=offcanvas]/sidebar:w-0 group-data-[collapsible=offcanvas]/sidebar:overflow-hidden",
            className
          )}
          {...props}>
          <div
            data-sidebar="sidebar"
            data-slot="sidebar-inner"
            className="flex max-h-[calc(100svh-5rem)] w-full flex-col overflow-hidden rounded-[1.25rem] border border-sidebar-border/80 bg-sidebar shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group/sidebar peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar">
      
      {/* gap placeholder — empurra o conteúdo principal de forma dinâmica */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative shrink-0 bg-transparent transition-[width] duration-500 ease-in-out",
          "group-data-[side=right]/sidebar:rotate-180",
          isIconMode
            ? "w-(--sidebar-width) group-data-[state=collapsed]/sidebar:w-(--sidebar-width-icon) group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-(--sidebar-width)"
            : "w-(--sidebar-width) group-data-[collapsible=offcanvas]/sidebar:w-0"
        )} />

      {/* container fixo — a sidebar em si */}
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-30 hidden h-svh transition-[width] duration-500 ease-in-out md:flex",
          "data-[side=left]:left-0 data-[side=right]:right-0",
          "group-data-[collapsible=offcanvas]/sidebar:data-[side=left]:left-[calc(var(--sidebar-width)*-1)]",
          "group-data-[collapsible=offcanvas]/sidebar:data-[side=right]:right-[calc(var(--sidebar-width)*-1)]",
          isIconMode
            ? "w-(--sidebar-width) group-data-[state=collapsed]/sidebar:w-(--sidebar-width-icon) group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-(--sidebar-width) overflow-hidden"
            : "w-(--sidebar-width)",
          variant === "floating" || variant === "inset"
            ? "p-2"
            : "group-data-[side=left]/sidebar:border-r group-data-[side=right]/sidebar:border-l",
          className
        )}
        {...props}>
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            "flex size-full flex-col bg-sidebar overflow-hidden",
            "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
          )}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}>
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({
  className,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]/sidebar:translate-x-0 group-data-[collapsible=offcanvas]/sidebar:after:left-full hover:group-data-[collapsible=offcanvas]/sidebar:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props} />
  );
}

function SidebarInset({
  className,
  ...props
}) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props} />
  );
}

function SidebarInput({
  className,
  ...props
}) {
  return (
    <div className="group-data-[state=collapsed]/sidebar:hidden w-full p-2">
      <Input
        data-slot="sidebar-input"
        data-sidebar="input"
        className={cn("h-8 w-full bg-background shadow-none", className)}
        {...props} />
    </div>
  );
}

function SidebarHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        "flex flex-col gap-2 p-2 transition-all duration-500", 
        "group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:group-hover/sidebar:items-stretch", 
        className
      )}
      {...props} />
  );
}

function SidebarFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-2 transition-all duration-500",
        "group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:group-hover/sidebar:items-stretch", 
        className
      )}
      {...props} />
  );
}

function SidebarSeparator({
  className,
  ...props
}) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props} />
  );
}

function SidebarContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:overflow-hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:items-stretch",
        className
      )}
      {...props} />
  );
}

function SidebarGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col p-2 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-1 group-data-[state=collapsed]/sidebar:group-hover/sidebar:items-stretch group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-2", 
        className
      )}
      {...props} />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[state=collapsed]/sidebar:h-0 group-data-[state=collapsed]/sidebar:py-0 group-data-[state=collapsed]/sidebar:opacity-0 group-data-[state=collapsed]/sidebar:pointer-events-none", 
        className
      )}
      {...props} />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[state=collapsed]/sidebar:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props} />
  );
}

function SidebarGroupContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props} />
  );
}

function SidebarMenu({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:group-hover/sidebar:items-stretch", className)}
      {...props} />
  );
}

function SidebarMenuItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
    className={cn("group/menu-item relative w-full group-data-[state=collapsed]/sidebar:w-auto group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full", className)}
      {...props} />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding,gap] duration-500 ease-in-out group-has-data-[sidebar=menu-action]/menu-item:pr-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent/40 data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        "group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:[&>span]:hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-full group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-3 group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:[&>span]:inline",
        className
      )}
      {...props} />
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[state=collapsed]/sidebar:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
        className
      )}
      {...props} />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[state=collapsed]/sidebar:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
        className
      )}
      {...props} />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}) {
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  })

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}>
      {showIcon && (
        <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1 group-data-[state=collapsed]/sidebar:hidden"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width
          }
        } />
    </div>
  );
}

function SidebarMenuSub({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[state=collapsed]/sidebar:hidden",
        className
      )}
      {...props} />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props} />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[state=collapsed]/sidebar:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        className
      )}
      {...props} />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
