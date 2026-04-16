import React from "react";
import { SectionHeader } from "./SectionHeader";
import { parseMarkdownLinks } from "@/app/util/markdown";

interface TextSectionProps {
  title?: string;
  content: string;
  large?: boolean;
  /** Overrides default Syne styling for **bold** segments from markdown. */
  markdownBoldClassName?: string;
}

export const TextSection: React.FC<TextSectionProps> = ({
  title,
  content,
  large,
  markdownBoldClassName,
}) => {
  return (
    <div className="flex flex-col gap-3" id={title?.split(" ").join("_")}>
      <SectionHeader title={title} />
      <p className={large
        ? "font-inter text-xl sm:text-2xl font-medium text-white/80 leading-snug tracking-normal"
        : "font-inter text-sm text-white/50 leading-relaxed"
      }>
        {parseMarkdownLinks(content, markdownBoldClassName)}
      </p>
    </div>
  );
};
