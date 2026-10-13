"use client";

import { useEffect, useState } from "react";
import { FileText, Volume2, VolumeX } from "lucide-react";
import { nav, profile } from "@/lib/content";
import { sound } from "./arcane/sound";
import Sigil from "./arcane/sigil";

// Fantasy names sit under the plain labels: the plain one is what you scan for.
const LORE: Record<string, string> = {
  "#work": "Spells",
  "#builds": "Artifacts",
  "#community": "The guild",
  "#experience": "Lore",
  "#contact": "Summon",
};
const NUMERALS = ["I", "II", "III", "IV", "V"];

function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const chime = () => sound?.chime();
    window.addEventListener("arcane:chapter", chime);
    return () => window.removeEventListener("arcane:chapter", chime);
  }, []);
  return (
    <button
      type="button"
      onClick={() => setOn(sound?.toggle() ?? false)}
      aria-pressed={on}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 transition hover:border-moon/60 hover:text-white"
    >
      {on ? <Volume2 className="h-3.5 w-3.5 text-moon" aria-hidden /> : <VolumeX className="h-3.5 w-3.5" aria-hidden />}
      Sound {on ? "on" : "off"}
    </button>
  );
}

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    for (const id of ["#top", ...nav.map((n) => n.href)]) {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    document.documentElement.classList.add("menu-open");
    return () => {
      window.removeEventListener("keydown", close);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open ? "border-b border-white/[0.07] bg-ink/70 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 md:px-10">
          <a href="#top" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <Sigil id="nav-sigil" className="h-8 w-8 animate-spin-slow text-moon transition group-hover:text-white" />
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold tracking-[0.22em] text-white">RYTHME</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-gold">Protocol · DevRel</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? "true" : undefined}
                  className={`group flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    active === item.href ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  <span className={`font-mono text-[10px] ${active === item.href ? "text-moon" : "text-gold/70"}`}>{NUMERALS[i]}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SoundToggle />
            </div>
            <a href={profile.resume} target="_blank" rel="noopener" className="btn-arcane hidden !px-4 !py-1.5 !text-xs md:inline-flex">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Resume
            </a>
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 lg:hidden"
              aria-expanded={open}
              aria-controls="grimoire-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`h-px w-4 bg-white transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-white transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen grimoire index for smaller screens */}
      <div
        id="grimoire-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-6 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        inert={!open}
      >
        <Sigil
          id="menu-sigil"
          className={`pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 text-moon/10 transition-transform duration-1000 ${
            open ? "rotate-90" : ""
          }`}
        />
        <ol className="relative space-y-1">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className="transition-all duration-500"
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(16px)" }}
            >
              <a href={item.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-4 py-2.5">
                <span className="w-8 font-mono text-xs text-gold">{NUMERALS[i]}</span>
                <span className={`font-display text-4xl font-semibold tracking-[0.06em] ${active === item.href ? "text-moon" : "text-white"}`}>
                  {item.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{LORE[item.href]}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="relative mt-10 flex flex-wrap items-center gap-3">
          <a href={profile.resume} target="_blank" rel="noopener" className="btn-arcane">
            <FileText className="h-4 w-4" aria-hidden /> Download resume
          </a>
          <SoundToggle />
        </div>
        <ul className="relative mt-8 flex gap-5 text-sm text-white/60">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener" className="hover:text-moon">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
