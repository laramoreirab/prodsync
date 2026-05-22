import { AppSidebar } from "@/components/sidebar-components/sidebar-adm/app-sidebar"
import Header from "@/components/ui/topbar"

export default function AdminLayout({ children }) {
  return (
    <div data-app-shell className="relative min-h-screen w-full flex flex-col select-none">

<div 
  className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" 
  style={{ backgroundImage: "url('/bg_app.svg')" }}
/>
      <Header showSidebarTrigger /> 
      <div className="flex-1 flex justify-center items-start w-full pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row w-full max-w-[1600px] gap-6 items-start mx-auto">

          <aside className="hidden md:block sticky top-24 h-[calc(100vh-120px)] flex-shrink-0">
            <AppSidebar />
          </aside>
          <main className="w-full min-w-0 flex-1">
            {children}
          </main>
        </div>

      </div>
    </div>
  )
}