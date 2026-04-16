import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { basePath } from "./util/constants";
import { Syne, Inter } from "next/font/google";
import { PageTransitionProvider } from "@/components/transition/page-transition-provider";
import { PageTransition } from "@/components/transition/page-transition";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Ronak Punase",
  description: "AKA The CS Guy",
  icons: `${basePath}/logo.png`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${inter.variable} antialiased bg-[#111111] text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PageTransitionProvider>
            <PageTransition>{children}</PageTransition>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
