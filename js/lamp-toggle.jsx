/* ───────────────────────────────────────────
   <LampToggle /> — pendant pull-cord theme switch
   click → pull → recoil → swing → settle
─────────────────────────────────────────── */
const { useState, useRef, useEffect } = React;

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const RECOIL = "cubic-bezier(.22, 1.4, .36, 1)";

function LampToggle({ amplitude, damping, pull }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("lamp-theme") || "light"; }
    catch (e) { return "light"; }
  });
  const lit = theme === "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-lamp-theme", theme);
    try { localStorage.setItem("lamp-theme", theme); } catch (e) {}
  }, [theme]);

  /* refs for imperative animation (single rAF, transforms only) */
  const swingRef = useRef(null);
  const cordRef = useRef(null);
  const litRef = useRef(null);
  const rafRef = useRef(null);
  const lockRef = useRef(false);
  const queuedRef = useRef(false);
  const themeRef = useRef(theme);
  const propsRef = useRef({ amplitude, damping, pull });
  const triggerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({ active: false, startY: 0, dy: 0, max: 0 });
  const hoverRef = useRef(false);

  themeRef.current = theme;
  propsRef.current = { amplitude, damping, pull };

  const setCord = (dy, transition) => {
    const el = cordRef.current;
    if (!el) return;
    el.style.transition = transition || "none";
    el.style.transform = `translateY(${dy}px)`;
  };

  /* 2-frame incandescent flicker on the lit overlay */
  const flicker = (toLit) => {
    const el = litRef.current;
    if (!el) return;
    el.style.transition = "none";
    const seq = toLit
      ? [[0, 0.2], [55, 0.95], [105, 0.35], [175, 1]]
      : [[0, 0.75], [60, 0.2], [125, 0.4], [220, 0]];
    seq.forEach(([t, o]) => setTimeout(() => { el.style.opacity = String(o); }, t));
    setTimeout(() => { el.style.transition = ""; }, 280);
  };

  /* damped pendulum about the ceiling anchor */
  const startSwing = () => {
    cancelAnimationFrame(rafRef.current);
    const el = swingRef.current;
    const { amplitude: A, damping: k } = propsRef.current;
    el.style.willChange = "transform";
    const t0 = performance.now();
    const step = (now) => {
      const t = (now - t0) / 1000;
      const a = A * Math.exp(-k * t) * Math.sin(13 * t);
      el.style.transform = `rotate(${a}deg)`;
      if (t < 1.8) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.style.transform = "rotate(0deg)";
        el.style.willChange = "auto";
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const unlock = () => {
    lockRef.current = false;
    if (queuedRef.current) {
      queuedRef.current = false;
      triggerRef.current(0);
    }
  };

  const trigger = (fromDy) => {
    if (lockRef.current) { queuedRef.current = true; return; }
    lockRef.current = true;
    const next = themeRef.current === "light" ? "dark" : "light";

    if (REDUCED) {
      setTheme(next);
      setCord(0, "transform 0.2s ease");
      setTimeout(unlock, 450);
      return;
    }

    const { pull: pullDist } = propsRef.current;
    const pullDur = fromDy > 0 ? 30 : 130;
    if (!(fromDy > 0)) setCord(pullDist, "transform 130ms cubic-bezier(.4, 0, 1, 1)");

    setTimeout(() => {
      setCord(0, `transform 300ms ${RECOIL}`);
      setTheme(next);
      flicker(next === "light");
      startSwing();
    }, pullDur);

    setTimeout(unlock, 1250);
  };
  triggerRef.current = trigger;

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* ── knob interactions: click is primary, drag is enhancement ── */

  const onPointerDown = (e) => {
    if (lockRef.current || REDUCED || e.button > 0) return;
    const d = dragRef.current;
    d.active = true;
    d.startY = e.clientY;
    d.dy = 0;
    d.max = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    let raw = e.clientY - d.startY;
    if (raw < 0) raw *= 0.25;
    const dy = raw <= 32 ? raw : 32 + (raw - 32) * 0.35;
    d.dy = Math.min(dy, 48);
    d.max = Math.max(d.max, d.dy);
    setCord(d.dy);
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
    if (d.max > 6) suppressClickRef.current = true;
    if (d.dy >= 32) {
      trigger(d.dy);
    } else if (d.max > 6) {
      setCord(hoverRef.current ? -4 : 0, `transform 300ms ${RECOIL}`);
    }
  };

  const onClick = () => {
    if (suppressClickRef.current) { suppressClickRef.current = false; return; }
    trigger(0);
  };

  const onEnter = () => {
    hoverRef.current = true;
    if (!lockRef.current && !dragRef.current.active && !REDUCED) {
      setCord(-4, "transform 0.25s ease");
    }
  };

  const onLeave = () => {
    hoverRef.current = false;
    if (!lockRef.current && !dragRef.current.active && !REDUCED) {
      setCord(0, "transform 0.25s ease");
    }
  };

  return (
    <div className="lamp-root" aria-hidden="false">
      {/* swing group — rotates about the ceiling anchor */}
      <div className="lamp-swing" ref={swingRef}>
        <div className="lamp-halo lamp-halo-light"></div>
        <div className="lamp-halo lamp-halo-dark"></div>

        <svg className="lamp-svg" viewBox="0 0 140 260" width="140" height="260" aria-hidden="true">
          <defs>
            <radialGradient id="glassOff" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#34343e"></stop>
              <stop offset="100%" stopColor="#1d1d25"></stop>
            </radialGradient>
            <radialGradient id="glassLit" cx="50%" cy="42%" r="65%">
              <stop offset="0%" stopColor="#fff6da"></stop>
              <stop offset="55%" stopColor="#ffe9b8"></stop>
              <stop offset="100%" stopColor="#ffce7a"></stop>
            </radialGradient>
            <filter id="filGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.6"></feGaussianBlur>
            </filter>
          </defs>

          {/* wire from ceiling to cap */}
          <line className="lamp-wire" x1="70" y1="0" x2="70" y2="150"></line>

          {/* socket cap */}
          <rect className="lamp-cap" x="58" y="148" width="24" height="26" rx="4"></rect>
          <line className="lamp-cap-ridge" x1="59" y1="156" x2="81" y2="156"></line>
          <line className="lamp-cap-ridge" x1="59" y1="163" x2="81" y2="163"></line>

          {/* glass — cold base, lit overlay crossfades above it */}
          <circle className="lamp-glass-off" cx="70" cy="200" r="28" fill="url(#glassOff)"></circle>
          <path className="lamp-filament" d="M62 182 V198 M78 182 V198 M62 198 q4 8 8 0 q4 -8 8 0"></path>

          <g className="lamp-lit" ref={litRef} style={{ opacity: lit ? 1 : 0 }}>
            <circle cx="70" cy="200" r="28" fill="url(#glassLit)" opacity="0.92"></circle>
            <path className="lamp-filament-glow" filter="url(#filGlow)" d="M62 182 V198 M78 182 V198 M62 198 q4 8 8 0 q4 -8 8 0"></path>
            <path className="lamp-filament-lit" d="M62 182 V198 M78 182 V198 M62 198 q4 8 8 0 q4 -8 8 0"></path>
          </g>

          {/* pull cord (own group so it can yank independently) */}
          <g className="lamp-cord-group" ref={cordRef}>
            <line className="lamp-cord-arm" x1="82" y1="158" x2="96" y2="158"></line>
            <line className="lamp-cord" x1="96" y1="158" x2="96" y2="216"></line>
            <circle className="lamp-bead" cx="96" cy="219" r="2.4"></circle>
            <path className="lamp-knob" d="M96 222 C101.5 227 101.5 235 96 239 C90.5 235 90.5 227 96 222 Z"></path>
          </g>
        </svg>
      </div>

      {/* the real control: a button over the knob, ≥44px hit area */}
      <button
        type="button"
        className="lamp-knob-btn"
        role="switch"
        aria-checked={theme === "dark"}
        aria-label={lit ? "switch to dark mode" : "switch to light mode"}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      ></button>
    </div>
  );
}

/* ── demo app + tweaks ───────────────────── */

const LAMP_DEFAULTS = /*EDITMODE-BEGIN*/{
  "amplitude": 9,
  "damping": 2.4,
  "pull": 28
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(LAMP_DEFAULTS);

  return (
    <React.Fragment>
      <LampToggle amplitude={t.amplitude} damping={t.damping} pull={t.pull} />

      <main className="demo" data-screen-label="lamp toggle demo">
        <p className="mono demo-label">✲ component demo</p>
        <h1>lamp toggle</h1>
        <p className="demo-sub">
          a pendant bulb is the theme switch. click the cord, drag it past the
          threshold, or focus it and press enter — the yank swings the bulb,
          the filament flickers, and the room follows.
        </p>
        <p className="mono demo-foot">
          lit = light mode · dark = dark mode · respects prefers-reduced-motion
        </p>
        <a className="mono demo-back" href="index.html">← back to portfolio</a>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Swing" />
        <TweakSlider label="Amplitude" value={t.amplitude} min={0} max={20} step={0.5} unit="°"
                     onChange={(v) => setTweak("amplitude", v)} />
        <TweakSlider label="Damping" value={t.damping} min={0.8} max={5} step={0.1}
                     onChange={(v) => setTweak("damping", v)} />
        <TweakSection label="Cord" />
        <TweakSlider label="Pull distance" value={t.pull} min={12} max={48} step={1} unit="px"
                     onChange={(v) => setTweak("pull", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
