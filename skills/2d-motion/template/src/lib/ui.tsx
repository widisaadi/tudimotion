import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, pop } from "./anim";
import { body, display } from "./fonts";
import { C } from "./theme";

/**
 * Narration caption. Words pop in one by one; words wrapped in *asterisks*
 * get a highlighter swipe. Sits in the top safe zone of a Reel.
 */
export const Caption: React.FC<{
  text: string;
  start?: number;
  end?: number;
  y?: number;
  size?: number;
  color?: string;
  mark?: string;
  stagger?: number;
}> = ({ text, start = 0, end, y = 250, size = 76, color = C.ink, mark = C.yellow, stagger = 3 }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const out = end === undefined ? 1 : 1 - ease(f, end, end + 10);
  if (f < start || out <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: display,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.16,
        color,
        opacity: out,
        transform: `translateY(${(1 - out) * -20}px)`,
      }}
    >
      {words.map((raw, i) => {
        const hl = raw.startsWith("*") || raw.endsWith("*") || raw.includes("*");
        const w = raw.replace(/\*/g, "");
        const d = start + i * stagger;
        const p = pop(f, d, 12);
        const swipe = ease(f, d + 6, d + 18);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 0.13em",
              transform: `translateY(${(1 - p) * 40}px) scale(${0.6 + 0.4 * p})`,
              opacity: Math.min(1, p * 1.6),
              padding: hl ? "0 0.12em" : 0,
              backgroundImage: hl ? `linear-gradient(${mark}, ${mark})` : undefined,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 82%",
              backgroundSize: hl ? `${swipe * 100}% 42%` : undefined,
              borderRadius: 6,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Speech bubble with a tail. (x, y) = the tail tip, so it pops out of the speaker. */
export const Bubble: React.FC<{
  x: number;
  y: number;
  text: string;
  start: number;
  end?: number;
  width?: number;
  side?: "left" | "right" | "center";
  size?: number;
  color?: string;
  bold?: boolean;
}> = ({ x, y, text, start, end, width = 520, side = "center", size = 46, color = C.white, bold = false }) => {
  const f = useCurrentFrame();
  const p = pop(f, start, 10);
  const out = end === undefined ? 1 : 1 - ease(f, end, end + 8);
  if (f < start || out <= 0) return null;
  const tailX = side === "left" ? 70 : side === "right" ? width - 70 : width / 2;
  const left = x - tailX;
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom: 1920 - y + 34,
        width,
        transform: `scale(${p * out})`,
        transformOrigin: `${tailX}px calc(100% + 34px)`,
      }}
    >
      <div
        style={{
          background: color,
          border: `5px solid ${C.ink}`,
          borderRadius: 40,
          padding: "26px 34px",
          fontFamily: bold ? display : body,
          fontWeight: bold ? 700 : 800,
          fontSize: size,
          lineHeight: 1.2,
          color: C.ink,
          textAlign: "center",
          boxShadow: `0 8px 0 ${C.ink}`,
        }}
      >
        {text}
      </div>
      <svg width={60} height={44} style={{ position: "absolute", left: tailX - 30, top: "100%", marginTop: 2 }} viewBox="0 0 60 44">
        <path d="M6 0 L30 40 L54 0" fill={color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <rect x={9} y={-6} width={42} height={8} fill={color} />
      </svg>
    </div>
  );
};

/** Research citation line, placed above the Reels UI. */
export const Source: React.FC<{ text: string; start?: number; y?: number }> = ({ text, start = 20, y = 1488 }) => {
  const f = useCurrentFrame();
  const o = ease(f, start, start + 15);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: body,
        fontWeight: 700,
        fontSize: 27,
        color: C.muted,
        opacity: o,
        transform: `translateY(${(1 - o) * 12}px)`,
      }}
    >
      <span style={{ background: "rgba(255,255,255,0.75)", padding: "8px 18px", borderRadius: 999 }}>Sumber: {text}</span>
    </div>
  );
};

/** Stamp-style label, e.g. "ILUSTRASI FIKSI". */
export const Tag: React.FC<{ text: string; x: number; y: number; start: number; color?: string; rotate?: number; size?: number }> = ({
  text,
  x,
  y,
  start,
  color = C.coral,
  rotate = -6,
  size = 32,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, start, 9);
  if (f < start) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
        opacity: Math.min(1, p * 2),
        border: `5px solid ${color}`,
        color,
        fontFamily: display,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 2,
        padding: "6px 18px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.85)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Plain background colour with a faint dot grid, like the paper of an explainer. */
export const Paper: React.FC<{ color?: string; dot?: string }> = ({ color = C.paper, dot = "rgba(43,42,58,0.07)" }) => (
  <AbsoluteFill
    style={{
      backgroundColor: color,
      backgroundImage: `radial-gradient(${dot} 3px, transparent 3.5px)`,
      backgroundSize: "44px 44px",
    }}
  />
);

/** Pop-in wrapper for absolutely positioned elements (centre anchored). */
export const Pop: React.FC<{ x: number; y: number; start: number; children: React.ReactNode; rotate?: number; damping?: number }> = ({
  x,
  y,
  start,
  children,
  rotate = 0,
  damping = 10,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, start, damping);
  if (f < start) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p}) rotate(${rotate}deg)` }}>{children}</div>
  );
};
