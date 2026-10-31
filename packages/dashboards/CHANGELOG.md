# @kolkrabbi/kol-dashboards

## 0.7.1 — 2026-10-31

- **`CalendarHeatmap` month labels** (kol-website metric): a label within two week-columns of the next month's is skipped, so a first month with one week no longer prints "OctNov".

## 0.7.0 — 2026-10-31

- **One tooltip** (user 2026-10-31: *"what is this tooltip/popover? not ours?"*). `DashTooltip` renders KOL's `.kol-tooltip` (mono 11, the tooltip surface + oq-08 hairline); `.dash-tooltip` keeps only the chart's placement. **`Heatmap colTick`** — every Nth column label on the axis, the full label in the tooltip, so a sparse axis never reads "C10" on hover.

## 0.6.0 — 2026-10-31

- **MetricDashboardUpstream** (kol-website metric's /demo-11). **`Heatmap variant="dots"`** — each cell a dot whose area follows the value in the scale's first colour, an empty cell a 2px speck; its labels kol-helper-10 at fg-48, the hours on the grid's own columns, the day labels stopping where the dots stop. Default `cells` unchanged. **`fill`** is a flex share (`flex-1 min-h-0`), not `h-full` — Firefox resolved the percentage differently and pushed a card's foot into its padding. New **`CalendarHeatmap`** (a year of days as GitHub's contributions: weeks across, Mon–Sun down, month labels, five steps of `color`) and **`CalendarScale`** (its Less → More key). Hover shows the chart's `DashTooltip` (the copy's native `title` is not carried).

## 0.5.1 — 2026-10-28

- **Relative imports name their file** (WebsiteFrameDuplicateModules, kol-website): every `./x` import now carries its extension. Vite serves raw source by the URL it was imported with, so `./Ctx` and `./Ctx.jsx` were two modules in dev and a provider and its hook held two contexts. `validate-relative-imports` keeps it from coming back. No behaviour change.

## 0.5.0 — 2026-10-09

- **Phone layout for `MetricsDashboard`** (kol-website, measured at 390): the section tabs scroll sideways inside their own strip; below md the deploy timeline takes its own line under the range control, and the status line drops the build duration so the ref has room. Desk unchanged. Pairs with kol-theme 0.172.0.

## 0.4.3 — 2026-09-30

- Comments only: one spelling, `color`.

## 0.4.2 — 2026-09-25

- **`DashStackedBarCard` legend ink takes `oq-64`, not `fg-64`** — the icon-ink law
  (icons and glyph plates take `oq-*`; translucent `fg` shows overlaps). Sat in the tree
  unpublished since 2026-09-23.

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
