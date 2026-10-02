import { ExhibitOverview } from '@kolkrabbi/kol-workshop'

export const stage = 'full'

/* An exhibit's landing page: what the section is, then every child page as a card. No `toc` — the
 * preview leaves the shell's rail alone. */
export default function ExhibitOverviewPreview() {
  return (
    <ExhibitOverview
      label="Scope: Dashboard — Overview"
      title="Dashboard"
      body="Cards for metrics, charts and data."
      cards={[
        { id: 'setup', label: 'Setup', subtitle: 'Install and wire the data', icon: 'book-open', href: '/components/exhibit-overview' },
        { id: 'cards', label: 'Cards', subtitle: 'Every card, live', icon: 'grid', href: '/components/exhibit-overview' },
      ]}
    />
  )
}
