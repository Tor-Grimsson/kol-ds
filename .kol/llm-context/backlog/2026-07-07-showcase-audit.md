# Showcase audit — responsive, correctness, consistency (2026-07-07)

Method: automated Playwright sweep of **every route** (13 core pages + 113 component pages + 22 blocks (+22 previews) + 7 sets (+14 previews)) at 375/768/1440 measuring horizontal overflow, offending elements, console errors, error-boundary trips, 404 stubs — plus a full source sweep of breakpoint/container/grid patterns, plus screenshot verification of every flagged spot. Screenshots in session scratchpad (`audit/`). NB: first sweep ran against port 5173 which is a *different app* (kol-client-canalix-contract) — voided; all data below is from the showcase on **:4788**.

## P0 — root causes

### 1. kol-theme ships unlayered CSS → Tailwind utilities silently lose to every kol-* rule
Tailwind v4 puts utilities in `@layer utilities`; kol-theme has **zero `@layer`** (verified: no match in `packages/theme/`). Unlayered CSS beats all layered CSS regardless of order/specificity. Any `hidden`, `block`, `w-*`, `rounded-*`… utility on a KOL component that touches a property a kol-* rule also sets **does nothing**.

Proof: TopBar search `<Input className="hidden sm:block">` (`showcase/src/lib/TopBar.jsx:45`) — className lands correctly on the shell `<label>` (`packages/component/src/atoms/Input.jsx:60-67`) but `.kol-control { display:inline-flex }` (`packages/theme/kol-components-atoms.css:52`) overrides `display:none`. Search renders at every width.

Fix direction: wrap kol-theme rules in `@layer components` (shadcn model — utilities can then override chrome). Package-level change, changeset required, README cascade-order docs unaffected (§5 order still applies for custom-property definitions).

### 2. Every page side-scrolls: TopBar overflows 14px @375 / 82px @768
Right cluster (`ml-auto flex items-center gap-3`) is a fixed ~285px: search visible when it shouldn't be (finding 1) + GitHub icon + theme toggle. @375 GitHub is half-clipped, toggle fully off-screen. @768 the 7-link nav (`hidden md:flex`) appears at exactly the width where wordmark+nav+search+icons need 850px → 82px overflow until ~860px. Even with finding 1 fixed, the md reveal is too early.

### 3. Docs chrome has no mobile navigation at all
- TopBar links `hidden md:flex` (`lib/TopBar.jsx:32`) — no hamburger anywhere
- DocLayout sidebar `hidden … lg:block` (`lib/DocLayout.jsx:56`) — vanishes, no drawer
- TOC `hidden … xl:block` (`lib/DocLayout.jsx:84`)
- Search `hidden sm:block` — four staggered reveal breakpoints in one shell

<768px the site exposes only wordmark + GitHub + theme toggle; every docs page is a navigational dead end. The repo already contains the correct pattern: workshop shell's hamburger + `ShellDrawer` portal drawer with backdrop + scroll-lock (`workshop/shell/ShellLayout.jsx:96-103`, `ShellDrawer.jsx`). Docs shell should adopt it.

## P1 — correctness bugs

4. **ChessBoard gets an invalid FEN** — `w:Invalid FEN provided to ChessBoard, reverting to start position` on every chess surface (/sets, /sets/chess-apparatus, previews). Board silently shows the wrong position.
5. **`.dash-grid` container-query trap** — base is 2-col, upgrades to 4-col only inside `@container (min-width:540px)` (`workshop/dashboards/dashboard.css:5,15`). `layout/DashboardGrid.jsx:22` sets `containerType:'inline-size'` correctly, but `workshop/metrics/MetricsDashboard.jsx:316,440,514,569` render `.dash-grid` with **no container-type ancestor** → permanently 2-col at every width.
6. **Home wall card defects @1440** (flagship page): Deploys card table clipped mid-letter, no scroll affordance; Traffic-mix card is a stat floating over a large empty area (no chart); asset-grid card renders 8 blank grey boxes.
7. **GameArchiveTable perma-“Loading…”** — "0 of 106 months loaded · 0 games in memory" in the chess composition gallery at rest.
8. **MenuItem `defaultOpen` demo spills past its card** at 375 (open panel crosses the card boundary to the viewport edge).
9. **`.kol-sidenav-toggle` pokes 12px past the viewport** at 1440 (absolute-positioned outside its rail) — /components/side-nav + /docs/shell-and-layout.
10. **Hardcoded stale version badge** — `Home.jsx:315` "Source-available · v0.1.1"; live versions are component/framework 0.1.2, loader 0.2.0. Read from package.json instead.

## P2 — consistency (full detail from source sweep)

11. **Six page-level max-widths**: 3xl(768) / 5xl(1024) docs contract, then `1232px` chess, `1400px` CollectionLanding + 3 sets, `1600px` Home wall, `1800px` workshop shell. Blocks & Sets landings (`lib/CollectionLanding.jsx:99-121`) bypass DocLayout entirely.
12. **Masonry walls disagree**: Home `columns-1 sm:2 lg:3 xl:4` (`Home.jsx:355`) vs Components `columns-1 sm:2 lg:3` (`Components.jsx:102`).
13. **Card-grid first break forks sm vs md**: bento-wall/CollectionLanding collapse at sm; article-grid (`blocks/article-grid.jsx:93`), stack-blog (`sets/stack-blog.jsx:246`), filter-bar collapse at md.
14. **Prose caps fork 4 ways**: 65ch (DocHeader), 58ch (Home, CollectionLanding), 60ch (Foundations pages), 52ch (CollectionPage).
15. **Three parallel breakpoint systems**: Tailwind min-width; chess CSS desktop-first `@media (max-width:1024px)` (`chess.css:593`); shell.css invents `@media (min-width:1600px)` (`shell.css:247` — off the Tailwind scale); dashboard `@container` 540/768/1024.
16. **Fixed grids, no fallback**: `grid-cols-3` in all three sidenav blocks + `prints-store.jsx:156`; `grid-cols-2` inspector-panel; `grid-cols-5` chess PlaybackControls + AlternativeControlsMock.
17. **Nav-rail width fork**: 240px (`lib/LabeledSection.jsx:22`) vs 256px (`workshop/shell/ShellLayout.jsx:79`).

## P3 — visual treatment

18. **Mobile tables scroll with zero affordance** — `.kol-table-wrapper` is `overflow-x:auto` (verified), but no gradient/shadow hint; @375 they read as clipped (foundations/color +478px hidden, typography +209, docs-shell +125, docs-loaders +164). Docs-shell props table @375 also renders grotesquely tall rows (squeezed description column).
19. **DemoStage `hug` canvas has a fixed tall stage** — Button preview is ~320px of mostly dead space for one row of buttons.
20. **Featured-strip card buttons clipped** on /blocks (+111) and /sets (+97) landings @375 (contained by card overflow, still reads cut).

## Second pass — user-reported, confirmed (2026-07-07, same session)

Three defect families the first sweep missed (mechanical overflow detection can't see them; the eyeball set didn't include the block viewer or icons page):

21. **Non-`full` stages render squished in the block viewer / standalone preview.** `CollectionPreview` wraps DemoStage in a shrink-wrapping flex item (`<div className="m-auto">`, `lib/CollectionPreview.jsx:33-38`); DemoStage's `w-full max-w-[20rem/28rem]` resolves against intrinsic content width during flex sizing, so the block collapses to min-content (color-picker renders ~200px instead of 320px, centered in a vast empty canvas). Affects all five non-full blocks: `color-picker`, `inspector-panel` (sm), `color-tools`, `command-palette`, `settings-form` (md). Fix: give the wrapper `w-full` and centre the stage itself (`mx-auto` on DemoStage), or use fixed stage widths in the preview route.

22. **`full`-stage preview canvas has zero padding and blocks inconsistently own their section padding.** `CollectionPreview` full branch renders `<C/>` straight into an unpadded `h-dvh` div (`lib/CollectionPreview.jsx:21-28`). `feature-showcase` (via `FeaturesCardSection`) brings no horizontal padding of its own → headline flush against the frame edge. Contract gap: marketing-band blocks must carry their own section padding (shadcn model) — audit each `full` block for it, or the preview canvas needs a documented rule.

23. **Icons page keyline overlay never aligns with the icon.** `KeylineBg` stretches `width/height="100%"` over the whole tile, but the tile is `size + 16` while the icon renders at `size` centered (`pages/Icons.jsx:23-40`, `lib/icon-controls.jsx:36-56`). The 24-grid keylines are drawn 25% oversized relative to the icon box at every size — icons read as mis-positioned/mis-scaled against the guides even when they're not. Fix: mount KeylineBg inside the icon-sized span (or `inset: 8px`).

24. **Icon inventory is optically un-normalized** — visible at size 48/64: different source sets drawn on different grids and stroke weights (`adjust` thin/underscaled, `al-1`/`al-2` chunky full-bleed, `bold` tiny glyph, `check-set-2` heavy filled). This is an asset-level issue in the kol-loader inventory (885 icons from mixed origins), not a page bug — needs a per-icon QA/normalization pass against the 24-grid keyline spec. Related minor: tile colors hardcoded (`#FFFFFF`/`#0E0E11` + white border invisible on light bg) instead of tokens; labels truncate aggressively at large sizes (`arrow-from-b…`).

## Clean

All 113 component pages (except side-nav #9), all 22 blocks + previews, all 7 sets + previews: no page-level overflow beyond the systemic TopBar, **zero error boundaries tripped, zero React warnings, zero JS errors, zero 404 stubs**. The component library itself is in good shape — the damage concentrates in chrome (TopBar/DocLayout), the theme-layer mechanism, and a handful of data-driven demos.

## Proposed fix sequence

> **EXECUTED 2026-07-07** — all six phases landed the same day (session log `2026-07-07-showcase-fix-phases-1-6.md`). Residuals: MenuItem page 8px side-scroll at 375 (floating-ui shift padding, kol-component internals); icon redraw/normalization work itself (ledger: `2026-07-07-icon-qa.md`).

1. **Layer kol-theme** (`@layer components` around kol-theme rules) — one package change unlocks utility overrides everywhere; changeset (minor).
2. **One chrome**: docs shell adopts workshop's drawer — hamburger <lg, sidebar/TOC as-is ≥lg, nav links lg+ not md+, search inside drawer on mobile. Kills findings 2, 3.
3. **Breakpoint law** (write into docs/documentation, then sweep): two content caps only — reading column (3xl/5xl wide) and gallery/full (1400); grid collapse 1→sm:2→lg:3 (xl:4 walls only); one prose cap 65ch; card grids break at sm; kill the 1600/1800/1232 caps; 256px rail everywhere; chess/shell CSS onto Tailwind-scale min-width queries.
4. **Component fixes**: FEN string, dash-grid container wrappers, home-wall cards (deploys/traffic/assets), MenuItem demo stage, sidenav toggle offset, version badge from package metadata, kol-table-wrapper scroll affordance.
5. **Preview-stage contract** (second-pass findings): fix CollectionPreview shrink-wrap (#21), audit `full` blocks for owned section padding (#22), mount KeylineBg on the icon box (#23).
6. **Icon inventory QA** (#24): separate pass — normalize the 885 icons against the 24-grid keyline spec; bigger than a showcase fix, belongs to kol-loader.
