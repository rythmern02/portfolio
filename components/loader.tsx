"use client";

import { useEffect, useRef, useState } from "react";
import Sigil from "./arcane/sigil";

const MIN_MS = 1300; // long enough for the circle to finish drawing
const MAX_MS = 3200; // never hold the page hostage on a slow network

// Resolves once the portrait is decoded and the fonts are ready, so the film
// never starts on a blank frame.
function waitForAssets() {
  const img = new window.Image();
  img.src = "/wizard-portrait.png";
  const image = img.decode().catch(() => undefined);
  const fonts = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
  return Promise.all([image, fonts]);
}

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"summon" | "flare" | "gone">("summon");
  const done = useRef(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setProgress(100);
      setPhase("flare");
      setTimeout(() => {
        setPhase("gone");
        onComplete();
      }, 650);
    };
    skipRef.current = finish;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done.current = true;
      setPhase("gone");
      onComplete();
      return;
    }

    const start = performance.now();
    let ready = false;
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      if ((ready && elapsed >= MIN_MS) || elapsed >= MAX_MS) return finish();
      setProgress((p) => Math.min(92, p + (92 - p) * 0.05));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // rAF pauses in background tabs; the hard cap must not depend on it.
    const cap = setTimeout(finish, MAX_MS);
    waitForAssets().then(() => (ready = true));

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(cap);
      window.removeEventListener("keydown", skip);
    };
  }, [onComplete]);

  if (phase === "gone") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      onClick={() => skipRef.current()}
      className={`fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-ink transition-opacity duration-500 ${
        phase === "flare" ? "opacity-0 delay-150" : "opacity-100"
      }`}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(43,108,176,0.3),transparent_55%)]" />

      <div className="relative flex flex-col items-center text-center">
        <div
          className={`relative h-56 w-56 text-ice transition-transform duration-700 ease-in md:h-72 md:w-72 ${
            phase === "flare" ? "scale-[6]" : "scale-100"
          }`}
        >
          <Sigil id="loader-sigil" draw className="h-full w-full animate-spin-slow drop-shadow-[0_0_18px_rgba(47,107,255,0.7)]" />
        </div>

        <p className="mt-10 font-display text-4xl font-bold tracking-[-0.045em] text-white">Rythme Nagrani</p>
        <p className="mt-3 px-6 font-mono text-[11px] tracking-[0.04em] text-white/55">
          tracing the table of jupiter · {Math.round(progress)}%
        </p>
      </div>

      <p className="absolute bottom-8 font-mono text-[11px] text-white/40">Click or press Esc to skip</p>
    </div>
  );
}
