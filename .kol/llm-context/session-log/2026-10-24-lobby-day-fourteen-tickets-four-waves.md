# Session: the lobby day — fourteen tickets, four waves, the rail kit

**Date:** 2026-10-24
**Agent:** Claude (Grim)
**Summary:** A watch-driven day: fourteen lobby tickets from dotfiles, monitor, mirror and kol-studio built and published in four waves — the card's back cover and the File Rail's images, the settings rail's Docs tab and a catalog that keeps its place on Back, three kol-studio fixes, then the rail kit with `apps/rails`, a true whole-card flip, FlipCard's face swap and a dark-default theme. Plus the Vercel build (a stale lockfile), apps/shell's site plane wash, and the AppShell adoption playbook.

## Changes Made

### Files Modified
- `pnpm-lock.yaml` — refreshed; Vercel's frozen install failed on kol-framework's peer bump
- `apps/shell/src/App.jsx` — `pageWash="var(--kol-fg-02)"` on the site `SiteLayout` so the rail edge reads
- `docs/operations/07-apps-tier/09-app-adoption.md` (new) — the AppShell playbook beside `08-site-adoption.md`; INDEX row, cross-linked (AppAdoptionPlaybook, dotfiles)
- `packages/component/src/molecules/ContentCard.jsx` · `packages/theme/kol-animation.css` — `back` + `backReveal` (flip-image · flip-card · hover), then `flipped` (controlled) and `backHover` (opt-in, default off); `flip-card` is a turner around the root — the whole card is the front face, the back a full face on the card's surface (AppCardBackCover, AppCardWholeFlip)
- `packages/component/src/organisms/AppItemMenuProvider.jsx` · `molecules/AppItem.jsx` · `ContentRow.jsx` — the File Rail's Files section: `images` as thumbnails, quicklook (`MediaInspector`, portalled), × and upload writing `onImages(next)`, Cover and Back picked (`onCover(src)` · `onBack(src)`, `null` on removal); the pencil in the foot row (FileRailImages)
- `packages/component/src/organisms/SettingsPanel.jsx` — `backdrop` and `mode` forwarded to its Rail (SettingsPanelBackdrop); `tier` (app · site), the header from `RailHeader`, the footer pinned (RailKit)
- `packages/component/src/molecules/Rail.jsx` — `variant="app" | "site"` (the tier's width and padding) and `footer` (pinned under the scroller)
- `packages/component/src/organisms/RailKit.jsx` (new) — `RailHeader` · `RailTabs` · `RailHint` · `RailActions` · `RailFoot`; `RailSection` = `LabeledControlSection`, `RailRow` = `SettingsRow` (barrel aliases); classified `member-of:Rail`
- `packages/theme/kol-design-tokens.css` — `--kol-rail-w-app` 320 · `--kol-rail-w-site` 380 · `--kol-pad-rail-app` · `--kol-pad-rail-site`
- `apps/rails/*` (new, 5206) — the rails reference: the parts, the settings rail, an inspector like fxr's, a list rail like monitor's patch table, the bottom rail; Tier on the Variants button; render routes, Apps page, apps-tier INDEX, root scripts and build chain
- `docs/documentation/04-compositions/19-rails.md` (new) — the kit, the tiers, the whole rails, fxr's inspector checked against it
- `packages/shell/src/CatalogPage.jsx` — the place per history entry (chips, search, LIST / GRID, the filter panel, the page's own view, the fixed region's scroll) restored on Back, fresh on a new entry (CatalogPageKeepsPlaceOnBack); `flipped` · `backHover` page-level
- `packages/shell/src/AppHub.jsx` — the settings rail's Docs tab from `app.docs`, Repo's links under About (SettingsRailDocsTab); `defaultTheme` / `app.defaultTheme` stamping `data-theme-default` (AppHubDefaultTheme)
- `packages/framework/src/theme.js` — `applyTheme('system')` lands on `data-theme-default` when the root carries one
- `packages/shell/src/HubHome.jsx` — files carry `back`, `images`; `onBack` · `onImages`; `flipped` · `backHover`
- `packages/hardware/src/frames/FlipCard.jsx` — faces swap by backface, the away face `inert` (FlipCardFaceSwap)
- `packages/theme/kol-components-atoms.css` · `kol-components-organisms.css` · `kol-components-molecules.css` — the site rail's dot in the row's ink; `.kol-table-cell-text--wrap` (Table `wrap: true`); the TOC rail capped at the frame's column with its labels ellipsized (kol-studio's three)
- `packages/component/src/organisms/Table.jsx` — a column's `wrap: true`
- `apps/rack-hub` — patches carry `back` + `images` (Output · Rack); `F` turns every card, Display → Hover flips card; `public/previews/patches` swapped for the real output frames (the old rack shots in `_tmp/2026-10-24-app-card-back-cover/old-patch-previews/`), racks at `public/previews/racks/` (1600)
- `apps/studio-hub` — files carry `images`; two `app.docs` sections; `defaultTheme: 'dark'`
- `showcase/src/open-questions/2026-10-24.jsx` (round 17, the card's back: three treatments) · `2026-10-24-b.jsx` (round 18, the app rail's width: 264 · 320 · 380)
- Docs: `06-content-card-system.md`, `16-app-anatomy.md`, `17-settings.md`, `06-studio-adoption.md`, `01-inventory.md`, the mdx for ContentCard · Rail · SettingsPanel · Table; changelogs; `02-shipped-packages.md`
- Published: kol-theme 0.187.0 → 0.189.0 · kol-component 0.299.0 → 0.301.0 · kol-shell 0.79.0 → 0.81.0 · kol-framework 0.55.0 · kol-hardware 0.7.0
- Lobby: ten tickets closed with receipts (dotfiles 1, monitor 3, mirror 2, kol-studio 3 — see `lobby/INDEX.md`); the walks in `_tmp/2026-10-24-*/walk.mjs`

### Features Added/Removed
- The card's back cover, its three treatments (round 17), the whole-card turn on a key, hover opt-in
- The File Rail's Files section; the settings rail's Docs tab; a catalog that keeps its place on Back
- The rail kit and the tiers' tokens; `apps/rails`; the AppShell adoption playbook
- A dark-default theme that survives reset; FlipCard's honest turn; three kol-studio fixes

## Current State

### Working
- Every walk green: back cover, File Rail, keeps-place, Docs tab, kol-studio wave, rail kit + FlipCard, whole flip, default theme; gates roster · taxonomy · imports · syntax · props · motion · vault-links · render (rails) clean
- Two visual calls open on the showcase: round 17 (the back's treatment — `flip-image` is the default until the ruling) and round 18 (the app rail's width — 320 in the tree)

### Known Issues
- **In flight:** the last wave (theme 0.189.0 · framework 0.55.0 · component 0.301.0 · hardware 0.7.0 · shell 0.81.0) is published and waiting at the registry; RailKit, FlipCardFaceSwap, AppCardWholeFlip (monitor) and AppHubDefaultTheme (mirror) are built, unpublished-until-live, their closes and receipts not yet written
- kol-branding closed `one-search-modal` without returning the receipt into `lobby/outbox/`; nothing owed here unless its row says so
- Pre-existing gate noise, the morning session's: `validate:headings` (phase-log `2026-10-24-site-hub.md:39`) and `validate:metadata` (`2026-10-24-home-library-one-card.md`), `validate:previews` (five component pages without a preview card)
- A walk's vite server was left on port 5397 (PID 44207) — the kill was refused here

## Next Steps
1. When the registry shows the wave: close RailKit · FlipCardFaceSwap · AppCardWholeFlip (receipts to kol-monitor) and AppHubDefaultTheme (receipt to kol-mirror); queue count −4
2. His picks on rounds 17 and 18; then the losing treatments and the width token settle
3. Push is his on this repo; the lockfile is in step with the published peers
