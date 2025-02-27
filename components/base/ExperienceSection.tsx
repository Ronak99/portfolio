import React from "react";
import { ExperienceItem } from "./ExperienceItem";
import { ExperienceItemProps } from "@/app/util/types";
import { SectionHeader } from "./SectionHeader";

interface ExperienceSectionProps {
  title: string;
  experiences: ExperienceItemProps[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  title,
  experiences,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title={title} />
      {experiences.map((exp, index) => (
        <ExperienceItem
          key={index}
          period={exp.period}
          title={exp.title}
          items={exp.items}
        />
      ))}
    </div>
  );
};
