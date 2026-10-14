"use client";

import { useEffect } from "react";

// Fades in anything marked data-reveal as it enters the viewport and lets the
// headings inside it rise; also feeds the cursor position to card spotlights. Content stays visible without JavaScript because
// the hidden state only applies under html.js.
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("main [data-reveal]").forEach((el) => io.observe(el));

    // Card spotlight: tell the card under the mouse where the cursor is.
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = (e.target as Element | null)?.closest?.<HTMLElement>(".card");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
        card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
