import React from "react";
import { SectionHeader } from "./SectionHeader";
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
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2"
          >
            <div className="overflow-hidden rounded-lg aspect-video bg-white/[0.04]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <span className="font-inter text-[11px] text-white/40 group-hover:text-white/70 transition-colors duration-300 leading-snug">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
