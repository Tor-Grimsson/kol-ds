# Session: kol-label family killed + 6 icons into v1 + one public/ at root

**Date:** 2026-07-15 (night, final leg)
**Agent:** Grim (Opus 4.8)
**Summary:** User caught the legacy `kol-label-*` class in the article/work gallery blocks → the whole 7-class family deleted from the theme with its 2 package users migrated; the six "missing" v1 icons turned out to exist in the legacy trees and were normalized in; JetBrains got true 400i/600i; ONE-public-at-root became repo law (ARCHITECTURE §7). Batch gated green — user pushes next.

## Changes Made

### Legacy label family — KILLED
- `blocks/article-grid.jsx` + `blocks/work-grid.jsx`: `kol-label-mono-xs` → `kol-helper-12` + authored caps.
- `SectionLabel` migrated: sm→`kol-helper-14`, md→`kol-helper-20`, lg→`kol-sans-heading-03` (lg's old `kol-heading-md` was a GHOST class defined nowhere — rendered 16px default). `FeaturedCarousel` label → `kol-helper-12`. Caller strings re-authored caps (demos + media-carousel block).
- All 7 `.kol-label-*` classes deleted from `kol-components-atoms.css` (uppercase-baked, pre-numeric naming). Atoms.css casing-arc remainder is now just 2 rules.

### Icons — the six "gaps" all existed in the legacy trees (user's catch)
- Normalized into v1 (icons 0.7.0): `layout/panel-right` (ex dock-right) · `singletons/cut` · `files/library` · `tools/pointer` · `tools/type` (fill letterform, star-solid precedent) · `misc/foundation`.
- Consumers restored to real semantics: ShellHeader→panel-right, menu demo x→cut, SplitToolButton demo→pointer/type, foundry ×4 + demo→foundation.
- Verified live: ZERO legacy-set warnings from packages (remaining `menu`/`social-github` = showcase's own TopBar, backlogged).
- **Set-versioning model stated:** v1 = the living design language (24-grid/1.5-keyline), grows by normalized promotion; v2 only on a language break. Package semver carries growth. User can overrule to frozen-v1+annex.

### Fonts + assets
- JetBrains Mono true italics: `JetBrainsMono-Italic.woff2` (400i) + `SemiBoldItalic` (600i) copied from the vault + declared — 6 faces total. Consumers need the 2 files in their `/fonts/jetbrains-mono/` on bump.
- **ONE `public/` at repo root — user ruling, now ARCHITECTURE §7**: `showcase/public` → `public/`; showcase + workbench point via Vite `publicDir: '../public'`; symlink only for unconfigurable tools. Verified live (font/image/favicon 200). Topology doc synced.

## Current State

### Working
- Gates green (roster 212 / imports / foundations). Batch ready — **user pushes now; push == publish**: component 0.11.0 · chess 0.3.0 · framework 0.5.0 · content 0.4.0 · theme 0.8.0 · icons 0.7.0 · foundry 0.4.2 · workshop 0.1.6.

### Known Issues
- Theme 0.8.0 removes `.kol-label-*` — any external consumer still using those classes renders unstyled on bump (in-repo users: zero). Flag in consumer notes.
- Casing-arc remainder: ~chess CSS ~20 rules + styleguide 3 + typography 3 + atoms 2 + EmptyState/FeatureSplit/foundry-preview JSX + showcase SidebarNav chrome (backlog file updated).
- Sidenav epic parked — user's scoping doc pending.

## Next Steps
1. User pushes → CI publishes the 8-package batch.
2. Consumers on bump: website (ledger-2.0 outcomes, 2 italic woff2s, kol-sources.css, optimizeDeps.exclude, kol-label check) · chess app (brief-2.0 resolution).
3. Sidenav epic (user scoping doc) · casing-arc go/no-go · showcase visual audit (Todoist, due 2026-07-16).
