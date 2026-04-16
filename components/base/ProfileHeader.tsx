import { basePath } from "@/app/util/constants";
import React from "react";

interface ProfileHeaderProps {
  name: string;
  title: string;
  imageSrc?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  imageSrc,
}) => {
  return (
    <div className="flex flex-col gap-8 pt-4 pb-2">
      <img
        src={imageSrc || `${basePath}/me.jpg`}
        alt={name}
        className="object-cover rounded-2xl h-[88px] w-[88px] grayscale hover:grayscale-0 transition-all duration-700"
      />
      <div className="flex flex-col gap-1">
        <h1 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          {name}
        </h1>
        <span className="font-inter text-sm text-white/40 tracking-wide">
          {title}
        </span>
      </div>
    </div>
  );
};
