import { Legend } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

export default function LegendPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Legend items={[{ label: 'This period' }, { label: 'Previous period', dashed: true }]} interval="Daily" />
      <Legend items={[{ label: 'Direct', color: 'var(--kol-palette-blue)' }, { label: 'Search', color: 'var(--kol-palette-green)' }, { label: 'Referral', color: 'var(--kol-palette-orange)' }]} />
    </div>
  )
}
