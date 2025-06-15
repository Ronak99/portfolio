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
              src={`${basePath}/farmako_logo.jpg`}
              alt="Farmako"
              className="object-cover rounded-lg h-[50px] w-[50px]"
            />
            <div className="flex flex-col">
              <span className="text-2xl">Farmako</span>
              <span className="text-sm text-ronak-foreground">
                Medicines in 10 minutes.
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
                  link: "farmako.ai",
                  text: "farmako.ai",
                },
                {
                  label: "Android",
                  link: "https://play.google.com/store/apps/details?id=in.farmako.users_app_mv2&hl=en_IN",
                  text: "Farmako App on Play Store",
                },
                {
                  label: "iOS",
                  link: "https://apps.apple.com/in/app/farmako-medicines-in-30-min/id1639113676",
                  text: "Farmako App on App Store",
                },
              ]}
            />
            {/* About Section */}
            <TextSection title="My Time at Farmako" content="To be added." />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
