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

// The brand-book set the two brand apps were both maintaining locally
// (brand-book-mocks-two-consumers, 2026-09-03).
export { default as AssetCard } from './AssetCard.jsx'
export { default as Swatch } from './Swatch.jsx'
export {
  PostPhoto, PostType, PostProduct, PostEditorial, StoryPhoto, StoryType, ProfileAvatar,
  DEFAULT_MOCK_PALETTE, DEFAULT_MOCK_FONTS,
} from './SocialMocks.jsx'
export {
  BusinessCardFront, BusinessCardBack, Envelope, Letterhead,
  LetterheadCorrespondence, LetterheadB, EmailSignature,
  DEFAULT_BRAND_INFO, DEFAULT_STATIONERY_PALETTE, DEFAULT_STATIONERY_FONTS,
} from './StationeryMocks.jsx'

// This barrel exports THIS package only. The convenience re-exports were
// dropped in 0.3.0: `export … from '@kolkrabbi/kol-foundry'` made every import
// of this package pull foundry + opentype.js + framer-motion, so a consumer
// that wanted one logo card could not build. Import them from their own homes:
//   AssetGrid, FeatureSplit, ProsePreview, SpectrumGrid → @kolkrabbi/kol-component
//   TypeSample, TypeSpecCard                            → @kolkrabbi/kol-foundry
