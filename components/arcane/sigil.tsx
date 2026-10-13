import type React from "react";

// The wizard's magic circle. Rings rotate independently through CSS variables
// (--r1 outer text ring, --r2 rune ring, --r3 hexagram) so callers can drive
// them from scroll, time or nothing at all.
//
// `layered` renders each ring as its own SVG in its own compositor layer, so
// rotating or scaling it is a GPU transform instead of re-rendering the SVG.
// Use it for anything large that moves every frame.

const RUNES = "ᚱᚤᛏᚺᛗᛖ ᚾᚨᚷᚱᚨᚾᛁ ᛟᚾᚲᚺᚨᛁᚾ".replace(/ /g, "").split("");
const RING_TEXT =
  "PROTOCOL ENGINEER ✦ DEVELOPER RELATIONS ✦ SOLIDITY ✦ RUST ✦ ANCHOR ✦ ZERO KNOWLEDGE ✦ BASE ✦ SOLANA ✦ ROOTSTOCK ✦ ";

// Rounded so the server and the browser render identical markup.
const r2 = (n: number) => Math.round(n * 100) / 100;

function polygon(n: number, r: number, offset = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((offset + (360 / n) * i) * Math.PI) / 180;
    return `${r2(200 + r * Math.cos(a))},${r2(200 + r * Math.sin(a))}`;
  }).join(" ");
}

const stroke = "currentColor";

function OuterRing({ id, drawCls }: { id: string; drawCls: string }) {
  return (
    <>
      <defs>
        <path id={`${id}-text`} d="M200,200 m-168,0 a168,168 0 1,1 336,0 a168,168 0 1,1 -336,0" />
      </defs>
      <circle className={drawCls} cx="200" cy="200" r="194" stroke={stroke} strokeWidth="1.2" pathLength={1} />
      <circle cx="200" cy="200" r="186" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.6" />
      <text fill={stroke} fontSize="10.5" letterSpacing="3.2" style={{ fontFamily: "var(--font-mono)" }} opacity="0.9">
        <textPath href={`#${id}-text`}>{RING_TEXT}</textPath>
      </text>
      <circle cx="200" cy="200" r="156" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.6" />
    </>
  );
}

function RuneRing({ drawCls }: { drawCls: string }) {
  return (
    <>
      <circle className={drawCls} cx="200" cy="200" r="148" stroke={stroke} strokeWidth="1" pathLength={1} />
      {RUNES.map((r, i) => {
        const a = (i / RUNES.length) * Math.PI * 2 - Math.PI / 2;
        const x = r2(200 + 134 * Math.cos(a));
        const y = r2(200 + 134 * Math.sin(a));
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill={stroke}
            fontSize="13"
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(${r2((a * 180) / Math.PI + 90)} ${x} ${y})`}
          >
            {r}
          </text>
        );
      })}
      <circle cx="200" cy="200" r="120" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
    </>
  );
}

function Hexagram({ drawCls }: { drawCls: string }) {
  return (
    <>
      <polygon className={drawCls} points={polygon(3, 118)} stroke={stroke} strokeWidth="1" pathLength={1} />
      <polygon className={drawCls} points={polygon(3, 118, 90)} stroke={stroke} strokeWidth="1" pathLength={1} />
      <polygon points={polygon(6, 68, 0)} stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = ((i * 60 - 90) * Math.PI) / 180;
        return <circle key={i} cx={r2(200 + 118 * Math.cos(a))} cy={r2(200 + 118 * Math.sin(a))} r="4" fill={stroke} />;
      })}
    </>
  );
}

function Core({ id, drawCls }: { id: string; drawCls: string }) {
  return (
    <>
      <defs>
        <mask id={`${id}-moon`}>
          <rect width="400" height="400" fill="white" />
          <circle cx="216" cy="190" r="34" fill="black" />
        </mask>
      </defs>
      <circle className={drawCls} cx="200" cy="200" r="58" stroke={stroke} strokeWidth="1" pathLength={1} />
      <circle cx="200" cy="200" r="40" fill={stroke} mask={`url(#${id}-moon)`} opacity="0.95" />
      <path d="M248 158 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill={stroke} />
    </>
  );
}

export default function Sigil({
  className,
  style,
  draw = false,
  layered = false,
  id = "sigil",
}: {
  className?: string;
  style?: React.CSSProperties;
  /** Stroke the circle in as if it is being drawn (loader). */
  draw?: boolean;
  /** One compositor layer per ring; see the note at the top. */
  layered?: boolean;
  id?: string;
}) {
  const drawCls = draw ? "sigil-draw" : "";

  if (layered) {
    const layer = (v: string | null, children: React.ReactNode) => (
      <div
        className="absolute inset-0"
        style={{ transform: v ? `rotate(var(${v}, 0deg))` : undefined, willChange: v ? "transform" : undefined }}
      >
        <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
          {children}
        </svg>
      </div>
    );
    return (
      <div className={`relative ${className ?? ""}`} style={style} aria-hidden>
        {layer("--r1", <OuterRing id={id} drawCls={drawCls} />)}
        {layer("--r2", <RuneRing drawCls={drawCls} />)}
        {layer("--r3", <Hexagram drawCls={drawCls} />)}
        {layer(null, <Core id={id} drawCls={drawCls} />)}
      </div>
    );
  }

  const spin = (v: string): React.CSSProperties => ({
    transform: `rotate(var(${v}, 0deg))`,
    transformOrigin: "200px 200px",
    transformBox: "view-box",
  });
  return (
    <svg viewBox="0 0 400 400" className={className} style={style} aria-hidden fill="none">
      <g style={spin("--r1")}>
        <OuterRing id={id} drawCls={drawCls} />
      </g>
      <g style={spin("--r2")}>
        <RuneRing drawCls={drawCls} />
      </g>
      <g style={spin("--r3")}>
        <Hexagram drawCls={drawCls} />
      </g>
      <Core id={id} drawCls={drawCls} />
    </svg>
  );
}
