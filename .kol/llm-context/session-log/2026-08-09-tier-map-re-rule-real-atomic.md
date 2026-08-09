# Session: the tier map re-ruled — real atomic, import test repealed

**Date:** 2026-08-09
**Agent:** Grim (Fable 5)
**Summary:** The user ruled the component categories wrong ("atoms molecules etc. ARE FUCKING INCORRECT") and ordered a solo re-rule with his review after. The mechanical import test (2026-07-04) is repealed; tiers are now judged by what a component IS — "could you rebuild it from other KOL components?" — and 20 of 93 kol-component files moved. **Awaiting his row-by-row review.**

## Changes made

- **Law rewritten** — `00-taxonomy.md` tier definitions are real atomic (judgment on anatomy/role); the "not Brad Frost on purpose" section replaced with the repeal + five boundary calls (single-value selection controls are atoms; input+buttons is a molecule; one elaborate element is still an atom; Icon/Graphic never affect tier; imports stay downward-only).
- **20 files moved** (37 atoms · 36 molecules · 20 organisms after):
  - atoms → molecules: DocsToc · DropdownTagFilter · FullscreenOverlay · LabeledControl · QuantityInput · SearchInput · Section · Stepper
  - molecules → atoms: ColorSwatch · Image · PaletteHarmonyWheel · SelectionOverlay
  - molecules → organisms: FramedMediaBand · ShellSearchOverlay · SpectrumControls
  - organisms → molecules: BentoCard · Carousel · ErrorBoundary · LoaderOverlay
  - organisms → atoms: AsciiCursor
- **All relative imports + the barrel** rewritten by codemod; five stale `taxonomy-ok:` comments stripped (they cited the dead law).
- **Validator rewritten** — `validate-taxonomy.mjs` no longer derives tiers: closed folder set + downward-only imports (now including molecules→organisms) only. `validate-rails.mjs` repointed at DocsToc's new path.
- **Docs synced** — `02-placement.md` (new test, rules, checklist, the authored 20-row re-sort map), `01-inventory.md` rows re-sorted. Flat packages untouched: ownership tiers (2026-07-30 ruling) already govern them; `classification.js` TIERS left as-is.
- **Regenerated:** usage index, composition index, MDX frontmatter (0 changes needed).
- **Published:** component **0.26.1** (folder restructure only, no API change — verified on registry). All 18 gates clean.

## Next steps

1. **User reviews the map** — `02-placement.md § Re-sort map` is the review surface; any row he overrules moves back (file + barrel + docs in one edit).
2. Judgment calls most likely to draw fire: SegmentedToggle/ViewToggle kept atoms; Stepper/SearchInput demoted to molecules; AsciiCursor ruled an atom; BentoCard/Carousel demoted from organisms.
