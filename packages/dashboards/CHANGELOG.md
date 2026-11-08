# @kolkrabbi/kol-dashboards

## 0.12.0 — 2026-11-04

- **The metric page's parts** (plan-2026-11-04-float-figma-review W5.1). What apps/metric drew itself is exported, each with props for its data and no baked fixture: **`TopStats`** (`variant` plausible | colour, `items`, the chart as `children`) with **`MetricTiles`**, **`ChartHead`**, **`ChangeBadge`**, **`DeltaBadge`**; **`TrendChart`** (the fitted line chart, `multi` for combined series) with **`ChartWithLegend`**; **`Behaviours`** (owns the tab, its children are a function) with **`GoalsTable`**, **`FunnelChart`**, **`JourneyExplorer`**; **`WorldMap`** (shapes built in, `rows` + `onFilter`) and `REGION_NAMES`; **`ColorKey`**, **`RecordsTable`**, **`SegmentBar`**, **`CalendarIcon`**. The series formatters `formatCount` · `formatDuration` · `formatRange` · `formatBucket` · `formatTick` are exported too. Carried class for class; apps/metric renders pixel-identical. Not published.

## 0.11.0 — 2026-11-04

- **The record dashboard's source and capture cards** (plan-2026-11-04-float-views W3.2, kol-float--style 13:5037). **`SourceCard`** takes `meta` (mono, at the title's right — "4 items") and `children` (its rows under the head, `TaskCard size="sm"`) — a healthy source that lists what it holds. **`CaptureCard`** draws the 5:3 frame only when `image` or `src` is given (a text capture from a list source has none), and takes `onPrev` (←) and `action` + `onAction` (a labelled float button — "Archive"); with either, the moves sit in their own row under the meta. Existing calls (an image + `onNext`) render as before. Not published.

## 0.10.0 — 2026-11-04

- **Float, all of it — W7 cards + tiles and W10 charts** (plan-2026-11-04-float-everything; the gap map's rows 95–114 and 153–157, each built to the exploration piece). Needs kol-theme ≥ 0.211.0 (the float tokens, Inter and the `kol-float-*` roles). The float look: a 20 sheet (`--kol-float-menu-r`) on the secondary surface, Inter through the float type roles and JetBrains Mono for numbers, no rim, selection at fg-16, the 2px focus ring, hover fg-08.
  - **`variant="float"`** on **`Card`** (`count` · `meta` · `description` · `value` · `onFold` + `folded` · `addLabel` + `onAdd`; the group card, the card with options + fold, the collapsed group), **`StatTiles`** (lg: the stat tile with `delta`, `note` and a `spark` sparkline; sm: the small metric tile with its window), **`RankedList`** (Inter rows, the 8 round bar) and **`LineChart`** (`tabs` + `tab` + `onTab` metric selector, `legend` + `interval`, the y scale with grid rules, a `dashed` series, `peak`; the record card form is `Card variant="float"` around it).
  - **New cards:** `SectionHead` (a float card's head — title · count · meta · value · controls · fold), `FoldedHead` (the folded pill), `FloatCard` (the glass recipe sheet), `TaskCard` (checkbox · title · group · date pill · chip; `size` sm for a group's rows, `selected`), `SourceCard`, `CaptureCard`, `KanbanColumn`, `ProjectCard`, `LinkCard`, `CoverTile`, `ContinueCard`, `AssetRow`, `LiveCard` (its live dot drawn inline until W2's LiveDot lands), `NoteCard`, `PositionBlock`.
  - **New charts:** `Legend` (`items` `{ label, color?, dashed? }` + `interval`), `WeeklyBars` (`weeks` `{ count, label, current? }`), `ProportionBar` (`segments` `{ value, color?, label? }` down the ink ladder). `Sparkline` takes `strokeWidth` and no longer calls a hook after its empty-data return.
  - Shared inside the package: `cards/_shared/float.js` (the sheet's classes) and `cards/_shared/ProgressLine.jsx` (the 4 / 6px progress line of ProjectCard, ContinueCard, PositionBlock). No new CSS — every float value is a kol-theme token worn inline.

## 0.9.0 — 2026-11-03

- **The card set** (DashboardCardSet, kol-website): metric's cards, carried class for class from its app code, general enough for a dashboard that is not analytics. **`Card`** — one header for a single `title`, a `tabs` row and a tab with `options` (a `Menu`), `controls` + `onExpand` on the right, `footLeft` / `footRight`; `Card.Head` is the header alone. **`RankedList`** — rows of any `{ label, value, icon?, display?, prev?, disabled? }`, a column head, `onPick(row)`, `limit`, `empty` / `loading`. **`StatTiles`** — static or selectable (`selected` + `onSelect`) number tiles, any count, `size` sm (in a card body) or lg (a section's head). **`DetailsOverlay`** — the expanded table: search, sortable columns. Phone rules built in (min-width steps): tabs 12 apart, row labels 14 under md and two lines, rows 36 apart, tiles 2 across, values 20 → 24. Peer `kol-component` ≥ 0.323.0 (`Menu`).

## 0.8.0 — 2026-11-03

- **`CalendarHeatmap weeks`** (BareButtonTouchRung, kol-website metric): the number of week columns, the last one `end`'s week (default 53, output unchanged). Month labels stay over their first week, so a phone can show the last 26 weeks without a sideways scroller.

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
