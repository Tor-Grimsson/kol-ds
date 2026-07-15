import { DashListCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixtures — meter items carry percent+color; ratings items carry value+detail.
const topPages = [
  { label: '/stack/design-systems', value: '1,204', percent: 42, color: 'var(--kol-palette-blue)' },
  { label: '/work/kol-editor', value: '861', percent: 30, color: 'var(--kol-palette-teal)' },
  { label: '/', value: '640', percent: 22, color: 'var(--kol-palette-green)' },
  { label: '/stack/type-foundry', value: '512', percent: 18, color: 'var(--kol-palette-orange)' },
]

const topCountries = [
  { label: 'Iceland', value: '512', detail: '31%', color: 'var(--kol-palette-blue)' },
  { label: 'United States', value: '389', detail: '24%', color: 'var(--kol-palette-teal)' },
  { label: 'Germany', value: '221', detail: '13%', color: 'var(--kol-palette-green)' },
  { label: 'United Kingdom', value: '164', detail: '10%', color: 'var(--kol-palette-orange)' },
]

export default function DashListCardDemo() {
  return (
    <>
      <DashListCard
        variant="meter"
        title="Top pages"
        subtitle="By pageviews"
        icon="dashboard-bookmark"
        items={topPages}
        footer="Last 30 days"
      />
      <DashListCard
        variant="ratings"
        title="Top countries"
        subtitle="By visitors"
        icon="dashboard-roadmap"
        items={topCountries}
        footer="Geo from headers"
      />
    </>
  )
}
