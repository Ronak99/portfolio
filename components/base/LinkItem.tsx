import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LinkItemProps } from "@/app/util/types";

export const LinkItem: React.FC<LinkItemProps> = ({ label, link, text }) => {
  return (
    <div className="flex items-center justify-between border-t border-white/[0.06] py-3 group">
      <span className="font-inter text-xs text-white/25 uppercase tracking-[0.1em]">{label}</span>
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-inter text-sm text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-1"
      >
        {text}
        <ArrowUpRight size={12} className="text-white/25 group-hover:text-white/60 transition-colors duration-300" />
      </Link>
    </div>
  );
};
