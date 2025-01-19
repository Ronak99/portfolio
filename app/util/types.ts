export interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Video {
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  videoId: string;
  ctaLink: string;
}

export interface Article {
  title: string;
  description: string;
  date: string;
  link: string;
}

export interface OngoingProject {
  title: string;
  description: string;
  date: string;
  link: string;
}

export interface Social {
  type?: string;
  icon?: string;
  link: string;
}
