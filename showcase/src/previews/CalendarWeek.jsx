import { CalendarWeek } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a week as seven columns — no timed events while sync needs attention, the running phase under them */
export default function CalendarWeekPreview() {
  return (
    <CalendarWeek className="w-full max-w-[1328px]" week="2026-11-02" today="2026-11-03"
      empty="No timed events shown while calendar sync needs attention."
      running={[{ label: 'November', meta: 'Day 1 of 21', range: '1 – 30 Nov' }]} />
  )
}
