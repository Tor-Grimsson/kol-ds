---
"@kolkrabbi/kol-component": patch
---

Internal taxonomy restructure — public exports unchanged. The `primitives` folder is dissolved (it was never part of the atomic system) and every component now sits in the tier the placement rules give it (docs/taxonomy/01-component-placement.md): Badge/Pill/Tag/Section/SectionLabel/SegmentedToggle/ToggleBracket/ViewToggle/LabeledControl/DropdownTagFilter/QuantityInput/QuantityStepper/Popover/AssetPlaceholder/ExitPreview/FullscreenOverlay → atoms; Slider/ColorSwatch/CodeBlock/Image/Accordion → molecules; Carousel/ContentFilters → organisms. Deep imports of source paths would break, but the package only supports root imports. `scripts/validate-taxonomy.mjs` now enforces the closed folder set, downward-only imports, and the molecule test.
