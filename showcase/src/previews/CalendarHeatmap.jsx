import { CalendarHeatmap } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* Inline fixture — a year of deploys, every few days, ending on a fixed date */
const end = new Date(2026, 9, 31)
const days = new Map()
for (let i = 0; i < 365; i += 1) {
  const d = new Date(end); d.setDate(d.getDate() - i)
  const n = (i * 7919) % 11
  if (n > 5) days.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, n - 5)
}

export default function CalendarHeatmapPreview() {
  return <div className="w-full"><CalendarHeatmap days={days} end={end} color="var(--kol-palette-green)" /></div>
}
