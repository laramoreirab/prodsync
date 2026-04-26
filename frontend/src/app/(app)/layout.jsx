import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full flex-col">
        {children}
      </div>
    </SidebarProvider>
  )
}
