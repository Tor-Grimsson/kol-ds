# `CanvasRuler` — a graduated ruler, not a labelled band

**Staged:** 2026-10-13 · from a kol-fxr session (plan 31 § 3, the user walking the editor's rulers against Affinity)
**Change:** `organisms/Canvas.jsx` — `CanvasRuler`, `niceStep`, `ticksFor` (public since `rulers-and-guides-are-private`); kol-component 0.255.0

---

## The problem, in two screenshots

Affinity's ruler has no band of its own — ticks and numbers sit on the pasteboard's tone with one
hairline at the inner edge; **three tick ranks** (every 10 short, every 50 mid, every 100 full with a
number) at a step that keeps the numbers ~100 screen px apart; numbers in a small sans beside the
major tick, the vertical ruler's rotated to read bottom-to-top; `px` in the corner square; a
hairline on each ruler follows the pointer.

`CanvasRuler` today: an 18px bar filled `fg-08` — a band *lighter* than the pasteboard, the corner
square the same — with **one rank**: 5px ticks at `niceStep(pxPer, 80)` and nothing between, so at
100% it reads 0 · 200 · 400 with 200px of blank bar between; mono 9 labels at `fg-64`; no unit; no
pointer line. A labelled axis wearing a strip of chrome. The 18px thickness matches Affinity's and is
not the problem.

## Ask

- Bar `transparent` (the pasteboard shows through); keep the inner-edge hairline (`oq-16`); the
  corner square the same, with the unit **`px`** in it.
- **Three ranks** — major = `niceStep` as now; medium = major / 2; minor = major / 10 — drawn from the
  inner edge at 18 · 9 · 4 px, `fg-48` for the major and `fg-24` for the other two.
- Labels **sans 10** at `fg-64` beside the major tick (where they are now, sans instead of mono); the
  vertical ruler's rotated −90°, reading bottom-to-top.
- A **1px `fg-64` pointer line** on each ruler, from the stage's own `pointermove` (the `Canvas`
  organism already tracks the pointer for the zoom anchor) — no prop from the consumer.
- Guides still drag off both rulers; `niceStep` / `ticksFor` keep their exports.

## Verify

Showcase canvas at 100%: the top ruler reads 0 · 100 · 200 … with nine minors between each pair, the
pasteboard's tone under the ticks; the pointer's line on both rulers moves with the mouse; at 25%
and 400% the step picks itself; the corner says `px`; a guide drags off each ruler.

For fxr on the return: bump only.

## ✅ RESOLUTION — 2026-10-13 · kol-component@0.256.0

`CanvasRuler` graduated: transparent bar with the oq-16 inner hairline; three ranks counted by index (major at niceStep, medium /2, minor /10) at 18 · 9 · 4 px, fg-48 / fg-24; sans 10 labels beside the major tick, the vertical's rotated -90°; `px` in the corner square; a 1px fg-64 pointer line on each ruler from the container's own pointermove, written to the lines directly (no re-render). Guide drag and the niceStep / ticksFor exports unchanged. Verified on the showcase (`/components/canvas`): labels 0 · 250 · 500 … at the fit zoom, tick lengths 4 4 4 4 9 4 4 4 4 18, no band rect, pointer line visible and tracking, corner reads px.

**Remainder here:** none — kol-fxr bump kol-component@0.256.0.

