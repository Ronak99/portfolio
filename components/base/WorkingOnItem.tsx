"use client";

import { parseMarkdownLinks } from "@/app/util/markdown";
import { ExperienceItemProps } from "@/app/util/types";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const WorkingOnItem: React.FC<ExperienceItemProps> = ({
  title,
  items,
  more,
  image,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-0">
      {/* Featured image card */}
      {image && (
        <div
          className="relative overflow-hidden rounded-xl cursor-pointer group aspect-video bg-white/[0.04]"
          onClick={() => setOpen((v) => !v)}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 flex items-end justify-between w-full">
            <span className="font-syne text-lg font-bold text-white">{title}</span>
            {more && (
              <Link
                href={more}
                onClick={(e) => e.stopPropagation()}
                target={more.startsWith("http") ? "_blank" : undefined}
                className="font-inter text-[10px] uppercase tracking-[0.12em] text-white/50 hover:text-white transition-colors duration-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
              >
                View
              </Link>
            )}
          </div>
        </div>
      )}

      {/* No image fallback */}
      {!image && (
        <div
          className="flex items-center justify-between border-t border-white/[0.06] pt-4 cursor-pointer group"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-syne text-base font-semibold text-white/90">{title}</span>
          <div className="flex items-center gap-3">
            {more && (
              <Link
                href={more}
                onClick={(e) => e.stopPropagation()}
                target={more.startsWith("http") ? "_blank" : undefined}
                className="font-inter text-[10px] uppercase tracking-[0.12em] text-white/25 hover:text-white/60 transition-colors duration-300"
              >
                view
              </Link>
            )}
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/25 text-lg leading-none"
            >
              +
            </motion.span>
          </div>
        </div>
      )}

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 pt-3 pb-1">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="font-inter text-xs text-white/40 leading-relaxed list-none"
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
