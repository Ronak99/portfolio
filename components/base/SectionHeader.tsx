interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return <span className="text-sm text-zinc-100">{title}</span>;
};
