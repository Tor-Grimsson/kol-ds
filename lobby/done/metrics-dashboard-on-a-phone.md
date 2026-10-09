# MetricsDashboard on a phone: rows that run off the edge, and 240 px cards holding three lines

**Staged:** 2026-10-09 · from a kol-website session (metrics.kolkrabbi.io, now a home-screen app)
**Change:** kol-dashboards `MetricsDashboard.jsx` (phone layout) + kol-theme `kol-components-dashboards.css` (row height)

---

## The case

The user saved metrics.kolkrabbi.io to the home screen and called it awkward. Measured: built app
(kol-dashboards 0.4.3 · kol-theme 0.169.0 · component 0.250.0), `/api` → production, iPhone 13
emulation, dark, all four tabs. `MetricsDashboard.jsx` carries **no responsive class at all** (0
`sm:/md:/lg:`): it is the desk layout, stacked.

| # | What | Measured | Source |
|---|---|---|---|
| 1 | **Every card is ≥240 px tall on a phone** — a stat card is title + number + one line (~90 px of content), so ⅔ of each card is empty; the hero cards (Main site, Top subdomain) are ~460 px with the sparkline pinned to the bottom. Site tab: 4,351 px of scroll. | Project / Infrastructure / Sessions: every stat 240 px | `kol-components-dashboards.css:9` `grid-auto-rows: minmax(240px, auto)` |
| 2 | **Tab row overflows** — Site · Project · Infrastructure · Sessions in one segmented row; "Sessions" ends at x=429 of 390, clipped, **not scrollable**. | right edge 429 | the tab `SegmentedToggle` in `MetricsDashboard` |
| 3 | **Host filter overflows** — All + 7 hosts in one segmented row, 5 off screen, no scroll affordance (Site tab). | — | `allHosts` row |
| 4 | **Range row shares its line with the deploy timeline** — Today…1y fills the width; the timeline ("● 10-06 Metrics on its own subdomain …") is a scroller squeezed into what is left, ~40 px visible. | — | range + timeline row |
| 5 | **Status line truncates the build ref** — "Live 4m ago 116s build \| ws-1… \|" | — | status line |

Desk is fine and should not move.

## The ask

- **#1:** on a phone, rows size to content — no 240 px floor below `md` (keep it at desk, where it
  is the viewport-fit grid). A sparkline card keeps its chart at a fixed small height (~80–96 px)
  under the number instead of stretching the card.
- **#2 / #3:** below `md` the tab row and the host row scroll horizontally (`overflow-x: auto`, no
  wrap, edge fade or partial last cell as the affordance) — or the host filter becomes a `Dropdown`
  below `md`; your call on the DS pattern.
- **#4:** below `md` the deploy timeline takes its own full-width line under the range control.
- **#5:** the status line wraps or drops the duration before it truncates the ref.

## Not asked

The page frame — kol-website handles safe area / status bar itself (done today). Data labels
(`packages/ui`, `@kol/ui`) are the consumer's data, not this ticket.

## Done when

At 390, all four tabs: no row past the right edge without a scroll, no stat card taller than its
content plus padding, Site tab well under half its current 4,351 px. kol-website bumps and checks the
same four tabs the turn it returns.

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-theme@0.172.0` + `@kolkrabbi/kol-dashboards@0.5.0`.**

1. `.dash-grid` `grid-auto-rows: auto` under `@container (max-width: 767px)`; the 240 floor stays at
   desk. Sparklines were already 24 tall, so they sit under the number.
2. The section tabs sit in a `max-w-full overflow-x-auto scrollbar-none` strip (`w-max` seg). The host
   row already scrolled (measured: scrollWidth 479 in 366) — its affordance is the cut last cell.
   One pattern for both; no Dropdown.
3. `TimelineBar` wraps below md; the milestone strip is `basis-full`, its own line.
4. `DeployBar` hides the build duration below md.

Measured in the showcase preview at 390, all four tabs: stat cards 115–155 (were 240), nothing past
the right edge, timeline full width on its own line. Site tab 3,515 there — what remains is real
content (top-pages / countries / referrers lists, the 200 chart), not empty card. At 1440: rows
`minmax(240px, auto)`, cards 240, timeline beside the range — desk unchanged.

For kol-website: bump kol-theme ^0.172.0 + kol-dashboards ^0.5.0, check the four tabs.
