/**
 * @kolkrabbi/kol-foundry — the type-specimen apparatus. Every export renders,
 * inspects, or manipulates a live font (see COMPONENTS.md for the membership
 * test). Data is consumer-injected; shared primitives stay in @kolkrabbi/kol-component.
 */

// section scaffold
export { default as SpecimenSectionHeader } from './SpecimenSectionHeader.jsx'

// specimen tools — one typeface, inspected
export { default as TypefaceHero } from './TypefaceHero.jsx'
export { default as TypefaceStyleSection } from './TypefaceStyleSection.jsx'
export { default as FontPreviewSection } from './FontPreviewSection.jsx'
export { default as VariableFontSection } from './VariableFontSection.jsx'
export { default as GlyphMetricsGrid } from './GlyphMetricsGrid.jsx'
export { default as GlyphMetricsSection } from './GlyphMetricsSection.jsx'
export { default as FoundryCharacterSets } from './FoundryCharacterSets.jsx'

// catalog — the specimen collection
export { default as TypefaceLibraryGrid } from './TypefaceLibraryGrid.jsx'
export { default as TypefaceLibraryGridWithVariables } from './TypefaceLibraryGridWithVariables.jsx'
export { default as TypefaceLibraryItem } from './TypefaceLibraryItem.jsx'
export { default as TypefaceVariablePreview } from './TypefaceVariablePreview.jsx'

// type-specimen kit — prop-driven specimen blocks (moved from @kolkrabbi/kol-component 2026-07-09)
export { default as TypeSample } from './TypeSample.jsx'
export { default as TypeSpecCard } from './TypeSpecCard.jsx'

// live-font effects — variable-font axes, animated
export { default as TextPressure } from './TextPressure.jsx'
export { default as ColorLoader } from './ColorLoader.jsx'

// reference composition (severed page — data via props, no router/SEO/data-fetch)
export { default as TypefaceSpecimenPage } from './TypefaceSpecimenPage.jsx'

// data
export { glyphSets, glyphCategories, SPECIMEN_SAMPLE_TEXT } from './glyphData.js'
export { typefaceConfig, getTypefaceConfig, getAllTypefaceIds, getAllTypefaces } from './typefaceConfig.js'
