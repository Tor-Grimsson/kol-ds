import { ChangeBadge } from '@kolkrabbi/kol-dashboards'

export const stage = 'sm'

// Inline fixture — up, down, flat, and a bounce rate where down is good.
export default function ChangeBadgePreview() {
  return (
    <div className="flex items-center gap-6">
      <ChangeBadge now={120} then={100} />
      <ChangeBadge now={80} then={100} />
      <ChangeBadge now={100} then={100} />
      <ChangeBadge now={58} then={61} lowerIsBetter />
    </div>
  )
}
