// @kolkrabbi/kol-styleguide — the brand style-guide component set.
//
// Visual specimens a brand manual is built from — color anatomy + the
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
export { DEFAULT_PALETTE } from './ComboLab.jsx'
export {
  RatioBar, Tower, QuadSplit, CardRow, StripeRow, AppliedCard,
  LAYOUT_COMPONENTS, COMBO_LAYOUTS,
} from './comboLayouts.jsx'
export { generatePalette, fgOn, hexToHsl, hslToHex, GENERATION_MODES } from './comboMath.js'

// The brand-book set the two brand apps were both maintaining locally
// (brand-book-mocks-two-consumers, 2026-09-03).
export { default as AssetCard } from './AssetCard.jsx'
/* a folder's pages as the brand book's contents cards (plan-2026-10-28-document W5.2) */
export { default as DocumentIndex } from './DocumentIndex.jsx'
export { default as DocumentLibrary, DocumentView, DocumentFiles, DocumentMarkdown, kindIcon, useFileQuickLook } from './DocumentLibrary.jsx'
/* print (PdfToolsFromStudio, 2026-10-28): A4 sheets for any content, and markdown to PDF · DOCX · MD on @kolkrabbi/kol-print */
export { default as A4Pages } from './A4Pages.jsx'
export { default as PrintStudio } from './PrintStudio.jsx'
export { default as Swatch } from './Swatch.jsx'
export {
  PostPhoto, PostType, PostProduct, PostEditorial, StoryPhoto, StoryType, BrandAvatar, ProfileAvatar,
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

// The brand tool (brand-as-a-tool, 2026-09-27): the brand book's two pages over one manifest —
// kol-olina's apps/brand, carried in. `Brand` is the tool; the pages render alone too.
export { default as Brand } from './Brand.jsx'
export { default as BrandBook } from './BrandBook.jsx'
export { default as BrandAssets } from './BrandAssets.jsx'
export { brandSections, brandToc, brandInfo, BRAND_VIEWS, BOOK_SECTIONS, ASSET_SECTIONS } from './brandBook.js'

// The brand guide (2026-10-27): kol-branding's guide renderer over a chapter list it is handed —
// kol-brand-template's GUIDE_SECTIONS, blank (GUIDE_TEMPLATE) or filled by a client's manifest.
export { default as BrandGuide } from './BrandGuide.jsx'
export { guideSections, guideToc } from './guideBook.js'

// THE LAB (2026-10-20; one name system and its own subpath 2026-10-29, BrandLabToolGaps): the generators a brand is MADE
// with — TypeLab · ColorLab · ComboLab · LockupLab, each `<x>Lab(value)` · `<x>LabCss` · `DEFAULT_<X>_LAB`. The same
// names ship from `@kolkrabbi/kol-styleguide/lab`.
export {
  LabWindow, LabOutput, useLabValue,
  TypeLab, typeLab, typeLabCss, DEFAULT_TYPE_LAB, TYPE_RATIOS, TYPE_STEPS, TYPE_ROLES, TYPE_FACES, TYPE_CASES, TYPE_INKS,
  ColorLab, colorLab, colorLabCss, rollColorLab, DEFAULT_COLOR_LAB, COLOR_ROLES, COLOR_RELATIONS, INK_LEVELS, TEXT_STOPS,
  generateColors, assignRoles, tintLadder, midColor, simulateCvd, CVD_TYPES, paletteFromPixels, seededRng, oklchToHex, hexToOklch, contrastRatio, contrastGrade, inkOn, blendRamp,
  ComboLab, comboLab, comboLabCss, DEFAULT_COMBO_LAB, COMBO_ROLES,
  LockupLab, BrandLockup, lockupLab, DEFAULT_LOCKUP_LAB, LOCKUP_PARTS, LOCKUP_TYPES, LOCKUP_SHAPES, LOCKUP_CASES, LOCKUP_GRID, LOCKUP_SUB_PRESETS,
  Lockup, LOCKUP_SCALES,
} from './lab/index.js'
// the names before the lab family (deprecated 2026-10-29, 04-retirements.md)
export { default as TypeScaleLab } from './TypeScaleLab.jsx'
export { typeScale, typeScaleCss, DEFAULT_TYPE_SCALE } from './typeLab.js'
export { deriveColorLab } from './colorLab.js'
export { default as LockupBuilder } from './LockupBuilder.jsx'
