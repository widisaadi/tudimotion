# Style guide

Everything here already exists as code in `template/src/lib/`. This file explains the rules so new scenes stay
inside them. When in doubt, copy a pattern from the reference scenes (`template/src/scenes/`).

## Canvas and safe zones (1080 x 1920, 30 fps)

| zone | y range | use |
|---|---|---|
| top UI | 0-230 | nothing important (status bar, Reels header) |
| caption | 230-480 | the scene's headline caption (`<Caption>` default y = 250) |
| stage | 480-1460 | characters, props, cards, charts, bubbles |
| source line | ~1488 | `<Source>` (small, above the Reels UI) |
| bottom UI | 1500-1920 | floor colour / background only; Instagram covers it with caption, buttons |
| sides | 0-60, 1020-1080 | keep text out; the right edge carries the like/comment buttons |

Characters stand with their feet on y = 1490 (floor line at 1450) at scale 1.35-1.45, i.e. heads at ~1060-1100.
Two characters face each other at x ~ 300 and x ~ 790 (the right one `flip`ped).

## Palette (closed: `theme.ts` `C`)

ink `#2B2A3A` (all outlines and text) · paper `#FBF4E8` · coral `#FF6B5B` · teal `#22B8A7` · yellow `#FFD15C`
(highlighter, chalk accent) · blue `#4D8BFF` · pink `#FF9BB3` (cheeks) · green `#4FBF7A` · purple `#8E6CEF` ·
muted `#6E6A7C` (labels, sources) · grey `#C9C3D3`.

Scene backgrounds are a pale tint per scene with the faint dot grid (`<Paper color=… />`), e.g. home `#FFE6C7`,
office `#DDE7F2`, facts `#FBF4E8`, brain `#E4EEFF`, sad `#E7E0F0`, resolution `#E3F5EA`, close `#FF7A66`.
Each scene gets its own tint so cuts read even without sound; the sad beat is the only desaturated one.
Floors: a flat band from y = 1450 with a 6 px ink top border, a darker shade of the wall tint.

## Line and shape

- Every object has a 5 px ink outline (`#2B2A3A`), rounded joins. Cards / bubbles / panels: radius 28-40,
  5 px border, a hard drop shadow `0 8-14px 0 ink` (no blur). No gradients except the highlighter swipe; no glow;
  no blur shadows; no photos.
- Shapes are simple geometry: rounded rects, circles, a few bezier paths. Props are drawn inline as SVG.

## Typography

| role | font | weight | size |
|---|---|---|---|
| caption (headline) | Fredoka | 700 | 70-78 (72 when the line is long), line-height 1.16 |
| bubble text | Nunito | 800 | 40-50 (a one-word punchline: Fredoka 700, 70) |
| cards, numbers, mastheads | Fredoka | 700 | 60-90; big data number 300 with 6 px ink stroke |
| labels, chips | Nunito / Fredoka | 800-900 / 700 | 26-40 |
| chalkboard | Patrick Hand | 400 | 108 (key word 170, yellow) |
| source line | Nunito | 700 | 27, muted, on a white pill |

Captions: centred, max ~8 words, 1-2 lines. Mark 1-2 key words with `*asterisks*` -> yellow highlighter swipe
(pink `#FFB4C6` / coral `#FFB4AA` / green `#9BE3B6` for emotional or data emphasis; ink on the coral close scene).

## Characters (`Chibi`)

Bean-shaped chibi: big round head (r 70 on a 200x300 box), small body, stubby limbs, ink outline, pink cheeks,
dot eyes with a white glint, **no mouth**. Emotion comes from:

| mood | eyes / brows | add |
|---|---|---|
| neutral | dot eyes | blink every ~3 s (`isBlinking`) |
| happy | ^ ^ arcs | arms up, small hop (`lift`) |
| sad | dots + inner brows up | `tears`, arms down, `sweat` for embarrassment |
| shock | big white eyes | jump (pop up then down), "!" pop, `sweat` |
| angry | inner brows down | pointing arm |

Always alive: `lift={bob(f, 0.12, 4)}` (breathing) and `blink={isBlinking(f, period, offset)}` with different
periods per character so they never blink in sync. Arms are angles (0 down, 90 sideways, 150 up); wave =
`135 + sin(f*0.45)*22`.

The brain mascot (`Brain`) is pink, bespectacled, with stick legs; it bobs (amp 8), waves, and can look worried.

## Motion grammar (`anim.ts`)

- **Entrances** are springs: `pop(f, start, damping)` with stiffness 170, mass 0.7; damping 10-12 for UI (one small
  overshoot), 8-9 for punchy stamps and the key word, 13-15 for big objects (boards, cards, newspaper).
- **Caption words** pop one by one, 3 frames apart (2 for long data labels): translateY 40 -> 0, scale 0.6 -> 1.
  The highlighter swipes in 6-18 frames after its word.
- **Bubbles** scale from the tail tip (transform-origin at the tail), damping 10; exit with an 8-frame ease.
- **Stamps / tags** drop from scale 2.2 -> 1 with a 4-9 degree tilt.
- **Panels / cards** slide in from alternating sides with a 4 degree rotation that settles to 0.
- **Counters** count with `ease()` (bezier 0.22, 1, 0.36, 1) over ~2 s, decimal comma for Indonesian.
- **Grids / runs** stagger 0.45-0.6 frames per item.
- **Hand-written text** reveals left-to-right with `clipPath: inset(0 X% 0 0)` over 20 frames per line; underlines
  draw with `strokeDashoffset`.
- **Idle**: something always moves (bob, blink, a rotating sunburst, steam) - no frozen frames longer than ~1 s.
- **Transitions** (12 frames, `@remotion/transitions`): slide / wipe / fade, varied, never the same twice in a
  row; fades for tonal shifts (into facts, into the turn).

## Adapting to a new reference

Keep: outline + flat colour, chibi proportions without mouths, caption + bubble system, springs, safe zones, the
audio pipeline. May change per brief: palette tints of backgrounds (not the ink), the host's look, props,
fonts only if the user's brand demands it (then change `fonts.ts` once, globally).
