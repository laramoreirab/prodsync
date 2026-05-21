import { AppSidebar } from "@/components/sidebar-components/sidebar-operador/app-sidebar"
import Header from "@/components/ui/topbar"

export default function AdminLayout({ children }) {
  return (
    <div data-app-shell className="relative min-h-screen w-full">
      {/* Fundo fixo — funciona em todos os browsers incluindo iOS */}
      <div className="fixed inset-0 -z-10 bg-[url('/bg_app.svg')] bg-cover bg-center bg-no-repeat" />

      <Header showSidebarTrigger />
      <div className="flex w-full gap-4 px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <AppSidebar />
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
