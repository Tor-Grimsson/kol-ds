import FeatureGrid from './FeatureGrid.jsx'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'

/**
 * FoundryOpentypeFeatures — the "OpenType Features" specimen section: a section
 * header over a row of FeatureCards. Ships a default feature set; pass
 * `features` to override.
 *
 * @param {Object} props
 * @param {Array<{title:string, description:string, icon?:string}>} props.features - Feature list.
 */
const DEFAULT_FEATURES = [
  {
    title: 'Stylistic Alternates',
    description: 'Alternative character forms for enhanced typographic expression'
  },
  {
    title: 'Ligatures',
    description: 'Contextual and discretionary ligatures for improved readability'
  },
  {
    title: 'Kerning Pairs',
    description: 'Optimized spacing between character pairs'
  },
  {
    title: 'Extended Language Support',
    description: 'Support for Latin, Cyrillic, and Greek character sets'
  }
]

const FoundryOpentypeFeatures = ({ features = DEFAULT_FEATURES }) => {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          label="OpenType Features"
          size="sm"
          showDropdown={false}
        />

        <FeatureGrid features={features} variant="row" />
      </div>
    </section>
  )
}

export default FoundryOpentypeFeatures
