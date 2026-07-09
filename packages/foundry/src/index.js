/**
 * @kol/component foundry sub-barrel — the type-specimen layer (the DS answer to
 * the monorepo's `@kol/ui/foundry`). Exposed as the `./foundry` package subpath
 * so the showcase specimen set can import these without touching the root
 * src/index.js barrel. The root barrel export lines are documented in the p9
 * wiring notes for a central merge.
 */

// molecule (shared section header)
export { default as SpecimenSectionHeader } from './SpecimenSectionHeader.jsx'

// organisms (specimen sections)
export { default as TypefaceHero } from './TypefaceHero.jsx'
export { default as VariableFontSection } from './VariableFontSection.jsx'
export { default as GlyphMetricsGrid } from './GlyphMetricsGrid.jsx'
export { default as GlyphMetricsSection } from './GlyphMetricsSection.jsx'
export { default as TypefaceStyleSection } from './TypefaceStyleSection.jsx'
export { default as FontPreviewSection } from './FontPreviewSection.jsx'
export { default as FoundryCharacterSets } from './FoundryCharacterSets.jsx'

// atoms (foundry-internal leaves)
export { default as PairingCard } from './PairingCard.jsx'
export { default as FeatureCard } from './FeatureCard.jsx'
export { default as TypefaceLibraryItem } from './TypefaceLibraryItem.jsx'
export { default as TypefaceVariablePreview } from './TypefaceVariablePreview.jsx'
// ButtonGroup — vendored (not yet in @kolkrabbi/kol-component)
export { default as ButtonGroup } from './ButtonGroup.jsx'

// molecules (composed foundry pieces)
export { default as PairingsList } from './PairingsList.jsx'
export { default as FeatureGrid } from './FeatureGrid.jsx'
export { default as TypefaceLibraryGrid } from './TypefaceLibraryGrid.jsx'
export { default as TypefaceLibraryGridWithVariables } from './TypefaceLibraryGridWithVariables.jsx'
export { default as FoundryCTA } from './FoundryCTA.jsx'

// organisms (specimen sections — foundry collection + features + chrome)
export { default as FoundryTypefacePairing } from './FoundryTypefacePairing.jsx'
export { default as FoundryOpentypeFeatures } from './FoundryOpentypeFeatures.jsx'
export { default as FoundryTypefaceDetails } from './FoundryTypefaceDetails.jsx'
export { default as FoundryOtherTypefaces } from './FoundryOtherTypefaces.jsx'
export { default as FoundryFeatureSection } from './FoundryFeatureSection.jsx'
export { default as FoundryLicenseQuestions } from './FoundryLicenseQuestions.jsx'
export { default as InDevelopmentSection } from './InDevelopmentSection.jsx'

// reference composition (severed page — data via props, no router/SEO/data-fetch)
export { default as TypefaceSpecimenPage } from './TypefaceSpecimenPage.jsx'

// data
export { glyphSets, glyphCategories, SPECIMEN_SAMPLE_TEXT } from './glyphData.js'
export { typefaceConfig, getTypefaceConfig, getAllTypefaceIds, getAllTypefaces } from './typefaceConfig.js'
