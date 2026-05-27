import { AppSidebar } from "@/components/sidebar-components/sidebar-gestor/app-sidebar"
import RoleGuard from "@/components/auth/RoleGuard"
import AppContentHeader from "@/components/ui/app-content-header"

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={["Gestor"]}>
      <div data-app-shell className="relative h-screen w-full overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-[url('/bg_app.svg')] bg-cover bg-center bg-no-repeat" />
        <div className="flex h-full w-full">
          <AppSidebar />
          <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-6 lg:p-8">
            <AppContentHeader />
            <div className="min-h-0 flex-1 overflow-y-auto pt-6">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
