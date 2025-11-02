import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LinkItemProps } from "@/app/util/types";

export const LinkItem: React.FC<LinkItemProps> = ({ label, link, text }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
      <span className="w-full sm:w-[120px] text-sm text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-zinc-100 flex gap-1 items-center text-sm text-muted-foreground break-all sm:break-normal">
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-4"
        >
          {text}
        </Link>{" "}
        <ArrowUpRight size={14} className="flex-shrink-0" />
      </span>
    </div>
  );
};
