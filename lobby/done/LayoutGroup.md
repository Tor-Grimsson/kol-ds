---
component: Layout group (LayoutType · LayoutColor · LayoutLogo · LayoutText · LayoutGuide) + BlockType · BlockSwatch · CardLogo
source: kol-atlas/apps/lab/src/pages/t1-type.jsx#L107-L378 · c1-color.jsx#L14-L127 · l1-logo.jsx#L20-L51 · i1-icons.jsx#L9-L110 · v1-verbal.jsx#L35-L121
staged: 2026-10-31
status: draft
deps: [TypeBlock, Swatch, LogoCard, BrandGuide, DocumentIndex, TableRow, TableCell, SectionText, PageHeader]
---

# LayoutGroup

## Purpose
The user, 2026-10-31, from kol-atlas: the identity lab's views are KOL layouts with Atlas's data in them, not Atlas components. They move to the DS so kol-atlas (`apps/lab` and the proxy--atlas Figma file) only passes data — values, marks, copy — and proxy--atlas is left holding Atlas's own styles. Today `apps/lab` hand-builds each one (866 lines across `src/pages/`), and the Figma rebuild drew them again.

## Anatomy
A new group in `packages/styleguide`, its own entry point **`@kolkrabbi/kol-styleguide/layout`** (beside `./lab`):

| component | from (kol-atlas `apps/lab/src/pages/`) | what it lays out |
|---|---|---|
| `LayoutType` | t1-type.jsx — TypeScale · TypeStyles · TypeArticle · TypeSheet (`view` prop) | a type exploration: scale, styles, article, specimen sheet |
| `LayoutColor` | c1-color.jsx — ColorPalette · ColorRamps · ColorLayouts · ColorSheet | a colour exploration: palette, ramps, ink-on-ground layouts, sheet |
| `LayoutLogo` | l1-logo.jsx — LogoMarks · LogoLockups | a grid of marks, and each with the wordmark |
| `LayoutText` | v1-verbal.jsx — VerbalToday · SourceDoc | voice and copy: lines with their sources, source documents |
| `LayoutGuide` | **rename of `BrandGuide`** | unchanged |

Building blocks, renamed group-word-first:

| new | today | where it sits |
|---|---|---|
| `BlockType` | `TypeBlock` | inside LayoutType |
| `BlockSwatch` | `Swatch` | inside LayoutColor, ColorRamp, palettes |
| `CardLogo` | `LogoCard` | LayoutLogo, LayoutGuide, BrandMark, Stationery/Social mocks, brand-sections |

Old names go on the retirement ledger as aliases.

## Also in this ticket
1. **`DocumentIndex` moves to kol-framework**, beside `documentFiles` / `documentTabs` it is built on. Nothing about it is brand: `apps/layouts` already lists it as the Index page type under the frames. kol-atlas's lab home (`apps/lab` `/`, the entries table) is that page type — it needs a table view beside the cards.
2. **The icon layout** (kol-atlas `i1-icons.jsx`, Icons · Icons-2) is the showcase's icon browser — export that browser as a component instead of a second copy.
3. **Generators** are already kol-styleguide's labs; nothing to move.
4. **ui.kolkrabbi.io doesn't list nested components.** /components/document-index shows none of what it is built from (SectionText, the icons, the text styles). The long-standing decision is that nested components are named; the component pages should list them.
5. **`apps/brand-lab` takes tab groups**, singular words: `/layout/type|color|logo|text|guide` and `/generator/*` (the labs already there), each Layout* on the Kolkrabbi draft.
6. **Figma library:** a page per Layout*, Block* and CardLogo, built from the code. Data-driven parts (type faces, colour values) read from variables, so a consumer file can hold one collection per kind with a **mode per exploration** (e.g. kol-atlas `atlas-type`: t1 · t2 · t3; `atlas-color`: c1 …) and switch an instance between them.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `view` | string | first view | which of the layout's views (LayoutType: scale · styles · article · sheet; LayoutColor: palette · ramps · layouts · sheet; LayoutLogo: marks · lockups) |
| data | the layout's data object | — | LayoutType: roles from `typeLabCss` / scale; LayoutColor: `colorLabCss` palette + ramps; LayoutLogo: marks `[{ id, svg, label }]` + wordmark; LayoutText: lines `[{ text, source }]` or markdown |

## Styling
KOL tokens only. Strip from the kol-atlas source: `--lab-display` / `--lab-*` vars (become the data), Atlas copy, the `Lab bar` (app chrome).

## Dependencies
TableRow / TableCell (tables), SectionText, PageHeader, kol-icons.

## Recreation notes
Code first; the Figma library follows from the code. When shipped, kol-atlas's `apps/lab` swaps its pages for these, and proxy--atlas rebuilds each board as a library instance on its mode collections.

## ✅ RESOLUTION — 2026-10-31 · kol-styleguide@0.19.0 · kol-framework@0.66.0

kol-styleguide 0.19.0 adds the `./layout` entry: LayoutType (scale, styles, article, sheet, and faces — the UI font sheet with a data face list, `faceOptions`), LayoutColor (palette, ramps, layouts, sheet), LayoutLogo (marks, lockups), LayoutText (lines, source) and LayoutGuide (BrandGuide renamed). Renames: TypeBlock → BlockType, Swatch → BlockSwatch (+ variant="cell"), LogoCard → CardLogo (+ variant="plate"); the old names stay as aliases on the retirement ledger. Atlas's `--lab-*` vars became props; the Atlas copy and the Lab bar were stripped. kol-framework 0.66.0 takes DocumentIndex with variant="table" (`columns`, `accent`); the styleguide export is a deprecated alias. The showcase icon gallery is the IconBrowser component. ui.kolkrabbi.io component pages list their nested components, icons and text styles. apps/brand-lab has /generator/* and /layout/type|color|logo|text|guide on the Kolkrabbi draft. The Figma library pages (item 6) follow from this code once the library is free; that is DS work.

**Remainder here:** none — kol-atlas bump kol-styleguide@0.19.0 + kol-framework@0.66.0, then swap apps/lab's pages for the Layout* components (data only).

