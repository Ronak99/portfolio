"use client";

import React, { useState } from "react";
import { parseMarkdownLinks } from "@/app/util/markdown";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
  title: string;
  items: string[];
  image?: string;
  period?: string;
}

const DEFAULT_IMG = "https://picsum.photos/seed/project/600/400";

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  items,
  image,
  period,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex flex-col cursor-pointer group"
      onClick={() => setOpen((v) => !v)}
      role="button"
      aria-expanded={open}
    >
      {/* Image */}
      {image && (
        <div className="relative overflow-hidden rounded-lg aspect-video bg-white/[0.04]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
      )}

      {/* Title row */}
      <div className="flex items-center justify-between pt-3 pb-1">
        <div className="flex items-baseline gap-3">
          {period && (
            <span className="font-inter text-[10px] text-white/25">{period}</span>
          )}
          <span className="font-syne text-sm font-semibold text-white/85">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/25 text-lg leading-none group-hover:text-white/50 transition-colors duration-300 ml-2"
        >
          +
        </motion.span>
      </div>

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
            <div className="flex flex-col gap-1.5 pb-4 pt-1">
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
