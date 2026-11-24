# Plan — Line form rebuilt on its own page, to the recipe

**Raised:** 2026-11-23, the user. Points verbatim: "make a new page and make the line part again there. like the document explains".
**Status:** W1 built 2026-11-23, page `593:10`, every acceptance line met. Open: his look; caps use `Line/horizontal` at stroke 6 with the cap set on the instance.
**Shape:** W › phase › list.
**Laws carried:** `docs/operations/10-figma/05-icon-forms.md` is the recipe, read whole before the first write and quoted in the brief; one drawing is one part, reused by instance, never redrawn or numbered (`line-19-2` is the failure this plan exists to prevent); parts on the keyline; whole-pixel sizes; icons shown at 24; nothing on any other page is touched; one kol-figma-agent (Opus), one check at the end.
**How a phase closes:** measurable acceptance line first, then a script reads the page and answers each line yes/no, then a screenshot at 24 that I judge myself before he sees it.

## W1 — Line, six steps, on a new page

File `iconset--kol-ds-ui` (`Lud0oSRKPTyHvT9MDVIczN`). The existing Line lane on Bases stays as it is.

### 1.1 — The page and its columns

- New page `Line, rebuilt`, canvas #1E1E1E, placed after Bases.
- One frame with six columns in order: RAW, PARTS, FORM, BASE, BUILD OUTPUT, CATEGORY, each step its own column (rule 6).

**Acceptance:** the page exists; its frame holds exactly six column titles in that order; every other page's node count is the same before and after.

### 1.2 — Raw and parts

- RAW: minus, plus, x, ascii-pipe, cap-butt, cap-round, cap-square, pasted from their code SVGs, reference only.
- PARTS: one component per distinct drawing: `Line/horizontal`, `Line/vertical`, `Line/diagonal-down`, `Line/diagonal-up`, `Line/horizontal-dashed`, `Line/vertical-dashed`. Each is one vector.
- A stroke that appears in several icons is drawn once. Plus is horizontal and vertical, x is the two diagonals: no new parts for them.

**Acceptance:** exactly 6 part components; each holds 1 vector; no two parts have the same drawing at any position or length (path compare after normalising); every part is used by at least 2 icons or is named in the doc's line row.

### 1.3 — Form and base

- FORM: component `Line`, one instance of each part, each instance on its own show/hide switch. No component set, no loose vectors.
- BASE: component `Base/line`, exactly two layers: `Base/keyline` (instance, off) and the `Line` instance, exposed so its switches show on the base.

**Acceptance:** `Line` has 6 children, all instances, 6 boolean properties, 0 vectors; `Base/line` has 2 children, both instances, 0 vectors, `Line` exposed.

### 1.4 — Build output and category

- BUILD OUTPUT: component set `Line/output`, `variant` = minus, plus, x, ascii-pipe, cap-butt, cap-round, cap-square, in the same rows as RAW.
- CATEGORY: icon components `minus`, `plus`, `x` (Interface / Actions), `ascii-pipe` (Signal / Ascii) and the caps (Signal / Cap), each one layer: its output variant.

**Acceptance:** 7 variants, each with 1 child, a `Base/line` instance; each variant exports the same paths as its raw drawing; 7 icon components, each with 1 child, an output instance; 0 vectors anywhere outside the 6 parts.

## Time

One Opus kol-figma-agent run, about 30 to 45 minutes, then my one check and screenshot.

## W2 — The page takes the Flow's auto layout and order (his points 2026-11-23: "you didnt use the layout structure ?", "im talking about the auto layout and order. use that to set up the new page")

Cause: the brief quoted the six steps but not the layout, so the page was six free columns of annotations. Band names on Bases ("Primitives") are agent changes, not his: copy the auto layout and the order, never those labels.

### 2.1 — Copy the Flow frame's auto layout and order — ✅ built 2026-11-23 (section 596:192, Flow 596:193)

- Measure `Bases, flow` (`111:17279`) and its frame `Flow` on Bases: the section, the frame, the header row of title cells, one lane row (label, cells, the arrow between each cell, the category cell's arrow list), with direction, sizing, gap, padding, fill and child order. Read only.
- On `Line, rebuilt` (`593:10`): one section holding a `Flow` frame on that same tree: the header row (RAW, PARTS, FORM, BASE, BUILD OUTPUT, CATEGORY), then the `line` lane. Cells carry their pill as on Bases; arrows between every step; the CATEGORY cell lists its categories with an arrow and a count. No band rows or band titles.
- The W1 components move into their cells unchanged (same ids). Leftovers go to the file's `_trash` with a `_` prefix.

**Acceptance:** the page has 1 top-level section holding 1 frame `Flow`; its header and lane rows have the same direction, gap, padding and cell widths as Bases' (to the pixel), children in the same order; 6 title cells, 1 lane with 6 cells and 5 arrows; every W1 component id is present in its column's cell; 0 band rows; every other page's node count unchanged.
