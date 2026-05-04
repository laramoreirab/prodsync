import AppThemeSync from "@/components/theme/app-theme-sync"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppThemeSync />
      <div className="flex min-h-screen w-full flex-col">
        {children}
      </div>
    </SidebarProvider>
  )
}
