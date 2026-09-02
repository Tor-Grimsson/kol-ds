# @kolkrabbi/kol-dashboards

## 0.4.1 — 2026-09-01

- **CardHeader's subtitle wears `.dash-lede`** — 0.4.0 pointed it at
  `.dash-subtitle`, a name that was already the pack's 16 → 22 medium
  sub-heading. Needs kol-theme 0.120.1. 0.4.0 is deprecated.
  (DashDetailWrapsWithoutLeading follow-up)

> Started 2026-08-14 at 0.2.2 — earlier versions shipped without entries (that history
> lives in the repo's session logs). From here every publish adds an entry, and
> breaking or global-surface changes are flagged **BREAKING**.

## 0.4.0 — 2026-09-01

- **CardHeader's subtitle wears `.dash-subtitle`, not `.dash-detail`** — the
  subtitle is a sentence that wraps, and dash-detail is line-height-1
  single-line chrome; at 390 every card subtitle rendered three lines with no
  leading. Footers and labels keep dash-detail. Needs kol-theme 0.120.0.
  (DashDetailWrapsWithoutLeading, kol-chess)

## 0.3.0 — 2026-08-31

- `DashTableCard` renders the `badge` it accepts. It had destructured the prop
  and called `CardHeader` with three arguments, so `<DashTableCard badge={…} />`
  rendered nothing and warned about nothing. It now wears `DashListCard`'s
  shape — header and badge in a `justify-between` row — so the four cards that
  take a badge place it the same way. `badge` is CONTENT, not a node: the card
  wraps it in `<Badge>`, matching `DashListCard`/`DashChartCard`/`DashFeaturedCard`.
- Call sites that pass no `badge` are unchanged — the wrapper is inert.

## 0.2.3 — 2026-08-15

- `CardHeader` and `DashStackedBarCard` ink their icons on the opaque tier
  (`text-oq-88`, was `text-fg-88`). A translucent stroke stacks alpha where the
  glyph self-overlaps.
