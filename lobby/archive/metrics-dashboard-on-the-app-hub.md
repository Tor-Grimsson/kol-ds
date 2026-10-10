# MetricsDashboard can be driven by AppHub: a controlled tab and no chrome of its own

**Staged:** 2026-10-09 · from a kol-website session
**Change:** two optional props on kol-dashboards `MetricsDashboard`

---

## The case

The user, on his phone with metrics beside media, fxr, kolkrabbi.io and ui.kolkrabbi.io: metrics does
not look like the others. It is the only one with no app frame — its own mono header
("kolkrabbi.io / metrics live"), its own segmented tab row, no bar. Every other KOL app is on kol-shell
`AppHub` (fxr, media-hub: title + settings on top, the rail as a bottom bar on a phone). kol-website
will move metrics onto `AppHub` the way `apps/media-hub` does — the four tabs (Site · Project ·
Infrastructure · Sessions) as the Hub's `items`, routing by hash, the dashboard inside `PageShell`.

It cannot today: `MetricsDashboard.jsx:518` keeps the tab in local state (`useState('site')`) and
always renders its title line and tab `SegmentedToggle` (`:550`). The Hub would draw a second set of
tabs above a dashboard it cannot switch.

## The ask

- **`tab` + `onTabChange`** — controlled when given (`'site' | 'project' | 'infrastructure' |
  'sessions'`), today's local state when not. Export the tab list (ids, labels, a suggested kol-icons
  name each) so the consumer builds `items` from the package instead of retyping it.
- **`chrome={false}`** (or `header={false}`) — drop the dashboard's own title line and tab row when a
  shell provides them. The range control, the deploy status line and everything below stay.
- Optional, your call: if the range (Today…1y) and the host filter belong in the Hub's Settings page
  rather than the dashboard body on a phone, say so and expose them the same way.

## Not asked

No change to the default — a consumer passing nothing renders exactly what 0.5.0 renders.

## Done when

kol-website renders `<AppHub items={TABS} currentPath=…><PageShell><MetricsDashboard tab={…}
onTabChange={…} chrome={false} …/></PageShell></AppHub>` with one set of tabs (the Hub's bar on a
phone, the rail at desk) and they switch the dashboard. kol-website wires it the turn it returns.

---

## Resolution — 2026-10-09 · ⚪ parked

Parked at kol-website's request: it is auditing the metrics header and navigation first and will
come back with one concrete ask if it needs one. kol-dashboards stays here (chess consumes it too).
Nothing built yet.
