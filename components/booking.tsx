"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { X } from "lucide-react";
import { booking } from "@/lib/content";
import SpellButton from "./arcane/spell-button";

// Book-a-call: every trigger is a real link to Calendly, so it works without
// JavaScript. With JavaScript it opens the scheduler in a modal instead; the
// iframe is only created on the first open.

const OPEN = "booking:open";
export const openBooking = () => window.dispatchEvent(new Event(OPEN));

export function BookButton({
  children = "Book a call",
  variant = "cast",
  className,
}: {
  children?: string;
  variant?: "cast" | "trace";
  className?: string;
}) {
  return (
    <SpellButton
      href={booking.url}
      variant={variant}
      className={className}
      icon="✦"
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let people open a new tab
        e.preventDefault();
        openBooking();
      }}
    >
      {children}
    </SpellButton>
  );
}

function embedUrl() {
  const q = new URLSearchParams({
    embed_domain: window.location.host,
    embed_type: "Inline",
    hide_gdpr_banner: "1",
    hide_landing_page_details: "1",
    background_color: "09101f",
    text_color: "f2f4f8",
    primary_color: "2f6bff",
  });
  return `${booking.url}?${q}`;
}

export default function BookingModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const open = () => {
      const d = dialog.current;
      if (!d || d.open) return;
      setSrc((s) => s ?? embedUrl());
      d.showModal();
      document.documentElement.classList.add("booking-open");
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if (e.data?.event === "calendly.event_scheduled") setBooked(true);
    };
    window.addEventListener(OPEN, open);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener(OPEN, open);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      className="booking"
      aria-labelledby="booking-title"
      onClose={() => {
        document.documentElement.classList.remove("booking-open");
        window.dispatchEvent(new Event("booking:close"));
      }}
      // A click on the dim backdrop (the dialog itself, not the panel) closes it.
      onClick={(e) => e.target === dialog.current && close()}
    >
      <div className="booking-panel relative flex h-[min(760px,92svh)] w-[min(1040px,94vw)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#09101f] shadow-[0_0_90px_-12px_rgba(47,107,255,0.55)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 md:px-7">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-7 w-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#9cc8ff_35%,#2f6bff_70%,#0b1630)]" />
            <div className="leading-tight">
              <p id="booking-title" className="font-display text-lg font-bold tracking-[-0.02em] text-white">
                {booked ? "See you soon." : "Book a call with Rythme"}
              </p>
              <p className="font-mono text-[11px] text-white/50">
                {booked ? "The invite is on its way to your inbox." : `${booking.length} · pick any slot that works for you`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a href={booking.url} target="_blank" rel="noopener" className="hidden px-3 py-2 text-xs text-white/50 hover:text-white sm:block">
              Open in Calendly ↗
            </a>
            <button
              type="button"
              onClick={close}
              aria-label="Close booking"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" aria-hidden>
              <span className="h-12 w-12 animate-spin rounded-full border border-white/10 border-t-ice" />
              <p className="font-mono text-[11px] text-white/45">loading the calendar…</p>
            </div>
          )}
          {src && (
            <iframe
              src={src}
              title="Schedule a 30 minute call with Rythme on Calendly"
              onLoad={() => setLoaded(true)}
              className={`h-full w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
