# Session: All icons in the Figma library, linked; `<Icon variant>` and solid pairs as sets

**Date:** 2026-11-01
**Agent:** Claude (Opus 5.5) — "Grim"
**Summary:** 07-icons synced to kol-icons (1002 components by group), a new by-group page, Code Connect for every icon, and `<Icon variant="solid">` shipped with the 72 outline/solid pairs as Figma component sets.

## Changes Made

### Files Modified
- `packages/icons/src/Icon.jsx` — `variant` prop (`outline` | `solid`). Solid resolves the `-solid` twin and falls back to the outline.
- `packages/icons/package.json`, `CHANGELOG.md` — 0.60.0
- `docs/documentation/02-icons/02-loader.md` — variant note (a pointer to drawn twins, not a solid cut)
- `docs/operations/01-release/02-shipped-packages.md` — kol-icons 0.60.0
- `figma/icons/*.figma.js` — 1002 files at first (560 new). The 72 pair files now read `variant`, and the `-solid` files moved to `_tmp/2026-11-01-icon-solid-code-connect/`
- `.kol/llm-context/plan-2026-10-31-figma-library.md` — W7 notes for the sync, the pairs and how to re-sync
- Figma (n48kE2bJtrFjl7wxst30xH):
  - `_trash` components prefixed `_`, and the raised Dropdown text props bound
  - 07-icons: 560 new components, one frame per code folder in each set section
  - colour-swatches re-imported with its masks
  - 72 sets with `variant=outline|solid`, outline as the default
  - new page **28-icon-groups**: one sheet per set, a tile for every icon

### Features Added/Removed
- Published kol-icons 0.60.0 (`<Icon variant>`)
- Code Connect republished. The 144 stale variant-node mappings were unpublished; this hit the rate limit, so it ran again with backoff.

## Current State

### Working
- Every `<Icon>` name is a component on 07-icons and links to code. The library is published (user, 2026-11-01).

### Known Issues
- `barrel` is in shapes but `barrel-solid` is in commerce. The set sits in shapes; the code folders disagree.
- `abacus-solid`, `contract-corners-solid` and `expand-corners-solid` have no outline twin and stay single components.
- 28-icon-groups headings use JetBrains Mono styles because Right Grotesk won't load in the plugin runtime.
- `_duplicate-2026-10-31 MenuRow` on `_trash` still has unbound `indicator`/`state` props.

## Next Steps
1. Re-sync when kol-icons adds names: diff the names, upload only the new ones and combine any new solid pairs (method in plan W7).
2. Decide which folder barrel goes in (with the duplicate cull).

## Amended — 2026-11-01

- Built three lobby tickets with background agents and closed each, returning its receipt.
- **LoaderAppIntro** (kol-fxr): kol-component 0.331.0, kol-framework 0.69.0, kol-shell 0.99.0.
  - `loaderApp({ intro })`. The intro claim lives in kol-component and kol-framework re-exports it.
  - `GrowthLineStage` claims the intro and hides the loader on its first frame.
  - HubHome holds its chrome until the stage's new `onIntroBreath` fires.
  - studio-hub is wired to it.
  - Still owed by kol-atlas: switch to `intro` and drop its own boot loader.
- **GrowthLineSeedOutline** (kol-atlas): kol-growth 0.5.0 and kol-component 0.332.0.
  - `seed({ points, inset })` in the engine, plus `outline()` and `pathRing()`.
  - The stage takes `seed="outline"`. A string picks where the line starts and a number is still the random seed.
  - Atlas needs `cap={30000}` to fill the hexagon solid.
- **MoreRowsNoPathLit** (kol-atlas): kol-shell 0.99.1, live on the registry. A row without a path no longer reads as the current page; fixed in MoreRows and the AppFloatNav More slot.
