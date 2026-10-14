"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { film } from "@/lib/content";
import Seal from "./seal";

// ---------------------------------------------------------------------------
// The scroll film. One portrait, everything else is procedural:
//   camera  push-in from full figure to the eyes, then a dive into one eye
//   runes   the robe's glowing glyphs are masked out of the PNG at runtime and
//           ignite from hem to hat as you scroll
//   eyes    moon sigils light up in both irises
//   light   a two-tone halo, light shafts from above and a rim light traced
//           around the silhouette, like a studio portrait
//   haze    slow stage fog drifting along the floor
//   dust    a few motes floating in the light
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

  // Rim light: pixels on the silhouette's edge, softened, in two tints.
  const alpha = data.data;
  const edge = bctx.createImageData(IMG, IMG);
  const R = 3;
  for (let y = R; y < IMG - R; y++) {
    for (let x = R; x < IMG - R; x++) {
      const i = (y * IMG + x) * 4 + 3;
      if (alpha[i] < 140) continue;
      if (
        alpha[i - R * 4] < 40 ||
        alpha[i + R * 4] < 40 ||
        alpha[i - R * IMG * 4] < 40 ||
        alpha[i + R * IMG * 4] < 40
      ) {
        edge.data[i - 3] = 255;
        edge.data[i - 2] = 255;
        edge.data[i - 1] = 255;
        edge.data[i] = 255;
      }
    }
  }
  const edgeC = makeCanvas(IMG, IMG);
  edgeC.getContext("2d")!.putImageData(edge, 0, 0);
  const tint = (color: string) => {
    // A soft wash of backlight, not a traced outline: a real Gaussian blur
    // where canvas filters exist, otherwise halve-and-double in small steps
    // (one big jump leaves visible blocks along the edge).
    const c = makeCanvas(IMG, IMG);
    const g = c.getContext("2d")!;
    // Safari has no canvas filter; the property is simply missing there.
    const canFilter = typeof (g as unknown as { filter?: unknown }).filter === "string";
    if (canFilter) {
      g.filter = "blur(7px)";
      g.drawImage(edgeC, 0, 0);
      g.drawImage(edgeC, 0, 0);
      g.filter = "none";
    } else {
      let src: HTMLCanvasElement = edgeC;
      const steps: HTMLCanvasElement[] = [];
      for (let size = IMG / 2; size >= IMG / 16; size /= 2) {
        const d = makeCanvas(size, size);
        const dx = d.getContext("2d")!;
        dx.imageSmoothingQuality = "high";
        dx.drawImage(src, 0, 0, size, size);
        steps.push(d);
        src = d;
      }
      for (let i = steps.length - 2; i >= 0; i--) {
        const d = steps[i];
        const dx = d.getContext("2d")!;
        dx.clearRect(0, 0, d.width, d.height);
        dx.imageSmoothingQuality = "high";
        dx.drawImage(steps[i + 1], 0, 0, d.width, d.height);
      }
      g.imageSmoothingQuality = "high";
      g.drawImage(steps[0], 0, 0, IMG, IMG);
      g.drawImage(steps[0], 0, 0, IMG, IMG);
    }
    g.globalCompositeOperation = "source-in";
    g.fillStyle = color;
    g.fillRect(0, 0, IMG, IMG);
    return c;
  };

  return { runes, bloom, dark, rimCool: tint("#5aa9ff"), rimIce: tint("#e3f1ff") };
}

function hazeSprite() {
  const s = 128;
  const c = makeCanvas(s, s);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(120,170,255,0.55)");
  grad.addColorStop(0.5, "rgba(47,107,255,0.22)");
  grad.addColorStop(1, "rgba(11,22,48,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

function shaftSprite() {
  const w = 128;
  const h = 512;
  const c = makeCanvas(w, h);
  const g = c.getContext("2d")!;
  const across = g.createLinearGradient(0, 0, w, 0);
  across.addColorStop(0, "rgba(207,230,255,0)");
  across.addColorStop(0.5, "rgba(207,230,255,1)");
  across.addColorStop(1, "rgba(207,230,255,0)");
  g.fillStyle = across;
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "destination-in";
  const down = g.createLinearGradient(0, 0, 0, h);
  down.addColorStop(0, "rgba(0,0,0,1)");
  down.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = down;
  g.fillRect(0, 0, w, h);
  return c;
}

function dustSprite() {
  const s = 16;
  const c = makeCanvas(s, s);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(235,245,255,1)");
  grad.addColorStop(0.35, "rgba(207,230,255,0.5)");
  grad.addColorStop(1, "rgba(207,230,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

function haloSprite() {
  const s = 256;
  const c = makeCanvas(s, s);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(47,107,255,1)");
  grad.addColorStop(0.55, "rgba(30,70,180,0.35)");
  grad.addColorStop(1, "rgba(11,22,48,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

type Flame = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number };
// A four-point star glint: two long, thin soft beams crossed over a core.
function starSprite() {
  const n = 128;
  const c = makeCanvas(n, n);
  const g = c.getContext("2d")!;
  g.translate(n / 2, n / 2);
  g.globalCompositeOperation = "lighter";
  for (const [rot, sx, sy] of [
    [0, 1, 0.045],
    [Math.PI / 2, 1, 0.045],
    [Math.PI / 4, 0.42, 0.03],
    [-Math.PI / 4, 0.42, 0.03],
  ] as const) {
    g.save();
    g.rotate(rot);
    g.scale(sx, sy);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, n / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(207,230,255,0.8)");
    grad.addColorStop(1, "rgba(90,169,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, n / 2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  const core = g.createRadialGradient(0, 0, 0, 0, 0, n * 0.14);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(1, "rgba(207,230,255,0)");
  g.fillStyle = core;
  g.beginPath();
  g.arc(0, 0, n * 0.14, 0, Math.PI * 2);
  g.fill();
  return c;
}

// The inside of his eye, drawn once: a dark pupil, fibres radiating out
// through a bright collarette, little crypts, and a dark limbal ring.
function irisSprite() {
  const n = 1024;
  const R = n / 2;
  const c = makeCanvas(n, n);
  const g = c.getContext("2d")!;
  g.translate(R, R);
  const base = g.createRadialGradient(0, 0, R * 0.2, 0, 0, R);
  base.addColorStop(0, "rgba(2,4,12,1)");
  base.addColorStop(0.3, "rgba(4,10,30,1)");
  base.addColorStop(0.42, "rgba(22,64,170,0.95)");
  base.addColorStop(0.7, "rgba(18,52,140,0.85)");
  base.addColorStop(0.92, "rgba(8,22,64,0.9)");
  base.addColorStop(1, "rgba(4,6,12,0)");
  g.fillStyle = base;
  g.beginPath();
  g.arc(0, 0, R, 0, Math.PI * 2);
  g.fill();
  // fibres
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.lineCap = "round";
  for (let k = 0; k < 1400; k++) {
    const a = rnd() * Math.PI * 2;
    const r0 = R * (0.3 + rnd() * 0.08);
    const r1 = R * (0.55 + rnd() * 0.38);
    const bend = (rnd() - 0.5) * 0.18;
    const bright = rnd();
    g.strokeStyle = bright > 0.85 ? `rgba(207,230,255,${0.12 + rnd() * 0.22})` : `rgba(90,169,255,${0.05 + rnd() * 0.14})`;
    g.lineWidth = 0.6 + rnd() * 1.8;
    g.beginPath();
    g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
    const am = a + bend;
    const rm = (r0 + r1) / 2;
    g.quadraticCurveTo(Math.cos(am) * rm, Math.sin(am) * rm, Math.cos(a + bend * 0.6) * r1, Math.sin(a + bend * 0.6) * r1);
    g.stroke();
  }
  // collarette: a bright, wavy ring around the pupil
  g.strokeStyle = "rgba(207,230,255,0.35)";
  g.lineWidth = 2.2;
  g.beginPath();
  for (let k = 0; k <= 180; k++) {
    const a = (k / 180) * Math.PI * 2;
    const r = R * (0.44 + Math.sin(a * 9) * 0.012 + Math.sin(a * 23) * 0.006);
    if (k) g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  g.stroke();
  // crypts
  for (let k = 0; k < 46; k++) {
    const a = rnd() * Math.PI * 2;
    const r = R * (0.48 + rnd() * 0.36);
    g.fillStyle = `rgba(2,6,20,${0.25 + rnd() * 0.3})`;
    g.save();
    g.translate(Math.cos(a) * r, Math.sin(a) * r);
    g.rotate(a);
    g.beginPath();
    g.ellipse(0, 0, R * (0.02 + rnd() * 0.03), R * (0.006 + rnd() * 0.01), 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  // limbal ring
  g.strokeStyle = "rgba(2,4,12,0.85)";
  g.lineWidth = R * 0.05;
  g.beginPath();
  g.arc(0, 0, R * 0.9, 0, Math.PI * 2);
  g.stroke();
  return c;
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; rot: number; spin: number };
type Streak = { x: number; y: number; vx: number; vy: number; life: number };
type Star = { a: number; r: number; w: number; size: number; seed: number };

type Mote = { x: number; y: number; size: number; alpha: number; depth: number; seed: number };

// The big circles are laid out once at this size and only ever moved with
// GPU transforms, so they never re-render while animating.
const SIGIL_BASE = 1000;
// Star glints that twinkle over the finale headline: left, top, delay, size.
const GLINTS: [string, string, string, string][] = [
  ["3%", "18%", "0s", "1"],
  ["27%", "-6%", "1.1s", "0.7"],
  ["49%", "8%", "2.3s", "1.15"],
  ["64%", "-10%", "0.6s", "0.8"],
  ["82%", "22%", "1.7s", "1"],
  ["97%", "58%", "2.9s", "0.65"],
];

// How long the finale holds before gliding into the work (ms).
const GLIDE_WAIT = 1400;

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

// One span per letter; CSS staggers them off the chapter's --v. Letters are
// grouped per word so a line can only wrap between words, never inside one.
function Letters({ text }: { text: string }) {
  const n = Array.from(text).length;
  let i = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden style={{ "--n": n } as React.CSSProperties}>
        {text.split(" ").map((word, w) => {
          const letters = Array.from(word).map((c) => {
            const idx = i++;
            return (
              <span key={idx} className="l" style={{ "--i": idx } as React.CSSProperties}>
                {c}
              </span>
            );
          });
          i++; // the space counts toward the stagger
          return (
            <span key={w}>
              {w > 0 && " "}
              <span className="inline-block whitespace-nowrap">{letters}</span>
            </span>
          );
        })}
      </span>
    </>
  );
}

export default function Film() {
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgSigilRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const glideRef = useRef<HTMLAnchorElement>(null);

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
    const sprite = hazeSprite();
    const halo = haloSprite();
    const shaft = shaftSprite();
    const dust = dustSprite();
    const star = starSprite();
    const iris = irisSprite();
    const sparks: Spark[] = [];
    const streaks: Streak[] = [];
    let emit = 0;
    let warpEmit = 0;
    const eyePts: [number, number][] = [];
    // Stardust that slowly circles inside the eye at the finale.
    const stardust: Star[] = Array.from({ length: mobile ? 36 : 64 }, (_, k) => ({
      a: (k / 64) * Math.PI * 2 + Math.random(),
      r: 0.32 + Math.random() * 0.5,
      w: (Math.random() < 0.5 ? -1 : 1) * (0.04 + Math.random() * 0.1),
      size: 4 + Math.random() * 12,
      seed: Math.random() * 100,
    }));

    const flames: Flame[] = [];
    const flameCount = mobile ? 12 : 22;
    const motes: Mote[] = [];

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
      const n = mobile ? 18 : 38;
      for (let i = 0; i < n; i++) {
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: 1.2 + Math.random() * 3.2,
          alpha: 0.15 + Math.random() * 0.45,
          depth: 0.3 + Math.random() * 0.9,
          seed: Math.random() * 100,
        });
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ro.observe(document.body);

    // Stage haze: big, slow, mostly sideways drift along the floor.
    const spawnFlame = (): Flame => ({
      x: Math.random() * W,
      y: H - Math.random() * H * 0.22,
      vx: (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 18),
      vy: -(2 + Math.random() * 6),
      life: Math.random() * 3,
      max: 7 + Math.random() * 6,
      size: (mobile ? 220 : 320) + Math.random() * 260,
      seed: Math.random() * 100,
    });

    let progress = 0;
    let lastChapter = -1;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    let time = 0;
    // The name assembles once after the loader; everything else follows scroll.
    let intro = reduced ? 1 : 0;
    let introStart = -1;
    // Auto-glide: once the finale has fully opened while scrolling down, wait
    // a beat for the sigil to draw, then hand off to the page to glide into
    // the work. Scrolling back up before then cancels it.
    let prevP = 0;
    let downward = false;
    let glideAt = 0;
    let glided = false;

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
      ctx.globalAlpha = 0.3 + 0.3 * wake;
      ctx.drawImage(halo, hx - 300 * s, hy - 300 * s, 600 * s, 600 * s);
      ctx.globalAlpha = 0.25 * fade;
      ctx.drawImage(halo, hx - 520 * s + 140 * s, hy - 420 * s, 840 * s, 840 * s);
      ctx.globalAlpha = 1;

      // ---- light shafts from above -----------------------------------------
      if (fade > 0.001) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let k = 0; k < 3; k++) {
          const sway = reduced ? 0 : Math.sin(t * 0.25 + k * 2.1) * 0.05;
          const bx = W * (0.36 + k * 0.14);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.translate(bx, -40);
          ctx.rotate(-0.22 + k * 0.2 + sway);
          ctx.globalAlpha = (0.05 + 0.05 * wake) * fade * (k === 1 ? 1.3 : 0.9);
          ctx.drawImage(shaft, -W * 0.09, 0, W * 0.18, H * 1.15);
        }
        ctx.restore();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

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

        // Rim light: cool blue from the left, ice from the right.
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = fade * (0.25 + 0.4 * wake);
        ctx.drawImage(layers.rimCool, ox - 4 * s, oy + 1 * s, IMG * s, IMG * s);
        ctx.globalAlpha = fade * (0.12 + 0.2 * wake);
        ctx.drawImage(layers.rimIce, ox + 3 * s, oy - 2 * s, IMG * s, IMG * s);
        ctx.globalCompositeOperation = "source-over";

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

        // Eyes: a radiant iris glow and a slowly turning star glint on each
        // catchlight. Sparks drift out of them (drawn below, in screen space).
        eyePts.length = 0;
        if (eyes > 0) {
          for (const [i, [ex, ey]] of EYES.entries()) {
            const [x, y] = toScreen(ex, ey);
            eyePts.push([x, y]);
            const r = 4.4 * s;
            const pulse = reduced ? 1 : 0.85 + 0.15 * Math.sin(t * 2.6 + i * 1.7);
            const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
            g.addColorStop(0, `rgba(235,246,255,${0.95 * eyes})`);
            g.addColorStop(0.18, `rgba(160,205,255,${0.7 * eyes})`);
            g.addColorStop(0.5, `rgba(47,107,255,${0.22 * eyes})`);
            g.addColorStop(1, "rgba(11,22,48,0)");
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = fade;
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r * 5, 0, Math.PI * 2);
            ctx.fill();
            // star glints: one large and slow, one small and counter-turning
            const gx = x - r * 0.28;
            const gy = y - r * 0.32;
            for (const [scale, speed, alpha] of [
              [9, 0.25, 0.95],
              [4.2, -0.6, 0.7],
            ] as const) {
              const size = r * scale * pulse * eyes;
              ctx.save();
              ctx.translate(gx, gy);
              ctx.rotate(t * speed + i * 0.8);
              ctx.globalAlpha = fade * alpha * eyes;
              ctx.drawImage(star, -size / 2, -size / 2, size, size);
              ctx.restore();
            }
          }
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

      // ---- sparks from the eyes ------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (!reduced && eyePts.length && eyes > 0.05 && fade > 0.05) {
        emit += dt * 46 * eyes;
        while (emit > 1 && sparks.length < 180) {
          emit--;
          const [ex, ey] = eyePts[(Math.random() * eyePts.length) | 0];
          const a = Math.random() * Math.PI * 2;
          const sp = 18 + Math.random() * 60;
          sparks.push({
            x: ex + Math.cos(a) * 4,
            y: ey + Math.sin(a) * 4,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 14,
            life: 0,
            max: 0.7 + Math.random() * 1.3,
            size: 5 + Math.random() * 14,
            rot: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 3,
          });
        }
      }
      for (let k = sparks.length - 1; k >= 0; k--) {
        const sp = sparks[k];
        sp.life += dt;
        if (sp.life > sp.max) {
          sparks.splice(k, 1);
          continue;
        }
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vx *= 0.985;
        sp.vy *= 0.985;
        sp.rot += sp.spin * dt;
        const q = sp.life / sp.max;
        const tw = 0.6 + 0.4 * Math.sin(sp.life * 18 + sp.rot * 3);
        const size = sp.size * Math.sin(Math.PI * q);
        ctx.globalAlpha = tw * (1 - q * 0.3);
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.rotate(sp.rot);
        ctx.drawImage(star, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      // ---- the dive: a tunnel of light rushing past ----------------------
      const tunnel = range(p, 0.69, 0.75) * (1 - range(p, 0.79, 0.86));
      if (!reduced && tunnel > 0.01) {
        warpEmit += dt * 520 * tunnel;
        while (warpEmit > 1 && streaks.length < 260) {
          warpEmit--;
          const a = Math.random() * Math.PI * 2;
          const r0 = 4 + Math.random() * 40;
          const sp = 120 + Math.random() * 280;
          streaks.push({ x: ax + Math.cos(a) * r0, y: ay + Math.sin(a) * r0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0 });
        }
      }
      ctx.lineCap = "round";
      for (let k = streaks.length - 1; k >= 0; k--) {
        const st = streaks[k];
        st.life += dt;
        const boost = 1 + 4 * dt;
        st.vx *= boost;
        st.vy *= boost;
        st.x += st.vx * dt;
        st.y += st.vy * dt;
        if (st.life > 1.4 || st.x < -60 || st.x > W + 60 || st.y < -60 || st.y > H + 60) {
          streaks.splice(k, 1);
          continue;
        }
        const len = 0.045;
        ctx.globalAlpha = Math.min(1, st.life * 3) * 0.75;
        ctx.strokeStyle = st.life < 0.3 ? "#ffffff" : "#cfe6ff";
        ctx.lineWidth = 1 + st.life * 1.6;
        ctx.beginPath();
        ctx.moveTo(st.x - st.vx * len, st.y - st.vy * len);
        ctx.lineTo(st.x, st.y);
        ctx.stroke();
      }
      ctx.restore();

      // ---- inside the eye: the iris around the seal, and stardust --------
      const inside = range(p, 0.74, 0.86);
      if (inside > 0.005) {
        const portalSize = Math.min(W, H) * (mobile ? 0.8 : 0.52);
        const cx = W / 2;
        const cy = H * (mobile ? 0.34 : 0.35);
        const S = portalSize * (0.08 + 0.92 * inside);
        const R = S * 0.7;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(reduced ? 0 : t * 0.02);
        ctx.globalAlpha = inside * 0.95;
        ctx.drawImage(iris, -R, -R, R * 2, R * 2);
        ctx.restore();
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const d of stardust) {
          const a = d.a + (reduced ? 0 : t * d.w);
          const rr = d.r * S * 0.95;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr * 0.96;
          const tw = reduced ? 0.7 : 0.4 + 0.6 * Math.max(0, Math.sin(t * 1.6 + d.seed));
          const size = d.size * tw;
          ctx.globalAlpha = inside * tw * 0.8;
          ctx.drawImage(star, x - size / 2, y - size / 2, size, size);
        }
        ctx.restore();
      }

      // ---- dust in the light --------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        if (!reduced) {
          m.y -= 4 * m.depth * dt;
          m.x += Math.sin(t * 0.3 + m.seed) * 6 * dt;
          if (m.y < -10) {
            m.y = H + 10;
            m.x = Math.random() * W;
          }
        }
        const yy = (((m.y - p * H * 0.5 * m.depth) % (H + 20)) + H + 20) % (H + 20) - 10;
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * (0.8 + m.depth) + m.seed);
        const sz = m.size * (0.6 + m.depth * 0.6) * 3;
        ctx.globalAlpha = m.alpha * tw;
        ctx.drawImage(dust, m.x - sz / 2, yy - sz / 2, sz, sz);
      }
      ctx.restore();

      // ---- stage haze -------------------------------------------------------
      const heat = (0.6 + 0.4 * range(p, 0.55, 0.7)) * (1 - 0.5 * range(p, 0.8, 0.95));
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
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          const k = f.life / f.max;
          const size = f.size * (0.8 + k * 0.4);
          ctx.globalAlpha = heat * 0.16 * Math.sin(Math.PI * k);
          ctx.drawImage(sprite, f.x - size / 2, f.y - size * 0.3, size, size * 0.6);
        }
      }
      const floor = ctx.createLinearGradient(0, H, 0, H - 160);
      floor.addColorStop(0, `rgba(47,107,255,${0.22 * heat})`);
      floor.addColorStop(1, "rgba(11,22,48,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = floor;
      ctx.fillRect(0, H - 160, W, 160);
      ctx.restore();

      // ---- DOM layers ---------------------------------------------------
      const bg = bgSigilRef.current;
      if (bg) {
        const [sx, sy] = toScreen(250, 170);
        const k = (560 * s) / SIGIL_BASE;
        const o = (0.06 + 0.14 * ignite) * fade;
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
        const size = Math.min(W, H) * (mobile ? 0.8 : 0.52);
        setStyle(portal, "opacity", open.toFixed(3));
        // Hysteresis so the sigil line never flickers at the threshold.
        if (open > 0.6 && portal.classList.contains("untraced")) portal.classList.remove("untraced");
        else if (open < 0.35 && !portal.classList.contains("untraced")) portal.classList.add("untraced");
        setStyle(portal, "visibility", open < 0.005 ? "hidden" : "visible");
        if (open >= 0.005) {
          setStyle(portal, "transform", `translate(-50%, -50%) scale(${((size / SIGIL_BASE) * (0.08 + 0.92 * open)).toFixed(4)})`);
          // Only the bezels turn, slowly, like a watch; the square stays still.
          setVar(portal, "--r1", `${(t * 3 + p * 60).toFixed(2)}deg`);
          setVar(portal, "--r2", `${(-t * 2 - p * 40).toFixed(2)}deg`);
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
        setStyle(el, "transform", `translate3d(0, ${((1 - shown) * 18).toFixed(1)}px, 0)`);
        // Letters are driven by this value too, so scrolling back plays the
        // reveal in reverse instead of re-triggering anything.
        setVar(el, "--v", (shown * intro).toFixed(3));
        setStyle(el, "pointerEvents", shown > 0.5 ? "auto" : "none");
        const hidden = shown > 0.5 ? "false" : "true";
        if (el.getAttribute("aria-hidden") !== hidden) el.setAttribute("aria-hidden", hidden);
        if (shown > 0.5) current = i;
      });
      if (p > prevP + 0.0005) downward = true;
      else if (p < prevP - 0.0005) downward = false;
      prevP = p;
      if (p < 0.8) glided = false;
      if (!glided && !reduced && downward && p >= 0.87) {
        if (!glideAt) glideAt = performance.now() + GLIDE_WAIT;
        else if (performance.now() >= glideAt) {
          glided = true;
          glideAt = 0;
          window.dispatchEvent(new Event("arcane:glide"));
        }
      } else if (glideAt && (p < 0.85 || !downward)) {
        glideAt = 0;
      }
      // The finale's ring fills during that beat, so the glide never surprises.
      if (glideRef.current) {
        const g = glideAt ? clamp(1 - (glideAt - performance.now()) / GLIDE_WAIT) : glided ? 1 : 0;
        setVar(glideRef.current, "--g", g.toFixed(3));
      }

      if (current !== lastChapter) {
        if (lastChapter !== -1) window.dispatchEvent(new CustomEvent("arcane:chapter", { detail: current }));
        lastChapter = current;
      }
      if (hintRef.current) setStyle(hintRef.current, "opacity", (1 - range(p, 0.02, 0.08)).toFixed(3));
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      if (introStart >= 0 && intro < 1) intro = smooth(clamp((now - introStart) / 1400));
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
      introStart = performance.now();
    };
    // Clicking the finale's ring glides at once (with reduced motion it is a
    // plain link to the work).
    const onGlideClick = (e: MouseEvent) => {
      if (reduced) return;
      e.preventDefault();
      glided = true;
      glideAt = 0;
      window.dispatchEvent(new Event("arcane:glide"));
    };
    glideRef.current?.addEventListener("click", onGlideClick);
    window.addEventListener("arcane:ready", onReady);

    return () => {
      cancelAnimationFrame(frame);
      visible = false;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("arcane:ready", onReady);
      glideRef.current?.removeEventListener("click", onGlideClick);
    };
  }, []);

  return (
    <section id="top" ref={trackRef} aria-label="Introduction" className="relative z-10 h-[620vh] md:h-[700vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={bgSigilRef}
          className="pointer-events-none absolute left-0 top-0 origin-center text-azure will-change-transform"
          style={{ width: SIGIL_BASE, height: SIGIL_BASE }}
          aria-hidden
        >
          <Seal layered table={false} className="h-full w-full" />
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        <div
          ref={portalRef}
          aria-hidden
          className="untraced pointer-events-none invisible absolute left-1/2 top-[34%] origin-center text-ice opacity-0 will-change-transform md:top-[35%]"
          style={{ width: SIGIL_BASE, height: SIGIL_BASE }}
        >
          {/* A painted glow instead of a drop-shadow filter: no per-frame filter work. */}
          <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.28)_0%,rgba(47,107,255,0.08)_45%,transparent_70%)]" />
          <Seal layered className="h-full w-full [&_.kamea-trace]:[filter:drop-shadow(0_0_6px_currentColor)]" />
        </div>

        {/* Vignette and bottom fade keep the copy readable over the art. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_45%,rgba(4,6,12,0.88)_100%)]"
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
            {ch.lead && (
              <p className="font-mono text-[12px] lowercase tracking-[0.04em] text-ice [text-shadow:0_0_14px_#04060c,0_0_4px_#04060c] md:text-[14px]">
                {ch.lead}
              </p>
            )}
            {i === 0 ? (
              <h1 className="scrub mt-2 font-display text-[15vw] font-bold leading-[0.9] tracking-[-0.05em] md:text-[8.5rem]">
                <Letters text={ch.word} />
              </h1>
            ) : (
              <h2
                className={`scrub relative mt-1 font-display font-bold leading-[0.85] tracking-[-0.06em] ${
                  ch.word.length > 8 ? "text-[11.5vw] md:text-[6rem]" : "text-[26vw] md:text-[13rem]"
                } ${i === film.length - 1 ? "cast" : ""}`}
              >
                {i === film.length - 1 ? (
                  // Glints are placed against the words themselves, not the full-width heading.
                  <span className="relative inline-block">
                    <Letters text={ch.word} />
                    <span aria-hidden className="glints">
                      {GLINTS.map((g, k) => (
                        <i key={k} style={{ left: g[0], top: g[1], animationDelay: g[2], "--gs": g[3] } as React.CSSProperties} />
                      ))}
                    </span>
                  </span>
                ) : (
                  <Letters text={ch.word} />
                )}
              </h2>
            )}
            {ch.body && (
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 [text-shadow:0_1px_14px_#04060c] md:text-[17px]">
                {ch.body}
              </p>
            )}
            {i === film.length - 1 && (
              <a ref={glideRef} href="#work" className="glide group mx-auto mt-8 flex w-max flex-col items-center gap-3" aria-label="Enter the work">
                <span className="relative block h-16 w-16">
                  <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
                    <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(207,230,255,0.14)" strokeWidth="1" />
                    <circle className="glide-fill" cx="32" cy="32" r="30" fill="none" stroke="#cfe6ff" strokeWidth="1.5" strokeLinecap="round" pathLength={1} />
                  </svg>
                  <span aria-hidden className="glide-orbit absolute inset-0" />
                  <span aria-hidden className="glide-arrow absolute inset-0 flex items-center justify-center text-ice">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </span>
                </span>
                <span className="font-mono text-[11px] lowercase tracking-[0.06em] text-white/60 transition-colors group-hover:text-white">
                  entering the work
                </span>
              </a>
            )}
            {ch.note && <p className="mx-auto mt-6 max-w-md font-mono text-[10.5px] leading-relaxed text-white/40">{ch.note}</p>}
          </div>
        ))}

        <div ref={hintRef} className="absolute inset-x-0 bottom-[3%] flex flex-col items-center gap-2 text-white/55" aria-hidden>
          <span className="font-mono text-[11px] lowercase tracking-[0.08em]">scroll to cast</span>
          <span className="h-8 w-px animate-pulse bg-gradient-to-b from-azure to-transparent" />
        </div>

      </div>
    </section>
  );
}
