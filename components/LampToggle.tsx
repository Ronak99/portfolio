"use client";

/**
 * <LampToggle /> — pendant pull-cord theme switch
 * ------------------------------------------------
 * A bulb hangs from the top edge on a wire; yanking the beaded cord swings
 * the bulb, flickers the filament, and crossfades the page between themes.
 * The lit-vs-dark bulb IS the on/off indicator.
 *
 * Stack: next-themes + framer-motion.
 *
 * Setup:
 *   1. npm i next-themes framer-motion
 *   2. Wrap your app:
 *        <ThemeProvider attribute="data-theme" enableSystem>
 *      and add suppressHydrationWarning to <html>.
 *   3. Add the theme tokens below to globals.css.
 *   4. Drop <LampToggle /> into your layout (it positions itself fixed).
 *
 * Tokens for globals.css:
 *
 *   :root[data-theme="light"] {
 *     --bg: #f5f1e8;  --fg: #1a1a1a;
 *     --halo: rgba(255, 214, 140, 0.55);
 *     --lamp-wire: #9b9183; --lamp-cap: #a89e8e;
 *     --lamp-cord: #8a8174; --lamp-knob: #7d7568;
 *     --lamp-filament: rgba(26, 26, 26, 0.45);
 *   }
 *   :root[data-theme="dark"] {
 *     --bg: #0e0e12;  --fg: #e8e8ea;
 *     --halo: rgba(120, 140, 200, 0.12);
 *     --lamp-wire: #565c6a; --lamp-cap: #3a3d46;
 *     --lamp-cord: #5d6370; --lamp-knob: #6a7080;
 *     --lamp-filament: rgba(232, 232, 234, 0.28);
 *   }
 *   body { background: var(--bg); color: var(--fg);
 *          transition: background-color 0.4s ease, color 0.4s ease; }
 */

import * as React from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

const SWING_KEYFRAMES = [0, -9, 7.2, -5, 3.2, -1.6, 0.7, 0]; // damped, ~3.5 swings
const SWING_TIMES = [0, 0.14, 0.32, 0.5, 0.66, 0.8, 0.91, 1];

export default function LampToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // avoid SSR mismatch: only render themed visuals after mount
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const cordControls = useAnimationControls();
  const swingControls = useAnimationControls();
  const litControls = useAnimationControls();

  const lockRef = React.useRef(false);
  const queuedRef = React.useRef(false);
  const suppressClickRef = React.useRef(false);
  const dragState = React.useRef({ active: false, startY: 0, dy: 0, max: 0 });

  const lit = mounted && resolvedTheme === "light";

  const flipTheme = React.useCallback(() => {
    const next = resolvedTheme === "light" ? "dark" : "light";
    // optional flourish: smooth page-wide repaint via View Transitions API
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !prefersReducedMotion) {
      doc.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
    return next;
  }, [resolvedTheme, setTheme, prefersReducedMotion]);

  const trigger = React.useCallback(
    async (fromDrag = false) => {
      if (lockRef.current) {
        queuedRef.current = true; // queue at most one
        return;
      }
      lockRef.current = true;

      if (prefersReducedMotion) {
        flipTheme(); // instant/short crossfade only — the switch still works
        window.setTimeout(() => {
          lockRef.current = false;
        }, 450);
        return;
      }

      // 1. cord pull (skipped when the drag already stretched it) + spring recoil
      if (!fromDrag) {
        await cordControls.start({
          y: 28,
          transition: { duration: 0.13, ease: [0.4, 0, 1, 1] },
        });
      }
      cordControls.start({
        y: 0,
        transition: { type: "spring", stiffness: 700, damping: 22 },
      });

      // 2. theme flip + filament flicker (2-frame incandescent warm-up / gutter)
      const next = flipTheme();
      const toLit = next === "light";
      litControls.start({
        opacity: toLit ? [0.2, 0.95, 0.35, 1] : [0.75, 0.2, 0.4, 0],
        transition: { duration: toLit ? 0.18 : 0.22, times: [0, 0.3, 0.6, 1] },
      });

      // 3. damped pendulum about the ceiling anchor
      swingControls.start({
        rotate: SWING_KEYFRAMES,
        transition: { duration: 1.4, times: SWING_TIMES, ease: "easeInOut" },
      });

      window.setTimeout(() => {
        lockRef.current = false;
        if (queuedRef.current) {
          queuedRef.current = false;
          trigger();
        }
      }, 1200);
    },
    [cordControls, swingControls, litControls, flipTheme, prefersReducedMotion]
  );

  /* ── drag (progressive enhancement; click/keyboard always work) ── */

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (lockRef.current || prefersReducedMotion || e.button > 0) return;
    dragState.current = { active: true, startY: e.clientY, dy: 0, max: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragState.current;
    if (!d.active) return;
    let raw = e.clientY - d.startY;
    if (raw < 0) raw *= 0.25;
    d.dy = Math.min(raw <= 32 ? raw : 32 + (raw - 32) * 0.35, 48);
    d.max = Math.max(d.max, d.dy);
    cordControls.set({ y: d.dy });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragState.current;
    if (!d.active) return;
    d.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (d.max > 6) suppressClickRef.current = true;
    if (d.dy >= 32) {
      trigger(true); // past threshold → switch
    } else if (d.max > 6) {
      cordControls.start({
        y: 0,
        transition: { type: "spring", stiffness: 700, damping: 22 },
      }); // below threshold → spring back, no change
    }
  };

  const onClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    trigger();
  };

  return (
    <div className="lamp-root">
      {/* swing group — transform-origin is the ceiling anchor, not the bulb */}
      <motion.div className="lamp-swing" animate={swingControls} style={{ transformOrigin: "70px 0px" }}>
        <div className="lamp-halo" data-lit={lit || undefined} />

        <svg className="lamp-svg" viewBox="0 0 140 260" width="140" height="260" aria-hidden="true">
          <defs>
            <radialGradient id="lampGlassOff" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#34343e" />
              <stop offset="100%" stopColor="#1d1d25" />
            </radialGradient>
            <radialGradient id="lampGlassLit" cx="50%" cy="42%" r="65%">
              <stop offset="0%" stopColor="#fff6da" />
              <stop offset="55%" stopColor="#ffe9b8" />
              <stop offset="100%" stopColor="#ffce7a" />
            </radialGradient>
            <filter id="lampFilGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.6" />
            </filter>
          </defs>

          <line className="lamp-wire" x1="70" y1="0" x2="70" y2="150" />
          <rect className="lamp-cap" x="58" y="148" width="24" height="26" rx="4" />
          <circle cx="70" cy="200" r="28" fill="url(#lampGlassOff)" stroke="rgba(255,255,255,0.12)" />
          <path className="lamp-filament" d="M62 182 V198 M78 182 V198 M62 198 q4 8 8 0 q4 -8 8 0" />

          {/* lit overlay — crossfades 0.4s on theme change, flickers on switch */}
          <motion.g animate={litControls} initial={false} style={{ opacity: lit ? 1 : 0 }}>
            <circle cx="70" cy="200" r="28" fill="url(#lampGlassLit)" opacity="0.92" />
            <path className="lamp-filament-glow" filter="url(#lampFilGlow)" d="M62 182 V198 M78 182 V198 M62 198 q4 8 8 0 q4 -8 8 0" />
            <path className="lamp-filament-lit" d="M62 182 V198 M78 182 V198 M62 198 q4 8 8 0 q4 -8 8 0" />
          </motion.g>

          {/* pull cord */}
          <motion.g animate={cordControls} whileHover={prefersReducedMotion ? undefined : { y: -4 }}>
            <line className="lamp-cord-arm" x1="82" y1="158" x2="96" y2="158" />
            <line className="lamp-cord" x1="96" y1="158" x2="96" y2="216" />
            <circle className="lamp-bead" cx="96" cy="219" r="2.4" />
            <path className="lamp-knob" d="M96 222 C101.5 227 101.5 235 96 239 C90.5 235 90.5 227 96 222 Z" />
          </motion.g>
        </svg>
      </motion.div>

      {/* the real control: a button over the knob, ≥44px hit area */}
      <button
        type="button"
        className="lamp-knob-btn"
        role="switch"
        aria-checked={mounted ? resolvedTheme === "dark" : false}
        aria-label={lit ? "Switch to dark mode" : "Switch to light mode"}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {/* component-scoped styles */}
      <style>{`
        .lamp-root {
          position: fixed;
          top: 0;
          right: clamp(28px, 13vw, 200px);
          width: 140px;
          height: 260px;
          z-index: 50;
          pointer-events: none;
        }
        .lamp-swing { position: absolute; inset: 0; will-change: transform; }
        .lamp-svg { display: block; overflow: visible; }
        .lamp-halo {
          position: absolute;
          left: -55px; top: 75px;
          width: 250px; height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--halo) 0%, transparent 68%);
          opacity: 0;
          transform: scale(0.92);
          transition: opacity 0.4s ease, transform 0.4s ease;
          pointer-events: none;
        }
        .lamp-halo[data-lit] { opacity: 1; transform: scale(1); }
        .lamp-wire { stroke: var(--lamp-wire); stroke-width: 1.8; transition: stroke 0.4s ease; }
        .lamp-cap { fill: var(--lamp-cap); transition: fill 0.4s ease; }
        .lamp-filament { stroke: var(--lamp-filament); stroke-width: 1.6; fill: none; stroke-linecap: round; transition: stroke 0.4s ease; }
        .lamp-filament-lit { stroke: #ff9d2e; stroke-width: 1.8; fill: none; stroke-linecap: round; }
        .lamp-filament-glow { stroke: rgba(255, 184, 77, 0.85); stroke-width: 5; fill: none; stroke-linecap: round; }
        .lamp-cord-arm, .lamp-cord { stroke: var(--lamp-cord); stroke-width: 1.6; transition: stroke 0.4s ease; }
        .lamp-cord { stroke-dasharray: 3.5 2.2; }
        .lamp-bead, .lamp-knob { fill: var(--lamp-knob); transition: fill 0.4s ease; }
        .lamp-knob { stroke: rgba(0, 0, 0, 0.18); stroke-width: 0.6; }
        .lamp-knob-btn {
          position: absolute;
          left: 72px; top: 204px;
          width: 48px; height: 52px;
          pointer-events: auto;
          appearance: none;
          background: none;
          border: 0;
          cursor: grab;
          border-radius: 12px;
          touch-action: none;
        }
        .lamp-knob-btn:active { cursor: grabbing; }
        .lamp-knob-btn:focus-visible {
          outline: 1.5px dashed var(--fg);
          outline-offset: 4px;
        }
        @media (max-width: 640px) {
          .lamp-root { right: 20px; transform: scale(0.82); transform-origin: top right; }
        }
      `}</style>
    </div>
  );
}
