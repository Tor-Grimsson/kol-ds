# Playbook — icon gallery, References, CompareGrid, ⌘K, Templates

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build every non-TALK phase of `plan-2026-10-17-icon-gallery-and-references.md` (W1–W6; 5.3 and 6.4 wait on rulings).

**Standing rules (non-negotiable):**
- each phase closes on its acceptance line: gates green, then Playwright in the user's view (2000px)
- receipts only after the version is live on the registry
- never delete — `_tmp/<date>-<what>/`; no git

---
## Entries

[21:35 CEST · 2026-10-17] · setup · playbook created
  what → initialised the live playbook   why → /kol-goal "get it done" on the plan

[21:41 CEST · 2026-10-17] · 4.1 ✓ · packages/component/src/atoms/IconPlate.jsx
  what → IconPlate + KeylineGuide (box = size, specimen ground, keyline grid); showcase KeylineBg + open-questions round 10 Plate ride it
  verify → taxonomy · roster · previews · props · frontmatter · syntax · native-title · icon-ink ✓

[21:41 CEST · 2026-10-17] · 1.1 · 1.2 · 1.3 · 2.1 ✓ · showcase/src/pages/IconsGallery.jsx
  what → own Tile on IconPlate (no ContentCard, no zoom), names whole, type steps 10/12/14 by plate, column = max(2×plate, name floor); list thumb = size; guide IconToggle + LIST/GRID TabStrip in the one control row
  verify → Playwright 2000px dark: plate = size ±0 at 16–128, guide = plate, hover still, cols 13·13·12·10·10·9·4, text overflow 0, list thumb = size 16–64, 0 console errors

[21:50 CEST · 2026-10-17] · 4.2 ✓ · packages/component/src/organisms/CompareGrid.jsx
  what → A beside B on IconPlate, sides named, toolbar size · ground · guide · state filter (consumer's states), candidate on an empty side
  verify → monitor's 116 (110 redrawn · 5 missing · 1 same) at 96 + guide, filter narrows, 0 errors

[21:50 CEST · 2026-10-17] · 4.3 ✓ · packages/shell/src/HubDev.jsx · AppHub · AppStudio
  what → dev={{ tabs }} slot: dev server only, code row above Settings, /dev; tabs own row + one line each; anatomy rows in 16-app-anatomy.md
  verify → dev: one row, 2 tabs, 116 tiles, tab remembered; prod build: no row, no page
  note → HubDev's code still ships in a prod bundle (statically imported) — never rendered

[21:50 CEST · 2026-10-17] · 4.4 ✓ · showcase/src/lib/devSpace.js · ShellChrome · Search · shell-nav
  what → Development: dev server always; site hidden until D (sessionStorage), out of tabs + ⌘K + search page; icon code
  verify → prod build preview: hidden 0 / D → 1 / reload 1 / D → 0; ⌘K 'phase log' none hidden, 3 shown

[22:21 CEST · 2026-10-17] · 3.1 · 3.2 · 3.3 ✓ · showcase References · lib/referenceTree.js · pages/ReferenceSlice.jsx · scripts/validate-rail-pages.mjs
  what → References a group: home (top 10 · slices · how to read) + Components · Tokens (6 concerns) · Classes (6 concerns); canon ● + colour swatch on Tooltip; P6 no loose page
  verify → 16 pages render with an outline; 254 + 230 + 237 = 721; 0 [title]; rail-pages clean; P6 fails on a loose References, passes on the group

[22:22 CEST · 2026-10-17] · 5.1 · 5.2 ✓ · ShellSearchOverlay onBack/backLabel · ShortcutsOverlay currentPath + shortcutInScope · AppHub passes the path
  verify → harness: categories → Generators → arrow back (tooltip, focus stays), Backspace-empty back, 'noise' both layers; sheet on /dev: App + ELSEWHERE (Rack, Cables) muted, /rack all live

[22:44 CEST · 2026-10-17] · 6.1 · 6.2 · 6.3 ✓ · showcase Templates · lib/templates-registry.js · templates/*.jsx · pages/Templates.jsx
  what → Library › Composition › Templates (between Modules and Apps): home + header table; Document · Catalog · Gallery · Browser · Tool · Index · Dev (preview · anatomy · built from · used by); Blocks home + 8 blocks
  verify → 17 pages render with preview + outline, every built-from link opens its component page; rail-pages clean (112 groups, no loose page)

[22:47 CEST · 2026-10-17] · release ✓ · kol-component 0.265.0 · kol-shell 0.65.0
  what → published; registry checked live before the receipts; CompareGridDevTab + CommandOverlayModes closed, receipts to kol-monitor (§2 of CommandOverlayModes held as plan 5.3 TALK)
──────────── MILESTONE: plan-2026-10-17 W1–W6 ──────────── [22:47]
  changed: kol-component · kol-shell · showcase (gallery · References · Development · Templates) · rail-pages P6 · build ✓ (prod builds of harness + showcase)
  open: 5.3 · 6.4 TALK

[23:32 CEST · 2026-10-17] · round 2 · goal set
  what → dev favicon system · Round 11 fixes (uppercase, style names, sans description) · plan 5.3 · 7.1 · 7.2 · 8.1 · 8.2 · 9.1; 6.4 waits on the pick

[23:36 CEST · 2026-10-17] · T1 ✓ · packages/framework/src/vite.js devFavicon · showcase + 27 apps · 16-app-anatomy § Dev favicon
  what → one dev-favicon plugin (serve only, replaces the icon link): KDS + two letters per app on #7C5CFF; table of every app's label/ground
  verify → served index has one data-svg icon link; tiles legible at 16px
[23:36 CEST · 2026-10-17] · T2 ✓ · open-questions/2026-10-17.jsx
  what → E: case (Aa/AA) + description sans/mono switches; every specimen lists its text styles read off the DOM (D through its frame); "9 different text styles across A–D"

[23:38 CEST · 2026-10-17] · T3 ✓ · CommandOverlay (was ShellSearchOverlay, alias + ledger row) · AppHub S → shortcuts mode
  verify → harness: → opens / ← back / ↓→ Math / ← while typing moves caret; S: App · View then Elsewhere · Rack · Cables, 'lock' narrows, Enter runs; old name renders

[23:44 CEST · 2026-10-17] · T4 ✓ · framework vite.js loaderApp + src/loaderApp.js hideLoaderApp · showcase moved onto it (old index/main in _tmp/2026-10-17-loader/showcase-before)
  verify → harness: mark on #121215 / #FAFAFA, pulse, removed after paint; reduced motion: no pulse, 0s; showcase loads clean
[23:44 CEST · 2026-10-17] · T5 ✓ · LoaderIntro (foundry; IntroLoader · ColorLoader aliases) · sets/loaders.jsx
  note → LoaderIntro stays in kol-foundry: it is drawn by TextPressure and kol-component may not import foundry

[23:48 CEST · 2026-10-17] · T6 · T7 ✓ · Rail (was ShellDrawer; alias + ledger) · useDragResize top/bottom · 17-rail-and-overlay.md · docs swept to rail/overlay
  verify → bottom push rail: drag top edge up 60 → 140→203, collapse → 0; over · top at y 0 full width; over · bottom flush; nothing imports ShellDrawer but the alias

[23:51 CEST · 2026-10-17] · T8 ✓ · TabsRow look underline · chip · text · stacked + placement=phone; TabChips · MobileTabBar · TabStrip aliases (ledger); internal users moved
  verify → alias DOM identical to the new looks (chip · text · phone); stacked inline static at 1400 + 390; phone bar fixed, hidden ≥ md

[23:59 CEST · 2026-10-17] · T9 ✓ · kol-framework 0.50.0 · kol-component 0.266.0 · kol-shell 0.66.0 · kol-foundry 0.13.0 · kol-workshop 0.40.0 live → AppLoader · RailOverlay · TabsStackedLayout closed, receipts to kol-monitor
  verify → rail-pages clean (113 groups, no loose page)

[00:28 CEST · 2026-10-18] · 6.4 ✓ shipped · PageHeader level · media · description · xl; .kol-header-lede(-section) · devFavicon one letter
  verify → Round 11 renders from PageHeader: H1 96/96 Medium · P 22/28 Light +0.22px 72% · H2 48/48 · P 16/24 Light +0.5px 72%; favicon K
  release → kol-theme 0.175.0 · kol-component 0.267.0 · kol-framework 0.51.0
