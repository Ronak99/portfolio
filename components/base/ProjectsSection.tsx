import React from "react";
import { ExperienceItemProps } from "@/app/util/types";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";

interface ProjectsSectionProps {
  title?: string;
  projects: ExperienceItemProps[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  title = "Personal Projects",
  projects,
}) => {
  const withImage = projects.filter((p) => p.image);
  const withoutImage = projects.filter((p) => !p.image);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title={title} />

      {/* Image grid — projects with visuals */}
      {withImage.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {withImage.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              items={project.items}
              image={project.image}
              period={project.period}
            />
          ))}
        </div>
      )}

      {/* Text-only projects */}
      {withoutImage.length > 0 && (
        <div className="flex flex-col border-t border-white/[0.06]">
          {withoutImage.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              items={project.items}
              period={project.period}
            />
          ))}
        </div>
      )}
    </div>
  );
};
