import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const virtualFont = localFont({
  src: "../fonts/virtual-regular.ttf",
  variable: "--font-virtual",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      // h-full + overflow-hidden evita que o próprio <html> gere barra de rolagem
      className={`${montserrat.variable} ${virtualFont.variable} min-h-screen antialiased`}
    >
      <head>
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`
            try {
              var isAppRoute = /^\\/(adm|gestor|operador)(\\/|$)/.test(window.location.pathname);
              var isDark = window.localStorage.getItem("prodsync-theme") === "dark";
              document.documentElement.classList.toggle("dark", isAppRoute && isDark);
            } catch (_) {}
          `}
        </Script>
      </head>

      {/* h-full + overflow-hidden: o body ocupa exatamente a viewport e não rola */}
      <body className="h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}