import { SegmentBar } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a store's file types by bytes.
export default function SegmentBarPreview() {
  return (
    <div className="w-full max-w-[400px]">
      <SegmentBar segments={[
        { label: 'video', value: 420, color: 'var(--kol-palette-blue)' },
        { label: 'images', value: 110, color: 'var(--kol-palette-green)' },
        { label: 'fonts', value: 30, color: 'var(--kol-palette-orange)' },
      ]} />
    </div>
  )
}
