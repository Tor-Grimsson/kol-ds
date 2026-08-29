import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'
import PairingCard from './PairingCard.jsx'

/* taxonomy-ok: organism — nests SpecimenSectionHeader + PairingCard (relative) */

const DEFAULT_PAIRINGS = [
  { leftTitle: 'Málrómur', leftTag: 'Body Text', leftDescription: 'Variable weight for nuanced discourse and extended reading', leftFontFamily: 'TGMalromur', rightTitle: 'Gullhamrar', rightTag: 'Headings', rightDescription: 'Warm, graceful forms for elegant hierarchy', rightFontFamily: 'TGGullhamrar' },
  { leftTitle: 'Rót', leftTag: 'Precision', leftDescription: 'Variable tuning system for technical documentation', leftFontFamily: 'TGRoot', rightTitle: 'Dylgjur', rightTag: 'Critique', rightDescription: 'Sharp angles for critical annotations and emphasis', rightFontFamily: 'TGDylgjur' },
  { leftTitle: 'Tröllatunga', leftTag: 'Mythological', leftDescription: 'Bold character for legendary narratives', leftFontFamily: 'TGTrollatunga', rightTitle: 'Málrómur', rightTag: 'Versatile', rightDescription: 'Balanced forms for diverse applications', rightFontFamily: 'TGMalromur' },
]

/**
 * FoundryTypefacePairing — the Font Pairings section of a specimen page: the
 * specimen header over a list of PairingCards (kol-website's section, moved in
 * 2026-08-27 — FoundrySpecimenSections).
 *
 * @param {object[]} pairings   PairingCard props per row (default: the house pairings)
 * @param {string} label · icon   the header (default "Font Pairings" · overlap)
 */
export default function FoundryTypefacePairing({ pairings = DEFAULT_PAIRINGS, label = 'Font Pairings', icon = 'overlap', className = '' }) {
  return (
    <section className={`w-full py-12 lg:py-16 ${className}`.trim()}>
      <div className="max-w-[var(--kol-container-max)] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader label={label} icon={icon} size="md" showDropdown={false} />
        <div className="w-full flex flex-col gap-4">
          {pairings.map((p, i) => <PairingCard key={i} {...p} />)}
        </div>
      </div>
    </section>
  )
}
