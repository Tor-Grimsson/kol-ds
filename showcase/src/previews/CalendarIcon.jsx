import { CalendarIcon } from '@kolkrabbi/kol-dashboards'

export const stage = 'sm'

export default function CalendarIconPreview() {
  return (
    <div className="flex items-center gap-6 text-fg-88">
      <CalendarIcon size={14} />
      <CalendarIcon size={24} />
    </div>
  )
}
