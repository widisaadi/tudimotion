import React from "react";
import { C } from "./theme";

const LOBES: [number, number, number][] = [
  [62, 70, 34],
  [104, 52, 38],
  [146, 70, 34],
  [44, 112, 32],
  [160, 112, 32],
  [80, 128, 36],
  [124, 128, 36],
  [102, 96, 44],
];

/** The bespectacled brain mascot. Anchored at its centre. */
export const Brain: React.FC<{
  x: number;
  y: number;
  scale?: number;
  blink?: boolean;
  wave?: number; // arm angle in degrees
  lift?: number;
  tilt?: number;
  worried?: boolean;
}> = ({ x, y, scale = 1, blink = false, wave = 0, lift = 0, tilt = 0, worried = false }) => {
  const w = 210 * scale;
  const h = 230 * scale;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 210 230"
      style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + lift, overflow: "visible", transform: `rotate(${tilt}deg)` }}
    >
      <ellipse cx={104} cy={222} rx={56} ry={8} fill="rgba(43,42,58,0.14)" />
      {/* legs */}
      <line x1={86} y1={160} x2={84} y2={208} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
      <line x1={120} y1={160} x2={122} y2={208} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={80} cy={210} rx={13} ry={7} fill={C.ink} />
      <ellipse cx={126} cy={210} rx={13} ry={7} fill={C.ink} />
      {/* arms */}
      <path d="M40 120 Q18 136 16 156" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
      <g transform={`rotate(${-wave} 168 118)`}>
        <path d="M168 118 Q192 134 194 156" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
        <circle cx={194} cy={160} r={8} fill={C.white} stroke={C.ink} strokeWidth={4} />
      </g>
      <circle cx={16} cy={160} r={8} fill={C.white} stroke={C.ink} strokeWidth={4} />
      {/* merged outline: thick ink circles under, fill circles on top */}
      {LOBES.map(([cx, cy, r], i) => (
        <circle key={`o${i}`} cx={cx} cy={cy} r={r + 5} fill={C.ink} />
      ))}
      {LOBES.map(([cx, cy, r], i) => (
        <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill="#FFA3BB" />
      ))}
      {/* folds */}
      <g stroke="#E0708F" strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M104 22 C96 40 112 52 102 70" />
        <path d="M50 64 C62 70 66 82 58 92" />
        <path d="M156 64 C144 70 140 82 148 92" />
        <path d="M60 140 C70 132 84 136 90 146" />
        <path d="M146 140 C136 132 122 136 116 146" />
      </g>
      {/* face */}
      <ellipse cx={72} cy={118} rx={12} ry={7} fill={C.coral} opacity={0.45} />
      <ellipse cx={136} cy={118} rx={12} ry={7} fill={C.coral} opacity={0.45} />
      <g stroke={C.ink} strokeWidth={5} fill="rgba(255,255,255,0.55)">
        <circle cx={82} cy={98} r={20} />
        <circle cx={126} cy={98} r={20} />
        <line x1={102} y1={96} x2={106} y2={96} />
      </g>
      {blink ? (
        <g stroke={C.ink} strokeWidth={5} strokeLinecap="round">
          <line x1={76} y1={99} x2={88} y2={99} />
          <line x1={120} y1={99} x2={132} y2={99} />
        </g>
      ) : (
        <g fill={C.ink}>
          <circle cx={82} cy={99} r={6.5} />
          <circle cx={126} cy={99} r={6.5} />
        </g>
      )}
      {worried && (
        <g stroke={C.ink} strokeWidth={5} strokeLinecap="round">
          <line x1={68} y1={72} x2={90} y2={66} />
          <line x1={140} y1={72} x2={118} y2={66} />
        </g>
      )}
    </svg>
  );
};
