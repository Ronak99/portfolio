import { parseMarkdownLinks } from "@/app/util/markdown";
import { ExperienceItemProps } from "@/app/util/types";
import Link from "next/link";
import React from "react";

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  period,
  title,
  items,
  more,
}) => {
  return (
    <div className="flex">
      <span className="w-[120px] flex-shrink-0 text-sm text-muted-foreground">
        {period}
      </span>
      <div className="flex flex-grow flex-col gap-4 text-zinc-100 text-sm text-muted-foreground">
        <div className="flex w-full justify-between">
          {title}
          {more && (
            <Link
              href={more}
              className="underline underline-offset-4 text-xs text-muted-foreground hover:text-zinc-300 transition-colors"
            >
              Read More
            </Link>
          )}
        </div>
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li className="text-muted-foreground" key={index}>
              {parseMarkdownLinks(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
