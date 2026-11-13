import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { bob, ease, isBlinking, pop } from "../lib/anim";
import { BOS, BUDI, Chibi, IBU } from "../lib/Chibi";
import { body, chalk, display } from "../lib/fonts";
import { C } from "../lib/theme";
import { Bubble, Caption, Paper, Pop, Source, Tag } from "../lib/ui";

/* ───────────────────────── 1. Hook: chalkboard ───────────────────────── */
const CHALK = [
  { t: "Bagaimana jika", s: 10 },
  { t: "di dunia ini", s: 30 },
  { t: "semua orangnya", s: 50 },
  { t: "menjadi", s: 70 },
];

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const board = pop(f, 0, 14);
  const budiIn = pop(f, 205, 13);
  const jujur = pop(f, 100, 8);
  const underline = ease(f, 112, 132);
  const waving = f > 222 ? 135 + Math.sin(f * 0.45) * 22 : 20;
  return (
    <AbsoluteFill style={{ background: "#EADBC2" }}>
      <div style={{ position: "absolute", top: 1500, left: 0, right: 0, bottom: 0, background: "#C99A6B", borderTop: `6px solid ${C.ink}` }} />
      {/* board */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 250,
          width: 960,
          height: 760,
          background: C.board,
          border: `24px solid ${C.wood}`,
          outline: `5px solid ${C.ink}`,
          borderRadius: 18,
          transform: `scale(${0.9 + 0.1 * board})`,
          opacity: board,
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.35)",
        }}
      >
        {CHALK.map((l, i) => {
          const r = ease(f, l.s, l.s + 20);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 40 + i * 118,
                textAlign: "center",
                fontFamily: chalk,
                fontSize: 108,
                color: "rgba(255,255,255,0.93)",
                clipPath: `inset(0 ${(1 - r) * 100}% 0 0)`,
                textShadow: "0 0 6px rgba(255,255,255,0.35)",
              }}
            >
              {l.t}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 500,
            textAlign: "center",
            fontFamily: chalk,
            fontSize: 170,
            color: C.yellow,
            transform: `scale(${jujur}) rotate(${(1 - jujur) * -8}deg)`,
            textShadow: "0 0 10px rgba(255,209,92,0.4)",
          }}
        >
          JUJUR?
        </div>
        <svg style={{ position: "absolute", left: 230, top: 690 }} width={480} height={40} viewBox="0 0 480 40">
          <path
            d="M6 24 C120 6 300 34 474 14"
            stroke={C.yellow}
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={520}
            strokeDashoffset={520 * (1 - underline)}
          />
        </svg>
        {/* doodles */}
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: chalk, fontSize: 70, color: "rgba(255,255,255,0.35)", opacity: ease(f, 40, 55), transform: "rotate(-14deg)" }}>?</div>
        <div style={{ position: "absolute", right: 46, top: 600, fontFamily: chalk, fontSize: 80, color: "rgba(255,255,255,0.3)", opacity: ease(f, 80, 95), transform: "rotate(12deg)" }}>?</div>
        {/* chalk tray */}
        <div style={{ position: "absolute", left: 120, right: 120, bottom: -44, height: 20, background: "#9C6B3E", border: `4px solid ${C.ink}`, borderRadius: 8 }} />
      </div>
      <Chibi
        {...BUDI}
        x={interpolate(budiIn, [0, 1], [1320, 820])}
        y={1570}
        scale={1.4}
        mood="happy"
        armR={waving}
        lift={bob(f, 0.15, 5)}
        tilt={(1 - budiIn) * 10}
      />
      <Bubble x={700} y={1200} side="right" width={480} text="Halo! Aku Budi." start={222} size={48} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── 2. Rumah ───────────────────────── */
export const S2Rumah: React.FC = () => {
  const f = useCurrentFrame();
  const shock = f >= 240;
  const jump = shock ? -pop(f, 240, 7) * 40 + pop(f, 250, 9) * 40 : 0;
  const steam = (i: number) => ((f * 1.6 + i * 30) % 90) / 90;
  return (
    <AbsoluteFill>
      <Paper color="#FFE6C7" dot="rgba(185,131,79,0.12)" />
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, bottom: 0, background: "#DDA878", borderTop: `6px solid ${C.ink}` }} />
      {/* window */}
      <div style={{ position: "absolute", left: 90, top: 620, width: 280, height: 300, background: "#BFE6FF", border: `8px solid ${C.white}`, outline: `5px solid ${C.ink}`, borderRadius: 14 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 8, background: C.white }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 8, background: C.white }} />
        <div style={{ position: "absolute", left: 30, top: 40, width: 70, height: 70, borderRadius: 99, background: C.yellow }} />
      </div>
      {/* frame */}
      <div style={{ position: "absolute", right: 110, top: 660, width: 180, height: 140, background: "#FFF6E8", border: `10px solid ${C.wood}`, outline: `5px solid ${C.ink}`, borderRadius: 6 }}>
        <svg viewBox="0 0 160 120" width="100%" height="100%">
          <path d="M0 110 L50 50 L90 90 L120 60 L160 100 L160 120 L0 120Z" fill={C.green} />
          <circle cx={120} cy={30} r={14} fill={C.coral} />
        </svg>
      </div>
      {/* table + dish */}
      <div style={{ position: "absolute", left: 420, top: 1290, width: 240, height: 22, background: C.wood, border: `5px solid ${C.ink}`, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 450, top: 1310, width: 18, height: 150, background: C.wood, border: `5px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 612, top: 1310, width: 18, height: 150, background: C.wood, border: `5px solid ${C.ink}` }} />
      <svg style={{ position: "absolute", left: 460, top: 1180 }} width={160} height={120} viewBox="0 0 160 120">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${50 + i * 30} 70 c-10 -14 10 -22 0 -36`}
            stroke="rgba(43,42,58,0.35)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={1 - steam(i)}
            transform={`translate(0 ${-steam(i) * 30})`}
          />
        ))}
        <ellipse cx={80} cy={96} rx={72} ry={16} fill={C.white} stroke={C.ink} strokeWidth={5} />
        <path d="M30 92 Q80 50 130 92 Z" fill="#F2A65A" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <Caption text="Di rumah, *pujian basa-basi* hilang." />
      <Chibi
        {...IBU}
        x={290}
        y={1490}
        scale={1.4}
        mood={shock ? "shock" : "happy"}
        armR={shock ? 150 : 62}
        armL={shock ? 150 : 14}
        sweat={shock}
        lift={jump + bob(f, 0.12, 4)}
        blink={isBlinking(f, 80, 10)}
      />
      <Chibi {...BUDI} x={800} y={1490} scale={1.4} flip mood={f >= 240 ? "sad" : "neutral"} armL={14} armR={14} lift={bob(f, 0.12, 4)} blink={isBlinking(f, 92)} />
      <Bubble x={330} y={1060} side="left" width={560} text="Gimana masakan Ibu? Enak, kan?" start={90} end={218} />
      <Bubble x={770} y={1060} side="right" width={500} text="Jujur… keasinan, Bu." start={226} size={50} />
      <Pop x={210} y={960} start={242} rotate={-10}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 110, color: C.coral, WebkitTextStroke: `4px ${C.ink}` }}>!</div>
      </Pop>
    </AbsoluteFill>
  );
};

/* ───────────────────────── 3. Kantor ───────────────────────── */
export const S3Kantor: React.FC = () => {
  const f = useCurrentFrame();
  const sad = f >= 200;
  return (
    <AbsoluteFill>
      <Paper color="#DDE7F2" dot="rgba(43,42,58,0.06)" />
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, bottom: 0, background: "#9AA7BB", borderTop: `6px solid ${C.ink}` }} />
      {/* blinds */}
      <div style={{ position: "absolute", right: 90, top: 620, width: 320, height: 300, background: "#BFE6FF", border: `5px solid ${C.ink}`, borderRadius: 10, overflow: "hidden" }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 34, height: 18, background: "#F4F7FB", borderBottom: "3px solid #C5D0DE" }} />
        ))}
      </div>
      {/* plant */}
      <svg style={{ position: "absolute", left: 920, top: 1260 }} width={120} height={200} viewBox="0 0 120 200">
        <path d="M60 120 C20 90 20 40 40 20 C50 60 60 80 60 120 C64 70 80 40 104 30 C104 70 90 100 60 120Z" fill={C.green} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M30 120 L90 120 L80 190 L40 190Z" fill={C.coral} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <Caption text="Di kantor, *kritik* datang tanpa bungkus." />
      <Chibi {...BOS} x={300} y={1400} scale={1.35} mood="angry" armL={10} armR={f > 90 && f < 200 ? 80 + Math.sin(f * 0.3) * 8 : 20} lift={bob(f, 0.1, 3)} blink={isBlinking(f, 76)} />
      {/* desk in front of boss */}
      <div style={{ position: "absolute", left: 70, top: 1250, width: 470, height: 210, background: "#8B6B52", border: `5px solid ${C.ink}`, borderRadius: 12 }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 40, height: 10, background: "rgba(0,0,0,0.15)", borderRadius: 6 }} />
      </div>
      <svg style={{ position: "absolute", left: 360, top: 1120 }} width={150} height={140} viewBox="0 0 150 140">
        <rect x={6} y={6} width={138} height={92} rx={10} fill="#2F3A55" stroke={C.ink} strokeWidth={5} />
        <rect x={18} y={18} width={114} height={68} rx={4} fill="#7FB7FF" />
        <rect x={64} y={98} width={22} height={28} fill="#C9D3E2" stroke={C.ink} strokeWidth={4} />
        <rect x={40} y={124} width={70} height={12} rx={6} fill="#C9D3E2" stroke={C.ink} strokeWidth={4} />
      </svg>
      <Chibi {...BUDI} x={800} y={1490} scale={1.4} flip mood={sad ? "sad" : "neutral"} sweat={sad} armL={50} armR={14} lift={bob(f, 0.12, 4)} blink={isBlinking(f, 88, 30)}>
        {/* report held in hand */}
        <g transform="translate(18 196) rotate(-12)">
          <rect x={0} y={0} width={52} height={66} rx={4} fill={C.white} stroke={C.ink} strokeWidth={4} />
          <path d="M10 16 L42 16 M10 28 L36 28 M10 40 L40 40" stroke={C.grey} strokeWidth={4} />
          {f > 110 && <path d="M8 10 L44 54 M44 10 L8 54" stroke={C.coral} strokeWidth={5} strokeLinecap="round" />}
        </g>
      </Chibi>
      <Bubble x={340} y={1040} side="left" width={600} text="Laporanmu berantakan. Revisi sebelum Jumat." start={90} end={205} />
      <Bubble x={790} y={1060} side="right" width={360} text="…siap, Pak." start={212} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── 4. Montase ───────────────────────── */
const PANELS = [
  {
    bg: "#FFE0D6",
    label: "Penjual buah",
    text: "Mangganya stok kemarin. Agak busuk, sih.",
    look: { hair: "spiky" as const, hairColor: "#2A1E1A", shirt: C.teal, pants: "#3D4A6B", apron: true },
  },
  {
    bg: "#DCE8FF",
    label: "Calon pejabat",
    text: "Janji ini belum tentu bisa saya tepati.",
    look: { hair: "short" as const, hairColor: "#8A8A8A", shirt: C.white, pants: "#2F3A55", tie: C.blue },
  },
  {
    bg: "#E2F5E8",
    label: "Teman",
    text: "Aku telat karena ketiduran, bukan macet.",
    look: { hair: "spiky" as const, hairColor: "#C46A2E", shirt: C.green, pants: "#3D4A6B" },
  },
];

export const S4Montase: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Paper color="#FFF3E0" />
      <Caption text="Semua orang jadi… *apa adanya*." />
      {PANELS.map((p, i) => {
        const s = [70, 138, 230][i];
        const inP = pop(f, s, 14);
        const dir = i % 2 === 0 ? -1 : 1;
        const t = pop(f, s + 14, 12);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60,
              top: 500 + i * 330,
              width: 960,
              height: 300,
              background: p.bg,
              border: `5px solid ${C.ink}`,
              borderRadius: 36,
              overflow: "hidden",
              boxShadow: `0 10px 0 ${C.ink}`,
              transform: `translateX(${(1 - inP) * dir * 1150}px) rotate(${(1 - inP) * dir * 4}deg)`,
            }}
          >
            <Chibi {...p.look} x={160} y={330} scale={0.92} mood={i === 1 ? "sad" : "neutral"} armR={i === 0 ? 70 : 14} armL={14} lift={bob(f + i * 20, 0.14, 4)} blink={isBlinking(f, 70 + i * 9, i * 13)} />
            <div style={{ position: "absolute", left: 320, top: 34, fontFamily: body, fontWeight: 900, fontSize: 28, letterSpacing: 1, color: C.muted, opacity: t }}>
              {p.label.toUpperCase()}
            </div>
            <div
              style={{
                position: "absolute",
                left: 310,
                right: 34,
                top: 84,
                background: C.white,
                border: `5px solid ${C.ink}`,
                borderRadius: 28,
                padding: "20px 26px",
                fontFamily: body,
                fontWeight: 800,
                fontSize: 40,
                lineHeight: 1.2,
                color: C.ink,
                transform: `scale(${t})`,
                transformOrigin: "0% 50%",
              }}
            >
              “{p.text}”
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────────────────── 5. Fakta ───────────────────────── */
const LIARS = new Set([62, 71, 79, 88, 96]);

export const S5Fakta: React.FC = () => {
  const f = useCurrentFrame();
  const numIn = pop(f, 96, 12);
  const count = ease(f, 100, 165) * 1.65;
  const shrink = ease(f, 184, 206);
  return (
    <AbsoluteFill>
      <Paper />
      <Caption text="Sebenarnya, seberapa sering kita *berbohong*?" size={72} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(shrink, [0, 1], [600, 480]),
          textAlign: "center",
          transform: `scale(${numIn * interpolate(shrink, [0, 1], [1, 0.62])})`,
          transformOrigin: "50% 0%",
        }}
      >
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 300, lineHeight: 1, color: C.coral, WebkitTextStroke: `6px ${C.ink}` }}>
          {count.toFixed(2).replace(".", ",")}
        </div>
        <div style={{ fontFamily: body, fontWeight: 800, fontSize: 52, color: C.ink, marginTop: 18 }}>kebohongan per hari, rata-rata</div>
      </div>
      <Caption text="*60%* orang mengaku tidak bohong sama sekali hari itu." start={200} end={318} y={790} size={46} mark="#9BE3B6" stagger={2} />
      <Caption text="Hampir *separuh* kebohongan datang dari *5%* orang saja." start={326} y={790} size={46} mark="#FFB4AA" stagger={2} />
      {/* 100 people grid */}
      <div style={{ position: "absolute", left: 1080 / 2 - 290, top: 950, width: 580, display: "flex", flexWrap: "wrap", gap: 0 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const p = pop(f, 188 + i * 0.45, 12);
          const honest = i < 60 && f >= 206 + i * 0.6;
          const liar = LIARS.has(i) && f >= 336;
          const faded = i >= 60 && !LIARS.has(i) && f >= 336;
          const col = liar ? C.coral : honest ? C.green : faded ? "#E4DFEA" : C.grey;
          const lp = liar ? pop(f, 336, 6) : 1;
          return (
            <svg key={i} width={58} height={46} viewBox="0 0 58 46" style={{ transform: `scale(${p * (liar ? 0.8 + 0.4 * lp : 1)})` }}>
              <circle cx={29} cy={13} r={10} fill={col} stroke={C.ink} strokeWidth={3} />
              <path d="M13 44 C13 30 45 30 45 44 Z" fill={col} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
            </svg>
          );
        })}
      </div>
      <Source text="Serota, Levine & Boster (2010), Human Communication Research" start={40} />
    </AbsoluteFill>
  );
};

export { Tag };
