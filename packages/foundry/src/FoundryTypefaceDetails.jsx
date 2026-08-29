import { Button, ButtonGroup, SectionCardItem } from '@kolkrabbi/kol-component'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'

/* taxonomy-ok: organism — nests SpecimenSectionHeader (relative) + kol-component's SectionCardItem / Button */

const DEFAULT_DETAILS = [
  { title: 'Designer', description: 'Tor Grimsson', icon: 'foundation' },
  { title: 'Categories', description: 'Serif, Italic, Display', icon: 'foundation' },
  { title: 'Styles', description: '4 Weights', icon: 'foundation' },
  { title: 'Format', description: 'OTF, WOFF2', icon: 'foundation' },
]

/**
 * FoundryTypefaceDetails — the Font Details section of a specimen page: the
 * specimen header, a row of text-only SectionCardItems (designer · categories
 * · styles · format) and the download / specimen buttons (kol-website's
 * section, moved in 2026-08-27 — FoundrySpecimenSections).
 *
 * @param {{title: string, description: string, icon?: string}[]} details  the tiles
 * @param {ReactNode} actions   the button row (default: Download Font · View Specimen); `null` drops it
 * @param {string} label · icon   the header (default "Font Details" · info)
 */
export default function FoundryTypefaceDetails({ details = DEFAULT_DETAILS, actions, label = 'Font Details', icon = 'info', className = '' }) {
  const buttons = actions === undefined ? (
    <ButtonGroup align="center">
      <Button variant="primary">Download Font</Button>
      <Button variant="outline">View Specimen</Button>
    </ButtonGroup>
  ) : actions
  return (
    <section className={`w-full py-12 lg:py-16 ${className}`.trim()}>
      <div className="max-w-[var(--kol-container-max)] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader label={label} icon={icon} size="md" showDropdown={false} />
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {details.map((d, i) => (
            <SectionCardItem key={i} title={d.title} description={d.description} icon={d.icon} className="flex-1" />
          ))}
        </div>
        {buttons && <div className="flex flex-col items-center gap-2 pt-10 pb-4">{buttons}</div>}
      </div>
    </section>
  )
}
