# Session: Lobby monorepo batch — P0–P10 + 4 review rounds

**Date:** 2026-07-03
**Agent:** Claude Opus 4.8 (1M)
**Summary:** Executed the whole 78-spec `kol-monorepo` lobby sweep — ~78 components across 11 phases, 5 full-apparatus sets, 22 blocks — then four rounds of review fixes (registry coverage, transitive set-slug gallery, home, kebab slugs, vercel, docs).

## Changes Made

### Packages (published surface)
- `packages/component` — ~55 new atoms/molecules/organisms + hooks (`usePrefersReducedMotion`, `useTilt`, `useAxisAnimation`, `cssVar` utils); Button gains `iconComponent`/`pressed`; barrel + `./foundry` subpath export; peers added: framer-motion, gsap, hls.js, opentype.js (optional).
- `packages/framework` — additive merges into `PortalFooter` / `AppShell` (header/footer slots + ShellToc contexts) / `SideNav` (onNavigate/collapse/collapsibleSections/isActive) + new `ShellHeader`; `PageSection` verified already-equivalent (no change).
- `packages/theme` — component CSS appended across atoms/molecules/organisms + kol-framework (Figure caption, `.kol-btn-pressed`, feature-split, shell chrome, colour-doc, type-kit, etc.).
- **7 changesets held** (`p0-shared-primitives` … `p6-p10-sets`), all `minor`.

### Showcase
- `showcase/src/sets/*` — 5 kebab sets: `stack-blog`, `work-portfolio`, `prints-store`, `foundry-specimen`, `design-editor` (all files renamed kebab; chess/metrics too).
- `showcase/src/blocks/*` — 22 blocks (6 → 22), kebab-named, across hero/marketing/content/media/colour/chrome/footer/panel/form/toolbar.
- `showcase/src/demos/*` — ~72 new demos (P1–P10 members + 22 metrics/chess local parts) so every gallery container renders live.
- `showcase/src/lib/CollectionPage.jsx` — **rewrote the slug page**: chips → a live **composition gallery**, one container per component (KOL + local parts), each a live demo or labelled+linked fallback.
- `showcase/src/pages/Home.jsx` — dense shadcn-style bento wall (metrics cards + blocks + demos), 1600px content with super-subtle skeleton edge-flanks.
- `showcase/src/usage/{usage-index.json, composition.json}` — 125 registry entries (every component tiered); composition regenerated (kebab keys).
- `scripts/extract-composition.mjs` — now walks **transitively** into the packages via the barrels (incl. `/foundry` subpath), skips UPPER_SNAKE consts.

### Repo / docs
- `vercel.json` — SPA rewrite (`/(.*) → /index.html`) + buildCommand/outputDirectory → fixes deep-link 404s.
- `docs/documentation/03-compositions/03-slug-composition-gallery.md` — new reference doc for the scanner + gallery (reciprocal cross-ref added to `01-blocks-and-sets.md`).
- `lobby/WORKLOG-2026-07-03-monorepo.md` — full phase log + 27-entry bug ledger; INDEX links it.

## Current State

### Working
- `pnpm build` green (3220+ modules), `validate-taxonomy` clean.
- All component / set / block routes Playwright-smoked — **0 console errors**; galleries, home, editor/foundry/metrics visually confirmed.
- Every set slug lists every component it uses (transitive) in its own live container.

### Known Issues
- Nothing published yet (7 changesets staged). `git` is blocked in-agent — user pushes manually.
- ⚠ Do **not** run `pnpm extract:docs`' usage miner before release — it regenerates `usage-index.json` and wipes the 125 hand-seeded entries (ledger #18/#23; durable fix = miner should union barrel exports).
- Pre-existing: `kol-btn-selected` has no theme rule (#14); `useScrollSpy` edge-lock dies in inner scrollers (#15). Small shared-atom seams flagged: FullscreenOverlay `bare` prop (#19), Carousel `onApi` seam (#20). Full list in the worklog ledger.

## Next Steps
1. **Push to `main`** (commit staged locally) → changesets action opens the "Version Packages" PR → merge to publish the 7 minor bumps → `git pull`.
2. Redeploy showcase to Vercel (vercel.json now in repo) — confirm deep links resolve.
3. Later: durable `extract-usage` fix (union barrel exports); the flagged shared-atom seams (#19/#20).
