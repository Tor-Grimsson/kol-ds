import { CalendarTimeline } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a year of phases on one scale — the year itself, then a phase a month, today's line */
const NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const ROWS = [
  { label: '2026', start: '2026-01-01', end: '2026-12-31', emphasis: true },
  ...NAMES.map((n, i) => ({ label: n, start: `2026-${String(i + 1).padStart(2, '0')}-01`, end: `2026-${String(i + 1).padStart(2, '0')}-${new Date(2026, i + 1, 0).getDate()}` })),
]

export default function CalendarTimelinePreview() {
  return <CalendarTimeline className="w-full max-w-[1328px]" year={2026} today="2026-11-03" rows={ROWS} />
}
