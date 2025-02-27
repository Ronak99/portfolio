import React from "react";
import { TextSection } from "@/components/base/TextSection";
import { LinkSection } from "@/components/base/LinkSection";
import { ExperienceSection } from "@/components/base/ExperienceSection";
import { ProfileHeader } from "@/components/base/ProfileHeader";

import { ExperienceItemProps, LinkItemProps } from "../../util/types";

const Page: React.FC = () => {
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
      link: "https://www.linkedin.com/in/ronak-punase/",
      text: "Ronak99",
    },
  ];

  // Experience data
  const experiences: ExperienceItemProps[] = [
    {
      period: "2021 — Now",
      title: "PuStack",
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
        "Developed [Live Session Controller](#lsc).",
        "Developed [Content Management System](#cms).",
        "Developed [Customer Care Platform](#ccp).",
        "Developed [Central Auth Mechnanism](#cam) like Google for all things PuStack.",
      ],
    },
  ];

  // Projects data
  const projects: ExperienceItemProps[] = [
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
      items: [
        "Fully functional Skype Clone in Flutter.",
        "Features: Auth, Search, Chat, Video-Call.",
        "Video call is faciliated via [Agora SDK](https://www.agora.io).",
        "Take a look at the demo on [YouTube](https://www.youtube.com/watch?v=01PUYvVoLa8&list=PLTHrJfrjCyJDlOLSIT3bm2xCCuPanUNX4&t=62s).",
        "[Github Repository](https://github.com/Ronak99/Skype-Clone) with 300+ stars.",
      ],
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
        <div className="flex flex-col px-8 py-12 w-[640px] h-full mx-auto">
          {/* Profile Header */}
          <ProfileHeader
            name="Ronak Punase"
            title="Flutter and React Developer."
          />

          <div className="flex flex-col gap-12 mt-10">
            {/* About Section */}
            <TextSection
              title="About"
              content="I am a passionate Flutter developer with over 4 years of experience and there's a lot more about you that you ought to know."
            />

            {/* Contact Section */}
            <LinkSection title="Contact" links={contactLinks} />

            {/* Socials Section */}
            <LinkSection title="Socials" links={socialLinks} />

            {/* Experience Section */}
            <ExperienceSection title="Experience" experiences={experiences} />

            {/* Projects Section */}
            <ExperienceSection
              title="Personal Projects"
              experiences={projects}
            />

            {/* Education Section */}
            <ExperienceSection title="Education" experiences={education} />

            {/* Videos Section */}
            <TextSection
              title="Videos"
              content="I am a passionate Flutter developer with over 4 years of experience and there's a lot more about you that you ought to know."
            />

            {/* Articles Section */}
            <TextSection
              title="Articles"
              content="I am a passionate Flutter developer with over 4 years of experience and there's a lot more about you that you ought to know."
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
