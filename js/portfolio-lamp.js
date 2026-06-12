/* compact pendant lamp — vanilla theme switch for the portfolio
   click → pull → recoil → swing → settle · drag past threshold · keyboard */
(() => {
  "use strict";

  const root = document.documentElement;
  const KEY = "portfolio-theme";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RECOIL = "cubic-bezier(.22, 1.4, .36, 1)";

  const lamp = document.getElementById("pfLamp");
  if (!lamp) return;
  const swing = lamp.querySelector(".pf-lamp-swing");
  const cord = lamp.querySelector(".pf-lamp-cord-group");
  const lit = lamp.querySelector(".pf-lamp-lit");
  const btn = lamp.querySelector(".pf-lamp-btn");

  /* compact motion: gentler swing than the full-size demo */
  const AMP = 7, DAMP = 2.8, PULL = 18;

  let theme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  let locked = false, raf = null;
  let hovering = false;
  const drag = { active: false, startY: 0, dy: 0, max: 0 };
  let suppressClick = false;

  function updateAria() {
    const lightNow = theme === "light";
    btn.setAttribute("aria-checked", String(theme === "dark"));
    btn.setAttribute("aria-label", lightNow ? "switch to dark mode" : "switch to light mode");
  }
  updateAria();

  function setCord(dy, transition) {
    cord.style.transition = transition || "none";
    cord.style.transform = `translateY(${dy}px)`;
  }

  /* 2-frame incandescent flicker on the lit overlay */
  function flicker(toLit) {
    lit.style.transition = "none";
    const seq = toLit
      ? [[0, 0.2], [55, 0.95], [105, 0.35], [175, 1]]
      : [[0, 0.75], [60, 0.2], [125, 0.4], [220, 0]];
    seq.forEach(([t, o]) => setTimeout(() => { lit.style.opacity = String(o); }, t));
    setTimeout(() => { lit.style.transition = ""; }, 280);
  }

  function setTheme(next, animate) {
    theme = next;
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    updateAria();
    if (animate && !REDUCED) {
      flicker(next === "light");
    } else {
      lit.style.opacity = next === "light" ? "1" : "0";
    }
  }

  /* damped pendulum about the ceiling anchor */
  function startSwing(amp) {
    cancelAnimationFrame(raf);
    const A = amp == null ? AMP : amp;
    swing.style.willChange = "transform";
    const t0 = performance.now();
    const step = (now) => {
      const t = (now - t0) / 1000;
      const a = A * Math.exp(-DAMP * t) * Math.sin(13 * t);
      swing.style.transform = `rotate(${a}deg)`;
      if (t < 1.7) {
        raf = requestAnimationFrame(step);
      } else {
        swing.style.transform = "rotate(0deg)";
        swing.style.willChange = "auto";
      }
    };
    raf = requestAnimationFrame(step);
  }

  function unlock() {
    locked = false;
  }

  /* taps during the transition are IGNORED (not queued) —
     the switch only accepts input when fully settled */
  function trigger(fromDy) {
    if (locked) return;
    locked = true;
    const next = theme === "light" ? "dark" : "light";

    if (REDUCED) {
      setTheme(next, false);
      setCord(0, "transform 0.2s ease");
      setTimeout(unlock, 450);
      return;
    }

    const pullDur = fromDy > 0 ? 30 : 130;
    if (!(fromDy > 0)) setCord(PULL, "transform 130ms cubic-bezier(.4, 0, 1, 1)");

    setTimeout(() => {
      setCord(0, `transform 300ms ${RECOIL}`);
      setTheme(next, true);
      startSwing();
    }, pullDur);

    setTimeout(unlock, 1250);
  }

  /* ── knob interactions: click primary, drag optional, keyboard always ── */

  btn.addEventListener("pointerdown", (e) => {
    if (locked || REDUCED || e.button > 0) return;
    drag.active = true;
    drag.startY = e.clientY;
    drag.dy = 0;
    drag.max = 0;
    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
  });

  btn.addEventListener("pointermove", (e) => {
    if (!drag.active) return;
    let raw = e.clientY - drag.startY;
    if (raw < 0) raw *= 0.25;
    const dy = raw <= 28 ? raw : 28 + (raw - 28) * 0.35;
    drag.dy = Math.min(dy, 42);
    drag.max = Math.max(drag.max, drag.dy);
    setCord(drag.dy);
  });

  function endDrag(e) {
    if (!drag.active) return;
    drag.active = false;
    try { btn.releasePointerCapture(e.pointerId); } catch (err) {}
    if (drag.max > 6) suppressClick = true;
    if (drag.dy >= 28) {
      trigger(drag.dy);
    } else if (drag.max > 6) {
      setCord(hovering ? -3 : 0, `transform 300ms ${RECOIL}`);
    }
  }
  btn.addEventListener("pointerup", endDrag);
  btn.addEventListener("pointercancel", endDrag);

  btn.addEventListener("click", () => {
    if (suppressClick) { suppressClick = false; return; }
    trigger(0);
  });

  btn.addEventListener("mouseenter", () => {
    hovering = true;
    if (!locked && !drag.active && !REDUCED) setCord(-3, "transform 0.25s ease");
  });
  btn.addEventListener("mouseleave", () => {
    hovering = false;
    if (!locked && !drag.active && !REDUCED) setCord(0, "transform 0.25s ease");
  });

  /* sync initial lit state */
  lit.style.opacity = theme === "light" ? "1" : "0";

  /* ── menu integration: the bulb lives on the menu page ──
     open → let the menu land first, then a slow drop with a big swing
     close → yank it straight back up with the closing curtain */

  let dropTimer = null;

  function dropLamp() {
    lamp.classList.add("is-down");
    document.body.classList.add("lamp-down");
    if (!REDUCED) startSwing(18); /* high-amplitude sway while it descends */
  }

  function liftLamp() {
    clearTimeout(dropTimer);
    cancelAnimationFrame(raf);
    swing.style.transform = "rotate(0deg)";
    lamp.classList.remove("is-down");
    document.body.classList.remove("lamp-down");
  }

  let menuWasOpen = document.body.classList.contains("menu-open");
  const menuWatcher = new MutationObserver(() => {
    const open = document.body.classList.contains("menu-open");
    if (open === menuWasOpen) return;
    menuWasOpen = open;
    if (open) {
      /* overlay clip-path takes 0.75s and nav items reveal after — drop once settled */
      dropTimer = setTimeout(dropLamp, REDUCED ? 400 : 900);
    } else {
      liftLamp();
    }
  });
  menuWatcher.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
})();
