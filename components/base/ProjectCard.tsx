import React from "react";
import { parseMarkdownLinks } from "@/app/util/markdown";

interface ProjectCardProps {
  title: string;
  items: string[];
  image?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  items,
  image = "https://picsum.photos/500",
}) => {
  return (
    <div className="flex gap-6">
      {/* Image/Logo */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={title}
          width={120}
          height={120}
          className="rounded-lg object-cover w-[120px] h-[120px]"
        />
      </div>

      {/* Title and Details */}
      <div className="flex flex-col gap-4 flex-grow">
        <h3 className="text-md font-semibold text-zinc-100">{title}</h3>
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li className="text-sm text-muted-foreground" key={index}>
              {parseMarkdownLinks(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

