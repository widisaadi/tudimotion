# Storytelling

The reference video ("Bagaimana jika di dunia ini semua orangnya menjadi jujur?") follows a fixed arc. Keep the
arc; change the content. It works because each scene answers the question the previous one raised, and the turn in
beat 8 stops the video from preaching.

## The 10-beat arc (one scene each)

| # | beat | job | reference scene |
|---|---|---|---|
| 1 | Hook | the title question, written on a chalkboard; the host character waves in and introduces himself | chalkboard, "Halo! Aku Budi." |
| 2 | Everyday case 1 | the premise in the most familiar place (home) - a short exchange, a reaction | Ibu asks about her cooking; "keasinan" |
| 3 | Everyday case 2 | same premise, higher stakes (work, school) | the boss on the report |
| 4 | Montage | three quick people, three panels, one line each - the premise is everywhere | seller, politician, friend |
| 5 | Fact | the real numbers: one big number that counts up, then a 100-person grid that recolours | 1,65 lies/day; 60%; 5% |
| 6 | Mechanism | why it works the way it does - the brain mascot explains, one simple chart | guilt response shrinking |
| 7 | Impact | what the world would look like - a (labelled fictional) newspaper + three stat chips | scams down, trust up |
| 8 | The turn | the other side: the premise taken too far hurts someone; music goes minor | "Jelek." -> broken heart |
| 9 | Resolution | the rule that reconciles both sides as an equation of cards, then the host does it right | JUJUR + EMPATI = DIPERCAYA |
| 10 | Close | a short quote card from a real person, the question back to the viewer, "write in the comments" | Jefferson quote, CTA |

A topic that is not a "what if" still fits: 1 = the question, 2-4 = where we meet it, 5-6 = the evidence and the
reason, 7 = the consequence, 8 = the catch, 9 = what to do, 10 = quote + question.

## Narration rules

- One string per scene in `audio/voiceover.json`; 15-40 words; 7-15 s spoken. The whole video lands at 80-110 s.
- Spoken, not written: short clauses, commas where the narrator should breathe, a question at least every two
  scenes. Write numbers as words when they must be read a specific way ("satu koma enam lima").
- The first line of a scene says what the caption says (the caption is the scene's headline, max ~8 words).
- Name the characters the viewer sees ("Budi", "Sari", "Ibu"); dialogue in bubbles may differ slightly from the
  narration but must never contradict it.
- No style instructions inside the text ("[cheerful]", "say slowly"): with temperature 0 the TTS reads the text
  verbatim, and the verify step checks exactly that.
- Use the correct spelling of the language ("di dunia", not "didunia") and say in the delivery note if you
  corrected the user's title.

## Characters

Reuse the cast presets (`BUDI`, `IBU`, `BOS`, `SARI` in `src/lib/Chibi.tsx`) or build new people from the same
`Chibi` props (hair: short / long / bun / spiky / bald; shirt colour from the palette; tie, apron, glasses). One
host character carries the whole video; the brain mascot is the "science voice" in the mechanism beat and waves
at the end. 2-4 named characters per video is enough.

## Facts and labels

- Every number on screen has a source line (`<Source>`): author(s), year, venue. Verify each source exists (search)
  before using it; if you cannot verify one, either drop it or tell the user in the delivery note.
- Invented items (a newspaper, a headline, an illustrative chart) carry a stamp: `ILUSTRASI FIKSI` or
  `ILUSTRASI KONSEP`. Never present an invented number as data.
- Quotes: attribute only quotes you verified; otherwise paraphrase without a name.

## Storyboard format (`storyboard.md`)

```
## Scene 5 - Fakta (460 f)
VO: "Sebenarnya, seberapa sering kita berbohong? Rata-rata, …"
Caption: "Sebenarnya, seberapa sering kita *berbohong*?"
Beats:
- phrase 1 "Rata-rata, …"     -> big number pops and counts 0 -> 1,65
- phrase 2 "Tapi enam puluh…" -> number shrinks up, 100-person grid pops, first 60 turn green, label 1
- phrase 3 "Dan hampir…"      -> 5 people turn coral, the rest fade, label 2
Source: Serota, Levine & Boster (2010), Human Communication Research
SFX: knock on the number, swell into the count landing + tine, drip run on the grid, up4 on green, glitch on coral
```
