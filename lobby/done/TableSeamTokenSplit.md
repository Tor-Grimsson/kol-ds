---
component: Table (kol-table seams)
source: kol-website apps/brand /assets — logo download table · packages/theme/kol-components-organisms.css
date: 2026-07-30
status: issue — half-finished migration, DS fix
deps: [Table]
---

# kol-table — horizontal seams are opaque, vertical seams are alpha

Consumer-side finding, spotted on the brand `/assets` logo table in dark mode:
the column dividers read visibly **brighter** than the row dividers. Nothing was
changed consumer-side; there is no workaround to unwind.

Both seams are nominally "08". They are not the same token.

## What the DS ships today

`kol-theme/kol-components-organisms.css`, default (framed) table:

| Seam | Line | Rule | Token |
|---|---|---|---|
| wrapper frame | 49 | `.kol-table-wrapper { border: 1px solid … }` | `--kol-oq-08` |
| thead underline | 78 | `.kol-table-thead { border-bottom: 1px solid … }` | `--kol-oq-08` |
| row underline | 82 | `.kol-table-row { border-bottom: 1px solid … }` | `--kol-oq-08` |
| **column divider** | **198** | `.kol-table th, .kol-table td { border-right: 1px solid … }` | **`--kol-fg-08`** |

Token definitions:

```
--kol-fg-08: color-mix(in srgb, <ink> 8%, transparent);          /* alpha */
--kol-oq-08: color-mix(in srgb, <ink> 8%, var(--kol-surface-primary));  /* baked grey */
```

`oq` is flattened against `--kol-surface-primary` at definition time. `fg` composites
against whatever is actually painted behind it.

## Why it shows

The two only agree when the cell backdrop IS plain `surface-primary`. It often isn't:

- `.kol-table-thead` sets `background: var(--kol-fg-04)` (line 77).
- Consumers tint individual cells — the brand asset table puts `bg-fg-04` on its
  preview column.

On those lighter backdrops the alpha divider rides up with the background while
the baked divider stays put, so verticals go brighter and horizontals stay flat.
`border-collapse: collapse` means each seam paints once — this is not double-draw.

## Why it's a half-finished migration, not a design choice

The wrapper carries its own comment (lines 46-49):

> opaque border stop — translucent fg-08 stacked with the collapsed table's own
> borders composited into darker seams over gradients (2026-07-15 chess audit
> finding 4); oq-\* mirrors the same visual weight without alpha

Wrapper, thead and row were converted to `oq-*` under that finding. Line 198 was
missed. The DS is currently arguing against itself in the same file.

## The fix

Line 198 → `--kol-oq-08`, matching the other three seams:

```css
.kol-table th,
.kol-table td { border-right: 1px solid var(--kol-oq-08); }
```

Check while in there: `.kol-table-cell-*` and any other `border-*` in the table
block for the same alpha/opaque split.

## Deliberately out of scope

`.kol-table--simple` (lines 187-196) is **internally consistent** — thead `fg-12`,
rows `fg-08`, no column dividers at all. It is a borderless flush variant meant to
sit on arbitrary surfaces, where alpha is the correct primitive. Leave it alone.

## Related

- [[DocTableAndChipAudit]] — same audit pass, `.kol-doc-table` side (closed in
  theme 0.12.1 / component 0.13.0 / framework 0.6.4).
- The `fg` vs `oq` distinction is documented at the top of `kol-opaque.css`:
  *"`oq` is not a transparency, it is a baked grey."*

---
## ✅ RESOLVED 2026-07-30 — kol-theme 0.13.0
`kol-components-organisms.css` td column divider `--kol-fg-08` → `--kol-oq-08` (the fourth seam of chess-audit finding 4). Full variant audit ran with it: `--simple` + `kol-doc-table` verified consistent (alpha over untinted surface only); one sibling noted out-of-scope (styleguide `.kol-combo-lab` fg-08 border over fg-02 tint — card frame, negligible).
