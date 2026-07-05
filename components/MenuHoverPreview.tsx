"use client";

import { useEffect, useRef, useState } from "react";
import type { Work } from "@/data/types";

const CARD_W = 270;
const CARD_H = 150;
const LERP = 0.1; // follow lag: lower = lazier trailing
const SCALE_LERP = 0.16; // scale in / scale out easing
const SKEW = 1; // velocity-skew intensity multiplier

type Card = { id: number; idx: number };
type Phys = { px: number; py: number; scale: number; tScale: number };

/**
 * Cursor-following preview cards for the overlay menu's works list.
 *
 * Every hover (and every row switch) spawns its OWN fixed-position card.
 * Each live card lerps toward the pointer per rAF frame and skews in the
 * direction of travel; outgoing cards scale to 0 and are removed once
 * invisible. Spawned cards inherit the previous card's lerped position so
 * a row switch reads as one continuous gesture.
 */
export function MenuHoverPreview({
  works,
  hoveredIndex,
}: {
  works: Work[];
  hoveredIndex: number | null;
}) {
  const [cards, setCards] = useState<Card[]>([]);
  const els = useRef(new Map<number, HTMLAnchorElement>());
  const phys = useRef(new Map<number, Phys>());
  const pointer = useRef({ x: 0, y: 0 });
  const nextId = useRef(1);
  const activeId = useRef<number | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // sane resting spot for keyboard focus before any pointer movement
    pointer.current = { x: innerWidth * 0.72, y: innerHeight * 0.5 };
  }, []);

  // Spawn / retire cards when the hovered row changes.
  useEffect(() => {
    const p = phys.current;

    if (hoveredIndex == null) {
      if (activeId.current != null) {
        const st = p.get(activeId.current);
        if (st) st.tScale = 0; // scale out wherever it is
        activeId.current = null;
      }
      return;
    }

    const prev = activeId.current != null ? p.get(activeId.current) : null;
    const id = nextId.current++;
    p.set(id, {
      px: prev ? prev.px : pointer.current.x - CARD_W * 0.28,
      py: prev ? prev.py : pointer.current.y - CARD_H * 0.63,
      scale: 0,
      tScale: 1,
    });
    if (prev) prev.tScale = 0;
    activeId.current = id;
    setCards((cs) => [...cs, { id, idx: hoveredIndex }]);
  }, [hoveredIndex]);

  // Shared physics loop.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);

    // Anchor so the cursor sits near each card's lower-left region.
    const offX = -CARD_W * 0.28;
    const offY = -CARD_H * 0.63;
    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));
    let raf = 0;

    const frame = () => {
      const lerp = reducedRef.current ? 1 : LERP;
      const scaleLerp = reducedRef.current ? 1 : SCALE_LERP;
      const dead: number[] = [];

      phys.current.forEach((st, id) => {
        const dx = pointer.current.x + offX - st.px;
        const dy = pointer.current.y + offY - st.py;
        st.px += dx * lerp;
        st.py += dy * lerp;
        st.scale += (st.tScale - st.scale) * scaleLerp;

        if (st.tScale === 0 && st.scale < 0.02) {
          dead.push(id);
          return;
        }

        const el = els.current.get(id);
        if (!el) return;
        const skewX = reducedRef.current ? 0 : clamp(dx * 0.045 * SKEW, -14, 14);
        const skewY = reducedRef.current ? 0 : clamp(dy * 0.02 * SKEW, -6, 6);
        el.style.visibility = st.scale < 0.02 ? "hidden" : "visible";
        el.style.transformOrigin = `${-offX}px ${-offY}px`;
        el.style.transform = `translate(${st.px}px, ${st.py}px) skew(${skewX}deg, ${skewY}deg) scale(${st.scale})`;
      });

      if (dead.length) {
        dead.forEach((id) => {
          phys.current.delete(id);
          els.current.delete(id);
        });
        setCards((cs) => cs.filter((c) => !dead.includes(c.id)));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {cards.map((c) => {
        const work = works[c.idx];
        if (!work) return null;
        const active = c.idx === hoveredIndex;
        return (
          <a
            key={c.id}
            ref={(node) => {
              if (node) els.current.set(c.id, node);
            }}
            href={work.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`preview${active ? " preview-active" : ""}`}
            style={
              { "--accent": work.glow, visibility: "hidden" } as React.CSSProperties
            }
            aria-label={`Visit ${work.title}`}
            tabIndex={active ? 0 : -1}
          >
            <img src={work.image} alt="" />
          </a>
        );
      })}
    </>
  );
}
