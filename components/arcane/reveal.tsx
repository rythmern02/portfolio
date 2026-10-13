"use client";

import { useEffect } from "react";
import { decipher } from "./decipher";

// Fades in anything marked data-reveal as it enters the viewport and deciphers
// the headings inside it. Content stays visible without JavaScript because the
// hidden state only applies under html.js.
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          if (!reduced) el.querySelectorAll<HTMLElement>("[data-decipher]").forEach((w) => decipher(w, 700));
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("main [data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
