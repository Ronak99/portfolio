export type RichToken =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "link"; text: string; href: string };

export type RichLine = RichToken[];

export type SocialLink = {
  label: string;
  href: string;
};

export type Work = {
  id: string;
  title: string;
  date: string;
  image: string;
  glow: string;
  bullets: RichLine[];
};

export type Experience = {
  company: string;
  period: string;
  bullets: RichLine[];
};

export type PackageLink = {
  label: string;
  href: string;
};

export type MediaItem = {
  index: string;
  title: string;
  source: string;
  href: string;
};

export type PortfolioData = {
  meta: {
    title: string;
    email: string;
    footerLine: string;
  };
  hero: {
    label: string;
    firstName: string;
    lastName: string;
    subtitle: string;
    current: string;
  };
  socials: SocialLink[];
  works: Work[];
  experience: Experience[];
  about: {
    copy: RichLine;
    education: string;
    packages: PackageLink[];
    elsewhere: RichLine;
  };
  media: MediaItem[];
};
