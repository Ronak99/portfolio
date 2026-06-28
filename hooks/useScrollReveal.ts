"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add("is-loaded"));
    });

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

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest('a[href^="#"]');
      if (!a || a.closest(".overlay")) return;
      const href = a.getAttribute("href");
      if (!href) return;
      const section = document.querySelector(href);
      if (!section) return;
      e.preventDefault();
      const top =
        section.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    };

    document.addEventListener("click", handleClick);

    return () => {
      io.disconnect();
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
