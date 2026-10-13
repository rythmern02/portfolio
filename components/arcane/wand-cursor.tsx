"use client";

import { useEffect, useRef } from "react";

// A wand tip that follows the pointer and sheds sparks. Mouse only: touch and
// reduced-motion visitors keep the normal cursor.
export default function WandCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    document.documentElement.classList.add("wand");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const ring = ringRef.current!;
    let W = 0;
    let H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    type Spark = { x: number; y: number; vx: number; vy: number; life: number };
    const sparks: Spark[] = [];
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const n = Math.min(4, Math.hypot(dx, dy) / 8);
      for (let i = 0; i < n; i++) {
        sparks.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 40 - dx * 0.6,
          vy: (Math.random() - 0.5) * 40 - dy * 0.6 + 10,
          life: 1,
        });
      }
      const t = e.target as Element | null;
      hovering = !!t?.closest?.("a, button, input, textarea, [role=button]");
    };
    const onDown = () => {
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        sparks.push({ x: mouse.x, y: mouse.y, vx: Math.cos(a) * 160, vy: Math.sin(a) * 160, life: 1 });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pos.x += (mouse.x - pos.x) * 0.25;
      pos.y += (mouse.y - pos.y) * 0.25;
      ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt * 1.6;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= 0.92;
        s.vy = s.vy * 0.92 + 30 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.life > 0.6 ? "#eaf7ff" : "#8fd3ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6 * s.life + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("wand");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[80] hidden h-full w-full [.wand_&]:block" />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[81] hidden h-7 w-7 rounded-full border border-moon/80 transition-[width,height] [.wand_&]:block"
      >
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(143,211,255,0.9)]" />
      </div>
    </>
  );
}
