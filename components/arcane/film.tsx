"use client";

import { useEffect, useRef } from "react";
import { film } from "@/lib/content";
import Sigil from "./sigil";
import SpellButton from "./spell-button";
import Aura from "./aura";
import { decipher } from "./decipher";

// ---------------------------------------------------------------------------
// The scroll film. One portrait, everything else is procedural:
//   camera  push-in from full figure to the eyes, then a dive into one eye
//   runes   the robe's glowing glyphs are masked out of the PNG at runtime and
//           ignite from hem to hat as you scroll
//   eyes    moon sigils light up in both irises
//   fire    blue "moonfire" particles along the bottom edge
//   motes   faint points of light drifting upward and twinkling
// Everything is drawn to one canvas; chapter text is plain DOM on top.
// ---------------------------------------------------------------------------

const SRC = "/wizard-portrait.png";
const IMG = 500; // source image is 500 x 500
const EYES: [number, number][] = [
  [153, 132],
  [205, 124],
];

// Camera keyframes: p = scroll progress, x/y = focus point in image pixels,
// z = zoom relative to the fitted size.
const CAMERA = [
  { p: 0, x: 250, y: 250, z: 1 },
  { p: 0.16, x: 250, y: 250, z: 1 },
  { p: 0.36, x: 240, y: 225, z: 1.3 },
  { p: 0.55, x: 205, y: 185, z: 1.85 },
  { p: 0.68, x: 180, y: 135, z: 2.6 },
  { p: 0.82, x: EYES[0][0], y: EYES[0][1], z: 9 },
  { p: 1, x: EYES[0][0], y: EYES[0][1], z: 9 },
];


const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const range = (p: number, a: number, b: number) => smooth(clamp((p - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function camera(p: number) {
  let i = 0;
  while (i < CAMERA.length - 2 && p > CAMERA[i + 1].p) i++;
  const a = CAMERA[i];
  const b = CAMERA[i + 1];
  const t = smooth(clamp((p - a.p) / (b.p - a.p)));
  // Zoom interpolates in log space so the push-in feels even.
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), t)) };
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

// Pull the bright cyan pixels out of the portrait: those are the runes, the
// moons on the hat and the robe trim.
function buildLayers(img: HTMLImageElement) {
  const base = makeCanvas(IMG, IMG);
  const bctx = base.getContext("2d")!;
  bctx.drawImage(img, 0, 0, IMG, IMG);
  const data = bctx.getImageData(0, 0, IMG, IMG);
  const out = bctx.createImageData(IMG, IMG);
  for (let i = 0; i < data.data.length; i += 4) {
    const r = data.data[i];
    const g = data.data[i + 1];
    const b = data.data[i + 2];
    const a = data.data[i + 3];
    if (a > 200 && b > 160 && g > 140 && b - r > 50) {
      out.data[i] = 150;
      out.data[i + 1] = 225;
      out.data[i + 2] = 255;
      out.data[i + 3] = 255;
    }
  }
  const runes = makeCanvas(IMG, IMG);
  runes.getContext("2d")!.putImageData(out, 0, 0);

  // Cheap blur that works in every browser: downscale, then upscale.
  const small = makeCanvas(IMG / 5, IMG / 5);
  const sctx = small.getContext("2d")!;
  sctx.imageSmoothingQuality = "high";
  sctx.drawImage(runes, 0, 0, IMG / 5, IMG / 5);
  const bloom = makeCanvas(IMG, IMG);
  const blctx = bloom.getContext("2d")!;
  blctx.imageSmoothingQuality = "high";
  blctx.drawImage(small, 0, 0, IMG, IMG);
  blctx.globalCompositeOperation = "lighter";
  blctx.drawImage(small, 0, 0, IMG, IMG);

  // A darkened copy, cross-faded on top while the wizard is still "asleep".
  const dark = makeCanvas(IMG, IMG);
  const dctx = dark.getContext("2d")!;
  dctx.drawImage(img, 0, 0, IMG, IMG);
  dctx.globalCompositeOperation = "source-atop";
  dctx.fillStyle = "rgba(2,4,12,0.72)";
  dctx.fillRect(0, 0, IMG, IMG);

  return { runes, bloom, dark };
}

function flameSprite() {
  const s = 64;
  const c = makeCanvas(s, s);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(235,248,255,0.9)");
  grad.addColorStop(0.25, "rgba(143,211,255,0.55)");
  grad.addColorStop(0.6, "rgba(43,108,176,0.18)");
  grad.addColorStop(1, "rgba(10,20,60,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

function haloSprite() {
  const s = 256;
  const c = makeCanvas(s, s);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(43,108,176,1)");
  grad.addColorStop(1, "rgba(43,108,176,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

function moteSprite() {
  const s = 32;
  const c = makeCanvas(s, s);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(240,250,255,1)");
  grad.addColorStop(0.2, "rgba(198,232,255,0.8)");
  grad.addColorStop(1, "rgba(143,211,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

type Flame = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number };
type Mote = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  depth: number;
  seed: number;
};

// The big circles are laid out once at this size and only ever moved with
// GPU transforms, so they never re-render while animating.
const SIGIL_BASE = 1000;

// Write a style only when its value actually changed.
const written = new WeakMap<HTMLElement, Record<string, string>>();
function setStyle(el: HTMLElement, prop: string, value: string) {
  const cache = written.get(el) ?? {};
  if (cache[prop] === value) return;
  cache[prop] = value;
  written.set(el, cache);
  (el.style as unknown as Record<string, string>)[prop] = value;
}
function setVar(el: HTMLElement, name: string, value: string) {
  const cache = written.get(el) ?? {};
  if (cache[name] === value) return;
  cache[name] = value;
  written.set(el, cache);
  el.style.setProperty(name, value);
}

export default function Film() {
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgSigilRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const portalLive = useRef(false);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    let W = 0;
    let H = 0;
    let trackTop = 0;
    let trackH = 1;
    let dpr = 1;
    let layers: ReturnType<typeof buildLayers> | null = null;
    const img = new window.Image();
    img.src = SRC;
    img.onload = () => {
      layers = buildLayers(img);
    };
    if (img.complete && img.naturalWidth) layers = buildLayers(img);
    const sprite = flameSprite();
    const halo = haloSprite();

    const flames: Flame[] = [];
    const flameCount = mobile ? 60 : 110;
    const motes: Mote[] = [];
    const mote = moteSprite();

    const resize = () => {
      // The portrait is 500px, so rendering past 1.5x buys no detail, only cost.
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      trackTop = track.offsetTop;
      trackH = track.offsetHeight;
      motes.length = 0;
      const n = mobile ? 26 : 48;
      for (let i = 0; i < n; i++) {
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: 4 + Math.random() * Math.random() * 14,
          alpha: 0.15 + Math.random() * 0.45,
          speed: 4 + Math.random() * 12,
          depth: 0.3 + Math.random() * 0.9,
          seed: Math.random() * 100,
        });
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ro.observe(document.body);

    const spawnFlame = (): Flame => ({
      x: Math.random() * W,
      y: H + 20,
      vx: (Math.random() - 0.5) * 12,
      vy: -(40 + Math.random() * 90),
      life: 0,
      max: 1.2 + Math.random() * 1.6,
      size: (mobile ? 40 : 60) + Math.random() * 90,
      seed: Math.random() * 100,
    });

    let progress = 0;
    let lastChapter = -1;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    let time = 0;

    // Cached geometry, so a frame never forces layout.
    const readProgress = () => {
      progress = clamp((window.scrollY - trackTop) / Math.max(1, trackH - H));
    };

    const draw = (dt: number) => {
      const p = progress;
      const t = reduced ? 0 : time;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ---- camera ---------------------------------------------------------
      const fit = Math.min(H * (mobile ? 0.78 : 0.88), W * (mobile ? 1.35 : 1.2)) / IMG;
      const cam = camera(p);
      const s = fit * cam.z;
      const ax = W / 2;
      const ay = H * (mobile ? 0.4 : 0.47);
      const ox = ax - cam.x * s;
      const oy = ay - cam.y * s;
      const toScreen = (x: number, y: number) => [ox + x * s, oy + y * s] as const;

      const wake = range(p, 0.1, 0.3); // wizard brightens
      const ignite = range(p, 0.14, 0.44); // runes sweep upward
      const eyes = range(p, 0.6, 0.7);
      const fade = 1 - range(p, 0.72, 0.79); // portrait gives way to the portal
      const breathe = reduced ? 0 : Math.sin(t * 0.9) * 0.006;

      // ---- halo -----------------------------------------------------------
      const [hx, hy] = toScreen(250, 230);
      ctx.globalAlpha = 0.25 + 0.25 * wake;
      ctx.drawImage(halo, hx - 300 * s, hy - 300 * s, 600 * s, 600 * s);
      ctx.globalAlpha = 1;

      // ---- portrait -------------------------------------------------------
      if (layers && fade > 0.001) {
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(ax, ay);
        ctx.scale(1 + breathe, 1 + breathe);
        ctx.translate(-ax, -ay);
        ctx.drawImage(img, ox, oy, IMG * s, IMG * s);
        ctx.globalAlpha = fade * (1 - wake);
        ctx.drawImage(layers.dark, ox, oy, IMG * s, IMG * s);

        // Runes: fully lit below the sweep line, a hot band at the line.
        const sweepY = IMG + 40 - ignite * (IMG + 120);
        const pulse = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 2.2);
        ctx.globalCompositeOperation = "lighter";
        ctx.save();
        ctx.beginPath();
        ctx.rect(ox, oy + sweepY * s, IMG * s, (IMG - sweepY + 40) * s);
        ctx.clip();
        ctx.globalAlpha = fade * 0.55 * pulse;
        ctx.drawImage(layers.bloom, ox, oy, IMG * s, IMG * s);
        ctx.globalAlpha = fade * 0.45 * pulse;
        ctx.drawImage(layers.runes, ox, oy, IMG * s, IMG * s);
        ctx.restore();
        if (ignite > 0 && ignite < 1) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(ox, oy + (sweepY - 6) * s, IMG * s, 18 * s);
          ctx.clip();
          ctx.globalAlpha = fade;
          ctx.drawImage(layers.bloom, ox, oy, IMG * s, IMG * s);
          ctx.drawImage(layers.runes, ox, oy, IMG * s, IMG * s);
          ctx.restore();
        }

        // Eyes: glow, a rotating moon sigil in each iris, and a lens streak.
        if (eyes > 0) {
          for (const [i, [ex, ey]] of EYES.entries()) {
            const [x, y] = toScreen(ex, ey);
            const r = 4.4 * s;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
            g.addColorStop(0, `rgba(200,240,255,${0.95 * eyes})`);
            g.addColorStop(0.25, `rgba(143,211,255,${0.6 * eyes})`);
            g.addColorStop(1, "rgba(43,108,176,0)");
            ctx.globalAlpha = fade;
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r * 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(t * (i ? -1.2 : 1.2));
            ctx.strokeStyle = `rgba(225,246,255,${0.8 * eyes})`;
            ctx.fillStyle = `rgba(225,246,255,${0.85 * eyes})`;
            ctx.lineWidth = Math.max(0.5, r * 0.05);
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
            ctx.stroke();
            for (let k = 0; k < 3; k++) {
              const a = (k / 3) * Math.PI * 2;
              ctx.beginPath();
              ctx.arc(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9, r * 0.11, 0, Math.PI * 2);
              ctx.fill();
            }
            // crescent
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(r * 0.15, -r * 0.08, r * 0.29, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.globalCompositeOperation = "lighter";
          }
          const [x1, y1] = toScreen(EYES[0][0], EYES[0][1]);
          const [x2, y2] = toScreen(EYES[1][0], EYES[1][1]);
          const my = (y1 + y2) / 2;
          const streak = ctx.createLinearGradient(0, 0, W, 0);
          streak.addColorStop(0, "rgba(143,211,255,0)");
          streak.addColorStop(clamp(x1 / W), `rgba(170,225,255,${0.5 * eyes})`);
          streak.addColorStop(clamp(x2 / W), `rgba(170,225,255,${0.5 * eyes})`);
          streak.addColorStop(1, "rgba(143,211,255,0)");
          ctx.globalAlpha = fade;
          ctx.fillStyle = streak;
          ctx.fillRect(0, my - 1, W, 2);
        }
        ctx.restore();
      }

      // ---- flash: the dive through the eye opens the portal ---------------
      const flash = range(p, 0.73, 0.775) * (1 - range(p, 0.775, 0.83));
      if (flash > 0.001) {
        const g = ctx.createRadialGradient(ax, ay, 0, ax, ay, Math.max(W, H) * 0.7);
        g.addColorStop(0, `rgba(230,246,255,${0.9 * flash})`);
        g.addColorStop(0.35, `rgba(143,211,255,${0.45 * flash})`);
        g.addColorStop(1, "rgba(4,5,10,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ---- motes ----------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        if (!reduced) {
          m.y -= m.speed * m.depth * dt;
          if (m.y < -30) {
            m.y = H + 30;
            m.x = Math.random() * W;
          }
        }
        const y = m.y - p * H * 0.6 * m.depth;
        const yy = ((y % (H + 60)) + H + 60) % (H + 60) - 30;
        const x = m.x + Math.sin(t * 0.5 + m.seed) * 14 * m.depth;
        // twinkle: mostly dim, now and then a bright glint
        const tw = Math.pow(0.5 + 0.5 * Math.sin(t * (0.8 + m.depth) + m.seed * 7), 3);
        ctx.globalAlpha = m.alpha * (0.25 + 0.75 * tw);
        const k = m.size * (0.6 + m.depth * 0.6);
        ctx.drawImage(mote, x - k / 2, yy - k / 2, k, k);
      }
      ctx.restore();

      // ---- moonfire -------------------------------------------------------
      const heat = (0.55 + 0.45 * range(p, 0.55, 0.7)) * (1 - 0.6 * range(p, 0.8, 0.95));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (!reduced) {
        while (flames.length < flameCount) flames.push(spawnFlame());
        for (let i = 0; i < flames.length; i++) {
          const f = flames[i];
          f.life += dt;
          if (f.life > f.max) {
            flames[i] = spawnFlame();
            continue;
          }
          f.x += (f.vx + Math.sin(t * 3 + f.seed) * 20) * dt;
          f.y += f.vy * dt;
          const k = f.life / f.max;
          const size = f.size * (1 - k * 0.7);
          ctx.globalAlpha = heat * 0.5 * Math.sin(Math.PI * k);
          ctx.drawImage(sprite, f.x - size / 2, f.y - size / 2, size, size);
        }
      }
      const floor = ctx.createLinearGradient(0, H, 0, H - 160);
      floor.addColorStop(0, `rgba(80,160,255,${0.35 * heat})`);
      floor.addColorStop(1, "rgba(43,108,176,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = floor;
      ctx.fillRect(0, H - 160, W, 160);
      ctx.restore();

      // ---- DOM layers ---------------------------------------------------
      const bg = bgSigilRef.current;
      if (bg) {
        const [sx, sy] = toScreen(250, 170);
        const k = (560 * s) / SIGIL_BASE;
        const o = (0.07 + 0.15 * ignite) * fade;
        setStyle(bg, "opacity", o < 0.005 ? "0" : o.toFixed(3));
        setStyle(bg, "visibility", o < 0.005 || k > 4 ? "hidden" : "visible");
        if (o >= 0.005 && k <= 4) {
          setStyle(bg, "transform", `translate3d(${(sx - SIGIL_BASE / 2).toFixed(1)}px, ${(sy - SIGIL_BASE / 2).toFixed(1)}px, 0) scale(${k.toFixed(4)})`);
          setVar(bg, "--r1", `${(p * 140 + t * 4).toFixed(2)}deg`);
          setVar(bg, "--r2", `${(-p * 220 - t * 6).toFixed(2)}deg`);
          setVar(bg, "--r3", `${(p * 90).toFixed(2)}deg`);
        }
      }
      const portal = portalRef.current;
      if (portal) {
        const open = range(p, 0.72, 0.86);
        const size = Math.min(W, H) * (mobile ? 1.05 : 0.92);
        setStyle(portal, "opacity", open.toFixed(3));
        setStyle(portal, "visibility", open < 0.005 ? "hidden" : "visible");
        portalLive.current = open >= 0.005;
        if (open >= 0.005) {
          setStyle(portal, "transform", `translate(-50%, -50%) scale(${((size / SIGIL_BASE) * (0.08 + 0.92 * open)).toFixed(4)})`);
          setVar(portal, "--r1", `${(t * 6 + p * 160).toFixed(2)}deg`);
        }
      }

      let current = Math.max(0, lastChapter);
      film.forEach((ch, i) => {
        const el = chapterRefs.current[i];
        if (!el) return;
        const [a, b] = ch.window;
        const v = range(p, a - 0.03, a + 0.01) * (1 - range(p, b - 0.01, b + 0.03));
        const shown = i === 0 ? 1 - range(p, b - 0.01, b + 0.03) : v;
        setStyle(el, "opacity", shown.toFixed(3));
        setStyle(el, "visibility", shown < 0.005 ? "hidden" : "visible");
        setStyle(el, "transform", `translate3d(0, ${((1 - shown) * 28).toFixed(1)}px, 0)`);
        setStyle(el, "pointerEvents", shown > 0.5 ? "auto" : "none");
        const hidden = shown > 0.5 ? "false" : "true";
        if (el.getAttribute("aria-hidden") !== hidden) el.setAttribute("aria-hidden", hidden);
        if (shown > 0.5) current = i;
      });
      if (current !== lastChapter) {
        const word = chapterRefs.current[current]?.querySelector<HTMLElement>("[data-decipher]");
        if (word && lastChapter !== -1 && !reduced) decipher(word);
        if (lastChapter !== -1) window.dispatchEvent(new CustomEvent("arcane:chapter", { detail: current }));
        lastChapter = current;
      }
      if (hintRef.current) setStyle(hintRef.current, "opacity", (1 - range(p, 0.02, 0.08)).toFixed(3));
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      readProgress();
      draw(dt);
      if (visible) frame = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(track);
    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    frame = requestAnimationFrame(loop);

    const onReady = () => {
      const word = chapterRefs.current[0]?.querySelector<HTMLElement>("[data-decipher]");
      if (word && !reduced) decipher(word, 1200);
    };
    window.addEventListener("arcane:ready", onReady);

    return () => {
      cancelAnimationFrame(frame);
      visible = false;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("arcane:ready", onReady);
    };
  }, []);

  return (
    <section id="top" ref={trackRef} aria-label="Introduction" className="relative z-10 h-[620vh] md:h-[700vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={bgSigilRef}
          className="pointer-events-none absolute left-0 top-0 origin-center text-moon will-change-transform"
          style={{ width: SIGIL_BASE, height: SIGIL_BASE }}
          aria-hidden
        >
          <Sigil id="bg-sigil" layered className="h-full w-full" />
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        <div
          ref={portalRef}
          aria-hidden
          className="pointer-events-none invisible absolute left-1/2 top-[42%] origin-center text-moon opacity-0 will-change-transform md:top-[44%]"
          style={{ width: SIGIL_BASE, height: SIGIL_BASE }}
        >
          <Aura activeRef={portalLive} className="absolute inset-[-12%] h-[124%] w-[124%]" />
          {/* One fine ring of text, turning slowly */}
          <div className="absolute inset-0 will-change-transform" style={{ transform: "rotate(var(--r1, 0deg))" }}>
            <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
              <defs>
                <path id="portal-ring" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
              </defs>
              <text fill="rgba(234,246,255,0.55)" fontSize="7" letterSpacing="3.4" style={{ fontFamily: "var(--font-geist-mono)" }}>
                <textPath href="#portal-ring">
                  RYTHME NAGRANI · PROTOCOL ENGINEER · DEVELOPER RELATIONS · BASE · SOLANA · ROOTSTOCK · ZERO KNOWLEDGE · TOKEN2049 ·
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Vignette and bottom fade keep the copy readable over the art. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_45%,rgba(4,5,10,0.85)_100%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

        {/* Chapters */}
        {film.map((ch, i) => (
          <div
            key={ch.word}
            ref={(el) => {
              chapterRefs.current[i] = el;
            }}
            className="absolute inset-x-0 bottom-[13%] px-5 text-center will-change-[transform,opacity] md:bottom-[12%]"
            style={{ opacity: i === 0 ? 1 : 0 }}
            aria-hidden={i === 0 ? "false" : "true"}
          >
            {ch.lead && <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-moon [text-shadow:0_1px_12px_#04050a,0_0_2px_#04050a] md:text-xs">{ch.lead}</p>}
            {i === 0 ? (
              <h1 className="mt-2 font-display text-[17vw] font-normal leading-[0.9] tracking-[-0.02em] text-white text-glow md:text-[9rem]">
                <span className="sr-only">{ch.word}</span>
                <span aria-hidden data-decipher={ch.word}>
                  {ch.word}
                </span>
              </h1>
            ) : (
              <h2
                className={`aura-text mt-4 font-display font-normal italic leading-[0.88] tracking-[-0.03em] ${
                  ch.word.length > 8 ? "text-[14vw] md:text-[8rem]" : "text-[30vw] md:text-[13rem]"
                }`}
              >
                <span className="sr-only">{ch.word}</span>
                <span aria-hidden data-decipher={ch.word}>
                  {ch.word}
                </span>
              </h2>
            )}
            {ch.body && <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 [text-shadow:0_1px_14px_#04050a] md:text-base">{ch.body}</p>}
            {ch.ctas && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {ch.ctas.map((c, k) => (
                  <SpellButton key={c.href + c.label} href={c.href} variant={k === 0 ? "cast" : "trace"}>
                    {c.label}
                  </SpellButton>
                ))}
              </div>
            )}
          </div>
        ))}

        <div ref={hintRef} className="absolute inset-x-0 bottom-[3%] flex flex-col items-center gap-2 text-white/55" aria-hidden>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px animate-pulse bg-gradient-to-b from-moon to-transparent" />
        </div>

      </div>
    </section>
  );
}
