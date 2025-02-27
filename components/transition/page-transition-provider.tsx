"use client";

import { ReactNode, createContext, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type PageTransitionContextType = {
  pathname: string;
};

const PageTransitionContext = createContext<PageTransitionContextType>({
  pathname: "",
});

export const usePageTransition = () => useContext(PageTransitionContext);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <PageTransitionContext.Provider value={{ pathname }}>
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
