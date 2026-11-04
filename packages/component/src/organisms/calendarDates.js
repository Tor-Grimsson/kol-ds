/* calendarDates — the four Calendar views' date arithmetic (float-everything W11, 2026-11-04). Dates are local
 * `YYYY-MM-DD` strings or Date objects; weeks start on Monday. Not exported from the package. */

export const toDate = (d) => {
  if (d instanceof Date) return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const [y, m, day] = String(d).split('-').map(Number)
  return new Date(y, (m || 1) - 1, day || 1)
}

export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

export const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Monday of the week holding `d` */
export const weekStart = (d) => addDays(d, -((d.getDay() + 6) % 7))

/** whole days from a to b */
export const daysBetween = (a, b) => Math.round((b - a) / 86400000)

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** `HH:MM` → hours as a number */
export const toHours = (t) => { const [h, m = 0] = String(t).split(':').map(Number); return h + m / 60 }
