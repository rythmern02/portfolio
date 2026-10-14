"use client";

import { useEffect, useRef, useState } from "react";
import Seal from "./arcane/seal";

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
      className={`fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-ink transition-opacity duration-700 ${
        phase === "flare" ? "opacity-0 delay-200" : "opacity-100"
      }`}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(47,107,255,0.22),rgba(11,22,48,0.25)_40%,transparent_70%)]" />

      <div className="relative flex flex-col items-center text-center">
        {/* The bezel draws itself, then the sigil traces through the square. */}
        <div
          className={`relative h-52 w-52 text-ice transition-[transform,opacity] duration-700 ease-out md:h-64 md:w-64 ${
            phase === "flare" ? "scale-[1.35] opacity-0" : "scale-100"
          }`}
        >
          <div aria-hidden className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.35),transparent_70%)]" />
          <Seal layered draw className="seal-spin h-full w-full [&_.kamea-trace]:[filter:drop-shadow(0_0_5px_currentColor)]" />
        </div>

        <p className="loader-name mt-10 font-display text-[2.6rem] font-bold leading-none tracking-[-0.05em] md:text-5xl">Rythme Nagrani</p>

        <div className="mt-6 flex items-center gap-3 font-mono text-[11px] text-white/45">
          <span className="relative block h-px w-40 overflow-hidden bg-white/10">
            <span
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-ice to-azure transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </span>
          <span className="w-8 text-right tabular-nums">{Math.round(progress)}</span>
        </div>
      </div>

      <p className="absolute bottom-8 font-mono text-[11px] text-white/30">click or press esc to skip</p>
    </div>
  );
}
