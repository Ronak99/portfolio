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
    <div className="flex items-center gap-3 sm:gap-4">
      <img
        src={imageSrc || `${basePath}/me.jpg`}
        alt={name}
        className="object-cover rounded-full h-[64px] w-[64px] sm:h-[92px] sm:w-[92px] flex-shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <span className="text-xl sm:text-2xl truncate">{name}</span>
        <span className="text-xs sm:text-sm text-ronak-foreground truncate">{title}</span>
      </div>
    </div>
  );
};
