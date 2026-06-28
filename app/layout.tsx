import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import portfolioData from "@/data/portfolio.json";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: portfolioData.meta.title,
  description: portfolioData.hero.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`try { var _t = localStorage.getItem("portfolio-theme"); if (_t) document.documentElement.setAttribute("data-theme", _t); } catch (e) {}`}
        </Script>
      </head>
      <body className={`${archivo.variable} ${jetBrainsMono.variable}`}>
        <div className="bg-grid" aria-hidden="true" />
        <div className="pf-lamp-pool" aria-hidden="true" />

        {children}
      </body>
    </html>
  );
}
