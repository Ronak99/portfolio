"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Work } from "@/data/types";
import { useMenuState } from "./useMenuState";

const DEFAULT_TWEAKS = { lag: 0.12, distort: 1, split: 1 };

function getTweaks() {
  if (typeof window !== "undefined" && (window as unknown as { PORTFOLIO_TWEAKS?: typeof DEFAULT_TWEAKS }).PORTFOLIO_TWEAKS) {
    return (window as unknown as { PORTFOLIO_TWEAKS: typeof DEFAULT_TWEAKS }).PORTFOLIO_TWEAKS;
  }
  return DEFAULT_TWEAKS;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function useMenu(
  works: Work[],
  overlayRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  logoRef: React.RefObject<HTMLAnchorElement | null>,
  navViewRef: React.RefObject<HTMLElement | null>,
  worksViewRef: React.RefObject<HTMLDivElement | null>,
  worksListRef: React.RefObject<HTMLUListElement | null>,
  cardRef: React.RefObject<HTMLDivElement | null>,
  cardInnerRef: React.RefObject<HTMLDivElement | null>,
  glowRef: React.RefObject<HTMLDivElement | null>,
  chRRef: React.RefObject<HTMLImageElement | null>,
  chGRef: React.RefObject<HTMLImageElement | null>,
  chBRef: React.RefObject<HTMLImageElement | null>,
  incomingRef: React.RefObject<HTMLImageElement | null>,
  itemRefs: React.RefObject<(HTMLButtonElement | null)[]>
) {
  const { isOpen, view, setView, setIsOpen } = useMenuState();
  const busyRef = useRef(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(-1);
  const keyboardModeRef = useRef(false);
  const firstShowRef = useRef(true);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pxRef = useRef(0);
  const pyRef = useRef(0);
  const cxRef = useRef(0);
  const cyRef = useRef(0);
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const cardVisibleRef = useRef(false);
  const reducedRef = useRef(false);
  const touchRef = useRef(false);
  const isClosingRef = useRef(false);

  const setStack = useCallback(
    (src: string) => {
      if (chRRef.current) chRRef.current.src = src;
      if (chGRef.current) chGRef.current.src = src;
      if (chBRef.current) chBRef.current.src = src;
    },
    [chRRef, chGRef, chBRef]
  );

  const hideCard = useCallback(() => {
    cardVisibleRef.current = false;
    if (cardRef.current) cardRef.current.classList.remove("is-visible");
    activeIndexRef.current = -1;
    itemRefs.current?.forEach((el) => el?.classList.remove("is-active"));
  }, [cardRef, itemRefs]);

  const swapPreview = useCallback(
    (item: Work) => {
      const glow = glowRef.current;
      const incoming = incomingRef.current;
      const cardInner = cardInnerRef.current;
      if (!glow) return;

      glow.style.background = `radial-gradient(closest-side, ${item.glow}, transparent 72%)`;

      if (reducedRef.current || firstShowRef.current || touchRef.current) {
        setStack(item.image);
        firstShowRef.current = false;
        return;
      }

      if (incoming) {
        incoming.src = item.image;
        incoming.style.transition = "none";
        incoming.style.opacity = "0";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            incoming.style.transition = "opacity 0.34s ease";
            incoming.style.opacity = "1";
          });
        });
      }

      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
      swapTimerRef.current = setTimeout(() => {
        setStack(item.image);
        if (incoming) {
          incoming.style.transition = "none";
          incoming.style.opacity = "0";
        }
      }, 360);

      if (cardInner) {
        cardInner.animate(
          [{ transform: "scale(1.03)" }, { transform: "scale(1)" }],
          { duration: 340, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
      }
    },
    [glowRef, incomingRef, cardInnerRef, setStack]
  );

  const setActive = useCallback(
    (i: number) => {
      if (i === activeIndexRef.current) return;
      itemRefs.current?.forEach((el, j) =>
        el?.classList.toggle("is-active", j === i)
      );
      activeIndexRef.current = i;
      if (i >= 0 && works[i]) swapPreview(works[i]);
    },
    [itemRefs, works, swapPreview]
  );

  const showCard = useCallback(
    (x: number, y: number) => {
      if (cardVisibleRef.current) return;
      cardVisibleRef.current = true;
      cxRef.current = x;
      prevXRef.current = x;
      cyRef.current = y;
      prevYRef.current = y;
      if (cardRef.current) cardRef.current.classList.add("is-visible");
      if (!reducedRef.current && cardInnerRef.current) {
        cardInnerRef.current.animate(
          [
            { transform: "scale(0.85)", opacity: 0.4 },
            { transform: "scale(1)", opacity: 1 },
          ],
          { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
      }
    },
    [cardRef, cardInnerRef]
  );

  const positionCardStatic = useCallback(() => {
    cxRef.current = pxRef.current;
    cyRef.current = pyRef.current;
    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${pxRef.current}px, ${pyRef.current}px, 0) translate(-50%, -50%)`;
    }
  }, [cardRef]);

  const loop = useCallback(() => {
    const t = getTweaks();
    const lag = clamp(t.lag ?? 0.12, 0.03, 0.4);
    cxRef.current += (pxRef.current - cxRef.current) * lag;
    cyRef.current += (pyRef.current - cyRef.current) * lag;
    const vx = cxRef.current - prevXRef.current;
    const vy = cyRef.current - prevYRef.current;
    prevXRef.current = cxRef.current;
    prevYRef.current = cyRef.current;

    const speed = Math.hypot(vx, vy);
    const ang = Math.atan2(vy, vx);
    const distort = t.distort ?? 1;
    const stretch = Math.min(speed * 0.004, 0.16) * distort;

    if (cardRef.current) {
      cardRef.current.style.transform =
        `translate3d(${cxRef.current}px, ${cyRef.current}px, 0) translate(-50%, -50%) ` +
        `rotate(${ang}rad) scale(${1 + stretch}, ${1 - stretch * 0.55}) rotate(${-ang}rad)`;
    }

    const split = Math.min(speed * 0.28, 9) * (t.split ?? 1);
    const ox = Math.cos(ang) * split;
    const oy = Math.sin(ang) * split;
    if (chRRef.current)
      chRRef.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
    if (chBRef.current)
      chBRef.current.style.transform = `translate3d(${-ox}px, ${-oy}px, 0)`;

    rafIdRef.current = requestAnimationFrame(loop);
  }, [cardRef, chRRef, chBRef]);

  const startLoop = useCallback(() => {
    if (rafIdRef.current == null) rafIdRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stopLoop = useCallback(() => {
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

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
      isClosingRef.current = true;
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.classList.add("is-closing");
        overlay.classList.remove("is-open");
      }
      if (triggerRef.current)
        triggerRef.current.setAttribute("aria-expanded", "false");
      stopLoop();
      hideCard();
      const delay = reducedRef.current ? 380 : 900;
      setTimeout(() => {
        if (overlay) overlay.classList.remove("is-closing");
        isClosingRef.current = false;
        busyRef.current = false;
        setIsOpen(false);
        setView("nav");
        if (lastFocusedRef.current?.focus)
          lastFocusedRef.current.focus({ preventScroll: true });
        if (after) after();
      }, delay);
    },
    [isOpen, overlayRef, triggerRef, stopLoop, hideCard, setIsOpen]
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
    pxRef.current = innerWidth / 2;
    pyRef.current = innerHeight / 2;

    if (works.length && works[0]) setStack(works[0].image);
    works.forEach((w) => {
      const im = new Image();
      im.src = w.image;
    });
  }, [works, setStack]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.dataset.view = view;
    if (view === "works") {
      if (!touchRef.current && !reducedRef.current) startLoop();
    } else {
      stopLoop();
      hideCard();
    }
  }, [view, overlayRef, startLoop, stopLoop, hideCard]);

  useEffect(() => {
    const worksView = worksViewRef.current;
    if (!worksView || touchRef.current) return;

    const onPointerMove = (e: PointerEvent) => {
      if (view !== "works" || busyRef.current) return;
      keyboardModeRef.current = false;
      pxRef.current = e.clientX;
      pyRef.current = e.clientY;
      if (reducedRef.current) positionCardStatic();

      let best = -1;
      let bestDist = Infinity;
      const listRect = worksListRef.current?.getBoundingClientRect();
      if (
        listRect &&
        e.clientY > listRect.top - 60 &&
        e.clientY < listRect.bottom + 60
      ) {
        itemRefs.current?.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const d = Math.abs(e.clientY - (r.top + r.height / 2));
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
      }
      if (best >= 0) {
        if (!cardVisibleRef.current) showCard(e.clientX, e.clientY);
        setActive(best);
      } else {
        hideCard();
      }
    };

    const onPointerLeave = () => {
      if (!keyboardModeRef.current) hideCard();
    };

    worksView.addEventListener("pointermove", onPointerMove);
    worksView.addEventListener("pointerleave", onPointerLeave);
    return () => {
      worksView.removeEventListener("pointermove", onPointerMove);
      worksView.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [
    view,
    worksViewRef,
    worksListRef,
    itemRefs,
    setActive,
    showCard,
    hideCard,
    positionCardStatic,
  ]);

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
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const next = clamp(
          activeIndexRef.current + dir,
          0,
          (itemRefs.current?.length ?? 1) - 1
        );
        keyboardModeRef.current = true;
        itemRefs.current?.[next]?.focus({ preventScroll: true });
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
    setActive,
    showCard,
    hideCard,
    positionCardStatic,
    keyboardModeRef,
    touchRef,
    reducedRef,
    pxRef,
    pyRef,
  };
}
