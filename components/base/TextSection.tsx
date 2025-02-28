import React from "react";
import { SectionHeader } from "./SectionHeader";
import { parseMarkdownLinks } from "@/app/util/markdown";

interface TextSectionProps {
  title: string;
  content: string;
}

export const TextSection: React.FC<TextSectionProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col gap-2">
      <SectionHeader title={title} />
      <p className="text-sm text-muted-foreground">
        {parseMarkdownLinks(content)}
      </p>
    </div>
  );
};
