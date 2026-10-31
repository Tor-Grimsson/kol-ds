---
title: apps/metric rebuilt on KOL parts
type: log
status: active
created: 2026-10-31
updated: 2026-10-31
description: apps/metric scanned component by component, its raw buttons and hand-made menus moved onto KOL parts, one new Menu molecule, three UX fixes — for review
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
---

# apps/metric rebuilt on KOL parts

**Run:** 2026-10-31 · **Order:** scan → list → fix → report → his review · **State:** built and verified locally; **nothing published** (kol-component carries a new `Menu`, a `Button variant="bare"` and a `Dialog` surface change — unreleased).

Line numbers in **Scan** and the *before* column of **Changes** are the pre-rebuild files.

## Scan

One row per local component in `apps/metric/src` (71). Verdicts: **keep** (app-specific: data shaping, the page, its own content) · **replace** with a KOL part · **consume into DS** as a new component (a look-alike no shipped part does yet).

| File:line | What it is | Verdict |
|---|---|---|
| `App.jsx:5` | the page root | keep |
| `MetricsDashboard.jsx:132–501` (DeployBar, HostSummaryCard, SiteTab, ProjectTab, InfraTab, SessionsTab, MetricsDashboard) | the old live dashboard; only `Sections.jsx`'s `LiveSection` imports its three tabs, and that path runs only when `nine && !ten` — never in this app | **dead path** — kept (still imported; retire with `Sections.jsx`'s pre-/demo-10 parts) |
| `demo7/DemoSeven.jsx:52` DemoSeven | the page: state, keys, toolbar, layout | keep |
| `DemoSeven.jsx:36–44` TRIGGER · PANEL · RULE · ROW · Key | the hand-written menu look (trigger, panel, rows, rules, key caps) | **consume into DS** as `Menu` — done |
| `DemoSeven.jsx:230–276` date · compare · ⋮ menus | three `MenuItem`s styled by hand | replace with `Menu` — done |
| `DemoSeven.jsx:359` WithLive | hook adapter | keep |
| `DemoSeven.jsx:361` Chip | filter chip, raw `<button>` + ghost Button | replace with `Tag` — done |
| `DemoSeven.jsx:386` FilterMenu | Filter with flyouts, disabled rows, divider, icons | replace with `Menu` — done |
| `DemoSeven.jsx:419` FilterDialog | the filter form in `Dialog` | keep (form is app data); its `Dialog` surface fixed in the DS |
| `DemoSeven.jsx:468` DatesDialog | custom range form in `Dialog` | keep |
| `DemoSeven.jsx:503,522,543` SettingsDialog · SiteToggles · SiteSettings | pre-/demo-10 settings (rendered only when `!ten`) | **dead path** — kept, flagged |
| `DemoSeven.jsx:560` Realtime | realtime tiles + chart | keep; tiles' raw `<button>` → `Button variant="bare"` — done |
| `DemoSeven.jsx:613` SitesPicker | `SettingsMulti` over Umami hosts | keep (already KOL) |
| `DemoSeven.jsx:625` RailTen | `HubSettingsRail` sections + Deploys tab | keep; Deploys tab → `SettingsSections` — done |
| `DemoSeven.jsx:671` Search | `CommandOverlay` over a kol-search index | keep (already KOL) |
| `demo7/Report.jsx:12` Card | report card: tab header on the rule, tab-menus, expand, ⋮ | **consume into DS** as `ReportCard` — kept (see Report) |
| `Report.jsx:58` CardHead | that header alone | consume with `ReportCard` |
| `Report.jsx:65` TabButton | underline tab, raw `<button>` | `TabsRow` underline cannot hold a tab that opens a menu; kept inside Card, raw `<button>` → `Button variant="bare"` — done |
| `Report.jsx:78` SearchList | searchable pick list in a tab-menu | keep (Card's) |
| `Report.jsx:93` CardMenu | card ⋮ — a `Dropdown` with a heading | replace with `Menu` — done |
| `Report.jsx:109,133,162` List · Row · Trend | bar-behind-label rows, filter on click, share on hover, trend arrow | **consume into DS** as `BarList` — kept; Row's raw `<button>` → `Button variant="bare"` — done |
| `Report.jsx:169,174` OverlayShell · DialogShell | Details' two shells | keep (DialogShell dead: `nine` always on) |
| `Report.jsx:177` Details | expanded sortable table | consume with `ReportCard`; sort head raw `<button>` → `Button variant="bare"` — done |
| `demo7/Cards.jsx:40–52` Mark · Brand · Favicon · Flag | icon pickers over kol-icons | keep (data → icon) |
| `Cards.jsx:119–205` Sources · Pages · Locations · Devices cards | data shaping onto Card/List | keep |
| `demo7/Behaviours.jsx:23` BehavioursCard | Goals · Properties · Funnels · Explore | keep |
| `Behaviours.jsx` Goals | bar rows + 3 columns, raw `<button>` | consume with `BarList`; raw `<button>` → `Button variant="bare"` — done |
| `Behaviours.jsx` Properties · Funnel | data views | keep |
| `Behaviours.jsx` Explore | journey columns, raw `<button>` rows | keep; raw `<button>` → `Button variant="bare"` — done |
| `demo7/CalendarIcon.jsx:4` CalendarIcon | disconnected icon until kol-icons ships `calendar` | keep (flagged in the file) |
| `demo7/WorldMap.jsx:7` WorldMap | choropleth on world.json | keep |
| `demo7/TopStats.jsx:26` Change | % change arrow | keep |
| `TopStats.jsx:81` TopStats | variant switch | keep |
| `TopStats.jsx:94` ChartTitle11 | chart header + series ⋮ (hand-styled `MenuItem`) | ⋮ replaced with `Menu` — done |
| `TopStats.jsx:119,125` WithFoot · Combined | chart body / multi-series | keep |
| `TopStats.jsx:144,166` ChartTitle · Split | pre-/demo-11 (`!eleven`) | **dead path** — kept, flagged |
| `TopStats.jsx:179` PlausibleStats | stat tiles, raw `<button>` | keep; tile → `Button variant="bare"` — done |
| `TopStats.jsx:257` Chart | SVG time-series: comparison line, dotted unfinished bucket, pin tooltip, click-to-zoom, fitted axis | **consume into DS** — `LineChart` lacks all five; kept (see Report) |
| `TopStats.jsx:383` Delta | change for the colour row | keep |
| `TopStats.jsx:398` ColourStats | colour tile row, raw `<button>` | keep; tile → `Button variant="bare"` — done |
| `demo7/nine.js:5,9,13` Nine · Ten · Eleven | the /demo-9 · 10 · 11 switch contexts (`useNine` · `useTen` · `useEleven`) | keep (remove with the switches, one change) |
| `demo7/Cards.jsx:120` SourcesCard | Channels · Sources · Campaigns ⌄ — Umami rows onto `Card` / `List` / `Details` | keep — a page section: data onto the report-card parts (themselves queued as `ReportCard` / `BarList`); draws nothing itself |
| `demo7/Cards.jsx:147` PagesCard | Top · Entry · Exit pages, ⋮ Break down by (`MenuMore`, Round 4) | keep — same; its ⋮ was `CardMenu`, now `MenuMore` |
| `demo7/Cards.jsx:178` LocationsCard | Map · Countries · Regions · Cities onto `WorldMap` / `List` | keep — same |
| `demo7/Cards.jsx:206` DevicesCard | Browsers · Operating systems · Devices onto `List` | keep — same |
| `demo7/Sections11.jsx:79` CodeSection11 | Code numbers, Components/Routes ranks, Content/Recent edits — `Card11` · `Numbers` · `List` · `Records` (`Table variant="simple"`) | keep — arranges parts + `repo-metrics.json` / Sanity data |
| `demo7/Sections11.jsx:131` DeploysSection11 | Deploys numbers, deploy activity (`CalendarHeatmap` + `CalendarScale`), Recent · By project · Failed records | keep — arranges KOL parts + the Vercel feed |
| `demo7/Sections11.jsx:193` StorageSection11 | Storage numbers, per-store tabs with a type-share bar + folder `List`, recent uploads `Records` | keep, **one look-alike flagged**: the type-share bar (`:215`, `flex h-2 rounded-full` with a segment per file type) is hand-drawn — no KOL part draws a multi-segment proportion bar (`ProgressBar` is one fill, `DashStackedBarCard` is vertical win/draw/loss columns), so **consume into DS** (a segmented `ProgressBar`), not replace; next round, if he agrees |
| `demo7/Sections11.jsx:20` Card11 | card anatomy over Report's Card | consume with `ReportCard` |
| `Sections11.jsx:36,41,58` Key · Numbers · Records | legend key, numbers row, `Table variant="simple"` | keep (Records is KOL) |
| `Sections11.jsx:65–193` WeekdayGrid11 · Code/Deploys/Storage sections | data shaping onto KOL charts | keep |
| `demo7/Sections.jsx:35–202` DeployBar · DeployLine · LiveSection · WeekdayGrid · SiteExtras · OneCard | pre-/demo-10 (`nine && !ten`) | **dead path** — kept, flagged (file stays: `useLive`, `Sized`, `Editing`, `dailyToSeries` are live) |
| `Sections.jsx:209` Sized | resizable card wrapper (`ResizeHandle`) | keep; its pre-/demo-10 raw-button branch removed — done |
| `demo7/Sections10.jsx` CodeSection · DeploysSection · StorageSection (+ Numbers, Plain) | /demo-10's sections, rendered only when `!eleven` | **dead file** — moved to `_tmp/2026-10-31-metric-dead/Sections10.jsx` |

**Dead-file verdicts by import graph.** `Sections10.jsx` was imported by `DemoSeven.jsx` only, on the `!eleven` branch — `App.jsx` always passes `eleven`, so it never rendered: moved. `Sections.jsx` is **not** dead: `TopStats`, `Sections11` and `DemoSeven` import its live `dailyToSeries`, `Sized`, `useLive`, `Editing`.

## Changes

| # | Before | After | Why |
|---|---|---|---|
| 1 | — | **new** `packages/component/src/molecules/Menu.jsx` — `Menu` (exported from `@kolkrabbi/kol-component`): items as data (`divider`, `heading`, row with `icon` · `current` · `checked` · `kbd` · `trailing` · `tooltip` · `items` flyout · `disabled`), label or `iconOnly` trigger, `size`, `align`, `minWidth`, `defaultOpen`, `children` | the four hand-written menu looks in one KOL part; composes `MenuItem` · `MenuDropdownItem` · `MenuDropdownDivider` · `MenuDropdownNest` · `Kbd` · `Tooltip` — forks none |
| 2 | — | showcase: `previews/Menu.jsx` (variants `label` · `icon`), `nav/classification.js` `Menu: 'overlay'`, `nav/registry.js` description; `03-components/01-inventory.md` row | a component gets a preview and a classification row like the rest |
| 3 | `Button` had no chrome-less form | `Button variant="bare"` — a pressable surface: no kol-btn ground/size/type/radius, keeps type, `disabled` and the KOL focus ring (`kol-menu-btn`) | tiles, bar rows and column heads draw themselves; a raw `<button>` there was the only way (decided, for review) |
| 4 | `Dialog` (`Modal.jsx:311`): `rounded border border-fg-08`, `background: surface-primary` | `kol-overlay-panel rounded` (oq-04 lift, no border; scrim stays `.kol-overlay-scrim` 48%) | UX fix (2): on a dark page the dialog painted the page's own surface — "a borderless box floating mid-page". Every KOL overlay wears this panel (decided, for review; `Modal`'s prompts still wear the old surface) |
| 5 | `DemoSeven.jsx:36–44` TRIGGER/PANEL/RULE/ROW/rowOf/Key | removed | now `Menu`'s |
| 6 | `DemoSeven.jsx:230–248` date `MenuItem` + `MenuDropdownItem rowClass` + `<Key>` | `Menu` items: `current`, `checked`, `kbd`, dividers between `RANGE_GROUPS`, Compare row | 1 · pixel-matched (224×585) |
| 7 | `DemoSeven.jsx:252–261` compare `MenuItem` | `Menu` | 1 |
| 8 | `DemoSeven.jsx:264–276` ⋮ `MenuItem` + hand heading div | `Menu iconOnly="more" iconRotate={90}` with `{ heading: 'Graph interval' }`, `trailing: 'download'` | 1 · pixel-matched (224×155) |
| 9 | `DemoSeven.jsx:386–417` FilterMenu: `MenuItem` + `MenuDropdownNest` + per-row Tooltip | `Menu` items: icons, flyouts (`items`), disabled rows with `tooltip`, divider after Segment | 1 · pixel-matched (224×435, rows 216×38, flyout 200×46) |
| 10 | `Report.jsx:93` CardMenu = `Dropdown tone="ghost" iconOnly` with `{ heading }` | `Menu iconOnly size="sm" minWidth={200}` with heading + checked/current rows | 1 — one menu look on the page; **the card ⋮ now looks like the toolbar ⋮** |
| 11 | `TopStats.jsx:100–113` series ⋮ `MenuItem` (`!px-1.5`, fg-meta ink) | `Menu iconOnly size="sm"` (200×160, same) | 1 — trigger is now the sm square, **26 wide (was 28)**: the chips beside it sit 2px right |
| 12 | `DemoSeven.jsx:203` crumb live count `<button>` | `Button variant="bare"` (same classes) | 0 raw `<button>` |
| 13 | `DemoSeven.jsx:361–366` Chip (`<button>` + ghost x) | `Tag variant="tertiary" hash={false} onClick onRemove` | 0 raw `<button>`; the KOL filter chip |
| 14 | `DemoSeven.jsx:286–294` chip row under the toolbar | chips + Clear all **in the toolbar row, before Filter**; Filter label shows `Badge size="xs"` with the count when any are active | UX fix (1) (decided, for review) |
| 15 | `DemoSeven.jsx:576` Realtime tiles `<button>` | `Button variant="bare"` | 0 raw `<button>` |
| 16 | `DemoSeven.jsx:17,312–314` Sections10 import + `!eleven` branch | removed; file to `_tmp/2026-10-31-metric-dead/` | dead file |
| 17 | `DemoSeven.jsx:649–665` Deploys tab: a hand-set stack (`flex-col gap-6`, mono-12 date over mono-14 text, no headers) | `SettingsSections divided`: **Latest deploy** (state · time ago) and **Deploys** (date · milestone, label column 88, value left-aligned) | UX fix (3): the tab had its own spacing and type, no section headings and no label/value rows — Settings and Shortcuts draw with `SettingsSections`; now it does too (decided, for review) |
| 18 | `Report.jsx:66` TabButton `<button>` | `Button variant="bare"` | 0 raw `<button>` |
| 19 | `Report.jsx:138` Row `<button>` | `Button variant="bare"` | 0 raw `<button>` |
| 20 | `Report.jsx:209` Details sort head `<button>` | `Button variant="bare"` | 0 raw `<button>` |
| 21 | `Behaviours.jsx` Goals row + Explore row `<button>`s | `Button variant="bare"` | 0 raw `<button>` |
| 22 | `TopStats.jsx:207,438` stat tile `<button>`s | `Button variant="bare"` | 0 raw `<button>` |
| 23 | `Sections.jsx:251` Sized's pre-/demo-10 resize pill `<button>` (unreachable: `ten` always on) | branch removed; `ResizeHandle` path kept | dead branch + raw `<button>` |
| 24 | menu icons, ✓ and trailing glyphs inherited `text-fg-88` | `text-oq-88` | icons take oq (law) — the only pixel change inside the matched menus |

### Round 2 — menus are Dropdown

| # | Before | After | Why |
|---|---|---|---|
| R2.1 | `Dropdown` was a single-select only (`options` / `value`) | `Dropdown items={…} trigger={({ open, props }) => …}` — an action menu: rows as data (`divider`, `heading`, `icon`, `trailing`, `current`, `checked`, `kbd`, `disabled` + `tooltip`, `items` flyout), `align`, `minWidth`, `children` above the rows. The select path is untouched (`DropdownSelect`; no call site passes `items` — grep of 64 files) | the menus are Dropdown; rows reuse `MenuDropdownItem` · `MenuDropdownNest` · `MenuDropdownDivider` · `Kbd` · `Tooltip`, none forked |
| R2.2 | `Menu.jsx` `PANEL` = `!bg-[var(--kol-oq-08)] !rounded-lg p-1 shadow-lg`, `ROW` / `ROW_ON` / rule / heading / key-cap utility strings | kol-theme `.kol-dd-menu` (oq-08 · 8px · 4px inset · `--kol-shadow-float`) + `.kol-dd-menu-row` (38 · 12px sides · 6px · fg-88, hover / current / open flyout oq-16 + fg-96) · `-rule` (oq-16, edge to edge) · `-heading` · `-kbd` | the look lives in the system; the oq ramp swaps per theme, so one rule is light + dark |
| R2.3 | panel shadow: Tailwind `shadow-lg` (resolved to transparent layers here — no visible shadow) | `--kol-shadow-float` (`0 8px 24px -8px` 40% · `0 2px 6px -2px` 30%) | **deliberate**: the brief's "float shadow"; the only change inside the menus' boxes |
| R2.4 | triggers: `MenuItem` `kol-menu-btn` + `TRIGGER` utilities — Filter / dates 32 tall, `0 12px`, 6px radius, 12/12 weight 500, oq-08 hover | `Button variant="tab" size="sm"` (TabsRow chip), `pressed` while open, `aria-pressed` cleared (the open state is `aria-expanded`) — 26 tall, `4px 12px`, 4px radius, 12/16 mono 400: **= the "Visitors" chip** (measured, light + dark); hover oq-04, open oq-08 | one chip for every toolbar trigger; **toolbar triggers are 6px shorter** (32 → 26) and Filter 91 / dates 134 wide |
| R2.5 | ⋮ triggers (graph, card, series): `Menu iconOnly iconRotate` — graph 32², card/series 26², 6px radius | `MoreChip` (`Report.jsx`) = `Button variant="tab" size="sm" iconOnly` with the `more` glyph turned 90° — 26², 4px radius | **the graph ⋮ is 26² (was 32²)**, same as the chips |
| R2.6 | `DemoSeven.jsx` FilterMenu · dates · compare · graph ⋮ = `Menu` | `Dropdown items` + chip trigger; Filter keeps `Badge` count; dates keep `CalendarIcon` (via `iconComponent`) | 1 |
| R2.7 | `Report.jsx` CardMenu = `Menu iconOnly`; `TopStats.jsx` series ⋮ = `Menu iconOnly` | `Dropdown items` under `MoreChip` | 1 |
| R2.8 | `Report.jsx:28–42` card tab-menus (Campaigns · Properties · Funnels): `MenuItem` with `panelClassName="!bg-surface-primary border border-fg-08"`, `!px-0 !items-start !text-*` trigger; `SearchList` | `TabMenu` = `Dropdown items` whose trigger is the card's own `TabButton` + caret (turns while open); search field as `children` above the rows; "Nothing matches" a disabled row | 0 `!bg-` in metric — **deliberate**: these panels now wear `.kol-dd-menu` (oq-08, no border) instead of surface-primary + border, and rows are 38 with ✓ fill |
| R2.9 | `packages/component/src/molecules/Menu.jsx` + `export { Menu }`; `showcase/src/previews/Menu.jsx`; `Menu: 'overlay'` (classification), registry description, inventory row, `api-tables.json` / `component-sources.json` keys | moved to `_tmp/2026-10-31-menu-wrapper/` (`Menu.jsx`, `showcase-previews/Menu.jsx`); rows removed | never published — no ledger alias |
| R2.10 | `previews/Dropdown.jsx` variants primary · grey · outline | + `menu` (dates: groups, ✓, key caps) · `menu-filter` (icons, flyouts, disabled + tooltip, badge) · `menu-more` (⋮, section label, trailing icon) — open, under chip triggers | Dropdown's showcase shows its menu shapes |

**Acceptance (Playwright, 1440×1000 @2x, vite :5319 — killed after).** `grep '!bg-\|!rounded\|kol-menu-btn'` in `apps/metric/src` + `Dropdown.jsx`: **0** (the rows' `MenuDropdownItem` still emits `kol-menu-btn` — the shared focus ring, reused not forked). Triggers vs "Visitors" chip: height 26 · padding `4px 12px` · radius 4 · `12px/16px JetBrains Mono 400` — equal, light + dark. Menus: Filter **224×435** · dates **224×585** · graph ⋮ **224×155** · flyout **200×46** · card ⋮ 200×108 · series **200×160**; rows 216×38 / 192×38, current row oq-16 — identical to before in light and dark; only the shadow differs (R2.3). Gates: taxonomy · roster · preview-files (349 rendered) clean; `validate:variants` / `icon-ink` / `dd-trigger` flag only pre-existing lines outside this round. Shots: `…/scratchpad/shots/r2-*` (each trigger rest / hover / open, each menu, flyout, disabled tooltip, card tab menu; light + dark).

### Round 3 — review

| # | Before | After | Why |
|---|---|---|---|
| R3.1 | Settings tab › SITE: one row, UMAMI, its Visit button hugging the row's end | + **GITHUB** (`https://github.com/Tor-Grimsson/kol-ds` — the repo's git remote, read from `.git/config`; it is `kol-ds`, not `kol-ds-ui`) and **DOCS** (`https://ui.kolkrabbi.io/apps/metric`); all three Visit buttons `w-full` on `align: 'fill'` rows (one local `Visit`), as wide as the STAT TILES · WEEK STARTS · TIME ZONE dropdowns | his: *"add two rows beside UMAMI"*, *"Visit button is as wide as the dropdowns below it"* — the rail's own `SettingsSections` rows, no hand-rolled row |
| R3.2a | Deploys tab milestones: date left (88 column), text right | `stack: true` rows — date over text (new `SettingsRow` `stack`, see R3.6) | his: *"date above the text … not side by side"* |
| R3.2b | Deploys tab: Latest deploy, then milestones | + **Recent deploys** between them: the last 10 Vercel deploys, label = project, value = `state · age` as a link to `https://<url>` (`target="_blank"`, `rel="noopener noreferrer"`). The deploys feed (`/api/metrics-deploys`) carries `url` but no project; the yearly feed (`/api/demo5-deploys`, already cached by the Deploys section) carries the project — joined on the deployment id. Milestones stay below, unlinked | his: *"Recent deploys list above the milestones … each row links to its deployment"* |
| R3.3 | active filters: `Tag variant="tertiary"` chips inside the Filter · dates · ⋮ row, click = edit, × = remove | their own line under the row, right-aligned under Filter (absolute under Filter; the row reserves `pb-9` only while a filter is active); each `Button variant="tab-filled" size="sm"` mono 12, `normal-case` — "Browser is chrome" as written — `iconRight="x"`, a click removes it; "Clear all" (2+ filters) rides the same line; Filter keeps its `Badge` count. `Tag` import and the now-unused `groupOf` dropped | his: *"leaves the … row"*, *"the filled tab chip … case as written"*. Click-to-edit is gone (a × inside a button cannot be its own button); Filter › field still edits |
| R3.4 | **system** — select `Dropdown` panel (`.kol-dd-panel`): the trigger tone's floating surface (`--kol-tone-panel-bg` → `--kol-tone-bg`), no shadow — the sites panel ("0 of 6 sites") melted into the page | `.kol-dd-panel` `background-color: var(--kol-oq-08)` + `box-shadow: var(--kol-shadow-float)` — `.kol-dd-menu`'s look, one rule in kol-theme, every select Dropdown (no metric override) | his: *"the same faint raised panel as the menus"*. Estate-wide: every select panel changes ground; outline keeps its border |
| R3.5 | `s` reported as not opening shortcuts | **no change** — every key in `SHORTCUTS` checked by Playwright: D R H W F N M P Y L A pick their ranges, T = last 30 days, **S = Last 6 months** (2 May – 30 Oct; also with the rail open), X compare, E edit layout, C custom dialog, Esc closes, `,` rail, `?` the shortcuts overlay, ⌘K search | `s` is bound to **Last 6 months** (plausible.io's hidden key, as listed); the shortcuts list opens on `?` |
| R3.6 | **system** — `SettingsRow` had no stacked form | `SettingsRow` `stack` (label over value, both at the start; `labelWidth`/`align` ignored) and `SettingsSections` row `stack` pass-through | R3.2a, drawn by the rail's own row instead of a hand-set stack |

**Verified (Playwright headless, 1400×900, vite :5321 — PID 78377/78415, killed after).** Light + dark shots in `…/scratchpad/shots/`: `r3-1-settings-site-*` (three Visit buttons = dropdown width) · `r3-2-deploys-*` (10 linked rows, `_blank`; milestones stacked) · `r3-3-filter-chip-*` · `r3-4-sites-dropdown-*` (raised panel) · `r3-5-press-s-*` (dates read "2 May - 30 Oct"). Not published.

### Round 4 — the Menu* family

One family, one prefix (his naming law). Names as he approved them; nothing published.

| # | Before | After | Why |
|---|---|---|---|
| R4.1 | `Dropdown items` + `trigger` (round 2, never published): the action menu inside `Dropdown.jsx` (`DropdownMenu` · `MenuRows` · `menuTrailing`) | **`Menu`** in `packages/component/src/molecules/Menu.jsx` — the same code, moved: `trigger` render prop + `items` (`{ heading }` · `{ divider }` · rows with `icon` · `trailing` · `current` · `checked` · `kbd` · `disabled` + `tooltip` · `items` flyout), `align`, `minWidth`, `children`, plus **`search`** (`{ placeholder, empty }`: the field above the rows, filters by label) | the base of the family. The label row stays keyed `heading` — `label` is already the row's text |
| R4.2 | `Dropdown` = select + action menu | `Dropdown` is the select only (`options` / `value`); `Kbd` · `Tooltip` imports and the `items` branch gone; its `.kol-dd-panel` round-3 look untouched | his list |
| R4.3 | `MoreChip` (`Report.jsx`), chip triggers hand-passed `variant="tab" size="sm" pressed` | **`MenuTrigger`** — `Button variant="tab" size="sm"`, `pressed` while open; `iconOnly` (true) = the `more` glyph turned 90°; `icon` / `iconComponent` lead | one trigger |
| R4.4 | `.kol-dd-menu` · `-row` · `-rule` · `-heading` · `-kbd` (kol-theme, unreleased) | **`.kol-menu-panel`** · `.kol-menu-row` · `.kol-menu-rule` · `.kol-menu-label` · `.kol-menu-kbd`; `.kol-dd-menu` kept as a `@deprecated` alias rule of the panel (ledger row). **`MenuPanel`** = that panel as a part; **`MenuLabel`** = the heading row | the look stays in kol-theme, renamed to the family |
| R4.5 | `MenuDropdownItem` · `MenuDropdownDivider` · `MenuDropdownNest` | **`MenuRow`** · **`MenuDivider`** · **`MenuFlyout`** (same functions, renamed in `MenuItem.jsx`); the old names are `@deprecated` aliases, 3 rows on the retirement ledger (2026-10-31, 30 days). `Dropdown` uses the new names; ContextMenu · MultiSelect · ShapeDropdown · MenuPopover · SplitToolButton · Combobox · MediaLibrary · LayerStack · AppItemMenuProvider · design-editor · rack-hub · stylesheet still import the old ones and work (the gate counts kol-fxr ×17, kol-monitor ×2, kol-website ×2 imports outside) | his list |
| R4.6 | `DemoSeven.jsx` FilterMenu (`Dropdown items` + chip trigger + `Badge`) and the chip line (`Button tab-filled` ×, Clear all) | **`MenuFilter`** — `groups` (`{ key, label, icon, fields, more, disabled: 'why' }` · `{ divider }`), `onPick`, `active` chips + count, `onRemove`, `onClear`. Metric passes `FILTER_GROUPS` + `FILTER_WHY` + its filters as text | ready-made; metric holds data |
| R4.7 | dates + compare: two `Dropdown items` with chip triggers | **`MenuDatePicker`** ×2 — `groups` (`[[{ key, label, kbd }]]`), `value`, `onChange`, `label`, `iconComponent` (metric's `CalendarIcon`), `compare` row | ready-made |
| R4.8 | graph ⋮, card ⋮ (`CardMenu`), series ⋮ — `Dropdown items` under `MoreChip` | **`MenuMore`** ×3 (`minWidth` 224 · 200 · 200) | ready-made |
| R4.9 | `Report.jsx` `TabMenu` (`Dropdown items` + `TabButton` trigger + own search state) | inline **`Menu`** in `Card` with `search` and `TabButton` + caret as its trigger. **`MenuTrigger` does not cover it**: the card tab is an underline tab on the rule, not a chip — `TabButton` stays (it also draws the plain tabs) | his "if MenuTrigger covers it" — it doesn't |
| R4.10 | — | showcase: `previews/Menu.jsx` (`rows` · `search`), `MenuFilter.jsx`, `MenuDatePicker.jsx`, `MenuMore.jsx`; the parts are **members of `Menu`** in `component-groups.js` (as `MenuItem`'s were) — no own page; classification `overlay` ×10; registry descriptions ×10; the old three on `DEPRECATED`; inventory rows; `previews/Dropdown.jsx` back to primary · grey · outline | a component gets a preview and its rows |
| R4.11 | — | **`MenuBar` parked** — not built (`MenuItem` remains the bar entry) | his list |

**Acceptance (Playwright headless, 1440×1000 @2x, vite :5322 — PID 26539/26565, killed after).**

| Check | Round 3 | Round 4 | |
|---|---|---|---|
| Filter · dates · ⋮ triggers | 91×26 · 134×26 · 26×26, `4px 12px`, radius 4 | 91×26 · 134×26 · 26×26, `4px 12px`, radius 4 | = the Visitors chip, light + dark |
| Filter panel | 224×435 | 224×435 | light + dark |
| dates panel | 224×585 | 224×585 | |
| graph ⋮ panel | 224×155 | 224×155 | |
| flyout | 200×46 | 200×46 | |
| series ⋮ | 200×160 | 200×160 | |
| card ⋮ | 200×108 | 200×108 | |
| panel paint | oq-08 · 8px · float shadow | same (`kol-menu-panel`): light `srgb .908`, dark `srgb .143` | one rule, renamed |
| filter flow | chip "Browser is chrome ×", Filter `1` | same | `MenuFilter` |
| local menu/trigger components in `apps/metric` (`MoreChip` · `TabMenu` · `CardMenu` · `FilterMenu`, `Dropdown items`) | 4 | **0** | grep |
| `!` overrides in `apps/metric` | 0 | **0** | grep |
| PascalCase functions/consts in `apps/metric/src` without a Scan row | 10 | **0** | re-run check |

Gates: retirements (the four new rows listed, none failing; other R3/R4 lines pre-existing) · taxonomy · roster (565) · preview-files (353 rendered) · groups · syntax · imports · relative-imports — clean. Shots `…/scratchpad/shots/r4-{filter,flyout,dates,graph,series,card,cardtab,filter-chip}-{light,dark}.png`. Not published.

## Report

**Counts.** Raw `<button>` in `apps/metric/src`: **11 → 0** (10 in the brief; the 11th was `Sections.jsx:251`). Hand-styled menus: **6 → 0** (Filter, dates, compare, ⋮, card ⋮, series ⋮ — all `Menu`). Local look-alikes left: **4** — `Card`/`CardHead`/`Card11` (one report-card anatomy), `List`/`Row`/`Trend` + Goals rows (one bar list), `Details`, `Chart`.

**Kept local, and why.** None of those four has a KOL part that does the job with a minimal prop: `DashListCard` has no tabs, no tab-menus, no expand, no click-to-filter bar rows, no trend; `TabsRow` cannot hold a tab that opens a menu; `LineChart` has no comparison line, dotted unfinished bucket, pinned tooltip, click-to-zoom or fitted axis. Each is a new component — `ReportCard`, `BarList`, a time-series chart — not a prop. Next round, if he agrees. Dead paths (`MetricsDashboard.jsx`, `Sections.jsx`'s pre-/demo-10 parts, `SettingsDialog`, `ChartTitle`/`Split`) stay until the `nine`/`ten`/`eleven` switches are collapsed — one change, its own.

**Verified (Playwright, 1440×900, vite on :5318 — killed after).** Menus measured before/after: Filter 224×435, row 216×38, flyout 200×46, dates 224×585, ⋮ 224×155, series 200×160 — identical. Pixel diff before/after, full page light + dark: only the series ⋮ (2px, change 11) and icon ink (change 24). Filter flow: Filter › Browser › Browser → modal → Chrome → Apply → chip `BROWSER IS CHROME ×` in the toolbar, Filter `1`. Gates clean: taxonomy · roster · preview-files (346 rendered, `Menu` included) · syntax · imports · relative-imports · groups. The browser gate `validate-previews` (outside the default `pnpm validate`) was stopped after 21 minutes without finishing; its partial output named only pages this run did not touch.

**Screenshots** (`…/scratchpad/shots/`): `rebuild-light.png` · `rebuild-dark.png` · `rebuild-menu-filter.png` · `rebuild-menu-dates.png` · `rebuild-menu-graph.png` · `rebuild-menu-series.png` · `rebuild-menu-card.png` · `rebuild-filter-modal.png` · `rebuild-dark-filter-modal.png` · `rebuild-filter-chip.png` · `rebuild-deploys-tab.png`. Before: `…/scratchpad/pre/pre-*.png`.

## Round 5 — modal variants

| # | Before | After | Why |
|---|---|---|---|
| R5.1 | prompts hard-wired to surface-primary + fg-08 hairline; Dialog hard-wired to `.kol-overlay-panel` | `variant="lift" \| "bordered"` on ModalProvider, every prompt call and Dialog; defaults unchanged (prompts bordered, Dialog lift) | user: *"do we not use variants for different styles?"* — two looks, one prop, he picks the default |
| R5.2 | apps/overlays: one Modal group, no Dialog | `Modal · bordered` and `Modal · lift` groups, each with prompt · confirm · confirm + options · alert · Dialog | both variants comparable in one place; measured light + dark |
| R5.3 | `DashTooltip` = its own `.dash-tooltip` box (surface-primary, 12% hairline, 8–10px caption) | `.kol-tooltip` (KOL tooltip: mono 11, tooltip surface, oq-08 hairline); `.dash-tooltip` = placement only | user: *"what is this tooltip/popover? not ours?"* — one tooltip in the system |
| R5.4 | Heatmap hour labels blank between ticks → hover read "Wed, C10: 2" | full labels (`0h`…`23h`) + `colTick={3}` for the axis | the tooltip names the real hour ("Tue, 12h: 1"), axis unchanged |
| R5.5 | open select: trigger on its tone, panel raised to oq-08 — two grounds in one control | `.kol-dd-trigger--open` takes the panel's oq-08 | user: *"why are there two TONEs in one component here?"* — measured equal, light + dark |
| R5.6 | `TopStats.jsx` Combined drew `data.data[i]` while a new pick was still loading — `TypeError … buckets` | stale results (length ≠ picked) are not drawn | user hit it "all the time" |

## Round 6 — the filter

| # | Before | After | Why |
|---|---|---|---|
| R6.1 | active filters = filled chips on a line under the toolbar (`pb-9` reserved), a count `Badge` on Filter | an "Active" section at the top of the Filter menu (MenuLabel, one MenuRow per filter — "Browser is chrome", click edits, × removes, "Clear all" at 2+), a rule, then the categories; no chip line, no count; the Filter trigger holds its pressed ground while any filter is set (built into `MenuFilter`) | user: *"dont put this tag there, it breaks the layout. put either in same row or hide in a dropdown"* · *"this bullshit, is bullshit what does it even mean"* · *"theres nothing in the dropdown about tags?"* |
| R6.2 | Page · Source · Browser · Operating system each a › flyout holding one row of the same name | a group with exactly one field is a plain row that opens its dialog; Location (Country · Region · City) keeps its flyout | user: *"browser/browser? … why is there just one thing in browser? shouldnt the group be wider scope?"* — Umami carries no browser/OS version, so Browser has one field; the data's fields per group: Page `path`, Hostname `hostname`, Source `referrer`, Location `country` `region` `city`, Browser `browser`, OS `os`, Goal `event` |
| R6.3 | Screen size disabled ("Umami cannot filter by this") | Screen size → Umami's `device` (mobile · tablet · laptop · desktop — its screen-size class, the Devices card's third tab), a plain row | the data carries it; it was the one field the menu left out |
| R6.4 | FilterDialog: kol-helper-14 caps title, Combobox value field, `primary` Apply + `ghost` Cancel, left-aligned, `--kol-pad-card-lg` | the useModal prompt's parts: `p-5` `gap-4`, kol-mono-12 `text-emphasis` title, Cancel `size="sm"` + Apply `tone="inverted" size="sm"` right-aligned; operator = the outline sm Dropdown; value = the same outline sm Dropdown fed by the data for `is` / `is not`, the prompt's `Input variant="outline" size="sm"` for `contains` / `does not contain` or a field with no data | user: *"wrong dropdown"*, *"wrong search input"*, *"wrong buttons"* — `useModal().form` is Inputs only and sits at z 1000, above KOL's floats (z 210+), so a select's list could not show in it; Dialog (z 150) with the prompt's parts. Matched against the `lift` prompt in apps/overlays, light + dark |
| R6.5 | MenuDatePicker trigger a quiet tab at rest; panel 4px under it | the trigger holds a value, so it wears its chip at rest — the tab's pressed oq-08, measured equal to `.kol-menu-panel`'s ground (light + dark); the panel opens right-aligned, 8px under it (`Menu` gains `offset`, default 4 for the rest of the family) | user: *"relation ship between tab and dropdown is much better at reference"* — plausible.io measured live: 8px gap, right edges flush. Its chip (10px pad, 32 tall, 14px type) is on its own scale; ours stays on the KOL sm rung beside Filter |

## Round 7 — the triggers, as Plausible

| # | Before | After | Why |
|---|---|---|---|
| R7.1 | date trigger filled at rest (R6.5); Filter/date had the tab's oq-04 hover | labelled `MenuTrigger`s (`.kol-menu-trigger--quiet`): no ground at rest, none on hover, oq-08 only while open (= the panel); the ⋮ keeps its hover | user: *"its not supposed to be solid, only bg on [click] … no hover just click … only [...] has hover"* — measured: rest/hover transparent, open = panel, light + dark |
| R7.2 | Filter / ⋮ menus 4px under their trigger | `offset={8}` on MenuFilter and MenuMore, as MenuDatePicker — right edges flush | Plausible measured 8px |
| R7.3 | menu triggers rested at the tab's meta ink (fg-48) | every `MenuTrigger` (Filter · date · every ⋮) rests at fg-80 (`.kol-menu-trigger`) | user: *"and default bring opacity up on all of them"* — measured 0.8, light + dark |
| R7.4 | the ⋮ = kol-icons `more` turned 90° (`rotate-90`) | new kol-icons `more-vertical` (nav, solid, dots at 12·5 / 12·12 / 12·19), no rotation; 16px | user: *"just make a vertical version"* — every ⋮ checked |

## Before kol-component is released

- The dock's slot hover (kol-shell 0.95.0, HomeDockRound4) is a Tailwind class forced over TabsRow's inline slot background. Move it into TabsRow (a slot hover state + a ref through to the slots), then drop the override in AppFloatNav.

| R8.1 | 0.208.0 put every select back on its own tone, undoing R3.4's raised panel | Dropdown `variant="raised"` (oq-08 trigger · open trigger · panel + float shadow); the sites select uses it; the default select keeps 0.208.0 | user: *"I dont wanna break anything, should we just make a variant?"* — both rulings hold: R3.4 "same as the menus" and "one tone closed or open"; measured rest = open = panel, light + dark |

## Round 9 — responsive (from kol-website)

| # | Before | After | Why |
|---|---|---|---|
| R9.1 | CardHead title and switch side by side at every width | title `hidden md:flex`, right group `ml-auto` | the two never fit a phone's ~300px card; the switch already names the view |
| R9.2 | weekday grid and deploy calendar squeezed to the card | each in an `overflow-x-auto` box with a floor: weekday `min-w-[400px]`, calendar `min-w-[640px]` | 24 hours of dots and 53 weeks stay legible; narrower, they scroll inside the card |
| R9.3 | TopStats tile rows auto-fit minmax(140/150px) | `grid-cols-2 md:grid-cols-3 xl:grid-cols-6`; the grid runs 1px past an overflow-hidden parent so no row starts or ends with a stray rule | a row never strands one tile |
| R9.4 | Numbers: first item unpadded, rules between, minmax 140 | phone stacked with top rules, no indent; from sm every item `pl-[17px]` + left rule, grid `-17px` inside an overflow-hidden wrapper; minmax 160 | each wrapped row's first item is flush with the card edge |
| R9.5 | Card11 footer one line; Goals counts 8ch×3 gap-4 | footer `flex-wrap gap-y-2`; Goals below sm 8ch·6ch·6ch gap-2, names wrap; from sm 8ch×3 gap-4 + truncate | the goal name keeps room on a phone |

kol-dashboards 0.7.1: `CalendarHeatmap` skips a month label within two week-columns of the next ("OctNov").
