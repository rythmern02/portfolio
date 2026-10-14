import type React from "react";

// The wizard's magic circle, built from real sources rather than invented
// glyphs: the Seal of Solomon (hexagram) around the Kamea of Jupiter, the 4x4
// magic square Agrippa gives in "Three Books of Occult Philosophy" (1531,
// book II ch. 22) for gain, favour and peace. Every row, column and diagonal
// sums to 34; the whole square to 136. The rune ring carries the Hebrew names
// Agrippa ties to those numbers. A sigil line is traced through the square
// from 1 to 16, the classic way sigils were drawn from these tables.
//
// Rings rotate independently through CSS variables
// (--r1 outer text ring, --r2 rune ring, --r3 hexagram) so callers can drive
// them from scroll, time or nothing at all.
//
// `layered` renders each ring as its own SVG in its own compositor layer, so
// rotating or scaling it is a GPU transform instead of re-rendering the SVG.
// Use it for anything large that moves every frame.

// Kamea of Jupiter, as printed by Agrippa.
const KAMEA = [
  [4, 14, 15, 1],
  [9, 7, 6, 12],
  [5, 11, 10, 8],
  [16, 2, 3, 13],
];
// Hebrew names Agrippa attaches to Jupiter's numbers (gematria in brackets):
// Aba [4, the side], El Ab [34, each line], Iophiel the intelligence and
// Hismael the spirit [136 each, the whole square].
const NAMES = [
  { he: "אבא", n: "4" },
  { he: "אל אב", n: "34" },
  { he: "יהפיאל", n: "136" },
  { he: "הסמאל", n: "136" },
];
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
      {NAMES.map((name, i) => {
        const deg = i * 90;
        return (
          <g key={name.he} transform={`rotate(${deg} 200 200)`}>
            <text x="200" y="64" fill={stroke} fontSize="14" textAnchor="middle" dominantBaseline="central" direction="rtl">
              {name.he}
            </text>
            <text x="200" y="76" fill={stroke} fontSize="6" textAnchor="middle" opacity="0.6" style={{ fontFamily: "var(--font-mono)" }}>
              {name.n}
            </text>
            {/* small diamonds between the names */}
            <path d="M200 60 l2.5 6 -2.5 6 -2.5 -6z" transform="rotate(45 200 200)" fill={stroke} opacity="0.6" />
          </g>
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

// The Kamea of Jupiter with a sigil traced through it, 1 to 16.
const CELL = 19;
const ORIGIN = 200 - CELL * 2;
function cellCenter(n: number) {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (KAMEA[r][c] === n) return [ORIGIN + c * CELL + CELL / 2, ORIGIN + r * CELL + CELL / 2];
  return [200, 200];
}
const TRACE = Array.from({ length: 16 }, (_, i) => cellCenter(i + 1));
const TRACE_D = "M" + TRACE.map(([x, y]) => `${x} ${y}`).join(" L");
const [START, END] = [TRACE[0], TRACE[15]];

function Core({ drawCls }: { id: string; drawCls: string }) {
  return (
    <>
      <circle className={drawCls} cx="200" cy="200" r="58" stroke={stroke} strokeWidth="1" pathLength={1} />
      <rect x={ORIGIN} y={ORIGIN} width={CELL * 4} height={CELL * 4} stroke={stroke} strokeWidth="0.8" strokeOpacity="0.8" />
      {[1, 2, 3].map((k) => (
        <g key={k} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.45">
          <line x1={ORIGIN + k * CELL} y1={ORIGIN} x2={ORIGIN + k * CELL} y2={ORIGIN + CELL * 4} />
          <line x1={ORIGIN} y1={ORIGIN + k * CELL} x2={ORIGIN + CELL * 4} y2={ORIGIN + k * CELL} />
        </g>
      ))}
      {KAMEA.map((row, r) =>
        row.map((n, c) => (
          <text
            key={n}
            x={ORIGIN + c * CELL + CELL / 2}
            y={ORIGIN + r * CELL + CELL / 2}
            fill={stroke}
            fontSize="6.5"
            textAnchor="middle"
            dominantBaseline="central"
            opacity="0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {n}
          </text>
        )),
      )}
      {/* the sigil: a ring where it begins, a bar where it ends */}
      <path
        className={`kamea-trace ${drawCls}`}
        d={TRACE_D}
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
      />
      <circle cx={START[0]} cy={START[1]} r="3" stroke={stroke} strokeWidth="1.2" fill="none" />
      <line x1={END[0] - 4} y1={END[1] + 4} x2={END[0] + 4} y2={END[1] - 4} stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
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
