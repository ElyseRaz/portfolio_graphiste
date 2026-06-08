"use client";

import { useEffect } from "react";

/* Reveal-on-scroll: toggles a `data-in` attribute on `.reveal`/`.tool`
   elements once they cross ~92% of the viewport height. Attribute-based
   (not className) so React re-renders never wipe the revealed state. */
export function useReveal() {
  useEffect(() => {
    let raf = 0;
    const check = () => {
      const trigger = window.innerHeight * 0.92;
      document
        .querySelectorAll<HTMLElement>(".reveal:not([data-in]), .tool:not([data-in])")
        .forEach((el) => {
          if (el.getBoundingClientRect().top < trigger) el.setAttribute("data-in", "");
        });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    requestAnimationFrame(check);
    const t1 = setTimeout(check, 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t1);
      cancelAnimationFrame(raf);
    };
  });
}
