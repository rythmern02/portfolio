"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";

const STOPS = [{ label: "Intro", href: "#top" }, ...nav];

// Page-wide progress ("mana") on the right edge, doubling as a section index.
export default function ManaRail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<number[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setMarks(
        STOPS.map((s) => {
          const el = document.querySelector<HTMLElement>(s.href);
          return el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / Math.max(1, max))) : 0;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = window.scrollY / Math.max(1, max);
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
        setMarks((m) => {
          let idx = 0;
          m.forEach((v, i) => {
            if (p + 0.002 >= v) idx = i;
          });
          setActive(idx);
          return m;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav aria-label="Page progress" className="fixed right-6 top-1/2 z-40 hidden h-[52vh] -translate-y-1/2 lg:block">
      <div className="relative h-full w-px bg-white/10">
        <div ref={fillRef} className="h-full w-full origin-top bg-moon shadow-[0_0_10px_rgba(143,211,255,0.8)]" style={{ transform: "scaleY(0)" }} />
        {STOPS.map((s, i) => (
          <a
            key={s.href}
            href={s.href}
            style={{ top: `${(marks[i] ?? 0) * 100}%` }}
            className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2"
            aria-current={active === i ? "true" : undefined}
          >
            <span
              className={`block h-2 w-2 rotate-45 border transition ${
                active === i ? "border-moon bg-moon shadow-[0_0_10px_rgba(143,211,255,0.9)]" : "border-white/40 bg-ink group-hover:border-white"
              }`}
            />
            <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/0 transition group-hover:text-white/80 group-focus-visible:text-white/80">
              {s.label}
            </span>
          </a>
        ))}
        <span className="absolute left-1/2 top-full mt-4 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-white/40 [writing-mode:vertical-rl]">
          MANA
        </span>
      </div>
    </nav>
  );
}
