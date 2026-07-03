---
component: MediaRow
source: kol-media-admin/src/MediaRow.jsx#L1-L48
date: 2026-07-03
status: recreated
deps: [SelectCheckbox (→ DS ToggleCheckbox)]
---

# MediaRow

## Purpose
List row for one media object: an optional select checkbox, a small thumbnail, the name (flexes), fixed-width date + size columns, then an actions cluster. The list-view counterpart to `MediaCard`. Used in the kol-media-admin file list.

## Anatomy
- `<li>` row — flex, items-center, gap, bottom border
  - select checkbox (only in select mode)
  - thumbnail box (48px square, rounded, clipped)
  - name slot (flex-1, `min-w-0` for truncation)
  - date column (fixed width, right-aligned)
  - size column (fixed width, right-aligned)
  - actions slot (hidden in select mode)

## Variants
- **Default** — actions shown, no checkbox.
- **Select mode** — checkbox leads the row; whole row is clickable; actions hidden.
- **Selected** — row background highlight.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| thumb | node | — | 48px thumbnail |
| name | node | — | name cell (text or inline editor) |
| date | string | — | right-aligned date column (`w-24`) |
| size | string | — | right-aligned size column (`w-20`) |
| actions | node | — | action buttons (hidden in select mode) |
| selectMode | bool | false | shows checkbox, makes the row clickable, hides actions |
| selected | bool | false | row highlight + checked box |
| onSelect | fn(event) | — | row click in select mode; event carries `shiftKey` for range select |

## Styling
- Row `<li>`: `flex items-center gap-3 py-2 border-b`; border color inline `var(--kol-fg-08)`; `cursor-pointer select-none` in select mode; `bg-fg-08` when selected.
- Thumb box: `w-12 h-12 shrink-0 rounded overflow-hidden`.
- Name cell: `flex-1 min-w-0` (enables truncation of long names).
- Date column: `kol-mono-12 text-fg-32 shrink-0 w-24 text-right`.
- Size column: `kol-mono-12 text-fg-48 shrink-0 w-20 text-right`.
- Actions wrapper: `shrink-0`.

## States & interactions
- **selected**: `bg-fg-08` + checked box.
- **click**: select mode → `onSelect` toggles from anywhere on the row; default → the row is inert (interaction lives in the thumb / name / actions slots).

## Dependencies
- `SelectCheckbox` — see the MediaCard note; map to DS `ToggleCheckbox`.

## Recreation notes
- Tier: **molecule** (row layout with slots + a checkbox atom).
- Column widths (`w-24` date, `w-20` size) are consumer-tuned for this data — expose as props or a `columns` config in the DS version rather than hardcoding.
- Date/size are dimmed (`text-fg-32` / `text-fg-48`) to set metadata hierarchy — keep those tokens.
- Presentational — `thumb` / `name` / `actions` are slots; no fetch or rename logic in the row.
- Pairs 1:1 with `MediaCard` (same object, two layouts) — the DS may want them to share a props contract (`thumb`/`name`/`actions`/selection).
