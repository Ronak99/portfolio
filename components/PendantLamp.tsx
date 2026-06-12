"use client";

import { useRef } from "react";
import { useLamp } from "@/hooks/useLamp";

export function PendantLamp() {
  const lampRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<SVGGElement>(null);
  const litRef = useRef<SVGGElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useLamp(lampRef, swingRef, cordRef, litRef, btnRef);

  return (
    <div className="pf-lamp" id="pfLamp" ref={lampRef}>
      <div className="pf-lamp-swing" ref={swingRef}>
        <div className="pf-lamp-halo" />
        <svg
          className="pf-lamp-svg"
          viewBox="0 0 104 168"
          width="104"
          height="168"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="pfGlassLit" cx="50%" cy="42%" r="64%">
              <stop offset="0%" stopColor="#fbf3dd" />
              <stop offset="56%" stopColor="#f4e4c0" />
              <stop offset="100%" stopColor="#e6cc99" />
            </radialGradient>
            <filter id="pfFilGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          <line className="pf-lamp-wire" x1="52" y1="0" x2="52" y2="86" />
          <rect className="pf-lamp-cap" x="44" y="84" width="16" height="18" rx="3" />
          <line className="pf-lamp-cap-ridge" x1="45" y1="90" x2="59" y2="90" />
          <line className="pf-lamp-cap-ridge" x1="45" y1="96" x2="59" y2="96" />

          <circle className="pf-lamp-glass-off" cx="52" cy="122" r="19" />
          <path
            className="pf-lamp-filament"
            d="M46 109 V120 M58 109 V120 M46 120 q3 6 6 0 q3 -6 6 0"
          />

          <g className="pf-lamp-lit" ref={litRef}>
            <circle
              className="pf-lamp-glass-lit"
              cx="52"
              cy="122"
              r="19"
              fill="url(#pfGlassLit)"
              fillOpacity="0.85"
            />
            <path
              className="pf-lamp-filament-glow"
              filter="url(#pfFilGlow)"
              d="M46 109 V120 M58 109 V120 M46 120 q3 6 6 0 q3 -6 6 0"
            />
            <path
              className="pf-lamp-filament-lit"
              d="M46 109 V120 M58 109 V120 M46 120 q3 6 6 0 q3 -6 6 0"
            />
          </g>

          <g className="pf-lamp-cord-group" ref={cordRef}>
            <line className="pf-lamp-cord-arm" x1="62" y1="94" x2="74" y2="94" />
            <line className="pf-lamp-cord" x1="74" y1="94" x2="74" y2="132" />
            <circle className="pf-lamp-bead" cx="74" cy="135" r="2.1" />
            <path
              className="pf-lamp-knob"
              d="M74 138 C78.5 142 78.5 149 74 152.5 C69.5 149 69.5 142 74 138 Z"
            />
          </g>
        </svg>
      </div>
      <button
        type="button"
        className="pf-lamp-btn"
        ref={btnRef}
        role="switch"
        aria-checked={false}
        aria-label="switch to dark mode"
      />
    </div>
  );
}
