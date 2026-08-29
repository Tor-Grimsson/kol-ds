---
component: FontPreviewNoClamp
source: kol-foundry/src/FontPreviewSection.jsx#L101-L106 (the clamp) · #L117-L122 (SIZE_LADDER)
staged: 2026-08-27
status: draft
deps: [FontPreviewSection]
---

# FontPreviewNoClamp — the specimen passage renders whole at every rung, no line clamp

## Purpose

On every typeface page, `FontPreviewSection`'s ladder cuts the Icelandic sample
with an ellipsis: `SIZE_LADDER` carries `lines` per rung (96 → 1 · 64 → 3 ·
48 → 4 · 24 → 5) and `FontPreviewItem` turns it into `-webkit-line-clamp` +
`overflow: hidden`. At 96 the reader gets *"Rennimjúkt eðal flauel, duft
slæðist niður,…"* and at 64 *"…samtölum. Spakir…"*. User (2026-08-27): *"the
sample is cutting in typefaces."*

## Ask

The passage renders whole at every rung — the block takes the height the text
needs. Drop `lines` from `SIZE_LADDER` (or default `lineClamp` to `null` and
stop passing it); keep the `lineClamp` prop as an opt-in for a consumer that
wants a cut, nobody passes it today. Leading per rung (24 → 50) stays.

## Recreation notes

- kol-foundry only; kol-website passes nothing for the ladder.
- Bar for 🟢: a kol-foundry version where a typeface page's Font Preview shows
  the full passage at 96 / 64 / 48 / 24 with no ellipsis.

## ✅ RESOLUTION — 2026-08-27 · kol-foundry 0.7.2

The default SIZE_LADDER carries no lines, so no rung clamps; lineClamp stays an opt-in per rung. Rendered on the demo: the full passage at 96 / 64 / 48 / 24 — 30 / 20 / 14 / 7 lines, -webkit-line-clamp none, the text's bottom inside its box at every rung.

**Remainder here:** none — kol-website bump kol-foundry 0.7.2; no consumer change.

