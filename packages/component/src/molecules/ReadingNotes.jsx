import Button from '../atoms/Button.jsx'
import Textarea from '../atoms/Textarea.jsx'

/* taxonomy-ok: molecule — float Textarea and Buttons under mono labels */

/**
 * ReadingNotes — The selected highlight and its note: the Notes side of `ReadingPanel` (float-everything W11 row 150,
 * 2026-11-04 — kol-float--style W2.9 `Contextual reading panel · Notes`). Under a `kol-float-ruler` label (uppercase,
 * fg-64): the passage on the float well at radius 14, 14 in, in the reading face at 16 / 1.5; its place in a 32 well
 * capsule (`kol-float-label`, fg-64). Under the second label the note as a float Textarea, its save state in
 * `kol-float-label`, then the way out — `View highlights` as the inverted float capsule (lg, full width) — the quiet
 * remove, and the mono footer line.
 *
 * @param {ReactNode} quote          the highlighted passage
 * @param {ReactNode} [location]     `Third interlude · Page 125`
 * @param {string}    [note]         the note's text · {Function} [onNoteChange] `(text) => void`
 * @param {ReactNode} [status]       `All changes saved`
 * @param {Function}  [onView]       · {string} [viewLabel] default `View highlights`
 * @param {Function}  [onRemove]     · {string} [removeLabel] default `Remove highlight`
 * @param {ReactNode} [footer]       `Note 1 / Page 125`
 * @param {string}    [quoteLabel]   default `Selected highlight` · {string} [noteLabel] default `Reading note`
 * @param {string}    [font]         the reading face (default `'Literata', Georgia, serif`)
 * @param {string}    [className]
 */
export default function ReadingNotes({ quote, location, note = '', onNoteChange, status, onView, viewLabel = 'View highlights', onRemove, removeLabel = 'Remove highlight', footer, quoteLabel = 'Selected highlight', noteLabel = 'Reading note', font = "'Literata', Georgia, serif", className = '' }) {
  return (
    <div className={`flex flex-col ${className}`.trim()}>
      <span className="kol-float-ruler uppercase text-fg-64">{quoteLabel}</span>
      <blockquote className="mt-3 rounded-[14px] bg-[var(--kol-float-well)] p-3.5 text-[16px] leading-[1.5] text-fg-emphasis" style={{ fontFamily: font }}>{quote}</blockquote>
      {location && <span className="kol-float-label mt-5 flex h-8 items-center rounded-full bg-[var(--kol-float-well)] px-4 text-fg-64">{location}</span>}
      <span className="kol-float-ruler mt-8 uppercase text-fg-64">{noteLabel}</span>
      <Textarea variant="float" rows={5} value={note} onChange={(e) => onNoteChange?.(e.target.value)} aria-label={noteLabel} className="mt-3" />
      {status && <span className="kol-float-label mt-5 text-fg-64">{status}</span>}
      {onView && <Button variant="float" tone="inverted" size="lg" iconRight="external-link" onClick={onView} className="mt-6 w-full justify-center">{viewLabel}</Button>}
      {onRemove && <Button variant="float" tone="ghost" size="sm" onClick={onRemove} className="-ml-3 mt-4 self-start">{removeLabel}</Button>}
      {footer && <span className="kol-float-ruler mt-5 uppercase text-fg-64">{footer}</span>}
    </div>
  )
}
