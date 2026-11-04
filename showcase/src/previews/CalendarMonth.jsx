import { CalendarMonth } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a month of weeks — what runs across them split at each week's edge, today on the disc */
export default function CalendarMonthPreview() {
  return (
    <CalendarMonth className="w-full max-w-[1328px]" month="2026-11" today="2026-11-03" onSelect={() => {}}
      events={[{ start: '2026-10-01', end: '2026-10-31', label: 'October' }, { start: '2026-11-01', end: '2026-11-30', label: 'November' }, { start: '2026-12-01', end: '2026-12-31', label: 'December' }]} />
  )
}
