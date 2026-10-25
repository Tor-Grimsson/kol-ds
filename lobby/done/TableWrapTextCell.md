# TableWrapTextCell

**Staged:** 2026-10-24 · from a kol-studio session
**Change:** `Table` gets a body-size text cell that wraps, for a long free-text column

---

## The problem, in one case
kol-studio `/clients`, rebuilt on the page kit (`PageHero` · `PageSection`, kol-framework 0.54.0). The roster's Notes column holds one long note (Another Creation). Every body-size cell class nowraps (`.kol-table-cell-title`, `.kol-table-cell-text`); the only wrapping ones are `.kol-table-cell-meta*` at 10px. So the table scrolls sideways: at 1440 the wrapper is 918px wide and the content 1384px, and the note is cut at the edge.

The user's direction: put the page on the kit so tables *"expand all the way"*. They do now (`width="column"`), and the note still does not fit.

Screenshot: `_assets/2026-10-24-kol-studio-clients/1440-dark-clients-roster.png`.

## The fix
- A wrapping body-size cell, e.g. a column's `wrap: true` (or a `kol-table-cell-text--wrap` class), same face and size as `cell-text`, with a sensible max measure.

## Definition of done
- [ ] A column can wrap at body size
- [ ] Published; kol-studio's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-theme 0.188.0 · kol-component 0.300.0 live

`Table` columns take `wrap: true` → `kol-table-cell-text kol-table-cell-text--wrap` (kol-theme): the body cell's face and size, `white-space: normal` inside a 12–32rem measure; a column naming its own `className` keeps it. Walked on the showcase's Table page: a cell given the modifier wraps (75px tall from 41) inside the measure (502px content ≤ 512). Docs: `Table.mdx` columns row. Registry live (checked once). Receipt returned to kol-studio's outbox.
