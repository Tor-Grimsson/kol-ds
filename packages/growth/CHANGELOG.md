# @kolkrabbi/kol-growth

## 0.4.0 — 2026-10-31

- **The line cools instead of freezing** (GrowthLineIntro, kol-fxr plan 45). With `settle` > 0 every node carries a heat 1 → 0 that fades by 1/settle a step; its motion, a split beside it, `poke`, or a warm neighbour pressing a fifth into its gap (less 0.15 a hop) raise it. Force and growth scale with heat, the last quarter tapers, the step is halved (it overshot every step), so nothing stops mid-move — 0.3.0's step-count freeze left a rubber-string rim and a hard stop. New fields: `heat`, `hot` (nodes still warm), `full`, `id` (stable node ids).
- **Front growth** — while settling, each open-front edge splits with chance `growth`/100 a step, so the rim advances at a steady pace; splits end at the cap or when the front leaves the frame. `growth` now means a percentage for settling sims (fxr's home uses 2.5); `settle` 0 is unchanged.
- **Soft pointer** — settling, a hover reaches 0.24 of the short side with a bell falloff `(1 − d²/r²)²`, capped under a third of `minGap` a frame.
- **`draw({ wave })`** — `{ a, k, p }` displaces the drawn line by two crossed sines; the sim is untouched.
- `orbCanvas(aspect, W)` · `pathCanvas(d, aspect, fit, W)` take an optional width (default 400). kol-fxr's `engine.js`, carried verbatim.

## 0.3.0 — 2026-10-30

- **`settle` — the line rests** (kol-fxr plan 44 6.1 — user: *"it doesnt need to be so active when nothing is happening, its just the mouse interaction and the growth edges that are subject to constant change"*). 0.2.0 still jittered: a packed line never comes to rest (strands two nodes apart push along it), and growth split edges anywhere, so every split shoved the whole line. With `settle` > 0 a node with packed neighbours (14+ strands within 1.5 gaps) freezes after `settle` steps, growth splits only the front, and `poke` re-heats what it touches. Measured on a 1440×900 orb: 98% of the line moving every step → 8–13% while growing, 3% when grown, ~10× cheaper a step. Default 0 = 0.2.0's behaviour.
- **`step(zone)` retired** — `settle` does its job everywhere, not only around the pointer. kol-fxr's `engine.js`, carried verbatim.

## 0.2.0 — 2026-10-30

- **`bleed` and `step(zone)`** (SignedOutStageStill, kol-fxr — a finished line jittered at the edges). `bleed` (default 0, today's framed clamp) lets nodes run that many units past every edge; a node outside the frame is frozen — no force, split or merge — and the spatial hash spans the bled frame. `step(zone)` with `{ x, y, r }` freezes every node outside the zone the same way. kol-fxr's fixed `engine.js`, carried verbatim; framed consumers are unchanged.

## 0.1.0 — 2026-10-30

- **First release — the engine tier's fourth package** (ARCHITECTURE §3, GrowthLineStage from kol-atlas). kol-fxr's
  growing line moved in so fxr and every other app grow the same line from one engine.
- `Growth` · `densityFrom` · `SIM_W` — kol-fxr `src/loops/growth/engine.js`, carried verbatim.
- `mulberry32` — kol-fxr `src/loops/gl/rng.js`, verbatim.
- `orbCanvas` (fxr's `sourceCanvas('orb')`, verbatim) and `pathCanvas` (new: any SVG path `d` as a density source).
- `src/selftest.mjs` — grows to the cap, a seed repeats, `poke` moves the line.
