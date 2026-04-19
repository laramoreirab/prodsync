import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import localFont from "next/font/local";
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
      className={`${montserrat.variable} ${virtualFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}