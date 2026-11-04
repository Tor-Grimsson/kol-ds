import { WeeklyBars } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a month of commits by week, the current week last.
export default function WeeklyBarsPreview() {
  return (
    <div className="w-[320px]">
      <WeeklyBars weeks={[{ count: 13, label: '01–07' }, { count: 19, label: '08–14' }, { count: 24, label: '15–21' }, { count: 31, label: '22–28', current: true }]} />
    </div>
  )
}
