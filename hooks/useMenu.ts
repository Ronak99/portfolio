"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Work } from "@/data/types";
import { useMenuState } from "./useMenuState";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function useMenu(
  works: Work[],
  overlayRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  navViewRef: React.RefObject<HTMLElement | null>,
  itemRefs: React.RefObject<(HTMLButtonElement | null)[]>
) {
  const { isOpen, view, setView, setIsOpen, setIsClosing } = useMenuState();
  const busyRef = useRef(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const reducedRef = useRef(false);
  const touchRef = useRef(false);

  const scrollToSection = useCallback((sel: string) => {
    const target = document.querySelector(sel);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({
      top,
      behavior: reducedRef.current ? "auto" : "smooth",
    });
    history.replaceState(null, "", sel);
  }, []);

  const handleCloseMenu = useCallback(
    (after?: () => void) => {
      if (!isOpen || busyRef.current) return;
      busyRef.current = true;
      setIsClosing(true);
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.classList.add("is-closing");
        overlay.classList.remove("is-open");
      }
      if (triggerRef.current)
        triggerRef.current.setAttribute("aria-expanded", "false");
      const delay = reducedRef.current ? 380 : 900;
      setTimeout(() => {
        if (overlay) overlay.classList.remove("is-closing");
        busyRef.current = false;
        setIsOpen(false);
        setIsClosing(false);
        setView("nav");
        if (lastFocusedRef.current?.focus)
          lastFocusedRef.current.focus({ preventScroll: true });
        if (after) after();
      }, delay);
    },
    [isOpen, overlayRef, triggerRef, setIsOpen, setIsClosing, setView]
  );

  const handleOpenMenu = useCallback(() => {
    if (isOpen || busyRef.current) return;
    busyRef.current = true;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.classList.remove("is-closing");
      overlay.classList.add("is-open");
    }
    if (triggerRef.current)
      triggerRef.current.setAttribute("aria-expanded", "true");
    setIsOpen(true);
    setView("nav");
    const delay = reducedRef.current ? 380 : 850;
    setTimeout(() => {
      busyRef.current = false;
      const first = navViewRef.current?.querySelector(".ov-link") as HTMLElement;
      if (first) first.focus({ preventScroll: true });
    }, delay);
  }, [isOpen, overlayRef, triggerRef, setIsOpen, setView, navViewRef]);

  useEffect(() => {
    reducedRef.current = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    touchRef.current = matchMedia("(hover: none), (pointer: coarse)").matches;

    // warm the cache so hover preview cards appear instantly
    works.forEach((w) => {
      const im = new Image();
      im.src = w.image;
    });
  }, [works]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        if (view === "works") setView("nav");
        else handleCloseMenu();
        return;
      }
      if (e.key === "Tab") {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const focusables = Array.from(
          overlay.querySelectorAll("button, a[href]")
        ).filter((el) => (el as HTMLElement).offsetParent !== null);
        const lampBtn = document.querySelector(
          ".pf-lamp.is-down .pf-lamp-btn"
        ) as HTMLElement;
        if (lampBtn) focusables.unshift(lampBtn);
        if (triggerRef.current) focusables.unshift(triggerRef.current);
        if (!focusables.length) return;
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
      if (
        view === "works" &&
        (e.key === "ArrowDown" || e.key === "ArrowUp")
      ) {
        e.preventDefault();
        const items = itemRefs.current ?? [];
        const current = items.findIndex(
          (el) => el === document.activeElement
        );
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const next =
          current === -1
            ? 0
            : clamp(current + dir, 0, items.length - 1);
        items[next]?.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    isOpen,
    view,
    setView,
    handleCloseMenu,
    overlayRef,
    triggerRef,
    itemRefs,
  ]);

  return {
    handleOpenMenu,
    handleCloseMenu,
    scrollToSection,
    touchRef,
    reducedRef,
  };
}
