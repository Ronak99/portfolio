import React from "react";
import { SectionHeader } from "./SectionHeader";
import { parseMarkdownLinks } from "@/app/util/markdown";
import { MediaItemProps } from "@/app/util/types";
import Link from "next/link";

interface MediaSectionProps {
  title: string;
  items: MediaItemProps[];
  link?: string;
  linkLabel?: string;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  items,
  link,
  linkLabel,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title={title} link={link} linkLabel={linkLabel} />
      <div className="flex text-sm text-muted-foreground overflow-x-auto gap-2 sm:gap-4 pb-2 -mb-2">
        {items.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            target="_"
            className="flex-shrink-0"
          >
            <div className="flex flex-col gap-2 items-center">
              <img
                src={item.image}
                className="rounded-lg h-[100px] w-[180px] sm:h-[120px] sm:w-[225px] object-cover"
                alt={item.title}
              />
              <span className="text-xs sm:text-sm text-center px-1">{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
