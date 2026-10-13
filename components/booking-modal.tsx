"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BOOK_EVENT, CALENDLY_EMBED, CALENDLY_URL } from "@/lib/booking";
import Aura from "./arcane/aura";

// Calendly in a modal. The iframe is only created the first time someone opens
// it, so Calendly costs nothing for visitors who never book.
export default function BookingModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onBook = () => {
      returnTo.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setOpen(true);
    };
    window.addEventListener(BOOK_EVENT, onBook);
    return () => window.removeEventListener(BOOK_EVENT, onBook);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.classList.remove("modal-open");
      window.dispatchEvent(new CustomEvent("arcane:lock", { detail: false }));
      returnTo.current?.focus?.();
      return;
    }
    root.classList.add("modal-open");
    window.dispatchEvent(new CustomEvent("arcane:lock", { detail: true }));
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      inert={!open}
      className={`fixed inset-0 z-[85] flex items-end justify-center p-0 transition-opacity duration-500 sm:items-center sm:p-6 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <button type="button" aria-label="Close" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/80" />

      <div
        className={`relative flex h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-panel shadow-[0_40px_120px_-20px_rgba(43,108,176,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] sm:h-[min(88vh,760px)] sm:rounded-[28px] ${
          open ? "translate-y-0 scale-100" : "translate-y-8 scale-[0.98]"
        }`}
      >
        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 opacity-70" aria-hidden>
          {mounted && <Aura rim={0} className="h-full w-full" />}
        </div>

        <header className="relative flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-moon">30 minutes · pick any slot</p>
            <h2 id="booking-title" className="mt-1 font-display text-3xl text-white sm:text-4xl">
              Book a call with <span className="aura-text italic">Rythme</span>
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close booking"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white/40 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="relative flex-1 bg-panel" data-lenis-prevent>
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-white/60">
              <span className="h-10 w-10 animate-spin rounded-full border border-white/10 border-t-moon" aria-hidden />
              Opening the calendar…
            </div>
          )}
          {mounted && (
            <iframe
              title="Book a 30-minute call with Rythme Nagrani on Calendly"
              src={CALENDLY_EMBED}
              onLoad={() => setLoaded(true)}
              className={`h-full w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              allow="payment"
            />
          )}
        </div>

        <p className="relative border-t border-white/10 px-6 py-3 text-xs text-white/50 sm:px-8">
          Calendar not loading?{" "}
          <a href={CALENDLY_URL} target="_blank" rel="noopener" className="text-link">
            Open it on Calendly
          </a>
        </p>
      </div>
    </div>
  );
}
