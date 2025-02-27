import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LinkItemProps } from "@/app/util/types";

export const LinkItem: React.FC<LinkItemProps> = ({ label, link, text }) => {
  return (
    <div className="flex">
      <span className="w-[120px] text-sm text-muted-foreground">{label}</span>
      <span className="text-zinc-100 flex gap-1 items-center text-sm text-muted-foreground">
        <Link href={link} target="_blank" className="hover:underline">
          {text}
        </Link>{" "}
        <ArrowUpRight size={14} />
      </span>
    </div>
  );
};
