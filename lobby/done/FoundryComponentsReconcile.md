---
component: FoundryComponentsReconcile
source: kol-website/apps/web/src/components/sections/foundry/ — nine files that fork `@kolkrabbi/kol-foundry` 0.6.2 (local copies + unified diffs in `_assets/2026-08-27-foundry-reconcile/`)
staged: 2026-08-27
status: draft
deps: [ContentFilters, ContentCollection, ContentCard, ContentRow, Dropdown, Pill, Icon, kol-theme]
---

# FoundryComponentsReconcile — the site's foundry components are a fork of kol-foundry; the local copies are the truth, sync the package to them

## Purpose

`@kolkrabbi/kol-foundry` ships the typeface components, but kol-website renders
its own copies in `components/sections/foundry/` and imports only `FontLoader`
+ `glyphSets` from the package. Nine files share a name with the package and
**every one but `GlyphItem` has drifted — locally, forward**: the type-class
and container-cap renames of 2026-08-27, the `SpecimenSectionHeader` pattern
change, a `GlyphMetricsGrid` rewrite (2026-08-14), and today's content-filter
swap of the library grid. The package copy was last republished 2026-08-26
(peer deps only) and has none of it.

**Ask:** kol-foundry adopts the local versions as its source, so the site can
import the package and delete the fork. `_assets/2026-08-27-foundry-reconcile/`
carries `local/` (the nine files as they are, plus the new `TypefaceAlphabet`)
and `diff/` (unified, package → local).

## Deltas — package 0.6.2 → local (per file)

| File | Drift | Lines |
|---|---|---|
| `GlyphItem` | identical | 0 |
| `FontPreviewSection` | web-owned Icelandic `SAMPLE_TEXT` as the default `text` (package uses the engine's neutral `SPECIMEN_SAMPLE_TEXT`); frame `border-fg-08 hover:border-fg-24 transition-colors duration-300` (was `border-fg-16`); cap → `max-w-[var(--kol-container-max)]`; header `label="Font Preview" icon="type-02" size="md"` (was `badgeText` · `type` · `sm`) | 18 |
| `FoundryCharacterSets` | `glyphSets`/`glyphCategories` from the package index (was `./glyphData.js` — in-package becomes relative again); cap token; header `label="Character Sets" icon="grid" size="md"` | 9 |
| `GlyphMetricsSection` | cap token; header `label="Glyph Viewer" icon="underline" size="md"` | 8 |
| `SpecimenSectionHeader` | title via a `SectionTitle` (icon + text — web's `ui/SectionTitle.jsx`, the DS supplies its own); size ladder `lg → kol-helper-20`, else `kol-helper-16` (was `sm → 16`, else 20); both rows `flex-wrap`; `Dropdown size` forwarded (`sm` → `sm`, else `md`) | 14 |
| `TypefaceStyleSection` | style list on `text-xl md:text-3xl leading-none`; active `bg-fg-02`, hover `bg-fg-02`; stacks below md (`flex-col md:flex-row`); preview pane `w-full md:w-[65%] aspect-[5/4] bg-oq-96 text-auto-inverse` (was `w-1/2 aspect-[4/3] bg-fg-80`), specimen `text-6xl md:text-8xl lg:text-[128px]`; list column `md:w-[35%]`; cap token; header `label="Styles" icon="italic-a" size="md"` | 20 |
| `TypefaceVariablePreview` | dead `kol-mono-xs/sm` → `kol-mono-12/14`; heading `kol-sans-heading-05 uppercase` (was `heading-04`) | 28 |
| `VariableFontSection` | cap token; header `label="Variable Font" icon="slider-02" size="md"`; `Pill` default variant (was `subtle`) | 10 |
| `GlyphMetricsGrid` | rewritten locally 2026-08-14 — take the local file whole | 389 |
| `TypefaceLibraryGridWithVariables` | today's content-filter swap — take the local file whole: `ContentFilters` bar (`layoutPlacement="header"`, LIST/GRID strip on `kol-helper-14`, Kind `stack: true`, `mutuallyExclusiveFilters=['name']`, `titleIcon` prop), `ContentCollection cols={{ md: 2, lg: 4 }}` (grid) / list `gap={24}`, `ContentCard typeface` (glyph in `media`, pangram in `reveal`) / `ContentRow typeface` (alphabet in `footer`) — component ≥0.95.0; the weights view in the same collection; `TypefaceLibraryItem` retired | 159 |

New file with no package counterpart: **`TypefaceAlphabet.jsx`** — the measured
shrink-to-fit alphabet band the row's `footer` carries (binary-search clip
against the container, ResizeObserver re-measure). The grid imports it; it
ships with the grid.

## App-specific bits to DROP on recreation

- `TypefaceLibraryGridWithVariables`: `useNavigate` from react-router — the
  package takes an `onNavigate(href, event)` prop (the `linkComponent` prop is
  now unused; retire it).
- `SpecimenSectionHeader`: `../../ui/SectionTitle.jsx` is web-local — the DS
  renders icon + title on its own.
- The package's own `TypefaceLibraryItem` retires with the grid (the site's
  copy already did, `_tmp/2026-08-27-typeface-library-ds-swap/`).
- Package-internal imports go back to relative (`./glyphData.js`, not the
  package name).

## The header pattern, once, for every section

Every section moved from `SpecimenSectionHeader badgeText={…} icon="type"
size="sm"` to `label="<Section name>" icon="<its own icon>" size="md"` — one
change repeated in five files. That is the shipped pattern; `badgeText` is
dead in the site.

## Recreation notes

- Tier: kol-foundry package, same files, same names — a sync, not a redesign.
- Peer floor: kol-component ≥0.95.0 (`ContentCard reveal`, typeface ramp),
  kol-theme ≥0.64.0.
- Bar for 🟢: a kol-foundry version whose nine files diff clean against
  `_assets/…/local/` (modulo the drops above), so kol-website can swap its
  imports and delete the fork.

## ✅ RESOLUTION — 2026-08-27 · kol-foundry 0.7.0

The nine files are the site's copies, synced whole (diff vs _assets/local: 0 lines on six of them; the rest differ only by the drops — package-relative imports in FoundryCharacterSets/GlyphMetricsGrid, the SectionTitle opener rendered in-package on SpecimenSectionHeader (IconFrame + kol-btn-md text shell, lg → helper-20 else 16), and the grid's useNavigate → onNavigate(href, event) with linkComponent retired). TypefaceAlphabet ships and is exported. Peers: kol-component ≥0.95.0, kol-theme ≥0.64.0. TypefaceLibraryItem stays exported on the ledger. Rendered in the showcase: the grid's rows with the alphabet band and the typeface cards with reveal, the header opener, the alphabet clipping to its container. Pre-sync package files quarantined in _tmp/2026-08-27-foundry-pre-reconcile/.

**Remainder here:** none — kol-website bump kol-foundry 0.7.0; import the nine + TypefaceAlphabet from the package, pass onNavigate={(href, e) => { e.preventDefault(); navigate(href) }} to the grid, delete components/sections/foundry/ (keep FontLoader/glyphSets imports as they are).

