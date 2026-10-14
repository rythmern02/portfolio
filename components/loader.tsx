"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Seal from "./arcane/seal";

const MIN_MS = 1900; // long enough for the seal to draw and the name to form
const MAX_MS = 3600; // never hold the page hostage on a slow network
const OPEN_MS = 1000; // the eye opening onto the page
const NAME = "Rythme Nagrani";

// Resolves once the portrait is decoded and the fonts are ready, so the film
// never starts on a blank frame.
function waitForAssets() {
  const img = new window.Image();
  img.src = "/wizard-portrait.png";
  const image = img.decode().catch(() => undefined);
  const fonts = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
  return Promise.all([image, fonts]);
}

// Sparks spiral in from the dark and vanish into the seal while it loads;
// when it is done they burst outward as the eye opens.
function runSparks(canvas: HTMLCanvasElement, center: () => [number, number], burst: () => boolean) {
  const ctx = canvas.getContext("2d")!;
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  let W = 0;
  let H = 0;
  const resize = () => {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  };
  resize();
  window.addEventListener("resize", resize);

  type P = { a: number; r: number; w: number; vr: number; size: number; seed: number; out: number };
  const parts: P[] = [];
  const spawn = (): P => ({
    a: Math.random() * Math.PI * 2,
    r: Math.max(W, H) * (0.45 + Math.random() * 0.3),
    w: 0.6 + Math.random() * 0.9,
    vr: 120 + Math.random() * 160,
    size: 1 + Math.random() * 2.4,
    seed: Math.random() * 100,
    out: 0,
  });
  for (let k = 0; k < 140; k++) {
    const p = spawn();
    p.r *= 0.2 + Math.random() * 0.8;
    parts.push(p);
  }

  let last = performance.now();
  let frame = 0;
  let t = 0;
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    const [cx, cy] = center();
    const bursting = burst();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < parts.length; k++) {
      const p = parts[k];
      if (bursting) {
        p.out += dt * 3;
        p.r += (600 + p.vr * 4) * dt * (1 + p.out);
      } else {
        p.a += p.w * dt * (140 / Math.max(40, p.r));
        p.r -= p.vr * dt;
        if (p.r < 34) parts[k] = spawn();
      }
      const x = cx + Math.cos(p.a) * p.r;
      const y = cy + Math.sin(p.a) * p.r;
      const near = Math.min(1, p.r / 260);
      const tw = 0.5 + 0.5 * Math.sin(t * 7 + p.seed);
      ctx.globalAlpha = (bursting ? Math.max(0, 1 - p.out * 0.6) : (1 - near) * 0.9 + 0.1) * tw;
      ctx.fillStyle = tw > 0.8 ? "#ffffff" : "#9cc8ff";
      ctx.beginPath();
      ctx.arc(x, y, p.size * (bursting ? 1.4 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
  };
}

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"summon" | "open" | "gone">("summon");
  const done = useRef(false);
  const skipRef = useRef<() => void>(() => {});
  const rootRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sealCenter = (): [number, number] => {
      const r = sealRef.current?.getBoundingClientRect();
      return r ? [r.left + r.width / 2, r.top + r.height / 2] : [window.innerWidth / 2, window.innerHeight * 0.42];
    };

    const finish = () => {
      if (done.current) return;
      done.current = true;
      setProgress(100);
      // The eye opens from the seal's centre.
      const [x, y] = sealCenter();
      rootRef.current?.style.setProperty("--hx", `${x}px`);
      rootRef.current?.style.setProperty("--hy", `${y}px`);
      setPhase("open");
      setTimeout(() => {
        setPhase("gone");
        onComplete();
      }, OPEN_MS);
    };
    skipRef.current = finish;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done.current = true;
      setPhase("gone");
      onComplete();
      return;
    }

    const stopSparks = canvasRef.current ? runSparks(canvasRef.current, sealCenter, () => done.current) : () => {};

    const start = performance.now();
    let ready = false;
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      if ((ready && elapsed >= MIN_MS) || elapsed >= MAX_MS) return finish();
      setProgress((p) => Math.min(94, p + (94 - p) * 0.04));
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
      stopSparks();
      window.removeEventListener("keydown", skip);
    };
  }, [onComplete]);

  if (phase === "gone") return null;
  const opening = phase === "open";

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      onClick={() => skipRef.current()}
      className={`loader fixed inset-0 z-[70] overflow-hidden ${opening ? "is-opening" : ""}`}
    >
      {/* Everything inside is masked by an opening iris once loading is done. */}
      <div className="loader-veil absolute inset-0 bg-ink">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(47,107,255,0.26),rgba(11,22,48,0.3)_38%,transparent_68%)]" />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <div
            ref={sealRef}
            className={`relative h-52 w-52 text-ice transition-[transform,opacity] duration-700 ease-out md:h-64 md:w-64 ${
              opening ? "scale-[1.5] opacity-0" : "scale-100"
            }`}
          >
            <div aria-hidden className="loader-core absolute inset-[16%] rounded-full" />
            <Seal layered draw className="seal-spin h-full w-full [&_.kamea-trace]:[filter:drop-shadow(0_0_6px_currentColor)]" />
          </div>

          <p className={`mt-10 font-display text-[2.6rem] font-bold leading-none tracking-[-0.05em] transition-opacity duration-500 md:text-[3.4rem] ${opening ? "opacity-0" : ""}`}>
            <span className="sr-only">{NAME}</span>
            <span aria-hidden>
              {Array.from(NAME).map((c, i) =>
                c === " " ? (
                  <span key={i}> </span>
                ) : (
                  <span key={i} className="loader-l" style={{ "--i": i } as React.CSSProperties}>
                    {c}
                  </span>
                ),
              )}
            </span>
          </p>

          <div className={`mt-6 flex flex-col items-center gap-3 transition-opacity duration-500 ${opening ? "opacity-0" : ""}`}>
            <span className="relative block h-px w-44 overflow-hidden bg-white/10">
              <span
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-ice to-azure shadow-[0_0_8px_rgba(207,230,255,0.9)] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="font-mono text-[11px] italic tracking-[0.08em] text-ice/70">
              {progress >= 100 ? "lumos maxima" : "lumos…"}
            </span>
          </div>
        </div>

        <p className="absolute inset-x-0 bottom-8 text-center font-mono text-[11px] text-white/30">click or press esc to skip</p>
      </div>

      {/* The rim of the opening eye: a ring of light racing outward. */}
      <div aria-hidden className="loader-rim pointer-events-none absolute" />
    </div>
  );
}
