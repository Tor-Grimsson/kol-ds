// @kolkrabbi/kol-styleguide — the brand style-guide component set.
//
// Visual specimens a brand manual is built from — colour anatomy + the
// combination lab, logo construction / clearspace / scaling, mood tiles,
// type blocks, asset spec tables. Raided from the monorepo apps/brand
// styleguide (2026-07). Styling ships in @kolkrabbi/kol-theme
// (kol-components-styleguide.css, layer components); data is consumer-injected.
//
// Exports are appended as each component lands.
export { default as MoodTile } from './MoodTile.jsx'
export { default as ColorAnatomy } from './ColorAnatomy.jsx'
export { default as TypeBlock } from './TypeBlock.jsx'
export { default as AssetTable } from './AssetTable.jsx'
export { WEIGHTS, CUTS, CASES, familyFor } from './typographyCuts.js'
export { default as LogoCard } from './LogoCard.jsx'
export { default as ClearspaceDiagram, hasFramework } from './ClearspaceDiagram.jsx'
export { default as LogoScaling } from './LogoScaling.jsx'
export { default as ComboLab, DEFAULT_PALETTE } from './ComboLab.jsx'
export {
  RatioBar, Tower, QuadSplit, CardRow, StripeRow, AppliedCard,
  LAYOUT_COMPONENTS, COMBO_LAYOUTS,
} from './comboLayouts.jsx'
export { generatePalette, fgOn, hexToHsl, hslToHex, GENERATION_MODES } from './comboMath.js'

// Re-exported styleguide primitives — live in the core packages, surfaced here
// so a brand guide imports from one place. Not duplicated: same modules.
export { AssetGrid, FeatureSplit, ProsePreview, SpectrumGrid } from '@kolkrabbi/kol-component'
export { TypeSample, TypeSpecCard } from '@kolkrabbi/kol-foundry'
