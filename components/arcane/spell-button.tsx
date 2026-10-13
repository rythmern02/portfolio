"use client";

import { useRef } from "react";
import type React from "react";
import { decipher } from "./decipher";
import { CALENDLY_URL, openBooking } from "@/lib/booking";

// The site's buttons. "cast" is a dark glass pill with a comet of moonlight
// orbiting its border; "trace" is a quiet text link whose underline draws
// itself in. On hover the label briefly scrambles into runes and resolves.
// href="book" opens the Calendly modal (and links to Calendly without JS).

type Props = {
  href: string;
  children: string;
  variant?: "cast" | "trace";
  icon?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function SpellButton({ href, children, variant = "cast", icon, className = "", onClick }: Props) {
  const label = useRef<HTMLSpanElement>(null);
  const book = href === "book";
  if (book) href = CALENDLY_URL;
  const external = href.startsWith("http") || href.endsWith(".pdf") || href.startsWith("mailto:");
  const cast = () => {
    if (label.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) decipher(label.current, 420);
  };

  return (
    <a
      href={href}
      onMouseEnter={cast}
      onFocus={cast}
      onClick={(e) => {
        if (book) {
          e.preventDefault();
          openBooking();
        }
        onClick?.(e);
      }}
      {...(external && !href.startsWith("mailto:") ? { target: "_blank", rel: "noopener" } : {})}
      className={`${variant === "cast" ? "spell" : "spell-trace"} ${className}`}
    >
      {variant === "cast" && (
        <span aria-hidden className="spell-glyph">
          {icon ?? "☾"}
        </span>
      )}
      <span className="sr-only">{children}</span>
      <span ref={label} aria-hidden data-decipher={children}>
        {children}
      </span>
      {variant === "trace" && (
        <>
          <span aria-hidden className="spell-arrow">
            ⟶
          </span>
          <svg aria-hidden className="spell-ink" viewBox="0 0 200 8" preserveAspectRatio="none">
            <path d="M1 5 C 30 1, 50 8, 80 4 S 140 1, 170 5 S 195 4, 199 3" pathLength={1} />
          </svg>
        </>
      )}
    </a>
  );
}
