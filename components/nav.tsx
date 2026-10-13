"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { nav, profile } from "@/lib/content";
import { sound } from "./arcane/sound";
import Sigil from "./arcane/sigil";
import SpellButton from "./arcane/spell-button";

// Icon-only sound toggle: three bars that dance while the ambience plays.
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
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      className="group flex h-10 w-10 items-center justify-center gap-[3px] rounded-full transition hover:bg-white/5"
    >
      {[6, 12, 8, 4].map((h, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full transition-colors ${on ? "eq-bar bg-moon" : "bg-white/45 group-hover:bg-white"}`}
          style={on ? { animationDelay: `${i * 0.15}s` } : { height: h }}
        />
      ))}
    </button>
  );
}

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [moon, setMoon] = useState<{ x: number; w: number } | null>(null);

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

  // Slide the moon under the active link.
  useLayoutEffect(() => {
    const el = linkRefs.current[active];
    setMoon(el ? { x: el.offsetLeft + el.offsetWidth / 2, w: el.offsetWidth } : null);
  }, [active]);

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
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-5">
        <nav aria-label="Main" className="mx-auto flex max-w-[84rem] items-center justify-between gap-4">
          <a href="#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Sigil id="nav-sigil" className="h-9 w-9 animate-spin-slow text-moon transition duration-500 group-hover:text-white" />
            <span className="font-display text-[15px] font-semibold tracking-[0.24em] text-white">RYTHME</span>
          </a>

          <div
            className={`relative hidden items-center rounded-full border px-2 py-1.5 transition-colors duration-500 lg:flex ${
              scrolled ? "border-white/10 bg-ink/90" : "border-white/[0.07] bg-ink/55"
            }`}
          >
            <ul className="relative flex items-center">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    ref={(el) => {
                      linkRefs.current[item.href] = el;
                    }}
                    href={item.href}
                    aria-current={active === item.href ? "true" : undefined}
                    className={`block px-4 py-1.5 text-[13px] tracking-wide transition-colors duration-300 ${
                      active === item.href ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* the gliding moon */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-[3px] h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-moon shadow-[0_0_12px_3px_rgba(143,211,255,0.7)] transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              style={{ left: moon ? moon.x + 8 : 0, opacity: moon ? 1 : 0 }}
            />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <SoundToggle />
            <SpellButton href={profile.resume} className="hidden !px-5 !py-2.5 md:inline-flex" icon="✦">
              Resume
            </SpellButton>
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
              aria-expanded={open}
              aria-controls="grimoire-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`h-px w-5 bg-white transition duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-white transition duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu for smaller screens */}
      <div
        id="grimoire-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        inert={!open}
      >
        <Sigil
          id="menu-sigil"
          className={`pointer-events-none absolute -right-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 text-moon/[0.08] transition-transform duration-[1.5s] ${
            open ? "rotate-90" : ""
          }`}
        />
        <ol className="relative space-y-2">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className="transition-all duration-500"
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(16px)" }}
            >
              <a href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-4 py-2">
                <span aria-hidden className={`text-sm ${active === item.href ? "text-moon" : "text-white/20"}`}>
                  ☾
                </span>
                <span className={`font-display text-4xl font-semibold tracking-[0.08em] ${active === item.href ? "text-moon" : "text-white"}`}>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="relative mt-12">
          <SpellButton href={profile.resume} icon="✦">
            Resume
          </SpellButton>
        </div>
        <ul className="relative mt-10 flex gap-6 text-sm text-white/55">
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
