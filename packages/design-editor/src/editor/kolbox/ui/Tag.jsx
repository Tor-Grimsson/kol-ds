/* Tag (Figma Tag): a word on the field fill, radius 4, padding 4 across, Inter 11 in the text ink, 15 high. In the
   right rail it stands in for a glyph your icons do not have yet (mask, freeform, vertical, horizontal, fit, corners),
   at the glyph's place, as the file draws it. A button: `onClick`, `lit` (the accent ink while its mode is on). */
export default function Tag({ children, label, lit = false, onClick, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={lit}
      onClick={onClick}
      className={`inline-flex h-3.75 shrink-0 items-center rounded-control bg-field px-1 text-help outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${lit ? 'text-accent' : 'text-text'} ${className}`}
    >
      {children}
    </button>
  )
}
