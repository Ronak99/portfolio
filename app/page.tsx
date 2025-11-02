import React from "react";
import { TextSection } from "@/components/base/TextSection";
import { LinkSection } from "@/components/base/LinkSection";
import { ExperienceSection } from "@/components/base/ExperienceSection";
import { ProjectsSection } from "@/components/base/ProjectsSection";
import { WorkingOnSection } from "@/components/base/WorkingOnSection";
import { EducationSection } from "@/components/base/EducationSection";
import { ProfileHeader } from "@/components/base/ProfileHeader";
import {
  ExperienceItemProps,
  LinkItemProps,
  MediaItemProps,
} from "./util/types";
import { MediaSection } from "@/components/base/MediaSection";
import { basePath } from "./util/constants";

const Page: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const yearsOfExperience = currentYear - startYear;

  const aboutContent = `**Competitive when learning**, **collaborative when building**. 
\nI am a mobile dev with more than ${yearsOfExperience} years of experience, well versed in Flutter and the ins and outs of the various caveats presented by both Android and iOS.`

  // Contact links data
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

  // Social links data
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

  // Experience data
  const experiences: ExperienceItemProps[] = [
    {
      period: "2025 — Now",
      title: "Farmako",
      more: "/archive/farmako",
      items: ["Figuring things out..."],
    },
    {
      period: "2021 — 2025",
      title: "PuStack",
      more: "/archive/pustack",
      items: [
        "Worked on the [PuStack](https://apps.apple.com/us/app/pustack/id6444080075), [PuStack Tutor](https://apps.apple.com/in/app/pustack-tutor/id6444847124) and [PuStack Gives](https://apps.apple.com/in/app/pustack-gives/id6449460885) app.",
        "Engineered extremely reliable video calling mechanism.",
        "Implemented [Agora](https://www.agora.io/en)'s native Android and iOS SDK into a Flutter plugin.",
        "Extracted [Whiteboard SDK](d) native functionality into Flutter plugin.",
        "Built pixel-perfect UIs with dynamic layouts for mobile, tablet and iPad.",
        "Added feature inspired by Instagram Stories with advanced caching techniques in the tutor app.",
        "Designed and implemented a resilient call billing infrastructure.",
        "Led the revision and publication of the official PuStack and PuStack tutor apps on Play Store and App Store.",
      ],
    },
    {
      period: "Tech Stack",
      title: "Extensive",
      items: [
        "Flutter — Provider | Riverpod.",
        "Firebase — Auth | Storage | RTDB | Firestore | Cloud Functions.",
        "Native — Android (Java, Kotlin) | iOS (Swift)",
      ],
    },
    {
      period: "2020 — 2021",
      title: "Intern",
      items: [
        "Developed [Live Session Controller](/archive/pustack/#live_session_controller).",
        "Developed [Content Management System](/archive/pustack/#content_management_system).",
        "Developed [Customer Care Platform](#customer_care_platform).",
        "Developed [Central Auth Mechnanism](#central_auth_mechanism) like Google for all things PuStack.",
      ],
    },
  ];


  // Projects data
  const workingOn: ExperienceItemProps[] = [
    {
      period: "Jan 2025",
      title: "Majestic UI",
      items: [
        "[Shadcn](https://ui.shadcn.com/) equivalent for Flutter.",
        "Developed an [advanced CLI](https://pub.dev/packages/majestic_ui) tool for direct delivery to the user.",
        "Built a beautiful ReactJS website with hosted Flutter webview.",
        "Integrate Github's [Octokit](https://github.com/octokit) SDK for the [Publish](https://majesticui.com/publish) feature.",
        "Tech Stack — Next.js, Tailwind CSS, Dart, Supabase.",
      ],
    },
  ];

  // Projects data
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
      period: "2025",
      title: "Packages Published",
      items: [
        "Published on pub.dev [Persistent Textfield](https://pub.dev/packages/persistent_textfield).",
        "Published on pub.dev [majestic_ui](https://pub.dev/packages/majestic_ui).",
        "Published on npm [inquirely_chat](https://www.npmjs.com/package/inquirely-chat).",
      ],
    },
    {
      period: "2024",
      title: "Inquirely",
      image: `${basePath}/projects/inquirely.png`,
      items: [
        "Implemented ETL + Retrieval Augmented Generation pipeline.",
        "ETL Techniques such as: Normalization",
        "Supbase Vectorestore to store vector embeddings.",
        "OpenAIEmbeddings model to create and parse vector embeddings.",
        "Langchain to perform augmentation of user query.",
        "Next.js platform to create beautiful UI with a playground.",
        "Published inquirely-chat for businesses to incorporate.",
        "Watch a [demo](https://www.npmjs.com/package/inquirely-chat).",
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
        "Onpoint news with custom native notification design.",
        "Tech Stack — Flutter, Firebase, Cloud Function, Kotlin.",
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
    {
      period: "2021",
      title: "Skype Clone",
      image: `${basePath}/projects/skype-clone.webp`,
      items: [
        "Fully functional Skype Clone in Flutter.",
        "Features: Auth, Search, Chat, Video-Call.",
        "Video call is faciliated via [Agora SDK](https://www.agora.io).",
        "Take a look at the demo on [YouTube](https://www.youtube.com/watch?v=01PUYvVoLa8&list=PLTHrJfrjCyJDlOLSIT3bm2xCCuPanUNX4&t=62s).",
        "[Github Repository](https://github.com/Ronak99/Skype-Clone) with 300+ stars.",
      ],
    },
  ];

  // Videos
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

  // Medium articles
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

  // Education data
  const education: ExperienceItemProps[] = [
    {
      period: "2018 — 2021",
      title: "RGPV University",
      items: [
        "Pursued Bachelors of Technology in Computer Science.",
        "Maintained a decent score of 8.5 CGPA",
      ],
    },
  ];

  return (
    <>
      <main className="flex w-full">
        <div className="flex flex-col px-4 sm:px-8 py-8 sm:py-12 w-full max-w-[640px] h-full mx-auto">
          {/* Profile Header */}
          <ProfileHeader
            name="Ronak Punase"
            title="Flutter / iOS (Swift) Developer."
          />

          <div className="flex flex-col gap-8 sm:gap-12 mt-4">
            {/* About Section */}
            <TextSection
              content={aboutContent}
            />

            {/* Currently Working On Section */}
            <WorkingOnSection
              title="Currently Working On"
              items={workingOn}
            />

            {/* Experience Section */}
            <ExperienceSection title="Professional Experience" experiences={experiences} />
            
            {/* Projects Section */}
            <ProjectsSection
              title="Personal Projects"
              projects={projects}
            />

            {/* Videos Section */}
            <MediaSection
              title="Videos"
              items={videos}
              link="https://www.youtube.com/@TheCSGuy"
              linkLabel="View All"
            />

            {/* Articles Section */}
            <MediaSection
              title="Articles"
              items={articles}
              link="https://medium.com/@punase.ronak99"
              linkLabel="Read on Medium"
            />

            {/* Education Section */}
            <EducationSection title="Education" education={education} />


            {/* Contact Section */}
            <LinkSection title="Contact" links={contactLinks} />

            {/* Socials Section */}
            <LinkSection title="Socials" links={socialLinks} />

          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
