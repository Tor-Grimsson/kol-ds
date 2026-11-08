/* A calendar glyph for date pickers (24 grid, stroke 1.5, currentColor, square keyline 18). Drawn here until
 * kol-icons ships a calendar in its `time` group; then it becomes <Icon name="calendar">. */
const CalendarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
    <path d="M3 9.5H21M8 3V6M16 3V6" />
  </svg>
)
export default CalendarIcon
