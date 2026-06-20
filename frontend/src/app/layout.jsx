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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ProdSync",
  title: {
    default: "ProdSync | Gestão industrial em tempo real",
    template: "%s | ProdSync",
  },
  description:
    "ProdSync sincroniza máquinas, operadores, paradas e indicadores industriais em tempo real para melhorar a produtividade da fábrica.",
  keywords: [
    "ProdSync",
    "gestão industrial",
    "OEE",
    "produção",
    "manutenção",
    "paradas de máquina",
    "dashboard industrial",
  ],
  authors: [{ name: "ProdSync" }],
  creator: "ProdSync",
  publisher: "ProdSync",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "ProdSync",
    title: "ProdSync | Gestão industrial em tempo real",
    description:
      "Monitore máquinas, eventos, apontamentos e indicadores de produção em uma plataforma industrial integrada.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ProdSync",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ProdSync | Gestão industrial em tempo real",
    description:
      "Monitore máquinas, eventos, apontamentos e indicadores de produção em uma plataforma industrial integrada.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00357a",
  colorScheme: "light dark",
};
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

      {/* min-h-screen: permite que a página role naturalmente quando o conteúdo passa da viewport */}
      <body className="min-h-screen flex flex-col">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Pular para o conteúdo principal
        </a>        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
