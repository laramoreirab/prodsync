import AppThemeSync from "@/components/theme/app-theme-sync"
import { SidebarProvider } from "@/components/ui/sidebar"
import ChatAI from "@/components/chat/ChatAI"
import SmoothScroll from "@/components/smoothScroll";

export default function AppLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppThemeSync />
      <SmoothScroll />
      <div className="flex min-h-screen w-full flex-col relative">
        {children}
        <ChatAI />
      </div>
    </SidebarProvider>
  )
}