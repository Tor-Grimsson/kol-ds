# Session: Workshop docs system lifted into @kolkrabbi/kol-workshop (5th UI package)

**Date:** 2026-07-09
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Lifted the whole "workshop navbar set" — a handrolled docs subsystem, not one component — out of monorepo `apps/web` into a new `@kolkrabbi/kol-workshop` package, dedup'd against the shell chrome that already existed in the DS, KOL-conformed, and static-verified. Not render-tested; publish + monorepo repoint are user gates.

## Changes Made

### Files Modified / Created
- **`packages/workshop/`** — NEW 5th UI package. `src/engine/` (pure, React-free: `parse-markdown`, `frontmatter`, `build-inventory`, `search`, `tags`, `doc-helpers` + `__check.mjs`), `src/docs/` (viewer + `render-tokens`), `src/tags/` (TagMode* + TagGraph/d3), `src/shell/` (`ShellLayout` + `ShellSidebar`), `src/compositions/` (2 example sidebars), barrels, `package.json` (deps: d3 + 4 workspace pkgs; peers react/-dom/router; `private:false`), README.
- **`packages/theme/kol-components-workshop.css`** — NEW (relocated `.shell-*`/`.docs-*` chrome; `rgrot-*`→`sans-*` fonts, 5 `text-transform` stripped). `kol-theme.css` gained the `@import … layer(components)`.
- **`packages/workshop/src/shell/ShellLayout.jsx`** — adapted the `ShellHeader` call site to the DS ShellHeader API (`brand`/`nav`/`isActive`/`onNavigate`/`actions`/`onMenuClick`).
- **`.kol/llm-context/ARCHITECTURE.md`** — §3 amended: four→**five** UI packages (+ `kol-workshop`, with rationale).
- **`docs/documentation/04-compositions/04-workshop-system.md`** — NEW knowledge/reference doc (the full system map) + listed in `documentation/INDEX.md`.
- **`kol-monorepo/MIGRATION-workshop-package-brief.md`** — NEW cross-repo brief for the monorepo agent (repoint steps, injection seam, gotchas).
- **`showcase/`** — live dogfood: route `/workshop-docs` (`src/pages/WorkshopDocsPreview.jsx` + `workshop-sample/*.md` fed through the injection seam), `App.jsx` route, `@kolkrabbi/kol-workshop` dep + `@source` in `index.css`. Fixed `kol-mono-xs`→`kol-mono-12` in the reader's not-found branch.

### Features Added/Removed
- New package `@kolkrabbi/kol-workshop` (+ `./engine` subpath). Deleted 5 lifted duplicates that already ship in the DS.
- Content-injection seam: Vite `import.meta.glob`/`@docs` coupling removed — consumer supplies `modules`/`routes`/`docHref`/`tagHref`.

## Current State

### Working
- 25 package files **parse clean** (esbuild 0.25.12); engine **self-check green** (`node packages/workshop/src/engine/__check.mjs`).
- Grep-verified: 0 `ghost`/`primary` variants, 0 `@kol/ui`/`@kol/component` imports, 0 `useTheme`/`KolWordmark`/`KolLogomark`, 16/16 icons in `kol-icon-set-v1`, 0 `text-transform`, 0 live `import.meta.glob`/`@docs`.
- `pnpm install` clean — `kol-workshop@0.1.0` is a workspace project, `d3` resolves.

### Known Issues
- **Render-verified (2026-07-09)** — live dogfood at showcase `/workshop-docs`: **0 console errors**; ShellHeader-API adaptation + reverted chrome buttons (flush rows, no double-chrome) + icons + remapped fonts all correct. **Showcase-only artifact:** eyebrow labels render uppercase because the showcase's legacy `src/workshop/shell/shell.css` (used by `/workshop-preview`, eager-loaded via `App.jsx`) collides on `.shell-*` — the package CSS is correctly stripped, so real consumers render title-case.
- Icon gaps: 5 frontmatter field icons (`type`/`calendar`/`layers`/`tag`/`clock`) have no v1 equivalent → dropped (label kept); `share-2`→`polygon` (eyeball).
- DS `ShellHeader` `dock-right` uses a legacy-fallback icon (no `panel-right` in v1) — pre-existing DS gap, not ours.

## Next Steps
1. ~~Render eyeball~~ — **done** (dogfood `/workshop-docs`, 0 errors). All 10 planned tasks complete.
2. If clean: **push** → CI publishes `kol-workshop@0.1.0` (+ the staged 0.7.0 component/theme). Un-rendered, so patch to 0.1.1 if a fix is needed.
3. **Monorepo:** repoint `apps/web` onto the package per `MIGRATION-workshop-package-brief.md`; delete the local shell/docs/tag copies.
4. Optional: author the 5 missing frontmatter icons into `kol-icon-set-v1`.
