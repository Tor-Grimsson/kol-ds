/**
 * @kol/component foundry sub-barrel — the type-specimen layer (the DS answer to
 * the monorepo's `@kol/ui/foundry`). Exposed as the `./foundry` package subpath
 * so the showcase specimen set can import these without touching the root
 * src/index.js barrel. The root barrel export lines are documented in the p9
 * wiring notes for a central merge.
 */

// molecule (shared section header)
export { default as SpecimenSectionHeader } from '../../molecules/foundry/SpecimenSectionHeader.jsx'

// organisms (specimen sections)
export { default as TypefaceHero } from './TypefaceHero.jsx'
export { default as VariableFontSection } from './VariableFontSection.jsx'
export { default as GlyphMetricsGrid } from './GlyphMetricsGrid.jsx'
export { default as TypefaceStyleSection } from './TypefaceStyleSection.jsx'
export { default as FontPreviewSection } from './FontPreviewSection.jsx'
export { default as FoundryCharacterSets } from './FoundryCharacterSets.jsx'

// data
export { glyphSets, glyphCategories, SPECIMEN_SAMPLE_TEXT } from './glyphData.js'
