import { AppSidebar } from "@/components/sidebar-components/sidebar-operador/app-sidebar"

export default function AdminLayout({ children }) {
  return (
    <div data-app-shell className="relative h-screen w-full overflow-hidden">
      <img
        src="/bg_app.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed -z-10 bottom-24 right-0 h-auto w-[140%] max-w-none sm:bottom-28 sm:w-[115%] lg:bottom-32 lg:w-[85%] xl:w-[75%]"
      />
      <div className="flex h-full w-full">
        <AppSidebar />
        <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
