import React from "react";
import { ExperienceItem } from "./ExperienceItem";
import { ExperienceItemProps } from "@/app/util/types";
import { SectionHeader } from "./SectionHeader";

interface WorkingOnSectionProps {
  title?: string;
  items: ExperienceItemProps[];
}

export const WorkingOnSection: React.FC<WorkingOnSectionProps> = ({
  title = "Currently Working On",
  items,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title={title} />
      {items.map((item, index) => (
        <ExperienceItem
          key={index}
          period={item.period}
          title={item.title}
          items={item.items}
          more={item.more}
        />
      ))}
    </div>
  );
};

