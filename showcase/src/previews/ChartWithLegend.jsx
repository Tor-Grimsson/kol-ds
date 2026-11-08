import { ChartWithLegend, Sparkline } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — two series and their totals; the second chart keeps the row, empty.
export default function ChartWithLegendPreview() {
  return (
    <div className="flex flex-col gap-10 w-full max-w-[560px]">
      <ChartWithLegend items={[
        { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)', value: '12.9k' },
        { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)', value: '41.8k' },
      ]}>
        <Sparkline data={[3, 5, 4, 8, 6, 9, 12, 10]} />
      </ChartWithLegend>
      <ChartWithLegend><Sparkline data={[3, 5, 4, 8, 6, 9, 12, 10]} /></ChartWithLegend>
    </div>
  )
}
