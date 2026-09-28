# Session: Showcase refinement — the space table and the engine tier

**Date:** 2026-09-28
**Agent:** kol-ds-ui (cloud container)
**Summary:** The user's 13-point review of ui.kolkrabbi.io, planned, then built in one run: kol-markdown and kol-search out of kol-workshop, three apps over a shared fixture, the workshop shell rebuilt to a per-space table, the showcase moved onto it. ds-0086…0099, unpublished.

## Changes Made

### Files Modified
- `packages/markdown/` (new, `@kolkrabbi/kol-markdown` 0.1.0) — kol-workshop's `engine/` moved out unchanged, plus kol-component's frontmatter reader + round-trip writer (the two `parseFrontmatter` copies were byte-identical)
- `packages/search/` (new, `@kolkrabbi/kol-search` 0.1.0) — query language (`tag:` `#tag` `is:` `in:` `cat:` `-neg` `"phrase"` `after:`/`before:`, smart terms: `atom` → category Atoms), ranker with reasons, disjunctive facets; `matchSearchItems` kept
- `packages/workshop` 0.30.0 — `ShellLayout`: one edge-to-edge scroll region (`#shell-scroll`, `SHELL_SCROLL_ROOT`), 256px rails with seams, `{ activeRoute }` to `renderSidebar` / function `defaultTocContent`, `usePageMeta` / `usePageMetaValue`, palette on kol-search, `searchPath` (Enter → results page), `/` key, `settings` drawer (gear, `,`), the `S` sheet, `brandLabel`; `RailSection` L1 fold glyph + count while folded; `ShellSidebar` follows the route; new `SearchPage`; engine re-exported from the two engines
- `packages/component` 0.228.0 — `ShortcutsOverlay` moved in from kol-shell; `ShellSearchOverlay` `enterLabel`, engine `highlights`, rows at 80; frontmatter from kol-markdown
- `packages/theme` 0.155.0 — `.shell-scroll` · `.shell-rail` · seams · no grid gap; `.kol-overlay-panel` on `oq-04`; `.shell-wordmark-label`
- `packages/framework` 0.45.0 — `--kol-shell-nav-w` / `--kol-shell-toc-w` 256px; `ThemeToggle` owns one KOL tooltip (no native `title`)
- `packages/shell` 0.58.0 — re-exports `ShortcutsOverlay` from kol-component
- `apps/workshop-fixture` · `apps/workshop` (5183) · `apps/markdown` (5184) · `apps/search` (5185, `pnpm search-app` — `pnpm search` is pnpm's own)
- `showcase/` — `nav/shell-nav.js` (spaces, `SPACE_PREFIXES`, `DOCS_GUIDES` · `DOCS_SPECIMENS` · `DEV_TOOLS`, kol-search items), `lib/ShellChrome.jsx` (per-space rails), new `pages/DocsIndex` · `Development` · `Search`, `SearchResults` deleted, `CollectionLanding` as an index header, `Home` install line in the hero, `Quarantine` on `Table`, `ComponentPage` publishes tags/related
- `scripts/validate-native-title.mjs` (T1b spread `title`, T2 over workshop + framework + `IconFrame`), `validate-reachable.mjs` (E1b/E2 to the space model), `validate-rails.mjs` (R4b = the Docs rail order)
- `docs/operations/08-cloud-sessions/` (new) — authorship (no agent fingerprint), branch + `--ff-only` handoff, publishing
- `docs/documentation/04-compositions/02-shells.md` § The space table (older lines marked *Superseded 2026-09-28*), `01-foundations/05-layout-systems.md` (rail pair, scroll region), `04-workshop-system.md`, `11-shell-system.md`, `00-overview/01-package-topology.md`, operations shipped-packages / apps-tier / surface-rules
- `.kol/llm-context/ARCHITECTURE.md` — §3 engine tier; ShortcutsOverlay's move
- `.kol/llm-context/plan-2026-09-28-showcase-refinement.md` — the review, findings, § 3b decisions, done

### Features Added/Removed
- Added: engine tier; three apps + fixture; per-space rails; Docs and Development spaces; search page; settings drawer; `S` sheet in the shell; typed wordmark
- Removed: References / Search / Quarantine header tabs; the Tools rail group; Enter-opens-tag-browser (kept behind the tag graph action); `SearchResults`; the rails' shared `--kol-sidenav-w`

## Current State

### Working
- 29 gates clean; showcase + the three apps build; kol-markdown / kol-search / fixture self-tests pass
- Checked headless: light + dark at 1440/1600, 390 phone on a few routes; label aligns with page text (328 = 328), rails 256 | 256, scrollbar at the window edge

### Known Issues
- **BREAKING for consumers of kol-workshop 0.30.0 / theme 0.155.0**: pages inside the shell must not pad x; scroll observers use `SHELL_SCROLL_ROOT`, not `#main`. kolkrabbi.io/workshop needs this on its bump
- Earlier rulings reversed by the run (L1 no-chevron/no-count, Operations as its own eyebrow, Enter → tag browser, drawn WORKSHOP mark, the one-stack rail order) — each marked in 02-shells.md; the user may overturn any (plan § 3b)
- Regenerating `showcase/src/usage/api-tables.json` in the cloud dropped kol-hardware's Knob/Fader/LED tables — not committed; only `component-sources.json`'s ShortcutsOverlay path was patched. Rerun `node scripts/extract-api.mjs` locally and check the diff
- Not every route click-tested; phone checked on two routes only
- workshop 0.29.0 was published without a changelog entry (noted in 0.30.0)

## Next Steps
1. Review `pnpm workshop` · `pnpm markdown` · `pnpm search-app` and the showcase; overturn any § 3b call
2. Publish in order: markdown · search · theme · framework · component · shell · workshop
3. ContentFilters · MediaLibrary · MediaPicker onto kol-search; kol-notes onto kol-markdown's frontmatter
4. Audits / reports published into the Development space
