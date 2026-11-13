import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { bob, ease, isBlinking, pop } from "../lib/anim";
import { Brain } from "../lib/Brain";
import { BUDI, Chibi, SARI } from "../lib/Chibi";
import { body, display } from "../lib/fonts";
import { C } from "../lib/theme";
import { Bubble, Caption, Paper, Pop, Source, Tag } from "../lib/ui";

/* ───────────────────────── 6. Otak ───────────────────────── */
const BARS = [300, 228, 168, 118, 80];

export const S6Otak: React.FC = () => {
  const f = useCurrentFrame();
  const inB = pop(f, 8, 11);
  const card = pop(f, 128, 14);
  return (
    <AbsoluteFill>
      <Paper color="#E4EEFF" dot="rgba(77,139,255,0.12)" />
      <Caption text="Masalahnya, bohong kecil itu *menumpuk*." end={180} />
      <Caption text="Lama-lama, bohong terasa *biasa*." start={190} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${inB})`, transformOrigin: "270px 840px" }}>
        <Brain x={270} y={840} scale={1.45} lift={bob(f, 0.12, 8)} blink={isBlinking(f, 70)} wave={f < 60 ? Math.sin(f * 0.4) * 25 + 25 : 0} worried={f > 188} />
      </div>
      <Bubble x={420} y={740} side="left" width={590} size={40} text="Tiap kali bohong, alarm rasa bersalah di otak makin pelan." start={86} />
      {/* chart card */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1030,
          width: 920,
          height: 420,
          background: C.white,
          border: `5px solid ${C.ink}`,
          borderRadius: 32,
          boxShadow: `0 10px 0 ${C.ink}`,
          transform: `translateY(${(1 - card) * 500}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>Respons rasa bersalah</div>
        <div style={{ position: "absolute", left: 60, right: 40, bottom: 70, height: 4, background: C.ink, borderRadius: 2 }} />
        {BARS.map((h, i) => {
          const g = ease(f, 140 + i * 16, 165 + i * 16);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  bottom: 74,
                  left: 90 + i * 168,
                  width: 110,
                  height: h * 0.9 * g,
                  background: interpolateColors(i, [0, 4], [C.coral, "#FFC9C1"]),
                  border: g > 0 ? `5px solid ${C.ink}` : "none",
                  borderBottom: "none",
                  borderRadius: "18px 18px 0 0",
                }}
              />
              <div style={{ position: "absolute", bottom: 22, left: 70 + i * 168, width: 150, textAlign: "center", fontFamily: body, fontWeight: 800, fontSize: 26, color: C.muted, whiteSpace: "nowrap" }}>
                bohong {i + 1}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <Tag text="ILUSTRASI KONSEP" x={830} y={1048} start={170} color={C.blue} rotate={4} size={28} />
      <Source text="Garrett dkk. (2016), Nature Neuroscience" start={175} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── 7. Berita ───────────────────────── */
export const S7Berita: React.FC = () => {
  const f = useCurrentFrame();
  const paper = pop(f, 4, 15);
  const rays = f * 0.25;
  const chips = [
    { t: "Penipuan ↓", c: C.coral, s: 72 },
    { t: "Hoaks ↓", c: C.coral, s: 106 },
    { t: "Kepercayaan ↑", c: C.green, s: 150 },
  ];
  return (
    <AbsoluteFill style={{ background: "#F3E9D8", overflow: "hidden" }}>
      <svg style={{ position: "absolute", left: -460, top: -140, transform: `rotate(${rays}deg)` }} width={2000} height={2000} viewBox="-1000 -1000 2000 2000">
        {Array.from({ length: 18 }).map((_, i) => (
          <path key={i} d="M0 0 L-90 -1000 L90 -1000 Z" fill="rgba(255,209,92,0.25)" transform={`rotate(${i * 20})`} />
        ))}
      </svg>
      <Caption text="Lalu, berita apa yang muncul?" end={138} />
      <Caption text="Dunia jujur = dunia yang *saling percaya*." start={150} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 480,
          width: 860,
          height: 690,
          background: "#FFFDF6",
          border: `5px solid ${C.ink}`,
          borderRadius: 14,
          boxShadow: `0 14px 0 ${C.ink}`,
          transform: `scale(${paper}) rotate(${interpolate(paper, [0, 1], [-540, -2.5])}deg)`,
          padding: 36,
        }}
      >
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 76, textAlign: "center", color: C.ink, letterSpacing: 2 }}>HARIAN JUJUR</div>
        <div style={{ borderTop: `4px solid ${C.ink}`, borderBottom: `2px solid ${C.ink}`, margin: "10px 0 20px", padding: "6px 0", textAlign: "center", fontFamily: body, fontWeight: 800, fontSize: 24, color: C.muted }}>
          EDISI KHUSUS · DUNIA TANPA BOHONG
        </div>
        <div style={{ display: "inline-block", background: C.coral, color: C.white, fontFamily: display, fontWeight: 700, fontSize: 32, padding: "6px 18px", borderRadius: 8, letterSpacing: 2 }}>
          BREAKING NEWS
        </div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 60, lineHeight: 1.08, color: C.ink, marginTop: 14 }}>Penipuan Online Anjlok, Hoaks Nyaris Hilang</div>
        <div style={{ display: "flex", gap: 24, marginTop: 26 }}>
          <div style={{ width: 300, height: 190, background: "#DCE8FF", border: `4px solid ${C.ink}`, borderRadius: 10, position: "relative", overflow: "hidden" }}>
            <svg viewBox="0 0 300 190" width="100%" height="100%">
              <path d="M20 170 L80 120 L130 140 L190 80 L240 96 L285 30" stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M262 26 L288 26 L288 52" stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 6 }}>
            {[100, 92, 96, 70, 88, 60].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 14, borderRadius: 7, background: "#D8D2C6" }} />
            ))}
          </div>
        </div>
      </div>
      <Tag text="ILUSTRASI FIKSI" x={800} y={500} start={40} rotate={9} size={34} />
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {chips.map((c) => {
          const p = pop(f, c.s, 9);
          return (
            <div
              key={c.t}
              style={{
                transform: `scale(${p})`,
                background: C.white,
                border: `5px solid ${C.ink}`,
                borderRadius: 999,
                padding: "12px 28px",
                fontFamily: display,
                fontWeight: 700,
                fontSize: 40,
                color: c.c,
                boxShadow: `0 6px 0 ${C.ink}`,
              }}
            >
              {c.t}
            </div>
          );
        })}
      </div>
      <Source text="Zak & Knack (2001), The Economic Journal — kepercayaan & pertumbuhan ekonomi" start={160} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── 8. Sisi lain ───────────────────────── */
const HEART_L = "M50 88 C20 66 4 50 4 30 C4 14 16 4 30 4 C40 4 47 10 50 18 L44 34 L54 48 L46 62 Z";
const HEART_R = "M50 18 C53 10 60 4 70 4 C84 4 96 14 96 30 C96 50 80 66 50 88 L46 62 L54 48 L44 34 Z";

export const S8SisiLain: React.FC = () => {
  const f = useCurrentFrame();
  const bg = interpolateColors(f, [0, 70], [C.paper, "#E7E0F0"]);
  const sad = f >= 216;
  const heart = pop(f, 216, 9);
  const crack = ease(f, 236, 268);
  const tears = sad ? ((f - 222) % 40) / 40 : 0;
  return (
    <AbsoluteFill>
      <Paper color={bg} />
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, bottom: 0, background: "#CFC4DE", borderTop: `6px solid ${C.ink}` }} />
      <Caption text="Tapi, ada *sisi lainnya*…" end={228} />
      <Caption text="Jujur tanpa empati bisa *melukai*." start={240} mark="#FFB4C6" />
      <Chibi {...SARI} x={300} y={1490} scale={1.4} mood={sad ? "sad" : "happy"} tears={tears} armL={sad ? 10 : 150} armR={14} lift={bob(f, 0.12, 4)} blink={isBlinking(f, 80)} />
      <Chibi {...BUDI} x={790} y={1490} scale={1.4} flip mood="neutral" armL={14} armR={14} lift={bob(f, 0.11, 4)} blink={isBlinking(f, 94, 20)} />
      <Bubble x={330} y={1060} side="left" width={540} text="Gimana potongan rambut baruku?" start={86} end={198} />
      <Bubble x={770} y={1060} side="right" width={300} text="Jelek." start={208} size={72} bold />
      {f >= 216 && (
        <svg
          style={{ position: "absolute", left: 300 - 70, top: 860, overflow: "visible", transform: `scale(${heart})` }}
          width={140}
          height={126}
          viewBox="0 0 100 90"
        >
          <path d={HEART_L} fill={C.coral} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" transform={`translate(${-crack * 22} ${crack * 40}) rotate(${-crack * 22} 50 88)`} opacity={1 - crack * 0.4} />
          <path d={HEART_R} fill={C.coral} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" transform={`translate(${crack * 22} ${crack * 40}) rotate(${crack * 22} 50 88)`} opacity={1 - crack * 0.4} />
        </svg>
      )}
      <Source text="Levine & Schweitzer (2015) — niat baik ikut menentukan rasa percaya" start={245} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── 9. Solusi ───────────────────────── */
const Card: React.FC<{ text: string; color: string; size?: number }> = ({ text, color, size = 66 }) => (
  <div
    style={{
      background: color,
      color: C.white,
      fontFamily: display,
      fontWeight: 700,
      fontSize: size,
      padding: "14px 38px",
      border: `5px solid ${C.ink}`,
      borderRadius: 28,
      boxShadow: `0 10px 0 ${C.ink}`,
      WebkitTextStroke: `2px ${C.ink}`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const Op: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 90, color: C.ink, lineHeight: 1 }}>{t}</div>
);

export const S9Solusi: React.FC = () => {
  const f = useCurrentFrame();
  const happy = f >= 128;
  return (
    <AbsoluteFill>
      <Paper color="#E3F5EA" dot="rgba(79,191,122,0.14)" />
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, bottom: 0, background: "#B9E2C7", borderTop: `6px solid ${C.ink}` }} />
      <Caption text="Kuncinya: bukan cuma *apa*, tapi *bagaimana*." />
      <Pop x={300} y={560} start={170} rotate={-3}>
        <Card text="JUJUR" color={C.blue} />
      </Pop>
      <Pop x={520} y={560} start={184}>
        <Op t="+" />
      </Pop>
      <Pop x={760} y={560} start={198} rotate={3}>
        <Card text="EMPATI" color={C.pink} />
      </Pop>
      <Pop x={250} y={730} start={228}>
        <Op t="=" />
      </Pop>
      <Pop x={590} y={730} start={240} rotate={-2} damping={8}>
        <Card text="DIPERCAYA" color={C.green} size={78} />
      </Pop>
      <Chibi {...SARI} x={290} y={1490} scale={1.35} mood={happy ? "happy" : "neutral"} armL={happy ? 150 : 14} armR={happy ? 150 : 14} lift={(happy ? -Math.abs(Math.sin((f - 128) * 0.25)) * 26 : 0) + bob(f, 0.12, 3)} blink={isBlinking(f, 82)} />
      <Chibi {...BUDI} x={790} y={1490} scale={1.35} flip mood="happy" armL={40} armR={14} lift={bob(f, 0.12, 4)} />
      <Bubble x={760} y={1090} side="right" width={520} size={40} text="Menurutku gaya yang kemarin lebih cocok buatmu. Tapi ini juga berani!" start={60} />
      {happy &&
        [0, 1, 2].map((i) => {
          const t = ((f - 128 - i * 14) % 60) / 60;
          if (f - 128 - i * 14 < 0) return null;
          return (
            <svg key={i} style={{ position: "absolute", left: 120 + i * 50, top: 1040 - t * 180, opacity: 1 - t }} width={50} height={46} viewBox="0 0 100 90">
              <path d="M50 88 C20 66 4 50 4 30 C4 14 16 4 30 4 C40 4 47 10 50 18 C53 10 60 4 70 4 C84 4 96 14 96 30 C96 50 80 66 50 88 Z" fill={C.coral} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
            </svg>
          );
        })}
    </AbsoluteFill>
  );
};

/* ───────────────────────── 10. Penutup ───────────────────────── */
export const S10Penutup: React.FC = () => {
  const f = useCurrentFrame();
  const card = pop(f, 8, 13);
  const arrow = Math.sin(f * 0.3) * 12;
  const pill = pop(f, 255, 10);
  return (
    <AbsoluteFill>
      <Paper color="#FF7A66" dot="rgba(255,255,255,0.14)" />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 330,
          width: 900,
          background: C.white,
          border: `5px solid ${C.ink}`,
          borderRadius: 36,
          boxShadow: `0 14px 0 ${C.ink}`,
          padding: "70px 64px 52px",
          transform: `scale(${card}) rotate(${interpolate(card, [0, 1], [8, -2])}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 40, top: -70, fontFamily: display, fontWeight: 700, fontSize: 220, lineHeight: 1, color: C.yellow, WebkitTextStroke: `5px ${C.ink}` }}>“</div>
        <div style={{ fontFamily: display, fontWeight: 600, fontSize: 64, lineHeight: 1.15, color: C.ink }}>Kejujuran adalah bab pertama dalam buku kebijaksanaan.</div>
        <div style={{ fontFamily: body, fontWeight: 800, fontSize: 38, color: C.muted, marginTop: 28, opacity: ease(f, 40, 55) }}>— Thomas Jefferson</div>
      </div>
      <Caption text="Kamu siap hidup di dunia yang *100% jujur*?" start={148} y={920} size={70} color={C.white} mark={C.ink} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1130,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${pill})`,
        }}
      >
        <div style={{ background: C.yellow, border: `5px solid ${C.ink}`, borderRadius: 999, padding: "16px 40px", fontFamily: display, fontWeight: 700, fontSize: 46, color: C.ink, boxShadow: `0 8px 0 ${C.ink}`, display: "flex", alignItems: "center", gap: 18 }}>
          Tulis jawabanmu di komentar
          <span style={{ display: "inline-block", transform: `translateX(${arrow}px)` }}>→</span>
        </div>
      </div>
      <Chibi {...BUDI} x={220} y={1500} scale={0.95} mood="happy" armR={135 + Math.sin(f * 0.45) * 22} lift={bob(f, 0.15, 4)} opacity={ease(f, 150, 165)} />
      <Brain x={860} y={1390} scale={0.9} wave={Math.sin(f * 0.45) * 25 + 25} lift={bob(f, 0.13, 6)} blink={isBlinking(f, 66)} />
    </AbsoluteFill>
  );
};
