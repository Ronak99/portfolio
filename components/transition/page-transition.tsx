"use client";

import { motion } from "framer-motion";
import { usePageTransition } from "./page-transition-provider";
import { ReactNode } from "react";

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = usePageTransition();

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        type: "tween",
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
