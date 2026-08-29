import { SectionCardItem } from '@kolkrabbi/kol-component'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'

/* taxonomy-ok: organism — nests SpecimenSectionHeader (relative) + kol-component's SectionCardItem */

const DEFAULT_FEATURES = [
  { title: 'Stylistic Alternates', description: 'Alternative character forms for enhanced typographic expression' },
  { title: 'Ligatures', description: 'Contextual and discretionary ligatures for improved readability' },
  { title: 'Kerning Pairs', description: 'Optimized spacing between character pairs' },
  { title: 'Extended Language Support', description: 'Support for Latin, Cyrillic, and Greek character sets' },
]

/**
 * FoundryOpentypeFeatures — the OpenType Features section of a specimen page:
 * the specimen header over a row of text-only SectionCardItems (kol-website's
 * section, moved in 2026-08-27 — FoundrySpecimenSections; its FeatureGrid /
 * FeatureCard are the family card with no visual). Hover only, never a
 * persistent selected state (user: "neither All Typefaces nor Font Pairing
 * does this").
 *
 * @param {{title: string, description: string, icon?: string}[]} features  the tiles (default: the four house features)
 * @param {string} label · icon   the header (default "OpenType Features" · variant-01)
 */
export default function FoundryOpentypeFeatures({ features = DEFAULT_FEATURES, label = 'OpenType Features', icon = 'variant-01', className = '' }) {
  return (
    <section className={`w-full py-12 lg:py-16 ${className}`.trim()}>
      <div className="max-w-[var(--kol-container-max)] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader label={label} icon={icon} size="md" showDropdown={false} />
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {features.map((f, i) => (
            <SectionCardItem key={i} title={f.title} description={f.description} icon={f.icon} className="flex-1" />
          ))}
        </div>
      </div>
    </section>
  )
}
