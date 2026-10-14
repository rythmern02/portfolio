import type React from "react";

// The site's mark: the Kamea of Jupiter, the 4x4 magic square Agrippa gives in
// "Three Books of Occult Philosophy" (1531, book II ch. 22) for gain, favour
// and peace. Every row, column and diagonal sums to 34. The glowing line is a
// sigil traced through the square from 1 to 16, the classic way sigils were
// drawn from these tables, opened with a ring and closed with a bar.
//
// Kept deliberately quiet: a thin bezel, a faint grid, and the one line.
// Rings rotate through --r1 (bezel) and --r2 (inner ring). With `layered`,
// each part is its own compositor layer so big, moving seals never re-render.

const KAMEA = [
  [4, 14, 15, 1],
  [9, 7, 6, 12],
  [5, 11, 10, 8],
  [16, 2, 3, 13],
];

const CELL = 34;
const ORIGIN = 200 - CELL * 2;
const r2 = (n: number) => Math.round(n * 100) / 100;

function center(n: number): [number, number] {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (KAMEA[r][c] === n) return [ORIGIN + c * CELL + CELL / 2, ORIGIN + r * CELL + CELL / 2];
  return [200, 200];
}
const TRACE = Array.from({ length: 16 }, (_, i) => center(i + 1));
const TRACE_D = "M" + TRACE.map(([x, y]) => `${x} ${y}`).join(" L");
const [START, END] = [TRACE[0], TRACE[15]];

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const long = i % 6 === 0;
  const r1 = long ? 170 : 176;
  const r0 = 184;
  return {
    x1: r2(200 + r0 * Math.cos(a)),
    y1: r2(200 + r0 * Math.sin(a)),
    x2: r2(200 + r1 * Math.cos(a)),
    y2: r2(200 + r1 * Math.sin(a)),
    long,
  };
});

function Bezel({ drawCls }: { drawCls: string }) {
  return (
    <>
      <circle className={drawCls} cx="200" cy="200" r="194" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.55" pathLength={1} />
      {TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth={t.long ? 1 : 0.6} strokeOpacity={t.long ? 0.55 : 0.25} />
      ))}
    </>
  );
}

function InnerRing({ drawCls }: { drawCls: string }) {
  return (
    <>
      <circle className={drawCls} cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.3" pathLength={1} />
      {[0, 90, 180, 270].map((deg) => (
        <circle key={deg} cx="200" cy="50" r="2.2" fill="currentColor" opacity="0.7" transform={`rotate(${deg} 200 200)`} />
      ))}
    </>
  );
}

function Table({ numbers, drawCls }: { numbers: boolean; drawCls: string }) {
  return (
    <>
      <g stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.16">
        <rect x={ORIGIN} y={ORIGIN} width={CELL * 4} height={CELL * 4} fill="none" />
        {[1, 2, 3].map((k) => (
          <g key={k}>
            <line x1={ORIGIN + k * CELL} y1={ORIGIN} x2={ORIGIN + k * CELL} y2={ORIGIN + CELL * 4} />
            <line x1={ORIGIN} y1={ORIGIN + k * CELL} x2={ORIGIN + CELL * 4} y2={ORIGIN + k * CELL} />
          </g>
        ))}
      </g>
      {numbers &&
        KAMEA.map((row, r) =>
          row.map((n, c) => (
            <text
              key={n}
              x={ORIGIN + c * CELL + 6}
              y={ORIGIN + r * CELL + 11}
              fill="currentColor"
              fontSize="7"
              opacity="0.28"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {n}
            </text>
          )),
        )}
      <path
        className={`kamea-trace ${drawCls}`}
        d={TRACE_D}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        pathLength={1}
      />
      <circle cx={START[0]} cy={START[1]} r="5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <line x1={END[0] - 6} y1={END[1] + 6} x2={END[0] + 6} y2={END[1] - 6} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

export default function Seal({
  className,
  style,
  draw = false,
  layered = false,
  numbers = true,
  rings = true,
  table = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  /** Strokes draw themselves in (loader). */
  draw?: boolean;
  /** One compositor layer per ring, for large seals that move every frame. */
  layered?: boolean;
  /** Faint cell numbers; drop them at small sizes. */
  numbers?: boolean;
  /** Bezel and inner ring; drop them for a bare sigil. */
  rings?: boolean;
  /** The square and its sigil; drop it for rings only. */
  table?: boolean;
}) {
  const drawCls = draw ? "sigil-draw" : "";
  // Without the rings, crop to the square so the sigil fills the box.
  const pad = 8;
  const viewBox = rings ? "0 0 400 400" : `${ORIGIN - pad} ${ORIGIN - pad} ${CELL * 4 + pad * 2} ${CELL * 4 + pad * 2}`;

  if (layered) {
    const layer = (v: string | null, children: React.ReactNode) => (
      <div className="absolute inset-0" style={v ? { transform: `rotate(var(${v}, 0deg))`, willChange: "transform" } : undefined}>
        <svg viewBox={viewBox} className="h-full w-full" fill="none">
          {children}
        </svg>
      </div>
    );
    return (
      <div className={`relative ${className ?? ""}`} style={style} aria-hidden>
        {rings && layer("--r1", <Bezel drawCls={drawCls} />)}
        {rings && layer("--r2", <InnerRing drawCls={drawCls} />)}
        {table && layer(null, <Table numbers={numbers} drawCls={drawCls} />)}
      </div>
    );
  }

  const spin = (v: string): React.CSSProperties => ({
    transform: `rotate(var(${v}, 0deg))`,
    transformOrigin: "200px 200px",
    transformBox: "view-box",
  });
  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden fill="none">
      {rings && (
        <>
          <g style={spin("--r1")}>
            <Bezel drawCls={drawCls} />
          </g>
          <g style={spin("--r2")}>
            <InnerRing drawCls={drawCls} />
          </g>
        </>
      )}
      {table && <Table numbers={numbers} drawCls={drawCls} />}
    </svg>
  );
}
