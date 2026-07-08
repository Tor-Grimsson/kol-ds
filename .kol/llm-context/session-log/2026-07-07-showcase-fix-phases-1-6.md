# Session: Showcase audit executed — fix phases 1–6

**Date:** 2026-07-07
**Agent:** Grim (Claude Fable 5)
**Summary:** Ran the full showcase audit (178 routes × 2-3 widths, mechanical + eyeball + source sweep), wrote it to backlog, then executed all six fix phases the same session: layered all KOL package CSS under `@layer components`, gave the docs chrome a real mobile drawer, wrote the breakpoint law + swept 16 offenders, fixed 8 component bugs, repaired the preview-stage contract, and produced the 885-icon QA ledger.

## Changes Made

### Packages (changeset `.changeset/layer-kol-css.md`, theme+framework minor)
- `packages/theme/kol-theme.css` — all 11 barrel imports now `layer(components)`; trailing token blocks wrapped. Utilities beat KOL chrome everywhere now (root cause of "utilities silently fail": unlayered CSS beats Tailwind v4's layered utilities).
- `packages/framework/kol-framework.css` — whole rule body wrapped in `@layer components`.
- `packages/theme/kol-components-organisms.css` — `.kol-table-wrapper` gained pure-CSS scroll shadows (scrollbar is hidden, so clipped tables read as cut-off data).
- `packages/theme/README.md` — layer contract documented.

### Showcase chrome
- `lib/SidebarNav.jsx` (new) — nav tree extracted from DocLayout, shared by sidebar + drawer.
- `lib/NavDrawer.jsx` (new) — portal drawer <lg (workshop ShellDrawer pattern: backdrop, scroll lock, Escape).
- `lib/TopBar.jsx` — hamburger <lg; nav links reveal at lg (was md — content needs ~850px); drawer wired.
- `lib/DocLayout.jsx` — sidebar consumes SidebarNav.

### Breakpoint law (phase 3)
- `docs/documentation/01-foundations/04-layout-breakpoints.md` (new) — Tailwind scale only, two content caps (reading column / 1400 gallery), lg chrome reveal, canonical grid collapses, 65ch prose, 256px rails, workshop/chess port exemption. Registered in INDEX + sibling `related:` backrefs.
- 16-edit sweep: Components wall xl:columns-4; Home wall 1600→1400; card grids first-break md→sm (article-grid, stack-blog, filter-bar, shell-topbar incl. its 1800→1400); fixed grid-cols-3 → 1/sm:3 (3 sidenav blocks, prints-store); prose 52/58/60→65ch (5 files); LabeledSection rail 240→256.

### Component fixes (phase 4)
- `workshop/chess/apparatus/ChessBoard.jsx` — chess.js v1 `load()` API misuse: warned on every SUCCESS and threw uncaught on the cleared board; now try/catch + manual piece placement for display-only FENs (empty board renders empty, not the start position).
- `workshop/metrics/MetricsDashboard.jsx` — 4 bare `.dash-grid`s wrapped with `containerType:'inline-size'` (were stuck 2-col forever).
- `showcase/src/index.css` — `--kol-palette-*` (14 vars) ported verbatim from monorepo `packages/ui/theme.css`; they were used by all dashboard charts but defined nowhere → every chart color rendered transparent (the "Traffic mix void").
- `demos/MenuItem.jsx` — reserves the open panel's space (portalled panel was overlaying neighbors in galleries).
- `demos/SideNav.jsx` — `relative` on the frame: the static-override demo left the absolute collapse toggle anchored to the viewport (the 12px page side-scroll on two pages).
- `pages/Home.jsx` — version badge reads `packages/component/package.json` (was hardcoded v0.1.1 at v0.4.0); wall cap 1400.
- `blocks/filter-bar.jsx` — result tiles are labelled `AssetPlaceholder`s instead of anonymous grey boxes.
- `pages/Components.jsx` — index cards use an overlay Link instead of wrapping demos in `<a>` (React anchor-nesting errors from demos containing real anchors).

### Preview-stage contract (phase 5)
- `lib/CollectionPreview.jsx` — `w-full` on the centering wrapper (shrink-wrap collapsed `sm/md` blocks to min-content — the squished color-picker).
- `lib/DemoStage.jsx` — capped stages carry `mx-auto`.
- 7 full-stage blocks gained owned section padding (article-grid, cta-band, palette-reference, sidenav-kol, type-scale, work-grid, feature-showcase) — measured flush at 0px in the bare preview.
- `pages/Icons.jsx` + `pages/IconsVariants.jsx` — KeylineBg mounts inside the icon-sized span (was stretched over the padded cell → guides permanently ~25% oversized).

### Icon QA (phase 6)
- `.kol/llm-context/backlog/2026-07-07-icon-qa.md` (new) — 885 icons measured live: all on 24×24 ✓; stroke forks 1.5 (556) / 2 (252) / 1.125 (32, machine-scaled); 67 undersized, 23 off-center, 35 no-stroke. Proposed normalization sequence (attribute passes first, redraws last). Redraws not attempted — design work.

## Current State

### Working
- Final regression: 47/51 route×width checks fully clean; 0 horizontal overflow anywhere (was 14px @375 / 82px @768 on EVERY page); zero console errors/warnings (chess FEN noise gone); drawer navigates; chart colors resolve; picker preview 320px centered.
- Verified against a fresh dev server on :5199 (the long-running 4788–4791 servers predate the package CSS edits; **:5173 is a DIFFERENT app** — canalix — don't test against it).

### Known Issues
- MenuItem component page: 8px side-scroll at 375 from the portalled open panel (floating-ui shift padding — kol-component internals; deliberately not touched).
- Icon inventory normalization itself is future design work (ledger above).
- All uncommitted; changeset joins the existing held pile (user owns git + publish).

## Next Steps
1. User visual pass over the changed surfaces (Home, /components, drawer, block previews, icons grid).
2. Icon normalization phase 1–2 (attribute-only passes) when the design call on 1.5-vs-2 stroke is made.
3. MenuItem shift padding if the 8px residual bothers.
