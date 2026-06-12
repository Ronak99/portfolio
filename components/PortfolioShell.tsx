"use client";

import { useRef } from "react";
import type { PortfolioData } from "@/data/types";
import { useMenu } from "@/hooks/useMenu";
import { MenuStateProvider, useMenuState } from "@/hooks/useMenuState";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { About } from "./About";
import { Contact } from "./Contact";
import { ExperienceSection } from "./Experience";
import { Hero } from "./Hero";
import { Media } from "./Media";
import { OverlayMenuContent } from "./OverlayMenu";
import { PendantLamp } from "./PendantLamp";
import { TopBar } from "./TopBar";
import { Works } from "./Works";

function PortfolioInner({ data }: { data: PortfolioData }) {
  useScrollReveal();
  const { isOpen, view } = useMenuState();

  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navViewRef = useRef<HTMLElement>(null);
  const worksViewRef = useRef<HTMLDivElement>(null);
  const worksListRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const chRRef = useRef<HTMLImageElement>(null);
  const chGRef = useRef<HTMLImageElement>(null);
  const chBRef = useRef<HTMLImageElement>(null);
  const incomingRef = useRef<HTMLImageElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const menu = useMenu(
    data.works,
    overlayRef,
    triggerRef,
    logoRef,
    navViewRef,
    worksViewRef,
    worksListRef,
    cardRef,
    cardInnerRef,
    glowRef,
    chRRef,
    chGRef,
    chBRef,
    incomingRef,
    itemRefs
  );

  const handleToggle = () => {
    if (isOpen) menu.handleCloseMenu();
    else menu.handleOpenMenu();
  };

  const handleLogoSpin = (spin: boolean) => {
    const logo = document.getElementById("logoMark");
    if (logo && !document.body.classList.contains("menu-open")) {
      logo.classList.toggle("is-spun", spin);
    }
  };

  return (
    <>
      <TopBar
        onToggle={handleToggle}
        onLogoSpin={handleLogoSpin}
        triggerRef={triggerRef}
      />
      <OverlayMenuContent
        works={data.works}
        socials={data.socials}
        email={data.meta.email}
        view={view}
        overlayRef={overlayRef}
        navViewRef={navViewRef}
        worksViewRef={worksViewRef}
        worksListRef={worksListRef}
        cardRef={cardRef}
        cardInnerRef={cardInnerRef}
        glowRef={glowRef}
        chRRef={chRRef}
        chGRef={chGRef}
        chBRef={chBRef}
        incomingRef={incomingRef}
        itemRefs={itemRefs}
        menu={menu}
      />
      <PendantLamp />

      <main id="top">
        <Hero hero={data.hero} />
        <Works works={data.works} />
        <ExperienceSection experience={data.experience} />
        <About about={data.about} />
        <Media media={data.media} />
        <Contact meta={data.meta} socials={data.socials} />
      </main>
    </>
  );
}

export function PortfolioShell({ data }: { data: PortfolioData }) {
  return (
    <MenuStateProvider>
      <PortfolioInner data={data} />
    </MenuStateProvider>
  );
}
