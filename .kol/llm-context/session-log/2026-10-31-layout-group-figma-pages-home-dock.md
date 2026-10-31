# Session: LayoutGroup, its Figma pages, HomeDockRound4

**Date:** 2026-10-31
**Agent:** kol-ds-ui-23 (Claude Opus 5.5), running beside kol-ds-ui-2d (metric rebuild)
**Summary:** Two lobby tickets built by background agents, published and closed with receipts. The LayoutGroup pages are in the Figma library, and PortableTextRenderer's leftover property is removed.

## Changes Made

### Published
- kol-framework 0.66.0: DocumentIndex moved here, with `variant="table"`.
- kol-styleguide 0.19.0: the `./layout` entry point.
  - LayoutType, with views scale, styles, article, sheet and faces. The faces view is the UI font sheet, and its face list is data (`faceOptions`).
  - LayoutColor, LayoutLogo and LayoutText.
  - LayoutGuide, renamed from BrandGuide.
  - Renames: BlockType, BlockSwatch and CardLogo, with the old names kept as aliases on the retirement ledger.
  - The IconBrowser component.
- kol-shell 0.95.0 (HomeDockRound4):
  - The + no longer follows `home.surface`.
  - The ··· sits inside the dock pill and opens the + menu's card.
  - The dock slots get the menu row's hover.

### Also changed
- apps/brand-lab: tab groups `/generator/*` and `/layout/type|color|logo|text|guide`, each with a view segment.
- Showcase component pages list their nested components, icons and text styles.
- Figma library: pages 14-layout-type to 21-card-logo, plus the `layout-type` and `layout-color` collections, with one mode per exploration.
  - LogoCard (26:62) moved into the CardLogo set.
  - W25 added to `plan-2026-10-31-figma-library.md`.
- Figma: removed the unused `label` text property from PortableTextRenderer (57:232). It now has only its `blocks` slot.

### Tickets
- LayoutGroup (kol-atlas) and HomeDockRound4 (kol-fxr) are closed, receipts returned and both filers messaged.

## Current State

### Working
- Both tickets are verified on the registry. Screenshots checked: brand-lab layouts, the faces sheet, the Figma colour and faces pages, and the dock's glass surfaces.

### Known Issues
- Figma views set in Right Grotesk use Schibsted as a stand-in, because the plugin can't load Right Grotesk, so their heights differ. Tables and photos are plain frames, and Code Connect isn't added for the new components.
- The dock's slot hover is a forced Tailwind class over TabsRow's inline background. It belongs in TabsRow, with a ref through to the slots, once kol-ds-ui-2d releases kol-component.
- The Figma library is unpublished; publishing is his click.

## Next Steps
1. Move the dock's slot hover into TabsRow once kol-component is free.
2. Add Code Connect for the Layout*, Block* and CardLogo components.
3. He reviews the names the agent chose: IconBrowser, `faceOptions`, the LayoutText views `lines` and `source`, and DocumentIndex's `cards` and `table`.
