import React from "react";

import { SectionHeader } from "./SectionHeader";
import { LinkItemProps } from "@/app/util/types";
import { LinkItem } from "./LinkItem";

interface LinkSectionProps {
  title: string;
  links: LinkItemProps[];
}

export const LinkSection: React.FC<LinkSectionProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title={title} />
      {links.map((link, index) => (
        <LinkItem
          key={index}
          label={link.label}
          link={link.link}
          text={link.text}
        />
      ))}
    </div>
  );
};
