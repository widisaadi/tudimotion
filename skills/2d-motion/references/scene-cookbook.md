# Scene cookbook

How to write a scene in this style. The reference scenes in `template/src/scenes/ScenesA.tsx` (1-5) and
`ScenesB.tsx` (6-10) are the canonical examples of each pattern below; open the matching one before writing yours.

## File wiring

- `src/timing.json`: `scenes` = frame length per scene, `transition` = 12, `voStart` = 6 (the VO of a scene starts at
  its frame 6). `npm run beats -- --apply` sets the lengths from the voiceover.
- `src/Video.tsx`: `COMPONENTS` lists the scene components in order (one per `timing.scenes` entry) and
  `PRESENTS` the 9 transitions. Add / remove scenes in both places.
- `src/beats.json` (generated): `scenes[i].phrases[k] = {start, end}` frames inside scene i+1.
- Inside a scene, `const f = useCurrentFrame();` is the frame inside that scene (0 = scene start).

## Timing beats to the voice

```tsx
import { beat } from "../lib/anim";
// scene 2, phrase 1 ("Saat Ibu bertanya…") starts the bubble 4 frames before the words
<Bubble x={330} y={1060} side="left" text="Gimana masakan Ibu? Enak, kan?" start={beat(2, 1, -4)} end={beat(2, 3, -8)} />
// the punchline lands exactly on its phrase
<Bubble x={770} y={1060} side="right" text="Jujur… keasinan, Bu." start={beat(2, 3)} />
const shock = f >= beat(2, 3, 14);
```

Rules: a bubble / card / chart that illustrates a phrase starts 0-6 frames before that phrase; the reaction (shock,
sad, happy) lands 8-16 frames after the punchline starts; nothing new appears in the last 15 frames of a scene
(the transition eats 12). The scene caption appears at frame 0 (it is the headline; the narrator says it first).
A second caption may replace it on a later phrase (`end` on the first, `start` on the second) - used for the
sad turn and the "lama-lama" line.

## Layout patterns

**Two-person dialogue** (scenes 2, 3, 8): caption top; wall tint + floor band; one prop between them (table + dish,
desk + monitor); speaker A at x 290-330, B at x 760-800 (`flip`); bubbles above heads, tails at y ~1040-1060,
`side="left"` for A, `"right"` for B, width 480-600. Bubbles never overlap each other: end A's before B's starts,
or put them at different heights.

**Chalkboard hook** (scene 1): board 960 x 760 at (60, 250), wood border 24, lines of chalk text revealed one by
one, key word bigger in yellow with a drawn underline; host enters from the right with a spring and a tilt, waves,
says hello in a bubble below the board.

**Three-panel montage** (scene 4): 3 rounded panels 960 x 300 at y 500 / 830 / 1160, each a different pale tint,
sliding in from alternating sides; inside: chibi at scale 0.92 on the left, an uppercase label and a quote box on
the right.

**Big number + people grid** (scene 5): number Fredoka 300 coral with 6 px ink stroke counting up, label under it;
then the number shrinks up (scale 0.62) to make room; 10 x 10 people icons (58 x 46 each) pop in a wave; recolour
subsets for each statistic; one caption-sized label above the grid per statistic, swapping.

**Mascot + chart card** (scene 6): mascot at upper left with a bubble to the right; a white chart card 920 x 420
slides up from below at y 1030; bars grow one by one; a `Tag` "ILUSTRASI KONSEP" on the card corner.

**Newspaper** (scene 7): sunburst background slowly rotating; a newspaper card spins in (-540 deg -> -2.5 deg,
damping 15) with masthead, red BREAKING NEWS label, headline, a mini chart and grey text lines; a red
"ILUSTRASI FIKSI" stamp; three pill chips pop in a row below on their phrases.

**The turn** (scene 8): background desaturates over 2 s; the friend asks, the host answers with a one-word bold
bubble; the friend turns sad with tears; a heart pops above her and cracks in two halves that fall apart.

**Equation cards** (scene 9): `JUJUR + EMPATI` on one row, `= DIPERCAYA` (bigger) on the next, each card a
coloured rounded rect with ink border and hard shadow, popped on its words; the host demonstrates the right way in a
bubble, the friend hops happily with floating hearts.

**Quote + CTA** (scene 10): coral background; white quote card tilted -2 deg with a big yellow quote mark; the
question as a white caption with ink highlight; a yellow pill "Tulis jawabanmu di komentar ->" with a bouncing
arrow; host and mascot small at the bottom, waving.

## Components (all in `src/lib/`)

| component | key props |
|---|---|
| `Chibi` | `x, y` (feet), `scale`, `flip`, `mood`, `armL/armR` (deg), `lift`, `tilt`, `blink`, `sweat`, `tears` (0-1 loop), `tie`, `apron`, `glasses`, look presets `BUDI IBU BOS SARI`; `children` = SVG props in its 200x300 space (a report in hand) |
| `Brain` | `x, y` (centre), `scale`, `wave`, `lift`, `blink`, `worried` |
| `Caption` | `text` (`*mark*` words), `start`, `end`, `y`, `size`, `color`, `mark`, `stagger` |
| `Bubble` | `x, y` (tail tip), `text`, `start`, `end`, `width`, `side`, `size`, `bold` |
| `Source` | `text`, `start` |
| `Tag` | `text, x, y, start, color, rotate, size` (stamp) |
| `Paper` | `color`, `dot` (background with dot grid) |
| `Pop` | `x, y` (centre), `start`, `rotate`, `damping` (wraps any element) |
| `anim.ts` | `pop`, `ease`, `bob`, `isBlinking`, `beat` |

New props (a phone, a trophy, a cloud) are inline SVG with the same 5 px ink outline and palette fills. Add a new
component to `src/lib/` only if two scenes need it.

## Checklist while writing a scene

- [ ] caption at frame 0, <= 8 words, 1-2 marked words
- [ ] every beat on `beat(...)`, reactions 8-16 f after the punchline
- [ ] characters bob and blink with different periods; no frozen element for > 1 s
- [ ] no text in the top 230 / bottom 420 px; nothing overlapping a bubble or caption
- [ ] source line on any fact; stamp on any fiction / concept
- [ ] the matching SFX cues written in `audio/sfx-cues.json` with the same frames
