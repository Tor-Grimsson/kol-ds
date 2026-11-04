# DashboardCardSet — metric's card look as kol-dashboards components, for every dashboard

**Staged:** 2026-11-03 · from kol-website (`apps/metric` is the source; `apps/record`'s Dashboard is the second consumer)
**User:** *"metric has changed every dashboard component"* — and record's Dashboard still wears the old ones. He wants one card set across both: *"send the ticket, yes good go"*.

No stopgap in kol-website: record's Dashboard is rebuilt on the release, not on copies.

## Where it stands

- metric's look (the plausible.io-style cards, landed via `MetricDashboardUpstream` 2026-10-31) lives **as app code**, not in the package: kol-ds-ui `apps/metric` → kol-website `apps/metric/src/dashboard/`. kol-dashboards (0.8.0) ships only its charts (`Heatmap`, `CalendarHeatmap`, `LineChart` …) plus the OLD cards (`DashMetricCard`, `DashChartCard`, `DashListCard` …).
- record's Dashboard (`apps/record/src/pages/Dashboard.jsx` + `components/Dashboard*.jsx`) uses those old cards, so the two dashboards look like two systems.

## The parts, as metric runs them today (kol-website paths, phone fixes of 2026-11-03 included)

| Part | Where | What it is |
|---|---|---|
| `Card11` | `Sections11.jsx:20` | the card: title as the active tab on the rule, or a tab row; `controls`; foot left/right; `footPad` |
| `Card` · `CardHead` · `TabButton` | `Report.jsx:10–68` | the report card head: tab row on the header's rule (underline on the rule), a tab that opens a `Menu`, expand + ⋮ group; phone: tabs `gap-3`, header `gap-2` |
| `List` · `Row` · `Trend` | `Report.jsx:72–131` | ranked rows: share bar behind the label, value right, share % on hover, trend arrow; label wraps to 2 lines; 14px under md / 12 from md; rows 36 apart under md |
| `Details` | `Report.jsx:141` | the expanded view: FullscreenOverlay, search, sortable columns |
| `Numbers` · `Key` | `Sections11.jsx:36–61` | number tiles: label + dot, value, note; left rule per tile clipped at each row's start; 2 columns under sm, auto-fit from sm; value 20 / 24 |
| stat tiles + `Chart` · `Delta` · `Change` | `TopStats.jsx` | the selectable tile row over a fitted line chart (phone: no header row, ⋮ for view/series, y gutter 32, a date per ~48px) |
| `Records` | `Sections11.jsx:63` | a simple `Table` with an empty state |

## Ask

These as **kol-dashboards components**, general enough for a dashboard that is not analytics (record's: tasks, capture board, calendar, projects, a metrics strip, links):
- **Card** — one component for both heads (single title, tab row, tab-with-menu), with slots for controls and foot; accepts any children.
- **RankedList** (List/Row/Trend) — rows of any `{ label, value, icon?, display?, prev? }`, a column head, `onPick`, limit, empty/loading.
- **StatTiles** — selectable or static tiles (`Numbers` and the TopStats row are one thing at two sizes), any count.
- **DetailsOverlay** — the expanded table.
- The phone rules above built in (min-width steps only).
- metric's app code then imports them; kol-ds-ui `apps/metric` the same.

## Acceptance

- kol-dashboards exports Card · RankedList · StatTiles · DetailsOverlay; the showcase renders each at 1440 and 390 in both themes.
- kol-ds-ui `apps/metric` on them renders pixel-identical to today's (dark), and at 402 matches kol-website's measured phone numbers: tabs 12px, report cards ≈437–445, number tiles 2 columns, no tab row overflowing.

## Remainder in kol-website once it ships

1. metric: replace `Card11`, `Report.jsx`'s card/list/details, `Numbers` and the tile row with the package parts; local copies to `_tmp/`.
2. record: rebuild the Dashboard on them in the redesigned layout (design: https://claude.ai/artifact/HWGSSCjMhY2NiLZVmR66tZ, redrawn on this card set).

## ✅ RESOLUTION — 2026-11-03

Shipped in **kol-dashboards 0.9.0** (peer kol-component ≥ 0.323.0). Four exports, carried class for class from metric's app code with kol-website's phone fixes of 2026-11-03:

| Export | File | Main props |
|---|---|---|
| `Card` (+ `Card.Head`) | `packages/dashboards/src/cards/Card.jsx` | `title` · `tabs` + `tab` + `onTab` (a tab with `options` opens a `Menu`; `search`, `empty`) · `controls` · `onExpand` · `footLeft` · `footRight` · `footPad` · `className` |
| `RankedList` | `packages/dashboards/src/cards/RankedList.jsx` | `rows` `{ key?, label, value, icon?, display?, prev?, disabled? }` · `total` · `column` · `valueLabel` · `onPick(row)` · `limit` (9) · `empty` · `loading` · `format` |
| `StatTiles` | `packages/dashboards/src/cards/StatTiles.jsx` | `items` `{ key?, label, value, color?, note?, delta? }` · `size` sm (Numbers) \| lg (the TopStats row) · `selected` + `onSelect` · `columns` |
| `DetailsOverlay` | `packages/dashboards/src/cards/DetailsOverlay.jsx` | `open` · `onClose` · `title` · `columns` `{ key, label, fmt? }` · `rows` · `loading` |

Renames from the app code: `setTab` → `onTab`, `menu` → `controls`, `List` → `RankedList` with `prev` and the clickable flag on each row (`onFilter` → `onPick(row)`; `disabled` marks a row that cannot be picked), `Numbers` → `StatTiles`, `Details` → `DetailsOverlay`. Card11 is `Card` with `className="h-full"`. `Chart` / `Delta` / `Change`, `Key` and `Records` stay app code (Delta goes into a tile as `delta`).

kol-ds-ui `apps/metric` runs on them; the replaced code is in `_tmp/2026-11-03-metric-card-layer/`. Showcase: `showcase/src/previews/{Card,RankedList,StatTiles,DetailsOverlay}.jsx`, rows in `nav/classification.js`.

Measured (Playwright): 1440 dark before/after differs only in each card header — the active tab's underline now lands on the rule 2px (kol-website's `pb-px -mb-px` fix; it was clipped to 1px) and a one-level antialias shift of the tab text; with that fix removed the page is identical. 402 touch: tabs 12px, report cards 437–447 (Sources 403 — 8 rows), number tiles 2 columns, no tab row overflows. Showcase pages clean at 1440 and 390, light and dark. Gates: roster · imports · taxonomy · syntax · placements · groups clean.
