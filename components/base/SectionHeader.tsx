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
    <>
      <div className="flex w-full justify-between">
        {title && (
        <span className="text-md font-semibold text-zinc-100">{title}</span>)}
        {link && (
          <Link
            href={link}
            target="_"
            className="underline underline-offset-4 text-xs text-muted-foreground hover:text-zinc-300 transition-colors"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </>
  );
};
