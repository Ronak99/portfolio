/* overlay menu + works list — single rAF loop, lerp-based inertia */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  const tweaks = () => window.PORTFOLIO_TWEAKS || {};
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const body = document.body;
  const overlay = document.getElementById("overlay");
  const trigger = document.getElementById("menuTrigger");
  const logo = document.getElementById("logoMark");
  const navView = document.getElementById("navView");
  const worksView = document.getElementById("worksView");
  const worksList = document.getElementById("worksList");
  const backBtn = document.getElementById("worksBack");
  const items = Array.from(worksList.querySelectorAll(".work-item"));

  /* preview card pieces */
  const card = document.getElementById("previewCard");
  const cardInner = card.querySelector(".pc-inner");
  const glow = card.querySelector(".pc-glow");
  const chR = card.querySelector(".ch-r");
  const chG = card.querySelector(".ch-g");
  const chB = card.querySelector(".ch-b");
  const incoming = card.querySelector(".pc-incoming");

  let isOpen = false;
  let busy = false;
  let view = "nav";
  let lastFocused = null;

  /* ───────── open / close ───────── */

  function setView(v) {
    view = v;
    overlay.dataset.view = v;
    if (v === "works") {
      if (!touch && !reduced) startLoop();
    } else {
      stopLoop();
      hideCard();
    }
  }

  function openMenu() {
    if (isOpen || busy) return;
    isOpen = true;
    busy = true;
    lastFocused = document.activeElement;
    overlay.classList.remove("is-closing");
    overlay.classList.add("is-open");
    body.classList.add("menu-open");
    trigger.setAttribute("aria-expanded", "true");
    setView("nav");
    setTimeout(() => {
      busy = false;
      const first = navView.querySelector(".ov-link");
      if (first) first.focus({ preventScroll: true });
    }, reduced ? 380 : 850);
  }

  function closeMenu(after) {
    if (!isOpen || busy) return;
    isOpen = false;
    busy = true;
    overlay.classList.add("is-closing");
    overlay.classList.remove("is-open");
    body.classList.remove("menu-open");
    trigger.setAttribute("aria-expanded", "false");
    stopLoop();
    hideCard();
    setTimeout(() => {
      overlay.classList.remove("is-closing");
      overlay.dataset.view = "nav";
      view = "nav";
      busy = false;
      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
      if (after) after();
    }, reduced ? 380 : 900);
  }

  trigger.addEventListener("click", () => (isOpen ? closeMenu() : openMenu()));

  trigger.addEventListener("mouseenter", () => logo.classList.add("is-spun"));
  trigger.addEventListener("mouseleave", () => logo.classList.remove("is-spun"));

  /* nav links */
  document.getElementById("navWorks").addEventListener("click", () => {
    if (busy) return;
    setView("works");
    if (touch || reduced) {
      const first = items[0];
      if (first) first.focus({ preventScroll: true });
    }
  });

  backBtn.addEventListener("click", () => {
    if (busy) return;
    setView("nav");
  });

  overlay.querySelectorAll("[data-scroll-target]:not(.work-item)").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const sel = el.getAttribute("data-scroll-target");
      closeMenu(() => scrollToSection(sel));
    });
  });

  function scrollToSection(sel) {
    const target = document.querySelector(sel);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", sel);
  }

  /* keyboard */
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (view === "works") setView("nav");
      else closeMenu();
      return;
    }
    if (e.key === "Tab") trapFocus(e);
    if (view === "works" && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = clamp(activeIndex + dir, 0, items.length - 1);
      keyboardMode = true;
      items[next].focus({ preventScroll: true });
    }
  });

  function trapFocus(e) {
    const focusables = Array.from(
      overlay.querySelectorAll("button, a[href]")
    ).filter((el) => el.offsetParent !== null);
    /* the pendant lamp is fixed-position (offsetParent is null), add it by hand */
    const lampBtn = document.querySelector(".pf-lamp.is-down .pf-lamp-btn");
    if (lampBtn) focusables.unshift(lampBtn);
    focusables.unshift(trigger);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  /* ───────── works list: active item ───────── */

  let activeIndex = -1;
  let keyboardMode = false;
  let firstShow = true;
  let swapTimer = null;

  function setActive(i) {
    if (i === activeIndex) return;
    items.forEach((el, j) => el.classList.toggle("is-active", j === i));
    activeIndex = i;
    if (i >= 0) swapPreview(items[i]);
  }

  function swapPreview(item) {
    const src = item.dataset.image;
    glow.style.background = `radial-gradient(closest-side, ${item.dataset.glow}, transparent 72%)`;
    if (reduced || firstShow || touch) {
      setStack(src);
      firstShow = false;
      return;
    }
    /* crossfade: incoming fades in over the rgb stack, then stack swaps */
    incoming.src = src;
    incoming.style.transition = "none";
    incoming.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.style.transition = "opacity 0.34s ease";
        incoming.style.opacity = "1";
      });
    });
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      setStack(src);
      incoming.style.transition = "none";
      incoming.style.opacity = "0";
    }, 360);
    /* scale punch */
    cardInner.animate(
      [{ transform: "scale(1.03)" }, { transform: "scale(1)" }],
      { duration: 340, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }

  function setStack(src) {
    chR.src = src;
    chG.src = src;
    chB.src = src;
  }

  /* ───────── cursor-follow card (lerp + velocity distortion) ───────── */

  let px = innerWidth / 2, py = innerHeight / 2;
  let cx = px, cy = py, prevX = px, prevY = py;
  let rafId = null;
  let cardVisible = false;

  function showCard(x, y) {
    if (cardVisible) return;
    cardVisible = true;
    cx = prevX = x;
    cy = prevY = y;
    card.classList.add("is-visible");
    if (!reduced) {
      cardInner.animate(
        [
          { transform: "scale(0.85)", opacity: 0.4 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
  }

  function hideCard() {
    cardVisible = false;
    card.classList.remove("is-visible");
    setActive(-1);
  }

  function loop() {
    const t = tweaks();
    const lag = clamp(t.lag != null ? t.lag : 0.12, 0.03, 0.4);
    cx += (px - cx) * lag;
    cy += (py - cy) * lag;
    const vx = cx - prevX;
    const vy = cy - prevY;
    prevX = cx;
    prevY = cy;

    const speed = Math.hypot(vx, vy);
    const ang = Math.atan2(vy, vx);
    const distort = t.distort != null ? t.distort : 1;
    const stretch = Math.min(speed * 0.004, 0.16) * distort;

    card.style.transform =
      `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) ` +
      `rotate(${ang}rad) scale(${1 + stretch}, ${1 - stretch * 0.55}) rotate(${-ang}rad)`;

    const split = Math.min(speed * 0.28, 9) * (t.split != null ? t.split : 1);
    const ox = Math.cos(ang) * split;
    const oy = Math.sin(ang) * split;
    chR.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
    chB.style.transform = `translate3d(${-ox}px, ${-oy}px, 0)`;

    rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (rafId == null) rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* pointer tracking inside works view */
  if (!touch) {
    worksView.addEventListener("pointermove", (e) => {
      if (view !== "works" || busy) return;
      keyboardMode = false;
      px = e.clientX;
      py = e.clientY;
      if (reduced) positionCardStatic();

      /* nearest title to the cursor */
      let best = -1, bestDist = Infinity;
      const listRect = worksList.getBoundingClientRect();
      if (
        e.clientY > listRect.top - 60 &&
        e.clientY < listRect.bottom + 60
      ) {
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs(e.clientY - (r.top + r.height / 2));
          if (d < bestDist) { bestDist = d; best = i; }
        });
      }
      if (best >= 0) {
        if (!cardVisible) showCard(e.clientX, e.clientY);
        setActive(best);
      } else {
        hideCard();
      }
    });

    worksView.addEventListener("pointerleave", () => {
      if (!keyboardMode) hideCard();
    });
  }

  /* keyboard focus drives the preview to a fixed sensible spot */
  items.forEach((el, i) => {
    el.addEventListener("focus", () => {
      if (touch) return;
      keyboardMode = true;
      setKeyboardTarget();
      if (!cardVisible) showCard(px, py);
      setActive(i);
      if (reduced) positionCardStatic();
    });
    el.addEventListener("click", () => {
      const sel = el.getAttribute("data-scroll-target");
      closeMenu(() => scrollToSection(sel));
    });
  });

  function setKeyboardTarget() {
    px = innerWidth * 0.78;
    py = innerHeight * 0.5;
  }

  function positionCardStatic() {
    cx = px; cy = py;
    card.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
  }

  /* preload preview images + prime first stack */
  items.forEach((el) => { const im = new Image(); im.src = el.dataset.image; });
  if (items.length) setStack(items[0].dataset.image);
})();
