---
component: MetricDashboardUpstream
source: kol-website/apps/metric/src/demo7/ (route /demo-11) — plan kol-website .kol/llm-context/plans/2026-10-30-metric-style.md, W8–W17
staged: 2026-10-31
status: draft
deps: [MenuItem, Dropdown, Heatmap, SettingsPanel, HubSettingsRail, ColumnBrowser ResizeHandle, Table, TabsRow, CommandOverlay, Card]
---

# MetricDashboardUpstream — metric's analytics dashboard into the DS

## Purpose
kol-website's metric app has a new dashboard on live Umami data, `/demo-11`, built as plausible.io's structure in the KOL look. The user picked it as the keeper (2026-10-31). It runs on KOL parts plus **disconnected copies** of KOL parts that needed a change, in `apps/metric/src/demo7/kol/`. This ticket asks the DS to take those changes in, give metric a reference app, and add one colour step, so metric can drop the copies and promote `/demo-11` to the live page.

## The asks
1. **An `apps/metric` space in kol-ds-ui** — the dashboard's components and its reference page live there, as other apps have theirs (`apps/media`, `apps/studio-hub` …).
2. **Fold the disconnected copies back in** — each is a small diff, written up in its file header:
   - `kol/Menu.jsx` ← kol-component `MenuItem.jsx` + three props: `MenuDropdownDivider className`, `MenuDropdownNest rowClass`, `MenuDropdownNest panelClassName / panelStyle` (flyout surface and side; the gap mirrors when it flips).
   - `kol/Heatmap.jsx` ← kol-dashboards `charts/Heatmap.jsx` + `variant="dots"` (dot area follows the value, `fill` shares the height), and a new `CalendarHeatmap` + `CalendarScale` (a year of days as GitHub's contributions, Less → More).
   - `kol/SettingsRail.jsx` ← kol-shell `HubSettingsRail.jsx` + `extra` tabs (`[{ id, label, draw }]` — metric's Deploys bulletin tab). Copied because kol-shell 0.92 needs kol-component ≥0.318 / kol-theme ≥0.201 and metric is on 0.317.6 / 0.200.5.
   - `kol/ResizeHandle.jsx` ← ColumnBrowser's `ResizeHandle` (not exported) on a card's foot; `GRAB_COLUMN` inlined because `utilities/*.js` is not in kol-component's exports map.
   - `kol/Combobox.jsx` (SearchInput + the Dropdown panel) and `kol/Dialog.jsx` (Modal's shell at z 150 so floats open above it) — new parts KOL does not have whole.
   - `kol/CalendarIcon.jsx` — a calendar glyph until kol-icons ships `calendar` (the `time` group, ClaudeListIconSet).
   - The card anatomy in `Sections11.jsx` `Card11` (header controls only · body fills · foot: legend left, totals/source right), `TopStats.jsx` `Chart` (multi-series, `height="fill"`, fitted axis) and the colour tile row — candidates for kol-dashboards.
3. **`oq-06` as a whole step** — the user ruled: if it is added, it is added **everywhere** — the `fg-` series and the `oq-` series **and their inverses**, live in the theme, not a one-off. (Need: a resting chip fill between oq-04, which vanishes on a card, and oq-08.)

## Known issues to fix on the way (flagged by the user)
- **The toolbar** (Filter · date · ⋮, `plausible/his/` screenshots) does not sit right against the DS — it needs aligning to the DS's controls.
- **The section headings** (Code · Deploys · Storage, `kol-sans-display-04`) — the user is not sold on them; open.
- The Visitors weekday card's bottom padding in Firefox (the foot crowding the card's edge) — fixed in Chrome, unconfirmed in Firefox.

## Layout reference
**media.kolkrabbi.io is the reference for page structure** — header, gaps, spacing: `kol-shell-page`, title 48/48, the gear (and the source picker) on the title row, then one column: the crumb row, `gap-3`, the content. `/demo-11` was measured to it (title top 48, crumb top 145).

## Not asked
- No visual redesign — `/demo-11` is the look the user approved; the DS recreates, it does not restyle.

## Definition of done
- [ ] `apps/metric` exists in kol-ds-ui with the dashboard's reference page
- [ ] each copy above is a published DS change (or a ruled "stays local"), version cited here
- [ ] `oq-06` in the fg- / oq- series and inverses, published
- [ ] the toolbar aligned to the DS; the section headings ruled

## ✅ RESOLUTION — 2026-10-31 · kol-component@0.321.0 · kol-dashboards@0.6.0 · kol-shell@0.94.0 · kol-theme@0.204.0

Copies folded back: kol-component@0.321.0 — MenuDropdownDivider className, MenuDropdownNest rowClass/panelClassName/panelStyle (gap mirrors on flip), ResizeHandle exported (GRAB_COLUMN stays inside it), new Combobox (SearchInput + Dropdown's panel/rows) and Dialog (Modal's shell, any children, portalled, z 150). kol-dashboards@0.6.0 — Heatmap variant="dots" (+ the Firefox fill fix as flex-1 min-h-0), CalendarHeatmap, CalendarScale; hover uses DashTooltip, not native title (native-title law). kol-shell@0.94.0 — HubSettingsRail extra=[{ id, label, draw }]. kol-theme@0.204.0 — the 06 step in every fg- and oq- family and their inverses (ab, absolute, kol-color's redeclare), all utilities; docs 01-foundations/10-opacity.md + the opacity lookup updated. apps/metric in kol-ds-ui: /demo-11 verbatim on the DS packages, static fixtures (captured 2026-10-31, fetch shim); light screenshot pixel-identical to /demo-11, dark identical except the live dot. Stays local: CalendarIcon (until kol-icons ships calendar); Card11 card anatomy, the multi-series TopStats Chart and the colour tile row (no single clean prop on kol-dashboards' Card/LineChart carries them; they are page composition, apps/metric holds the reference). Toolbar alignment and the section headings remain the user's open calls.

**Remainder here:** none — kol-website bump kol-component@0.321.0 · kol-dashboards@0.6.0 · kol-shell@0.94.0 · kol-theme@0.204.0.

