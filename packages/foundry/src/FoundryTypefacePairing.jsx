import PairingsList from './PairingsList.jsx'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'

/**
 * FoundryTypefacePairing — the "Font Pairings" specimen section: a section
 * header over a PairingsList of recommended pairings. Ships a default set of
 * pairings; pass `pairings` to override.
 *
 * @param {Object} props
 * @param {Array} props.pairings - Pairing objects (see PairingsList). Defaults to the bundled set.
 */
const DEFAULT_PAIRINGS = [
  {
    leftTitle: 'Málrómur',
    leftTag: 'Body Text',
    leftDescription: 'Variable weight for nuanced discourse and extended reading',
    leftFontFamily: 'TGMalromur',
    rightTitle: 'Gullhamrar',
    rightTag: 'Headings',
    rightDescription: 'Warm, graceful forms for elegant hierarchy',
    rightFontFamily: 'TGGullhamrar'
  },
  {
    leftTitle: 'Rót',
    leftTag: 'Precision',
    leftDescription: 'Variable tuning system for technical documentation',
    leftFontFamily: 'TGRoot',
    rightTitle: 'Dylgjur',
    rightTag: 'Critique',
    rightDescription: 'Sharp angles for critical annotations and emphasis',
    rightFontFamily: 'TGDylgjur'
  },
  {
    leftTitle: 'Tröllatunga',
    leftTag: 'Mythological',
    leftDescription: 'Bold character for legendary narratives',
    leftFontFamily: 'TGTrollatunga',
    rightTitle: 'Málrómur',
    rightTag: 'Versatile',
    rightDescription: 'Balanced forms for diverse applications',
    rightFontFamily: 'TGMalromur'
  }
]

const FoundryTypefacePairing = ({ pairings = DEFAULT_PAIRINGS }) => {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          label="Font Pairings"
          size="sm"
          showDropdown={false}
        />

        <PairingsList pairings={pairings} />
      </div>
    </section>
  )
}

export default FoundryTypefacePairing
