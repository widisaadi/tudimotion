import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import timing from "./timing.json";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { S1Hook, S2Rumah, S3Kantor, S4Montase, S5Fakta } from "./scenes/ScenesA";
import { S6Otak, S7Berita, S8SisiLain, S9Solusi, S10Penutup } from "./scenes/ScenesB";

/** Scene lengths in frames (30 fps). Tweak here to change the pacing. */
const COMPONENTS = [S1Hook, S2Rumah, S3Kantor, S4Montase, S5Fakta, S6Otak, S7Berita, S8SisiLain, S9Solusi, S10Penutup];
/** Scene lengths live in src/timing.json (shared with tools/audio.py so sound and picture stay in sync). */
export const SCENES = COMPONENTS.map((C, i) => ({ C, d: timing.scenes[i] }));

const T = timing.transition;
const PRESENTS = [
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-top-left" }),
  fade(),
  slide({ direction: "from-left" }),
  wipe({ direction: "from-bottom" }),
];

export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

export const Video: React.FC = () => (
  <AbsoluteFill>
  <Audio src={staticFile("audio/soundtrack.wav")} />
  <TransitionSeries>
    {SCENES.map(({ C, d }, i) => (
      <React.Fragment key={i}>
        <TransitionSeries.Sequence durationInFrames={d}>
          <C />
        </TransitionSeries.Sequence>
        {i < SCENES.length - 1 && (
          <TransitionSeries.Transition presentation={PRESENTS[i] as never} timing={linearTiming({ durationInFrames: T })} />
        )}
      </React.Fragment>
    ))}
  </TransitionSeries>
  </AbsoluteFill>
);
