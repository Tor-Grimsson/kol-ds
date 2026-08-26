---
component: kol-icon-set-v1 (new glyphs)
source: kol-fxr — Figma-model inspector (2026-08-12 pass)
staged: 2026-08-12
status: draft
deps: [icons]
---

# EditorInspectorIconBatch — the Figma-inspector glyphs the set lacks

## Purpose
The editor's rebuilt inspector copies Figma's panel; several controls need glyphs the set doesn't carry. Interim stand-ins are live (named below) — each swaps out the day the real drawing ships.

## The glyphs

| name | drawing | interim stand-in |
|---|---|---|
| `resize-fixed` | Figma's fixed-size glyph (▭ with side ticks) | text label "Fixed" |
| `resize-auto-w` | auto-width — \|→ arrow to edge | text label "Auto W" |
| `resize-auto-h` | auto-height — stacked lines \|=\| | text label "Auto H" |
| `constrain` | constrain-proportions corner arrows (dimensions link) | `maximize` |
| `corner-radius` | ⌜ ⌟ corner brackets (Figma's radius glyph) | `maximize` |
| `opacity` | dotted/checker square (Figma's opacity glyph) | `ptrn-dot` |
| `line-height` | A̅ with vertical arrows | `rows` |
| `letter-spacing` | \|A\| with horizontal ticks | `type` |
| `angle` | ∟ rotation angle | text prefix "R" |
| `mask` | half-moon circle (Use as mask) | absent (feature flagged off) |

## States & interactions
Static glyphs, keyline-conformed to the set's grid like the LabsNavIcons batch.

## Recreation notes
Consumers never mint set icons locally (estate law) — the editor is running the stand-ins listed above via existing set/editor drawings only. On ship the editor bumps and swaps names in one pass.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-icons@0.15.0** (registry-verified). All ten glyphs
minted into existing groups after the user's frame-by-frame approval on the
`docs/visual-reference/inspector-icon-proposals.html` page: layout +5
(`resize-fixed` · `resize-auto-w` · `resize-auto-h` · `constrain` ·
`corner-radius`), tools +3 (`opacity` · `angle` · `mask`), typography +2
(`line-height` · `letter-spacing`). Set idiom throughout: 24 grid, stroke
1.5 round. Inventory regenerated **194 · 27**. Adoption is kol-fxr's: bump
≥0.15.0 and swap the interim stand-ins (text labels, `maximize`, `ptrn-dot`,
`rows`, `type`, the "R" prefix) for the real names in one pass; `mask`
unblocks when the feature flag turns on.
