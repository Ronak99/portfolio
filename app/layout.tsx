import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { basePath } from "./util/constants";
import { Abril_Fatface } from "next/font/google";
import { PageTransitionProvider } from "@/components/transition/page-transition-provider";
import { PageTransition } from "@/components/transition/page-transition";

export const metadata: Metadata = {
  title: "Ronak Punase",
  description: "AKA The CS Guy",
  icons: `${basePath}/logo.png`,
};

// const geistSans = Abril_Fatface({
//   variable: "--font",
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-[#222222]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
