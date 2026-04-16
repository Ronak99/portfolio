import Link from "next/link";

interface SectionHeaderProps {
  title?: string;
  link?: string;
  linkLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  link,
  linkLabel,
}) => {
  return (
    <div className="flex w-full justify-between items-center">
      {title && (
        <span className="font-syne text-[10px] uppercase tracking-[0.18em] text-white/30 font-semibold">
          {title}
        </span>
      )}
      {link && (
        <Link
          href={link}
          target="_blank"
          className="text-[10px] uppercase tracking-[0.12em] text-white/25 hover:text-white/60 transition-colors duration-300"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
};
