import React from "react";
import { TextSection } from "@/components/base/TextSection";
import { LinkSection } from "@/components/base/LinkSection";
import { ExperienceSection } from "@/components/base/ExperienceSection";
import { ProjectsSection } from "@/components/base/ProjectsSection";
import { WorkingOnSection } from "@/components/base/WorkingOnSection";
import { ProfileHeader } from "@/components/base/ProfileHeader";
import {
  ExperienceItemProps,
  LinkItemProps,
  MediaItemProps,
} from "./util/types";
import { MediaSection } from "@/components/base/MediaSection";
import { FadeIn } from "@/components/base/FadeIn";
import { basePath } from "./util/constants";

const Page: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - 2020;

  const aboutContent = `**Competitive when learning**, **collaborative when building**.\n\nI am a mobile dev with more than ${yearsOfExperience} years of experience, well versed in Flutter and the ins and outs of the various caveats presented by both Android and iOS.`;

  const contactLinks: LinkItemProps[] = [
    {
      label: "Email",
      link: "mailto:punase.ronak99@gmail.com",
      text: "punase.ronak99@gmail.com",
    },
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/ronak-punase/",
      text: "ronak-punase",
    },
  ];

  const socialLinks: LinkItemProps[] = [
    {
      label: "YouTube",
      link: "https://www.youtube.com/@TheCSGuy",
      text: "The CS Guy",
    },
    {
      label: "Twitter",
      link: "https://x.com/The_RonakPunase",
      text: "The_RonakPunase",
    },
    {
      label: "Github",
      link: "https://github.com/Ronak99/",
      text: "Ronak99",
    },
  ];

  const experiences: ExperienceItemProps[] = [
    {
      period: "2025 — Now",
      title: "Farmako",
      more: "/archive/farmako",
      items: [
        "Built a new, dynamic UI using advanced Dart features (mixins, factory constructors, detailed enums), improving overall project code-quality.",
        "Developed and stabilized multiple CI/CD workflows, reducing build failures by 40%.",
        "Implemented a unified CI/CD pipeline for Android, iOS, Firebase Distribution, and Shorebird, cutting distribution time by several hours (≈60–70%).",
        "Replaced GitHub-hosted runners with local runners, reducing infrastructure costs by 150% and speeding up builds by 25%.",
        "Re-implemented the cart as a local-first system, improving add-to-cart speed and delivering a noticeably smoother UX.",
      ],
    },
    {
      period: "2021 — 2025",
      title: "PuStack",
      more: "/archive/pustack",
      items: [
        "Worked on the [PuStack](https://apps.apple.com/us/app/pustack/id6444080075), [PuStack Tutor](https://apps.apple.com/in/app/pustack-tutor/id6444847124) and [PuStack Gives](https://apps.apple.com/in/app/pustack-gives/id6449460885) app.",
        "Engineered extremely reliable video calling mechanism.",
        "Implemented [Agora](https://www.agora.io/en)'s native Android and iOS SDK into a Flutter plugin.",
        "Extracted Whiteboard SDK native functionality into Flutter plugin.",
        "Built pixel-perfect UIs with dynamic layouts for mobile, tablet and iPad.",
        "Added feature inspired by Instagram Stories with advanced caching techniques in the tutor app.",
        "Designed and implemented a resilient call billing infrastructure.",
        "Led the revision and publication of the official PuStack and PuStack tutor apps on Play Store and App Store.",
      ],
    },
    {
      period: "2020 — 2021",
      title: "Intern",
      items: [
        "Developed [Live Session Controller](/archive/pustack/#live_session_controller).",
        "Developed [Content Management System](/archive/pustack/#content_management_system).",
        "Developed Customer Care Platform.",
        "Developed Central Auth Mechanism like Google for all things PuStack.",
      ],
    },
  ];

  const workingOn: ExperienceItemProps[] = [
    {
      period: "Jan 2025",
      title: "MyMoney",
      more: "https://github.com/Ronak99/MyMoney",
      image: `${basePath}/projects/my-money.png`,
      items: [
        "Industry ready expense tracker in Flutter.",
        "Features: Dynamic local bank statement parsers, Income, Expense, Category, Bank Accounts",
        "Built using: Floor DB, Bloc, Get",
      ],
    },
  ];

  const projects: ExperienceItemProps[] = [
    {
      period: "Jan 2025",
      title: "Majestic UI",
      image: `${basePath}/projects/majestic-ui.png`,
      items: [
        "[Shadcn](https://ui.shadcn.com/) equivalent for Flutter.",
        "Developed an [advanced CLI](https://pub.dev/packages/majestic_ui) tool for direct delivery to the user.",
        "Built a beautiful ReactJS website with hosted Flutter webview.",
        "Integrate Github's [Octokit](https://github.com/octokit) SDK for the [Publish](https://majesticui.com/publish) feature.",
        "Tech Stack — Next.js, Tailwind CSS, Dart, Supabase.",
      ],
    },
    {
      period: "2024",
      title: "Inquirely",
      image: `${basePath}/projects/inquirely.png`,
      items: [
        "Implemented ETL + Retrieval Augmented Generation pipeline.",
        "Supabase Vectorstore to store vector embeddings.",
        "OpenAIEmbeddings model to create and parse vector embeddings.",
        "Langchain to perform augmentation of user query.",
        "Published [inquirely-chat](https://www.npmjs.com/package/inquirely-chat) for businesses to incorporate.",
        "Tech Stack — Next.js, Tailwind CSS, Langchain, Supabase.",
      ],
    },
    {
      period: "2020",
      title: "Quickbytes",
      image: `${basePath}/projects/quickbytes.png`,
      items: [
        "InShorts inspired News application in Flutter.",
        "Beautiful UI, minimalistic vision.",
        "On-point news with custom native notification design.",
        "Tech Stack — Flutter, Firebase, Cloud Function, Kotlin.",
      ],
    },
    {
      period: "2021",
      title: "Skype Clone",
      image: `${basePath}/projects/skype-clone.webp`,
      items: [
        "Fully functional Skype Clone in Flutter.",
        "Features: Auth, Search, Chat, Video-Call.",
        "Video call facilitated via [Agora SDK](https://www.agora.io).",
        "Demo on [YouTube](https://www.youtube.com/watch?v=01PUYvVoLa8&list=PLTHrJfrjCyJDlOLSIT3bm2xCCuPanUNX4&t=62s).",
        "[Github Repository](https://github.com/Ronak99/Skype-Clone) with 300+ stars.",
      ],
    },
    {
      period: "2025",
      title: "Packages Published",
      items: [
        "Published on pub.dev [Persistent Textfield](https://pub.dev/packages/persistent_textfield).",
        "Published on pub.dev [majestic_ui](https://pub.dev/packages/majestic_ui).",
        "Published on npm [inquirely_chat](https://www.npmjs.com/package/inquirely-chat).",
      ],
    },
    {
      period: "2020",
      title: "Omegle Clone",
      items: [
        "Algorithm that connects two individuals actively searching for a match.",
        "Once matched, UI updates to render two video blocks.",
        "Tech Stack — Flutter, Firebase",
      ],
    },
  ];

  const videos: MediaItemProps[] = [
    {
      title: "Introducing Majestic UI for Flutter",
      image: `${basePath}/thumbnails/majesticui.webp`,
      link: "https://www.youtube.com/watch?v=wWH66F9y63U&t=30",
    },
    {
      title: "Video Calling in Flutter",
      image: `${basePath}/thumbnails/video-calling.webp`,
      link: "https://www.youtube.com/watch?v=v9ngriCV0J0",
    },
    {
      title: "Making Pixel Perfect UIs in Flutter",
      image: `${basePath}/thumbnails/pixel-perfect.webp`,
      link: "https://www.youtube.com/watch?v=wWH66F9y63U&t=30",
    },
    {
      title: "How to add Text to Speech",
      image: `${basePath}/thumbnails/tts-flutter.webp`,
      link: "https://www.youtube.com/watch?v=WnJZOi57oTY",
    },
  ];

  const articles: MediaItemProps[] = [
    {
      title: "Migrate from Dynamic Links",
      image: `${basePath}/thumbnails/article-2.webp`,
      link: "https://medium.com/@punase.ronak99/migrate-from-dynamic-links-c6e35982d84b",
    },
    {
      title: "PyTorch for Machine Learning",
      image: `${basePath}/thumbnails/article-1.webp`,
      link: "https://medium.com/@punase.ronak99/machine-learning-using-pytorch-what-worked-for-me-12f2c71e2871",
    },
  ];

  return (
    <main className="flex w-full min-h-screen">
      <div className="flex flex-col px-5 sm:px-8 py-10 sm:py-16 w-full max-w-[600px] mx-auto">

        <FadeIn delay={0}>
          <ProfileHeader
            name="Ronak Punase"
            title="Flutter / iOS (Swift) Developer."
          />
        </FadeIn>

        <div className="flex flex-col gap-10 sm:gap-14 mt-10 sm:mt-14">

          <FadeIn delay={0.05}>
            <TextSection
              content={aboutContent}
              large
              markdownBoldClassName="font-inter font-medium text-white/65"
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <WorkingOnSection title="Currently Building" items={workingOn} />
          </FadeIn>

          <FadeIn delay={0.15}>
            <ExperienceSection title="Experience" experiences={experiences} />
          </FadeIn>

          <FadeIn delay={0.2}>
            <ProjectsSection title="Projects" projects={projects} />
          </FadeIn>

          <FadeIn delay={0.25}>
            <MediaSection
              title="Videos"
              items={videos}
              link="https://www.youtube.com/@TheCSGuy"
              linkLabel="All videos →"
            />
          </FadeIn>

          <FadeIn delay={0.3}>
            <MediaSection
              title="Writing"
              items={articles}
              link="https://medium.com/@punase.ronak99"
              linkLabel="Read on Medium →"
            />
          </FadeIn>

          <FadeIn delay={0.35}>
            <LinkSection title="Contact" links={contactLinks} />
          </FadeIn>

          <FadeIn delay={0.4}>
            <LinkSection title="Elsewhere" links={socialLinks} />
          </FadeIn>

          <div className="pt-4 pb-2">
            <span className="font-inter text-[10px] text-white/15">
              © {currentYear} Ronak Punase
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
