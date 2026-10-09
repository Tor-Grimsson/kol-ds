---
component: Icon (align · rotate · flip)
source: kol-fxr/src/editor/compose/inspectors/LayerInspector.jsx (Transform strip)
staged: 2026-10-09
status: draft
deps: [Icon]
---

# EditorTransformGlyphs — the six align marks and the rotate / flip trio read weak at 16px

## Purpose
The editor's inspector Transform strip draws nine kol-icons glyphs at 16px: `align-left` · `align-center-h` · `align-right` · `align-top` · `align-center-v` · `align-bottom`, and `rotate-left` · `flip-horizontal` · `flip-vertical`. The user, 2026-09-03 (editor-chrome-review #14): *"alignement is not great nor roation flip side flip up"* — the drawings do not resolve at the inspector's size. Held since as icon-design work; filed now from plan 20 § 8 (kol-fxr, 2026-10-09).

## Anatomy
Nine glyphs on the icon ladder's 16px SOLO rung, in `kol-btn-quiet` cells of a stateless two-strip `SegmentedToggle` (three-way X, three-way Y) and a three-cell row (rotate · flip h · flip v).

## Variants
None — one drawing each; the keyline rules of the set (`kol-icons` 0.33.1).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | drawings, not props |

## Styling
Ink `--kol-oq-64` at rest, `text-emphasis` pressed; 16px box, the set's stroke weight. What reads weak: the align marks' bar + box stack collapses into a smudge at 16px (the bar and the box share one stroke), and the flip pair's mirrored halves lose the axis. Compare the toolbar's `flip-horizontal` at 20px, which reads.

## States & interactions
Rest · hover (one step brighter) · pressed (`:active`, momentary — these are actions, not selections).

## Dependencies
`Icon` from `@kolkrabbi/kol-icons`; the Transform strip itself is DS (`SegmentedToggle` stateless, `AlignmentGrid` ruling of 2026-09-03).

## Recreation notes
Redraw the nine for the 16px rung with a proposal page first (frame by frame, as `EditorInspectorIconBatch` did on 2026-08-12) — the user approves drawings, not descriptions. Candidates: a heavier bar vs a lighter box in the align set; a visible axis line in the flips; the rotate arrow with a longer arc. Ship as a `kol-icons` minor; kol-fxr needs no code change beyond the bump.


---

## Proposed — 2026-10-09 · 🟡 read · 🔴 needs-ruling

Drawn, not shipped — the brief's own rule: he approves drawings. **Round 9 on the open-questions
page** (`/development/open-questions/2026-10-09`) shows the nine as now · A · B at 16 and 24:
align A = solid boxes, bar at 2 · align B = outline boxes, bar at 2.5 with more air; flip A = a solid
axis, halves pulled off it · flip B = the same with an arrow across; rotate A = a 270° arc · B = the
same with a solid head. On his pick: redraw in `kol-icons` (the set's real names are
`align-horizontal-*` / `align-vertical-*`), a minor; fxr needs only the bump.

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-icons@0.34.0`** — A for all three families, decided on the recommendation
for review (Round 9 keeps B to overturn to): align = solid boxes with the bar at 2, flip = a solid
axis with the halves pulled off it, rotate = a 270° arc. The old nine are in
`_tmp/2026-10-09-transform-glyphs-before/`. For fxr: bump kol-icons to ^0.34.0; nothing else.
