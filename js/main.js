/* page-level behavior: load-in masks, scroll reveals, smooth anchors */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* hero load-in */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  });

  /* scroll reveals */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));

  /* smooth in-page anchors (no scrollIntoView) */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.closest(".overlay")) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", a.getAttribute("href"));
  });
})();
