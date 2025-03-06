import React from "react";
import { TextSection } from "@/components/base/TextSection";
import { LinkSection } from "@/components/base/LinkSection";
import { ExperienceSection } from "@/components/base/ExperienceSection";
import { ProfileHeader } from "@/components/base/ProfileHeader";

import { ExperienceItemProps, LinkItemProps } from "../../util/types";
import { basePath } from "@/app/util/constants";

const Page: React.FC = () => {
  return (
    <>
      <main className="flex w-full">
        <div className="flex flex-col px-8 py-12 w-[640px] h-full mx-auto">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src={`${basePath}/pustack_logo.jpg`}
              alt="PuStack"
              className="object-cover rounded-lg h-[50px] w-[50px]"
            />
            <div className="flex flex-col">
              <span className="text-2xl">PuStack</span>
              <span className="text-sm text-ronak-foreground">
                Learning Made Easy.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-12 mt-10">
            {/* Section 1 */}
            <LinkSection
              title="Website"
              links={[
                {
                  label: "Webite",
                  link: "pustack.com",
                  text: "pustack.com",
                },
                {
                  label: "Student App",
                  link: "pustack.com",
                  text: "PuStack on App Store",
                },
                {
                  label: "Tutor App",
                  link: "pustack.com",
                  text: "PuStack Tutor on App Store",
                },
                {
                  label: "Gives App",
                  link: "pustack.com",
                  text: "PuStack Gives on App Store",
                },
              ]}
            />
            {/* About Section */}
            <TextSection title="My Time at PuStack" content="To be added." />

            <TextSection title="PuStack Student App" content="To be added." />

            <TextSection title="PuStack Tutor App" content="To be added." />

            <TextSection title="PuStack Gives App" content="To be added." />

            <TextSection
              title="Internship at PuStack"
              content={`[Shivam Gupta](https://www.linkedin.com/in/shivamsf/) reached out to me in 2020 after seeing my content on YouTube and explained his vision for PuStack and how I would fit into the role as a Flutter Developer. I really like the idea and as a 20 year old, really needed work experience. I was already working as a freelancer at this point, but I figured it would be better to take up full-time work experience.\n\nAfter a brief interview, I was given the offer letter, man was I thrilled.`}
            />

            <TextSection
              title="Live Session Manager"
              content="This was my first project. PuStack needed a platform from where their teacher's could schedule daily live sessions, the live sessions are then consumed by the student app. "
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
