"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

// A living aura: domain-warped noise mapped to a moonlight palette (navy,
// electric blue, cyan, lilac, a touch of rose), soft-edged, with film grain
// and an iridescent rim. It leans toward the pointer. Rendered at reduced
// resolution: it is all soft light, so extra pixels add nothing but cost.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uRim;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.11;
  vec2 p = uv * 2.3 - uMouse * 0.35;

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.6 * r);

  // Indigo base so blends never go grey; ice, lilac and rose ride on top.
  vec3 indigo = vec3(0.06, 0.04, 0.22);
  vec3 blue   = vec3(0.20, 0.34, 1.00);
  vec3 ice    = vec3(0.70, 0.88, 1.00);
  vec3 lilac  = vec3(0.62, 0.46, 1.00);
  vec3 rose   = vec3(1.00, 0.56, 0.80);

  vec3 col = mix(indigo, blue, smoothstep(-0.4, 0.3, f));
  col = mix(col, lilac, smoothstep(0.05, 0.65, length(q)) * 0.8);
  col = mix(col, ice, pow(smoothstep(0.25, 0.9, r.x + 0.3), 1.6) * 0.7);
  col += rose * pow(smoothstep(0.3, 0.95, f + r.y), 1.6) * 0.65;

  // Pull the light toward the pointer.
  vec2 lean = uv - uMouse * 0.08;
  float d = length(lean);
  float body = smoothstep(0.5, 0.06, d);
  float halo = exp(-d * 3.6) * 0.55;

  // Thin iridescent rim; its hue walks around the circle.
  float ang = atan(lean.y, lean.x);
  float rim = smoothstep(0.012, 0.0, abs(d - 0.41)) * uRim;
  vec3 rimCol = mix(ice, rose, 0.5 + 0.5 * sin(ang * 2.0 + uTime * 0.7));
  rimCol = mix(rimCol, lilac, 0.5 + 0.5 * sin(ang * 3.0 - uTime * 0.5));

  // a luminous core, like light behind silk
  vec3 core = vec3(0.78, 0.86, 1.0) * exp(-d * 6.5) * 0.45;
  vec3 c = col * (body + halo * 0.5) + core * body + rimCol * rim;
  float a = clamp(body + halo * 0.6 + rim, 0.0, 1.0);

  float g = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (g - 0.5) * 0.07 * a;

  gl_FragColor = vec4(c, a);
}`;

export default function Aura({
  className,
  rim = 1,
  activeRef,
}: {
  className?: string;
  /** Strength of the iridescent rim, 0 to 1. */
  rim?: number;
  /** If given, the aura only renders while this is true (the film drives it). */
  activeRef?: MutableRefObject<boolean>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false, alpha: true });
    if (!gl) {
      canvas.classList.add("aura-fallback");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[aura] shader failed, using CSS fallback:", gl.getProgramInfoLog(prog));
      canvas.classList.add("aura-fallback");
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uRim = gl.getUniformLocation(prog, "uRim");
    gl.uniform1f(uRim, rim);

    const resize = () => {
      const scale = 0.55; // soft light: half resolution is indistinguishable
      const w = Math.max(64, Math.round(canvas.clientWidth * scale));
      const h = Math.max(64, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, -((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let inView = false;
    let frame = 0;
    let time = Math.random() * 100;
    let last = performance.now();
    const render = () => {
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const active = inView && !document.hidden && (activeRef ? activeRef.current : true);
      if (active) {
        if (!reduced) time += dt;
        render();
      }
      frame = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(canvas);
    if (reduced) render();
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [rim, activeRef]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
