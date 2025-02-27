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
    <div className="flex items-center gap-4">
      <img
        src={imageSrc || `${basePath}/me.jpg`}
        alt={name}
        className="object-cover rounded-full h-[92px] w-[92px]"
      />
      <div className="flex flex-col">
        <span className="text-2xl">{name}</span>
        <span className="text-sm text-ronak-foreground">{title}</span>
      </div>
    </div>
  );
};
