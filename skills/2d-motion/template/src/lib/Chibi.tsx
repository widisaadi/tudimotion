import React from "react";
import { C } from "./theme";

export type Mood = "neutral" | "happy" | "sad" | "shock" | "angry";
type Hair = "short" | "long" | "bun" | "spiky" | "bald";

export type ChibiProps = {
  /** Feet position (bottom-centre) in canvas px. */
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  skin?: string;
  hair?: Hair;
  hairColor?: string;
  shirt?: string;
  pants?: string;
  /** Arm raise angles in degrees: 0 = hanging down, 90 = sideways, 160 = up. */
  armL?: number;
  armR?: number;
  mood?: Mood;
  blink?: boolean;
  tie?: string;
  apron?: boolean;
  glasses?: boolean;
  sweat?: boolean;
  tears?: number; // 0..1 progress of a tear falling
  lift?: number; // vertical offset (bob / jump), px in canvas space
  tilt?: number; // degrees
  opacity?: number;
  children?: React.ReactNode; // extra SVG drawn in the 200x300 space (props in hand)
};

const SW = 5;

const Arm: React.FC<{ side: "L" | "R"; angle: number; color: string; skin: string }> = ({ side, angle, color, skin }) => {
  const sx = side === "L" ? 68 : 132;
  const rot = side === "L" ? angle : -angle;
  return (
    <g transform={`rotate(${rot} ${sx} 176)`}>
      <line x1={sx} y1={176} x2={sx} y2={232} stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
      <line x1={sx} y1={176} x2={sx} y2={232} stroke={color} strokeWidth={16} strokeLinecap="round" />
      <circle cx={sx} cy={238} r={12} fill={skin} stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

const Eyes: React.FC<{ mood: Mood; blink: boolean; glasses: boolean }> = ({ mood, blink, glasses }) => {
  const L = 74;
  const R = 126;
  const Y = 102;
  const brows: Record<Mood, [string, string] | null> = {
    neutral: null,
    happy: null,
    sad: ["M60 86 L84 78", "M140 86 L116 78"],
    angry: ["M60 78 L86 88", "M140 78 L114 88"],
    shock: ["M62 74 Q74 66 86 72", "M138 74 Q126 66 114 72"],
  };
  const b = brows[mood];
  let eyes: React.ReactNode;
  if (mood === "happy") {
    eyes = (
      <>
        <path d={`M${L - 9} ${Y + 3} Q${L} ${Y - 9} ${L + 9} ${Y + 3}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M${R - 9} ${Y + 3} Q${R} ${Y - 9} ${R + 9} ${Y + 3}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      </>
    );
  } else if (blink) {
    eyes = (
      <>
        <line x1={L - 8} y1={Y} x2={L + 8} y2={Y} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <line x1={R - 8} y1={Y} x2={R + 8} y2={Y} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      </>
    );
  } else if (mood === "shock") {
    eyes = (
      <>
        <circle cx={L} cy={Y} r={12} fill={C.white} stroke={C.ink} strokeWidth={4} />
        <circle cx={R} cy={Y} r={12} fill={C.white} stroke={C.ink} strokeWidth={4} />
        <circle cx={L} cy={Y} r={5} fill={C.ink} />
        <circle cx={R} cy={Y} r={5} fill={C.ink} />
      </>
    );
  } else {
    eyes = (
      <>
        <circle cx={L} cy={Y} r={7.5} fill={C.ink} />
        <circle cx={R} cy={Y} r={7.5} fill={C.ink} />
        <circle cx={L + 2.5} cy={Y - 3} r={2.4} fill={C.white} />
        <circle cx={R + 2.5} cy={Y - 3} r={2.4} fill={C.white} />
      </>
    );
  }
  return (
    <g>
      {eyes}
      {b && (
        <>
          <path d={b[0]} stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none" />
          <path d={b[1]} stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none" />
        </>
      )}
      {glasses && (
        <g stroke={C.ink} strokeWidth={4.5} fill="rgba(255,255,255,0.25)">
          <rect x={L - 21} y={Y - 16} width={42} height={32} rx={10} />
          <rect x={R - 21} y={Y - 16} width={42} height={32} rx={10} />
          <line x1={L + 21} y1={Y - 2} x2={R - 21} y2={Y - 2} />
        </g>
      )}
    </g>
  );
};

const HairBack: React.FC<{ hair: Hair; color: string }> = ({ hair, color }) => {
  if (hair === "long")
    return <path d="M30 92 C26 150 34 196 52 206 L148 206 C166 196 174 150 170 92 Z" fill={color} stroke={C.ink} strokeWidth={SW} />;
  if (hair === "bun") return <circle cx={100} cy={22} r={24} fill={color} stroke={C.ink} strokeWidth={SW} />;
  return null;
};

const HairFront: React.FC<{ hair: Hair; color: string }> = ({ hair, color }) => {
  if (hair === "bald")
    return <path d="M36 70 C40 60 46 54 52 50 M164 70 C160 60 154 54 148 50" stroke={color} strokeWidth={10} strokeLinecap="round" fill="none" />;
  if (hair === "spiky")
    return (
      <path
        d="M30 96 C24 66 34 40 54 30 L58 12 L74 26 L88 6 L100 24 L116 4 L126 26 L144 14 L146 34 C166 46 176 70 170 96 C150 70 126 62 100 64 C74 62 50 70 30 96 Z"
        fill={color}
        stroke={C.ink}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
    );
  // short / long / bun share the cap with a side-swept fringe
  return (
    <path
      d="M30 98 C22 40 70 18 100 20 C140 18 178 40 170 98 C160 80 140 68 116 66 C104 78 80 84 60 82 C48 86 38 92 30 98 Z"
      fill={color}
      stroke={C.ink}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
  );
};

export const Chibi: React.FC<ChibiProps> = ({
  x,
  y,
  scale = 1,
  flip = false,
  skin = C.skin,
  hair = "short",
  hairColor = "#3B2A22",
  shirt = C.blue,
  pants = "#3D4A6B",
  armL = 12,
  armR = 12,
  mood = "neutral",
  blink = false,
  tie,
  apron,
  glasses = false,
  sweat = false,
  tears = 0,
  lift = 0,
  tilt = 0,
  opacity = 1,
  children,
}) => {
  const w = 200 * scale;
  const h = 300 * scale;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 200 300"
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h + lift,
        overflow: "visible",
        opacity,
        transform: `rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* ground shadow */}
      <ellipse cx={100} cy={292 - lift / scale} rx={58} ry={9} fill="rgba(43,42,58,0.14)" />
      {/* legs */}
      <rect x={76} y={236} width={20} height={48} rx={9} fill={pants} stroke={C.ink} strokeWidth={SW} />
      <rect x={104} y={236} width={20} height={48} rx={9} fill={pants} stroke={C.ink} strokeWidth={SW} />
      <ellipse cx={84} cy={286} rx={16} ry={8} fill={C.ink} />
      <ellipse cx={116} cy={286} rx={16} ry={8} fill={C.ink} />
      <HairBack hair={hair} color={hairColor} />
      {/* arms behind body */}
      <Arm side="L" angle={armL} color={shirt} skin={skin} />
      <Arm side="R" angle={armR} color={shirt} skin={skin} />
      {/* body */}
      <rect x={60} y={156} width={80} height={96} rx={32} fill={shirt} stroke={C.ink} strokeWidth={SW} />
      {apron && <path d="M74 190 L126 190 L130 248 L70 248 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />}
      {tie && <path d="M100 162 L110 176 L104 222 L100 230 L96 222 L90 176 Z" fill={tie} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />}
      {/* head */}
      <circle cx={100} cy={94} r={70} fill={skin} stroke={C.ink} strokeWidth={SW} />
      <ellipse cx={60} cy={122} rx={13} ry={7.5} fill={C.pink} opacity={0.85} />
      <ellipse cx={140} cy={122} rx={13} ry={7.5} fill={C.pink} opacity={0.85} />
      <HairFront hair={hair} color={hairColor} />
      <Eyes mood={mood} blink={blink} glasses={glasses} />
      {sweat && <path d="M168 60 C176 74 180 82 172 88 C164 92 158 84 162 76 Z" fill="#8FD3FF" stroke={C.ink} strokeWidth={3.5} />}
      {tears > 0 && (
        <g opacity={tears < 0.95 ? 1 : 1 - (tears - 0.95) * 20}>
          <path d={`M66 ${112 + tears * 60} c-5 8 -6 12 0 14 c6 -2 5 -6 0 -14z`} fill="#8FD3FF" stroke={C.ink} strokeWidth={3} />
          <path d={`M134 ${112 + tears * 50} c-5 8 -6 12 0 14 c6 -2 5 -6 0 -14z`} fill="#8FD3FF" stroke={C.ink} strokeWidth={3} />
        </g>
      )}
      {children}
    </svg>
  );
};

/** Preset looks for the recurring cast. */
export const BUDI = { hair: "short" as const, hairColor: "#3B2A22", shirt: C.yellow, pants: "#3D4A6B" };
export const IBU = { hair: "bun" as const, hairColor: "#5A3A2A", shirt: C.coral, pants: "#7A4E6A", apron: true };
export const BOS = { hair: "bald" as const, hairColor: "#6B6B6B", shirt: "#E8EEF6", pants: "#2F3A55", tie: C.coral, glasses: true };
export const SARI = { hair: "long" as const, hairColor: "#2A1E3A", shirt: C.purple, pants: "#3D4A6B" };
