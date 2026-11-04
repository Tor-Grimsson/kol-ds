/**
 * ReadingHighlight — A passage the reader marked, with its note marker. `… a willingness to remain. · Your highlight ·
 * Note 1` (float-everything W11 row 146, 2026-11-04 — kol-float--style W2.9 `Existing highlight · Note marker`). A block
 * on `surface-secondary` at radius 12, 20 in, 16 between: the passage in the reading face (`font`, default Literata) at
 * the column's size and leading on the emphasis ink, the marker under it in `kol-float-label` (fg-64). With `onClick`
 * the block is a button (open the note). `ReadingColumn` sets it inline among the paragraphs.
 *
 * @param {ReactNode} children  the passage
 * @param {ReactNode} [meta]    the marker (default `Your highlight` · `Note <note>` when `note` is set)
 * @param {number}    [note]    the note's number
 * @param {string}    [font]    the reading face (default `'Literata', Georgia, serif`)
 * @param {number}    [size]    px (default 22) · {number} [leading] (default 1.6)
 * @param {Function}  [onClick]
 * @param {string}    [className]
 */
export default function ReadingHighlight({ children, meta, note, font = "'Literata', Georgia, serif", size = 22, leading = 1.6, onClick, className = '' }) {
  const El = onClick ? 'button' : 'div'
  const marker = meta ?? (note != null ? `Your highlight · Note ${note}` : 'Your highlight')
  return (
    <El {...(onClick ? { type: 'button', onClick } : {})}
      className={`flex w-full flex-col gap-4 rounded-xl bg-surface-secondary p-5 text-left ${onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]' : ''} ${className}`.trim()}>
      <span className="text-fg-emphasis" style={{ fontFamily: font, fontSize: size, lineHeight: leading }}>{children}</span>
      <span className="kol-float-label text-fg-64">{marker}</span>
    </El>
  )
}
