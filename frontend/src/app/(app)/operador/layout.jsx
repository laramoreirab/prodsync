import { AppSidebar } from "@/components/sidebar-components/sidebar-operador/app-sidebar"

export default function AdminLayout({ children }) {
  return (
    <div data-app-shell className="relative h-screen w-full overflow-hidden bg-[#f8f8f8]">
{/* Light mode: aparece normalmente */}
      <img
        src="/bg_app.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed -top-16 right-0 z-0 h-auto w-[88%] max-w-none opacity-70 sm:-top-20 sm:w-[62%] lg:-top-24 lg:w-[46%] xl:w-[38%] dark:hidden"
      />

      {/* Dark mode: SVG some no fundo zinc-950 */}
      <img
        src="/bg_app.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed -top-16 right-0 z-0 h-auto w-[88%] max-w-none sm:-top-20 sm:w-[62%] lg:-top-24 lg:w-[46%] xl:w-[38%] hidden dark:block"
        style={{ filter: "brightness(0) invert(0) opacity(0.07)" }}
      />
      <div className="relative z-10 flex h-full w-full">
        <AppSidebar />
        <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">{children}</div>
        </main>
      </div>
    </div>
  )
}
