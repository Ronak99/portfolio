import { basePath } from "./constants";
import { Article, OngoingProject, Project, Social, Video } from "./types";

const projects: Project[] = [
  {
    title: "Skype Clone",
    description:
      "Fully functional skype clone in Flutter. | Flutter + Firebase",
    image: `${basePath}/projects/skype-clone.webp`,
    link: "https://github.com/Ronak99/Skype-Clone",
  },
  {
    title: "QuickBytes",
    description: "Mobile-first news platform | Flutter + Express + MongoDB",
    image:
      "https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=1000",
    link: "https://github.com/Ronak99/QuickBytes",
  },
  {
    title: "Inquirely",
    description:
      "Bring the power of AI to your venture. | React + MongoDB + Langchain",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    link: "https://github.com/Ronak99/Inquirely-Web",
  },
  {
    title: "Majestic UI",
    description: "ShadCN inspired UI component imports | NextJS + Flutter",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    link: "https://github.com/Ronak99/Inquirely-Web",
  },
  {
    title: "PuStack Tutor App",
    description: "Bring the power of AI to your venture. ",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    link: "https://github.com/Ronak99/Inquirely-Web",
  },
  {
    title: "Minerva App",
    description: "Bring the power of AI to your venture.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    link: "https://github.com/Ronak99/Inquirely-Web",
  },
];

const packagesPublished: Project[] = [
  {
    title: "Persistent TextField",
    description: "Fully functional skype clone in flutter.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
    link: "https://pub.dev/packages/persistent_textfield",
  },
  {
    title: "Majestic UI",
    description: "Mobile-first news platform",
    image:
      "https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=1000",
    link: "https://pub.dev/packages/majestic_ui",
  },
];

const videos: Video[] = [
  {
    title: "How to make Pixel Perfect UIs in Flutter",
    subtitle: "Subtitle 1",
    thumbnail: `${basePath}/thumbnails/pixel-perfect.webp`,
    ctaLink: "",
    videoId: "wWH66F9y63U?start=30",
    description: `This video is an introduction a flutter course, where we'll build a skype clone. I am gonna cover all important topics like: Firebase Authentication, Firestore Database, Sqlite, State Management, and Video Calling in flutter.

Check out these apks:
https://github.com/Ronak99/Skype-Clone/raw/master/apks/arm-64-skype-clone.apk - 30MB (only for arm-64 architecture based devices)
https://github.com/Ronak99/Skype-Clone/raw/master/apks/fat-skype-clone.apk - 42MB (should run on all devices)

If you are new to this channel then make sure to hit the subscribe button in order to receive updates about the app, and if you enjoyed watching this video then make sure to hit the like button and comment down below.`,
  },
  {
    title: "Video Calling in Flutter",
    subtitle: "Subtitle 2",
    thumbnail: `${basePath}/thumbnails/video-calling.webp`,
    ctaLink: "",
    videoId: "dQw4w9WgXcQ",
    description: `This video is an introduction a flutter course, where we'll build a skype clone. I am gonna cover all important topics like: Firebase Authentication, Firestore Database, Sqlite, State Management, and Video Calling in flutter.

Check out these apks:
https://github.com/Ronak99/Skype-Clone/raw/master/apks/arm-64-skype-clone.apk - 30MB (only for arm-64 architecture based devices)
https://github.com/Ronak99/Skype-Clone/raw/master/apks/fat-skype-clone.apk - 42MB (should run on all devices)

If you are new to this channel then make sure to hit the subscribe button in order to receive updates about the app, and if you enjoyed watching this video then make sure to hit the like button and comment down below.`,
  },
  {
    title: "Thanos Snap Effect in Flutter 1",
    subtitle: "Subtitle 3",
    thumbnail: `${basePath}/thumbnails/thanos-snap.webp`,
    ctaLink: "",
    videoId: "uIw9K6ix4c0",
    description: `This video is an introduction a flutter course, where we'll build a skype clone. I am gonna cover all important topics like: Firebase Authentication, Firestore Database, Sqlite, State Management, and Video Calling in flutter.

Check out these apks:
https://github.com/Ronak99/Skype-Clone/raw/master/apks/arm-64-skype-clone.apk - 30MB (only for arm-64 architecture based devices)
https://github.com/Ronak99/Skype-Clone/raw/master/apks/fat-skype-clone.apk - 42MB (should run on all devices)

If you are new to this channel then make sure to hit the subscribe button in order to receive updates about the app, and if you enjoyed watching this video then make sure to hit the like button and comment down below.`,
  },
  {
    title: "Thanos Snap Effect in Flutter 2",
    subtitle: "Subtitle 4",
    thumbnail: `${basePath}/thumbnails/tts-flutter.webp`,
    ctaLink: "",
    videoId: "uIw9K6ix4c0",
    description: `This video is an introduction a flutter course, where we'll build a skype clone. I am gonna cover all important topics like: Firebase Authentication, Firestore Database, Sqlite, State Management, and Video Calling in flutter.

Check out these apks:
https://github.com/Ronak99/Skype-Clone/raw/master/apks/arm-64-skype-clone.apk - 30MB (only for arm-64 architecture based devices)
https://github.com/Ronak99/Skype-Clone/raw/master/apks/fat-skype-clone.apk - 42MB (should run on all devices)

If you are new to this channel then make sure to hit the subscribe button in order to receive updates about the app, and if you enjoyed watching this video then make sure to hit the like button and comment down below.`,
  },
  {
    title: "Thanos Snap Effect in Flutter 3",
    subtitle: "Subtitle 5",
    thumbnail: `${basePath}/thumbnails/drag-and-drop.webp`,
    ctaLink: "",
    videoId: "uIw9K6ix4c0",
    description: `This video is an introduction a flutter course, where we'll build a skype clone. I am gonna cover all important topics like: Firebase Authentication, Firestore Database, Sqlite, State Management, and Video Calling in flutter.

Check out these apks:
https://github.com/Ronak99/Skype-Clone/raw/master/apks/arm-64-skype-clone.apk - 30MB (only for arm-64 architecture based devices)
https://github.com/Ronak99/Skype-Clone/raw/master/apks/fat-skype-clone.apk - 42MB (should run on all devices)

If you are new to this channel then make sure to hit the subscribe button in order to receive updates about the app, and if you enjoyed watching this video then make sure to hit the like button and comment down below.`,
  },
];

const articles: Article[] = [
  {
    title: "Migrate from Dynamic Links.",
    description:
      "The most straightforward guide to migrating away from Dynamic Links.",
    date: "Dec 19, 2024",
    link: "https://medium.com/@punase.ronak99/migrate-from-dynamic-links-c6e35982d84b",
  },
  {
    title: "Machine Learning using PyTorch",
    description: "Curation of resources to get started with Machine Learning.",
    date: "Oct 23, 2024",
    link: "https://medium.com/@punase.ronak99/machine-learning-using-pytorch-what-worked-for-me-12f2c71e2871",
  },
];

const ongoing: OngoingProject[] = [
  {
    title: "UI components for Flutter",
    description: "Shadcn UI /  Aceternity UI components equivalent for Flutter",
    date: "In the works",
    link: "#",
  },
  {
    title: "Podcast / Interviews",
    description:
      "Interview a bunch of Flutter developers on The CS Guy youtube channel.",
    date: "Brainstorming",
    link: "#",
  },
  {
    title: "pub-preview.dev",
    description:
      "A project where users can see the preview of a bunch of plugins without even installing them.",
    date: "Brainstorming",
    link: "#",
  },
];

const socials: Social[] = [
  {
    type: "github",
    link: "https://github.com/Ronak99",
  },
  {
    type: "linkedin",
    link: "https://www.linkedin.com/in/ronak-punase/",
  },
  {
    type: "mail",
    link: "mailto:punase.ronak99@gmail.com",
  },
];

export { projects, videos, articles, ongoing, socials };
