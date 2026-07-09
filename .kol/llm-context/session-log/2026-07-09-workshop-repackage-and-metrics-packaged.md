# Session: Workshop repackage (honest) + Metrics dashboard packaged

**Date:** 2026-07-09
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Audited which showcase "sets" are genuinely package-served vs. showcase-local fakes; honestly re-verified the `kol-workshop` package (no rebuild needed — it was sound, only the proof was theater); then packaged the metrics dashboard into `@kolkrabbi/kol-component/dashboards` following the chess pattern (import → scope/data-sever → fix → package), render-verified.

## Changes Made

### The "what's actually served" audit (no code — findings)
- Of the 7 sets, **6 are genuinely package-backed**; only **metrics-dashboard** rendered from a showcase-local file (now fixed, below). User's guess "Editor" was wrong — design-editor imports real `@kolkrabbi/kol-component` exports.
- **5 local subsystems under `showcase/src/workshop/`** shadow the packages and have **drifted** (`diff -rq` confirmed): `chess/` (7 gallery demos), `dashboards/` (15 demos + Home bento), `metrics/` (never packaged), `shell/` (`/workshop-preview`), `vendor/` (5 primitive copies). The package copies got the conformance sweep; the showcase copies are the pre-sweep originals.

### Workshop repackage (it was already sound — de-staled + honestly re-verified)
- `packages/workshop/package.json` — dropped stale "Private until…" clause from description.
- `packages/workshop/README.md` — brought current (was "Phase 1 engine only"): now documents engine + React layer + injection seam.
- `kol-monorepo/MIGRATION-workshop-package-brief.md` (separate repo) — render-status synced to "render-verified"; gotcha updated.
- **Render proof (real this time):** drove `/workshop-docs` shell + `/workshop-docs/0.0.1-getting-started` viewer — frontmatter parse, markdown, TOC, tag chips, quick actions — **0 console errors**, title-case labels (package CSS clean).

### Metrics packaged (`@kolkrabbi/kol-component/dashboards`)
- **NEW** `packages/component/src/dashboards/MetricsDashboard.jsx` — the view, moved from showcase. **Prop-driven** (data severed): takes `data` (the full metrics bag incl. `hostSummaries`), `milestones`, `mainHost`. Removed the internal `useMetricsData()` call, the favicon side-effect, and `HostSummaryCard`'s self-fetch (`/api/metrics-summary`).
- **NEW** `packages/component/src/dashboards/metrics-constants.js` — view-level tokens/formatters (RANGES, DEPLOY_STATE_*, TYPE_COLORS, PALETTE, MILESTONE_COLORS, formatB2Size, timeAgo).
- `packages/component/src/dashboards/index.js` — barrel: export `MetricsDashboard` + constants.
- **§3 fix:** SegmentedToggle import `@kolkrabbi/kol-component` → relative `../atoms/SegmentedToggle.jsx`; primitives → sibling `./index.js`.
- **Dead-class fix:** `.dash-label` (defined nowhere → silent fallback) → real `.dash-title`; `.scrollbar-none` (undefined) → added to `packages/theme/kol-components-dashboards.css` (Firefox `scrollbar-width` + WebKit pseudo).
- `showcase/src/workshop/metrics/useMetricsData.js` — sources RANGES/DEPLOY_*/formatB2Size/timeAgo from the package (re-exports them so Home.jsx keeps resolving `timeAgo`); returns `hostSummaries`.
- `showcase/src/sets/metrics-dashboard.jsx` — consumes `@kolkrabbi/kol-component/dashboards` MetricsDashboard; injects demo data + the kolkrabbi MILESTONES (now consumer content) + `mainHost`.
- **Deleted** `showcase/src/workshop/metrics/MetricsDashboard.jsx` (moved to package).

## Current State

### Working
- **Metrics render-verified** at `/sets/preview/metrics-dashboard`: milestone strip, host-summary cards, KPI cards + sparklines, `dash-title` heading, hidden scrollbars — **0 console errors**. The set now renders the PACKAGE view + PACKAGE dashboard primitives via injected data.
- **Workshop package** self-contained, render-verified, doc-current.

### Known Issues
- **Publish/PR gap (flagged to user):** working tree has **zero changesets** but versions are **hand-bumped** (component/theme 0.7.0, framework 0.3.2, icons 0.5.0). With no changesets, CI runs `changeset publish` on push → **push == publish, no Version-Packages PR**. Recommended reverting the bumps + adding changesets to restore the PR checkpoint. User decision pending.
- **My metrics edits are in component `src` → they ride the next component publish** (0.7.0). No separate bump.
- **Still un-unified:** the 15 standalone dashboard demos + Home bento + the 7 chess demos still import the drifted `showcase/src/workshop/{dashboards,chess}` local copies. Metrics-via-set is now on the package; the demos are not.
- **kol-workshop@0.1.0 is now on npm** (monorepo agent confirmed: 28 files, zero CSS). My README/description edits need a **0.1.1** bump to land (doc-only; repoint not blocked).

## Follow-on — standalone package extractions (same session)

Metrics was first packaged as a `component/dashboards` subpath, then **both dashboards and chess were extracted OUT of `component` into standalone packages** on the user's call (trigger: multiple consumers + independent versioning):

- **`@kolkrabbi/kol-dashboards@0.1.0`** — the whole `dashboards/` dir (primitives + charts + MetricsDashboard + metrics-constants). One escaping import fixed (SegmentedToggle → package specifier). `./dashboards` subpath dropped from component. Set + hook repointed. Render-verified `/sets/preview/metrics-dashboard` (0 errors).
- **`@kolkrabbi/kol-chess@0.1.0`** — the whole `chess/` dir + a bundled **`./data`** adapter (moved from `showcase/src/workshop/chess/data` — demo set `lightweight.js` ~136 KB + B2 CDN fetch for the 27k-game archive). **9 escaping imports** (Button/Input/Dropdown/Pill/Table/Tag) rewritten to `@kolkrabbi/kol-component`. `./chess` subpath dropped. Chess set + all **7 chess demos** repointed; drifted `showcase/src/workshop/chess/` **deleted**. Render-verified `/sets/preview/chess-apparatus` (0 errors — 106-month archive, table, board, pieces live). 11 console warnings are pre-existing legacy-icon deprecations, not regressions.
- **`@kolkrabbi/kol-content@0.1.0`** — the CMS content system (**stack + work**, both Sanity streams): 9 editorial components moved out of `component` (StackHero/ArticleHeader/ArticleCard/PortableTextRenderer + WorkCard/WorkListItem/WorkViewToggle/ParallaxShelf/ScrollDriftGallery) + **3 new pieces** built (`AuthorLine` unburied from ArticleHeader, `ShareButtons`, `SourcesReferences`). **Conformed:** auto-`uppercase` killed on author name / kicker / meta (ArticleHeader, ArticleCard) + ContentFilters inline. Core primitives (`ContentFilters`/`DropdownTagFilter`/`ShellSearchOverlay`/`GalleryCarousel`/`Avatar`/`Tag`) **stay in `component`** per user — kol-content depends on them. Set + 2 blocks + 9 demos repointed. Render-verified both sets (0 errors); ShareButtons/SourcesReferences DOM-confirmed.
- **`@kolkrabbi/kol-foundry@0.1.0`** — the type-specimen apparatus **graduated from the `component/foundry` subpath** (8 organism/data files + SpecimenSectionHeader; escaping imports → `@kolkrabbi/kol-component`; `opentype.js` optional peer; `./foundry` subpath dropped; foundry-specimen set + 6 foundry demos repointed).
- **`@kolkrabbi/kol-store@0.1.0`** — commerce (`ProductDetailLayout` / `PriceDisplay` / gsap `DiagonalMarqueeRiver`) lifted out of `component`; prints-store set + product-panel block + 3 demos repointed; form primitives (`QuantityInput`/`SpecList`/`TabsRow`) stay in `component`; gsap peer. Both **render-verified 0 errors** — a grep-missed single-`../` escape (SpecimenSectionHeader→Dropdown) + the component-subpath demos surfaced as transient 500s and were fixed.
- **Showcase image swap:** SVG-gradient placeholders across 7 files (2 sets + 5 blocks) swapped for real images cycled from `showcase/public/kol-images/` (7 `tt-0N.jpg` ~360K + `radar-ascii.png`; 24/24 load on work-portfolio).
- CSS for all stays in `kol-theme`. `chess.js` → kol-chess; `embla` → kol-content; `gsap` peer → kol-content / kol-store. **ARCHITECTURE §3 amended five→ten UI packages.**

## Next Steps
1. **Push** (user gate) — publishes `kol-dashboards@0.1.0` + `kol-chess@0.1.0` + component/theme `0.7.0` + framework/icons. Decide changesets + Version-PR vs. push-to-publish the hand-bumps first.
2. Unify the remaining **15 dashboard demos + Home bento** onto `@kolkrabbi/kol-dashboards` (delete the local `workshop/dashboards` copy) — chess demos already done.
3. Monorepo: relay to the repoint agent — workshop chrome CSS comes from `@kolkrabbi/kol-theme` (`kol-components-workshop.css`), **not** `@kol/ui`.
