import Button from '../atoms/Button.jsx'
import ProgressBar from '../atoms/ProgressBar.jsx'
import TocRow from '../molecules/TocRow.jsx'

/* taxonomy-ok: organism — the reader's contents sheet: book head, TocRow list, progress */

/**
 * ReadingContents — The book's contents, where the reader is in them, and how far through. `Contents · The Waves ·
 * 01 First interlude … · Through the book 42%` (float-everything W11 row 149, 2026-11-04 — kol-float--style W2.9
 * `Contents panel`). A 304 sheet on `surface-secondary` at the sheet radius, 20 in: `Contents` in `kol-float-body-lg`
 * with the fold ⌃, the book in `kol-float-section` over its author (`kol-float-hint`, fg-64), the count in
 * `kol-float-ruler`, then one `TocRow` per chapter (numbered, `current` lifted fg-16), then the progress line —
 * `Through the book` and the share in mono over the float ProgressBar (4px) — and the save state.
 *
 * @param {string}    [title]       default `Contents`
 * @param {ReactNode} [book]        · {ReactNode} [author] · {ReactNode} [count] `9 interludes`
 * @param {Array}     chapters      `[{ id, label, href? }]`
 * @param {string}    [current]     the id the reader is in
 * @param {Function}  [onSelect]    `(id) => void`
 * @param {number}    [progress]    0–100; unset, no progress line
 * @param {string}    [progressLabel]  default `Through the book`
 * @param {ReactNode} [status]      `Reading position saved`
 * @param {Function}  [onFold]
 * @param {number}    [width]       default 304
 * @param {string}    [className]
 */
export default function ReadingContents({ title = 'Contents', book, author, count, chapters = [], current, onSelect, progress, progressLabel = 'Through the book', status, onFold, width = 304, className = '' }) {
  return (
    <aside className={`flex flex-col rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-5 ${className}`.trim()} style={{ width }} aria-label={title}>
      <div className="flex h-7 items-center justify-between">
        <span className="kol-float-body-lg text-fg-emphasis">{title}</span>
        {onFold && <Button variant="float" tone="ghost" size="sm" iconOnly="chevron-up" aria-label="Fold" onClick={onFold} className="-mr-1.5" />}
      </div>
      {book && <span className="kol-float-section mt-8 text-fg-emphasis">{book}</span>}
      {author && <span className="kol-float-hint mt-1 text-fg-64">{author}</span>}
      {count && <span className="kol-float-ruler mt-6 uppercase text-fg-64">{count}</span>}
      <nav className="-mx-2 mt-3 flex flex-col gap-1" aria-label={title}>
        {chapters.map((c, i) => (
          <TocRow key={c.id} number={i + 1} label={c.label} href={c.href} current={c.id === current} onClick={onSelect ? () => onSelect(c.id) : undefined} className="h-9" />
        ))}
      </nav>
      {progress != null && (
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="kol-float-hint text-fg-64">{progressLabel}</span>
            <span className="kol-float-timecode tabular-nums text-fg-emphasis">{Math.round(progress)}%</span>
          </div>
          <ProgressBar variant="float" value={progress} ariaLabel={progressLabel} />
        </div>
      )}
      {status && <span className="kol-float-label mt-5 text-fg-64">{status}</span>}
    </aside>
  )
}
