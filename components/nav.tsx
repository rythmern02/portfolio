"use client";

import { useEffect, useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { nav, profile } from "@/lib/content";

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // A section counts as active while it crosses the upper third of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    for (const item of nav) {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    }
    const top = document.getElementById("top");
    if (top) observer.observe(top);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open ? "border-b border-white/10 bg-ink/95 backdrop-blur-md" : scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-content items-center justify-between px-5 md:px-6">
        <a href="#top" className="font-display text-base font-bold text-white" onClick={() => setOpen(false)}>
          Rythme<span className="text-moon">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active === item.href ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a href={profile.resume} target="_blank" rel="noopener" className="btn-primary !px-4 !py-1.5">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="-mr-2 rounded-full p-2 text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-white/5 py-3.5 text-lg ${
                    active === item.href ? "text-moon" : "text-white"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={profile.resume} target="_blank" rel="noopener" className="btn-primary mt-5 w-full justify-center">
            <FileText className="h-4 w-4" aria-hidden />
            Download resume
          </a>
        </div>
      )}
    </header>
  );
}
