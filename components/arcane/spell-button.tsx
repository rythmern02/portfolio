"use client";

import { useRef } from "react";
import type React from "react";

// The site's buttons. "cast" is a dark pill with a turning chrome rim, a pool
// of light that follows the cursor inside it, and a slight magnetic pull;
// "trace" is a quiet text link whose underline draws itself in.

type Props = {
  href: string;
  children: string;
  variant?: "cast" | "trace";
  icon?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function SpellButton({ href, children, variant = "cast", icon, className = "", onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const external = href.startsWith("http") || href.endsWith(".pdf");

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (variant === "cast") {
      el.style.transform = `translate3d(${((x - r.width / 2) * 0.18).toFixed(1)}px, ${((y - r.height / 2) * 0.28).toFixed(1)}px, 0)`;
    }
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`${variant === "cast" ? "spell" : "spell-trace"} ${className}`}
    >
      <span>{children}</span>
      {variant === "cast" && (
        <span aria-hidden className="spell-glyph">
          {icon ?? "↗"}
        </span>
      )}
      {variant === "trace" && (
        <>
          <span aria-hidden className="spell-arrow">
            ↗
          </span>
          <span aria-hidden className="spell-ink" />
        </>
      )}
    </a>
  );
}
