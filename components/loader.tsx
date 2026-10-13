"use client";

import { useEffect, useRef, useState } from "react";

const MIN_MS = 900; // long enough to read the name, short enough not to annoy
const MAX_MS = 2600; // never hold the page hostage on a slow network

// Resolves once the wizard image is decoded and the fonts are ready, so the
// intro that follows never shows a blank frame.
function waitForAssets() {
  const img = new window.Image();
  img.src = "/wizard-portrait.png";
  const image = img.decode().catch(() => undefined);
  const fonts = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
  return Promise.all([image, fonts]);
}

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setProgress(100);
      setLeaving(true);
      setTimeout(onComplete, 350);
    };
    skipRef.current = finish;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const start = performance.now();
    let ready = false;
    let frame = 0;

    // Ease toward 90% while waiting, then run to 100% once assets are in.
    const tick = () => {
      const elapsed = performance.now() - start;
      if (ready && elapsed >= MIN_MS) return finish();
      if (elapsed >= MAX_MS) return finish();
      setProgress((p) => Math.min(90, p + (90 - p) * 0.06));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    waitForAssets().then(() => (ready = true));

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", skip);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", skip);
    };
  }, [onComplete]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      onClick={() => skipRef.current()}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(43,108,176,0.28),transparent_55%)]"
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Moon ring: an orbiting crescent around the monogram */}
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 112 112" className="absolute inset-0" aria-hidden>
            <circle cx="56" cy="56" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="#8fd3ff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
              transform="rotate(-90 56 56)"
              style={{ transition: "stroke-dashoffset 120ms linear" }}
            />
          </svg>
          <div className="absolute inset-0 animate-orbit" aria-hidden>
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-moon shadow-[0_0_12px_3px_rgba(143,211,255,0.6)]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold text-white">
            RN
          </div>
        </div>

        <p className="mt-8 font-display text-xl font-bold tracking-wide text-white">Rythme Nagrani</p>
        <p className="mt-2 px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60 sm:text-xs sm:tracking-[0.2em]">
          Summoning the blockchain wizard · {Math.round(progress)}%
        </p>
      </div>

      <p className="absolute bottom-8 font-mono text-[11px] text-white/40">Click or press Esc to skip</p>
    </div>
  );
}
