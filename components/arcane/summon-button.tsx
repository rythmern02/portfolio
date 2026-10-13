"use client";

import { useEffect, useState } from "react";

// Floating "hire me" call to action. On phones it waits until the film is over
// so it never sits on top of the chapter buttons.
export default function SummonButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const film = document.getElementById("top");
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const pastFilm = film ? film.getBoundingClientRect().bottom < window.innerHeight * 0.5 : true;
      const atContact = (document.getElementById("contact")?.getBoundingClientRect().top ?? 9999) < window.innerHeight * 0.7;
      setShow((desktop || pastFilm) && !atContact);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <a
      href="#contact"
      className={`summon fixed bottom-5 right-5 z-40 hidden items-center gap-3 rounded-full border border-moon/40 bg-ink/80 py-2 pl-2 pr-5 backdrop-blur-md transition-all duration-500 hover:border-moon sm:flex md:bottom-8 md:right-14 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      tabIndex={show ? 0 : -1}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-moon/15">
        <span className="absolute inset-0 animate-ping rounded-full bg-moon/20" />
        <span className="h-2 w-2 rounded-full bg-moon shadow-[0_0_10px_3px_rgba(143,211,255,0.8)]" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold tracking-[0.18em] text-white">SUMMON RYTHME</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Roles · collabs · talks</span>
      </span>
    </a>
  );
}
