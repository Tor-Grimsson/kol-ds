---
component: FontPreviewClampAndBearings
source: kol-foundry/src/FontPreviewSection.jsx#L83 (wrapper overflow-hidden) · #L101-L106 (clamp) · #L117-L122 (SIZE_LADDER)
staged: 2026-08-27
status: draft
deps: [FontPreviewSection]
---

# FontPreviewClampAndBearings — put the per-rung line clamp BACK, and stop clipping the glyphs' side bearings

## Purpose

`FontPreviewNoClamp` (0.7.2) was filed on a misreading — mine, not the user's.
*"The sample is cutting"* meant the **glyphs are clipped at the box edges**:
the italic `s`, `ð`, `f` overhangs are sliced off on the left and right (see
`_assets/2026-08-27-font-preview-bearings/clip.png` — the `s` in
*silkislaufa*, *sjálfsögðum*, *seyði*). The line clamp with its ellipsis was
**correct** and is what production shows (96 → 1 line, 64 → 3, 48 → 4, 24 → 5).
0.7.2 now renders the whole passage at every rung — 30 lines at 96 — which is
wrong.

## Ask

1. **Restore the ladder's `lines`** — `SIZE_LADDER` back to `96/1 · 64/3 · 48/4
   · 24/5 (leading 50)`, `-webkit-line-clamp` + ellipsis as before 0.7.2.
2. **Side bearings survive the clip.** Both the wrapper (`overflow-hidden`,
   L83) and the clamped element (`overflow: hidden`, needed by
   `-webkit-line-clamp`) cut the horizontal overhang of italic and swash
   glyphs. Give the text box horizontal room the overhang can live in without
   moving the text: `padding-inline: 0.15em; margin-inline: -0.15em` on the
   clamped element (em so it scales with the rung), and the wrapper clips only
   vertically (`overflow-y: hidden; overflow-x: visible` — or drop its
   `overflow-hidden` entirely; the clamp already clips the element).

## Recreation notes

- kol-foundry only; no consumer change.
- Bar for 🟢: a typeface page's Font Preview shows 1 / 3 / 4 / 5 lines with
  the ellipsis at 96 / 64 / 48 / 24, and the first `s` of a line in TG
  Málrómur Thin Italic renders its full left bearing at every rung.

## ✅ RESOLUTION — 2026-08-27 · kol-foundry 0.7.3

The ladder's clamp is back — 96/1 · 64/3 · 48/4 · 24/5 with the ellipsis (0.7.2 was my misread). Side bearings: the clamped element carries padding-inline 0.15em / margin-inline -0.15em (14.4px at 96, scaling down the rungs) and the wrapper no longer clips. Rendered: 1 / 3 / 4 / 5 lines, -webkit-line-clamp 1 / 3 / 4 / 5, wrapper overflow visible.

**Remainder here:** none — kol-website bump kol-foundry 0.7.3; no consumer change.

