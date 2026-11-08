import { DeltaBadge } from '@kolkrabbi/kol-dashboards'

export const stage = 'sm'

export const variants = ['default', 'canvas']

// Inline fixture — a count, a session length and a bounce rate.
export default function DeltaBadgePreview({ variant }) {
  const v = variant === 'canvas' ? 'canvas' : undefined
  return (
    <div className="flex items-center gap-6">
      <DeltaBadge now={12864} then={10740} variant={v} />
      <DeltaBadge kind="duration" now={102} then={96} variant={v} />
      <DeltaBadge kind="rate" now={58} then={61} variant={v} />
    </div>
  )
}
