"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMenuState } from "./useMenuState";

const KEY = "portfolio-theme";
const RECOIL = "cubic-bezier(.22, 1.4, .36, 1)";
const AMP = 7;
const DAMP = 2.8;
const PULL = 18;

type Theme = "light" | "dark";

export function useLamp(
  lampRef: React.RefObject<HTMLDivElement | null>,
  swingRef: React.RefObject<HTMLDivElement | null>,
  cordRef: React.RefObject<SVGGElement | null>,
  litRef: React.RefObject<SVGGElement | null>,
  btnRef: React.RefObject<HTMLButtonElement | null>
) {
  const { isOpen, isClosing } = useMenuState();
  const themeRef = useRef<Theme>("light");
  const lockedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const dragRef = useRef({
    active: false,
    startY: 0,
    dy: 0,
    max: 0,
  });
  const suppressClickRef = useRef(false);
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedRef = useRef(false);

  const updateAria = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const lightNow = themeRef.current === "light";
    btn.setAttribute("aria-checked", String(themeRef.current === "dark"));
    btn.setAttribute(
      "aria-label",
      lightNow ? "switch to dark mode" : "switch to light mode"
    );
  }, [btnRef]);

  const setCord = useCallback(
    (dy: number, transition?: string) => {
      const cord = cordRef.current;
      if (!cord) return;
      cord.style.transition = transition || "none";
      cord.style.transform = `translateY(${dy}px)`;
    },
    [cordRef]
  );

  const flicker = useCallback(
    (toLit: boolean) => {
      const lit = litRef.current;
      if (!lit) return;
      lit.style.transition = "none";
      const seq = toLit
        ? [
            [0, 0.2],
            [55, 0.95],
            [105, 0.35],
            [175, 1],
          ]
        : [
            [0, 0.75],
            [60, 0.2],
            [125, 0.4],
            [220, 0],
          ];
      seq.forEach(([t, o]) =>
        setTimeout(() => {
          lit.style.opacity = String(o);
        }, t)
      );
      setTimeout(() => {
        lit.style.transition = "";
      }, 280);
    },
    [litRef]
  );

  const setTheme = useCallback(
    (next: Theme, animate: boolean) => {
      themeRef.current = next;
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      updateAria();
      const lit = litRef.current;
      if (!lit) return;
      if (animate && !reducedRef.current) {
        flicker(next === "light");
      } else {
        lit.style.opacity = next === "light" ? "1" : "0";
      }
    },
    [flicker, litRef, updateAria]
  );

  const startSwing = useCallback(
    (amp?: number) => {
      const swing = swingRef.current;
      if (!swing) return;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      const A = amp ?? AMP;
      swing.style.willChange = "transform";
      const t0 = performance.now();
      const step = (now: number) => {
        const t = (now - t0) / 1000;
        const a = A * Math.exp(-DAMP * t) * Math.sin(13 * t);
        swing.style.transform = `rotate(${a}deg)`;
        if (t < 1.7) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          swing.style.transform = "rotate(0deg)";
          swing.style.willChange = "auto";
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [swingRef]
  );

  const trigger = useCallback(
    (fromDy: number) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      const next: Theme =
        themeRef.current === "light" ? "dark" : "light";

      if (reducedRef.current) {
        setTheme(next, false);
        setCord(0, "transform 0.2s ease");
        setTimeout(() => {
          lockedRef.current = false;
        }, 450);
        return;
      }

      const pullDur = fromDy > 0 ? 30 : 130;
      if (!(fromDy > 0))
        setCord(PULL, "transform 130ms cubic-bezier(.4, 0, 1, 1)");

      setTimeout(() => {
        setCord(0, `transform 300ms ${RECOIL}`);
        setTheme(next, true);
        startSwing();
      }, pullDur);

      setTimeout(() => {
        lockedRef.current = false;
      }, 1250);
    },
    [setCord, setTheme, startSwing]
  );

  const dropLamp = useCallback(() => {
    const lamp = lampRef.current;
    if (!lamp) return;
    lamp.classList.add("is-down");
    document.body.classList.add("lamp-down");
    if (!reducedRef.current) startSwing(18);
  }, [lampRef, startSwing]);

  const liftLamp = useCallback(() => {
    const lamp = lampRef.current;
    if (!lamp) return;
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const swing = swingRef.current;
    if (swing) swing.style.transform = "rotate(0deg)";
    lamp.classList.remove("is-down");
    document.body.classList.remove("lamp-down");
  }, [lampRef, swingRef]);

  useEffect(() => {
    reducedRef.current = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const stored = document.documentElement.getAttribute("data-theme");
    themeRef.current = stored === "dark" ? "dark" : "light";
    updateAria();

    const lit = litRef.current;
    if (lit) {
      lit.style.opacity = themeRef.current === "light" ? "1" : "0";
    }

    const btn = btnRef.current;
    if (!btn) return;

    const onPointerDown = (e: PointerEvent) => {
      if (lockedRef.current || reducedRef.current || e.button > 0) return;
      dragRef.current = { active: true, startY: e.clientY, dy: 0, max: 0 };
      try {
        btn.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      let raw = e.clientY - dragRef.current.startY;
      if (raw < 0) raw *= 0.25;
      const dy = raw <= 28 ? raw : 28 + (raw - 28) * 0.35;
      dragRef.current.dy = Math.min(dy, 42);
      dragRef.current.max = Math.max(dragRef.current.max, dragRef.current.dy);
      setCord(dragRef.current.dy);
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      try {
        btn.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (dragRef.current.max > 6) suppressClickRef.current = true;
      if (dragRef.current.dy >= 28) {
        trigger(dragRef.current.dy);
      } else if (dragRef.current.max > 6) {
        setCord(hoveringRef.current ? -3 : 0, `transform 300ms ${RECOIL}`);
      }
    };

    const onClick = () => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }
      trigger(0);
    };

    const onMouseEnter = () => {
      hoveringRef.current = true;
      if (!lockedRef.current && !dragRef.current.active && !reducedRef.current)
        setCord(-3, "transform 0.25s ease");
    };

    const onMouseLeave = () => {
      hoveringRef.current = false;
      if (!lockedRef.current && !dragRef.current.active && !reducedRef.current)
        setCord(0, "transform 0.25s ease");
    };

    btn.addEventListener("pointerdown", onPointerDown);
    btn.addEventListener("pointermove", onPointerMove);
    btn.addEventListener("pointerup", endDrag);
    btn.addEventListener("pointercancel", endDrag);
    btn.addEventListener("click", onClick);
    btn.addEventListener("mouseenter", onMouseEnter);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      btn.removeEventListener("pointerdown", onPointerDown);
      btn.removeEventListener("pointermove", onPointerMove);
      btn.removeEventListener("pointerup", endDrag);
      btn.removeEventListener("pointercancel", endDrag);
      btn.removeEventListener("click", onClick);
      btn.removeEventListener("mouseenter", onMouseEnter);
      btn.removeEventListener("mouseleave", onMouseLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [btnRef, cordRef, litRef, setCord, trigger, updateAria]);

  useEffect(() => {
    if (isOpen && !isClosing) {
      dropTimerRef.current = setTimeout(
        dropLamp,
        reducedRef.current ? 400 : 900
      );
    } else {
      liftLamp();
    }
    return () => {
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    };
  }, [isOpen, isClosing, dropLamp, liftLamp]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isOpen]);
}
