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
            <TextSection
              title="My Time at PuStack"
              content="It was fun while it lasted. Learnt a lot."
            />

            <TextSection
              title="PuStack Student App"
              content="I have a lot of challenges that I faced and overcome which I can pen down here."
            />

            <TextSection
              title="PuStack Tutor App"
              content="This was really fun as this was the first app based project that I worked on from scratch and man, I love the way this turned out. I can just keep writing about this one."
            />

            <TextSection
              title="PuStack Gives App"
              content="This was a fun little experiment, never meant to be used by a large number of people, but I am mentioning it here nonetheless."
            />

            <TextSection
              title="Internship at PuStack"
              content={`[Shivam Gupta](https://www.linkedin.com/in/shivamsf/) reached out to me in 2020 after seeing my content on YouTube and explained his vision for PuStack and how I would fit into the role as a Flutter Developer. I really like the idea and as a 20 year old, really needed work experience. I was already working as a freelancer at this point, but I figured it would be better to take up full-time work experience.\n\nAfter a brief interview, I was given the offer letter, man was I thrilled.`}
            />

            <TextSection
              title="Live Session Manager"
              content="This was my first project. PuStack needed a platform from where their teacher's could schedule daily live sessions, the live sessions were then consumed by the student app. I got started with building this on Flutter Web. A big challenge in this project was defining what LIVE actually meant. A teacher had the ability to create a session for the next second, minute or they could plan ahead upto 2 months. Since our backend was in [Firebase](https://console.firebase.google.com/), I had to map the same data using two separate data points as anchor points in order to ensure that the queries are optimized. In one collection, everything is mapped by the date on which a particular session is supposed to go live, this allowed me to quickly query and display available sessions within a calendar view, making it easier to navigate for the teachers. On the other hand, we had the student app which didn't care for these things, so here everything was maintained using the regular firebase document id based structure. It was a real challenge to prevent a single data point to go out of sync with another one, now that we were maintaining two source of truths, especially when user changes the essential data like the date on which a particular session is meant to go live."
            />

            <TextSection
              title="Content Management System"
              content="This was my first project. PuStack needed a platform from where their teacher's could schedule daily live sessions, the live sessions were then consumed by the student app. I got started with building this on Flutter Web. A big challenge in this project was defining what LIVE actually meant. A teacher had the ability to create a session for the next second, minute or they could plan ahead upto 2 months. Since our backend was in [Firebase](https://console.firebase.google.com/), I had to map the same data using two separate data points as anchor points in order to ensure that the queries are optimized. In one collection, everything is mapped by the date on which a particular session is supposed to go live, this allowed me to quickly query and display available sessions within a calendar view, making it easier to navigate for the teachers. On the other hand, we had the student app which didn't care for these things, so here everything was maintained using the regular firebase document id based structure. It was a real challenge to prevent a single data point to go out of sync with another one, now that we were maintaining two source of truths, especially when user changes the essential data like the date on which a particular session is meant to go live."
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
