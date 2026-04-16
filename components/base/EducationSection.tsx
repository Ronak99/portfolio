import React from "react";
import { ExperienceItem } from "./ExperienceItem";
import { ExperienceItemProps } from "@/app/util/types";
import { SectionHeader } from "./SectionHeader";

interface EducationSectionProps {
  title?: string;
  education: ExperienceItemProps[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  title = "Education",
  education,
}) => {
  return (
    <div className="flex flex-col gap-0">
      <div className="mb-5">
        <SectionHeader title={title} />
      </div>
      {education.map((item, index) => (
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
