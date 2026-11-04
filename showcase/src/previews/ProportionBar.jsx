import { ProportionBar } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — visitors by device, then by browser in the palette.
export default function ProportionBarPreview() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[400px]">
      <ProportionBar segments={[{ label: 'Desktop', value: 69 }, { label: 'Phone', value: 27 }, { label: 'Tablet', value: 4 }]} />
      <ProportionBar segments={[{ label: 'Safari', value: 48, color: 'var(--kol-palette-blue)' }, { label: 'Chrome', value: 40, color: 'var(--kol-palette-green)' }, { label: 'Firefox', value: 12, color: 'var(--kol-palette-orange)' }]} />
    </div>
  )
}
