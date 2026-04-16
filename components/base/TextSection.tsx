import React from "react";
import { SectionHeader } from "./SectionHeader";
import { parseMarkdownLinks } from "@/app/util/markdown";

interface TextSectionProps {
  title?: string;
  content: string;
  large?: boolean;
}

export const TextSection: React.FC<TextSectionProps> = ({ title, content, large }) => {
  return (
    <div className="flex flex-col gap-3" id={title?.split(" ").join("_")}>
      <SectionHeader title={title} />
      <p className={large
        ? "font-syne text-xl sm:text-2xl font-semibold text-white/90 leading-snug tracking-tight"
        : "font-inter text-sm text-white/50 leading-relaxed"
      }>
        {parseMarkdownLinks(content)}
      </p>
    </div>
  );
};
