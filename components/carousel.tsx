"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// A horizontal carousel built on native scroll-snap: swipe on touch, trackpad
// sideways, drag with the mouse, arrows, or the keyboard. Each slide gets
// --d, its distance from the resting position (0 = in focus, ±1 = one slide
// away), so cards can dim, recede and parallax in CSS without React renders.

export default function Carousel({
  children,
  label,
  slideClassName = "",
}: {
  children: React.ReactNode;
  label: string;
  slideClassName?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const count = Children.count(children);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    if (!slides.length) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const anchor = el.scrollLeft + pad;
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth;
    let nearest = 0;
    let best = Infinity;
    slides.forEach((s, i) => {
      const d = (s.offsetLeft - anchor) / step;
      s.style.setProperty("--d", Math.max(-2, Math.min(2, d)).toFixed(3));
      if (Math.abs(d) < best) {
        best = Math.abs(d);
        nearest = i;
      }
    });
    setIndex(nearest);
    const max = el.scrollWidth - el.clientWidth;
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.08, el.scrollLeft / max) : 1})`;
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Mouse drag. Touch and trackpads already scroll natively.
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        el.classList.add("is-dragging");
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) {
        el.classList.remove("is-dragging");
        // Let snap pick the nearest slide again.
        const slides = Array.from(el.children) as HTMLElement[];
        const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
        const target = slides.reduce((a, s) => (Math.abs(s.offsetLeft - pad - el.scrollLeft) < Math.abs(a.offsetLeft - pad - el.scrollLeft) ? s : a));
        el.scrollTo({ left: target.offsetLeft - pad, behavior: "smooth" });
      }
    };
    // A drag should not also count as a click on the card's link.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [measure]);

  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const next = slides[Math.max(0, Math.min(slides.length - 1, index + dir))];
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    el.scrollTo({ left: next.offsetLeft - pad, behavior: "smooth" });
  };

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
        className="carousel-track flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 md:gap-7"
      >
        {Children.map(children, (child, i) => (
          <div
            className={`carousel-slide shrink-0 snap-start ${slideClassName}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {child}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-content items-center gap-5 px-5 md:px-6">
        <span className="font-mono text-xs tabular-nums text-white/50">
          <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
        </span>
        <span className="relative h-px flex-1 overflow-hidden bg-white/10">
          <span ref={bar} className="absolute inset-0 origin-left bg-gradient-to-r from-ice to-azure" style={{ transform: "scaleX(0.08)" }} />
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous"
            className="carousel-btn"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === count - 1}
            aria-label="Next"
            className="carousel-btn"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
