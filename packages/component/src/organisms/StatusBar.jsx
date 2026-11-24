/**
 * StatusBar — a document's status along its foot (Folio's StatusBar, 2026-11-22): the counts on the left, the host's
 * cells on the right (the format, the language, the zoom, the encoding). It holds no state; the cells are the host's.
 * Spaces in `left` are kept (Folio spaces its counts with them). Chrome in kol-theme `.kol-status-bar--kolbox` and
 * `.kol-status-bar--folio`.
 *
 *   <StatusBar left="212 words      1,204 characters      18 lines">
 *     <Dropdown variant="kolbox" ... /><span>UTF-8      LF</span>
 *   </StatusBar>
 *
 * @param {'kolbox'|'folio'} [variant='kolbox'] - kolbox: 32 high on the rail ground, the kolbox line over it, the text
 *   kolbox's help voice (11 / 15), the counts in oq-64. folio: Folio's bar carried class for class (40, its rule, meta).
 * @param {ReactNode} [left] - The text on the left
 * @param {ReactNode} [children] - The right-hand cells, 16 apart (folio 24)
 * @param {string} [className] - Extra classes on the bar
 */
export default function StatusBar({ variant = 'kolbox', left, children, className = '' }) {
  if (variant === 'folio') return (
    <div className={`kol-status-bar--folio flex h-[40px] shrink-0 items-center justify-between gap-[24px] whitespace-pre border-t px-[56px] ${className}`.trim()}>
      <p className="kol-status-bar-left">{left}</p>
      <div className="flex items-center gap-[24px]">{children}</div>
    </div>
  )
  return (
    <div className={`kol-status-bar--kolbox kol-kolbox-help flex h-8 shrink-0 items-center justify-between gap-4 whitespace-pre border-t pr-2 pl-3 ${className}`.trim()}>
      <p className="kol-status-bar-left min-w-0 overflow-hidden text-ellipsis">{left}</p>
      <div className="flex shrink-0 items-center gap-4">{children}</div>
    </div>
  )
}
