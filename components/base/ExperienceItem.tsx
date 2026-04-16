"use client";

import { parseMarkdownLinks } from "@/app/util/markdown";
import { ExperienceItemProps } from "@/app/util/types";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  period,
  title,
  items,
  more,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col border-t border-white/[0.06] pt-4">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
      >
        <div className="flex items-baseline gap-4 flex-1 min-w-0">
          <span className="font-inter text-[11px] text-white/25 flex-shrink-0 w-[90px]">
            {period}
          </span>
          <span className="font-syne text-base font-semibold text-white/90 truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {more && (
            <Link
              href={more}
              onClick={(e) => e.stopPropagation()}
              className="font-inter text-[10px] uppercase tracking-[0.12em] text-white/25 hover:text-white/60 transition-colors duration-300"
              target={more.startsWith("http") ? "_blank" : undefined}
            >
              more
            </Link>
          )}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-3.5 w-3.5 text-white/20 group-hover:text-white/40 transition-colors duration-300" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-4 pl-[106px]">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="font-inter text-sm text-white/40 leading-relaxed list-none"
                >
                  {parseMarkdownLinks(item)}
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
