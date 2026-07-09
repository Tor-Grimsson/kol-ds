import FeatureGrid from './FeatureGrid.jsx'
import ButtonGroup from './ButtonGroup.jsx'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'

/**
 * FoundryTypefaceDetails — the "Font Details" specimen section: a section header
 * over a row of detail FeatureCards, closed by a Download / View Specimen
 * ButtonGroup. Ships a default detail set + default actions; pass `details` /
 * `actions` to override.
 *
 * @param {Object} props
 * @param {Array<{title:string, description:string, icon?:string}>} props.details - Detail list.
 * @param {Array} props.actions - ButtonGroup button configs.
 */
const DEFAULT_DETAILS = [
  { title: 'Designer', description: 'Tor Grimsson', icon: 'foundation' },
  { title: 'Categories', description: 'Serif, Italic, Display', icon: 'foundation' },
  { title: 'Styles', description: '4 Weights', icon: 'foundation' },
  { title: 'Format', description: 'OTF, WOFF2', icon: 'foundation' }
]

const DEFAULT_ACTIONS = [
  { label: 'Download Font', variant: 'primary' },
  { label: 'View Specimen', variant: 'outline' }
]

const FoundryTypefaceDetails = ({ details = DEFAULT_DETAILS, actions = DEFAULT_ACTIONS }) => {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          label="Font Details"
          size="sm"
          showDropdown={false}
        />

        <FeatureGrid variant="row" features={details} />

        <div className="flex flex-col items-center gap-2 pt-10 pb-4">
          <ButtonGroup
            buttons={actions}
            align="center"
          />
        </div>
      </div>
    </section>
  )
}

export default FoundryTypefaceDetails
