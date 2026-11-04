import { CalendarDay } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* one day — the all-day lane over the hours, now's line */
export default function CalendarDayPreview() {
  return <CalendarDay className="w-full max-w-[1328px]" allDay={[{ label: 'November' }]} now="16:35" />
}
