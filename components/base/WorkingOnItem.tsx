import { parseMarkdownLinks } from "@/app/util/markdown";
import { ExperienceItemProps } from "@/app/util/types";
import Link from "next/link";
import React from "react";

export const WorkingOnItem: React.FC<ExperienceItemProps> = ({
  title,
  items,
  more,
  image,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Image/Icon */}
      {image && (
        <div className="flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="rounded-lg object-cover w-full sm:w-[120px] h-auto sm:h-[120px] max-w-[120px] mx-auto sm:mx-0"
          />
        </div>
      )}
      <div className="flex flex-grow flex-col gap-4 text-zinc-100 text-sm text-muted-foreground">
        <div className="flex w-full justify-between items-start gap-2 flex-wrap sm:flex-nowrap">
          <span className="break-words">{title}</span>
          {more && (
            <Link
              href={more}
              className="underline underline-offset-4 text-xs text-muted-foreground hover:text-zinc-300 transition-colors flex-shrink-0"
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

