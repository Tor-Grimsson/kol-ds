import ProgressBar from '../atoms/ProgressBar.jsx'
import TocRow from '../molecules/TocRow.jsx'
import { LabeledControlSection } from './SettingsPanel.jsx'

/* taxonomy-ok: organism — the reader's contents, a module's body: book head, LabeledControlSection of TocRows, progress */

/**
 * ReadingContents — The book's contents, where the reader is in them, and how far through. `The Waves · 9 interludes ·
 * 01 First interlude … · Through the book 42%` (float-everything W11 row 149, 2026-11-04 — kol-float--style W2.9
 * `Contents panel`). It is BODY CONTENT (plan-2026-11-12-float-rails-figma W4.1): no sheet, no header, no margins of its
 * own. It goes in a `RailFloat`'s body, the module carrying the title (`Contents`), the fold and the status line in its
 * footer:
 *
 *   <RailFloat title="Contents" collapsibleV footer={<span className="kol-float-label text-fg-64">Reading position saved</span>}>
 *     <ReadingContents book="The Waves" author="Virginia Woolf" count="9 interludes" chapters={chapters} … />
 *   </RailFloat>
 *
 * A column, 24 between its parts: `book` (the title in `kol-float-section` over the author in `kol-float-hint` fg-64,
 * 4 apart), the chapters as a float `LabeledControlSection` (the count in `kol-float-ruler` over one 36 `TocRow` per
 * chapter, 12 under the count, 4 between rows; `current` lifted fg-16), then `progress` (`Through the book` and the
 * share in mono over the float ProgressBar, 12 apart). Each part renders only when given.
 *
 * @param {ReactNode} [book]        · {ReactNode} [author] · {ReactNode} [count] `9 interludes`
 * @param {Array}     chapters      `[{ id, label, href? }]`
 * @param {string}    [current]     the id the reader is in
 * @param {Function}  [onSelect]    `(id) => void`
 * @param {number}    [progress]    0–100; unset, no progress line
 * @param {string}    [progressLabel]  default `Through the book`
 * @param {string}    [className]
 */
function ReadingContentsDefault({ book, author, count, chapters = [], current, onSelect, progress, progressLabel = 'Through the book', className = '' }) {
  return (
    <div data-reading-contents="" className={`flex flex-col gap-6 ${className}`.trim()}>
      {(book || author) && (
        <div className="flex flex-col gap-1">
          {book && <span className="kol-float-section text-fg-emphasis">{book}</span>}
          {author && <span className="kol-float-hint text-fg-64">{author}</span>}
        </div>
      )}
      {(count || chapters.length > 0) && (
        <LabeledControlSection variant="float" as="nav" aria-label="Contents" rowGap={1}
          label={count && <span className="kol-float-ruler uppercase text-fg-64">{count}</span>}>
          {chapters.map((c, i) => (
            <TocRow key={c.id} number={i + 1} label={c.label} href={c.href} current={c.id === current} onClick={onSelect ? () => onSelect(c.id) : undefined} className="h-9" />
          ))}
        </LabeledControlSection>
      )}
      {progress != null && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="kol-float-hint text-fg-64">{progressLabel}</span>
            <span className="kol-float-timecode tabular-nums text-fg-emphasis">{Math.round(progress)}%</span>
          </div>
          <ProgressBar variant="float" value={progress} ariaLabel={progressLabel} />
        </div>
      )}
    </div>
  )
}

/* ── folio (Folio batch E, 2026-11-22) ─────────────────────────────────────────────────────────────────────────────
 * Folio's contents, carried from apps/folio's FolioDocument (the reader's left Rail, above the library tree): the
 * `eyebrow` in Folio's label, the `book` title, the `author` line (Folio puts its chapter count or the document's kind
 * there), 12 apart; then the list under its head (`title`, `Contents` by default, and the `count`, over a rule in the
 * ink); then, for a book, `progress` (0 to 100) under `progressLabel` and its figure (`progressText`, the reader's
 * "1 / 3"). Parts 28 apart, each drawn only when given. ReadingContents' words: `chapters` ({ id, label, href }),
 * `current`. Folio's own: `sections` (the current chapter's headings, { id, label }, as anchors under it), `headings` (a
 * document's headings when it is not a book, drawn quieter), `empty` (the line when there are neither), `linkComponent`
 * (a router's Link for a chapter; default `a`) and `progressText`. */
function ReadingContentsFolio({ eyebrow, book, author, title = 'Contents', count, chapters = [], current, sections = [], headings = [], empty, linkComponent: L = 'a', progress, progressLabel = 'Through the book', progressText, className = '' }) {
  const go = (href) => (L === 'a' ? { href } : { to: href })
  return (
    <div className={`kol-reading-contents--folio flex flex-col gap-[28px] ${className}`.trim()}>
      <div className="flex flex-col gap-[12px]">
        {eyebrow != null && <p className="kol-folio-label kol-reading-contents-muted">{eyebrow}</p>}
        {book != null && <p className="kol-folio-book break-words">{book}</p>}
        {author != null && <p className="kol-folio-body kol-reading-contents-muted">{author}</p>}
      </div>
      <nav aria-label="Contents" className="flex flex-col gap-[4px]">
        <div className="kol-reading-contents-head flex justify-between border-b pb-[15px]">
          <p className="kol-folio-nav">{title}</p>
          <p className="kol-folio-meta kol-reading-contents-muted">{count}</p>
        </div>
        {chapters.length ? chapters.map((c, n) => {
          const on = c.id === current
          return (
            <div key={c.id} className="flex flex-col">
              <L {...go(c.href)} aria-current={on ? 'page' : undefined} className={`kol-reading-contents-row flex gap-[14px] rounded-[3px] px-[12px] py-[11px] ${on ? 'is-current' : ''}`.trim()}>
                <span className="kol-folio-meta kol-reading-contents-number tabular-nums">{String(n + 1).padStart(2, '0')}</span>
                <span className="kol-folio-nav min-w-0 flex-1">{c.label}</span>
              </L>
              {on && sections.length > 0 && (
                <div className="kol-reading-contents-sections ml-[38px] flex flex-col border-l py-[4px]">
                  {sections.map((h) => <a key={h.id} href={`#${h.id}`} className="kol-folio-meta kol-reading-contents-quiet py-[6px] pl-[12px]">{h.label}</a>)}
                </div>
              )}
            </div>
          )
        }) : headings.length ? headings.map((h, n) => (
          <a key={h.id} href={`#${h.id}`} className="kol-reading-contents-heading kol-reading-contents-quiet flex gap-[12px] rounded-[3px] px-[12px] py-[9px]">
            <span className="kol-folio-meta tabular-nums">{String(n + 1).padStart(2, '0')}</span>
            <span className="kol-folio-nav min-w-0 flex-1">{h.label}</span>
          </a>
        )) : <p className="kol-folio-meta kol-reading-contents-muted px-[12px] py-[9px]">{empty}</p>}
      </nav>
      {progress != null && (
        <div className="kol-reading-contents-progress flex flex-col gap-[12px] border-t pt-[19px]">
          <div className="kol-folio-meta flex justify-between">
            <p className="kol-reading-contents-muted">{progressLabel}</p>
            <p className="kol-reading-contents-figure font-bold">{progressText}</p>
          </div>
          <div className="kol-reading-contents-track h-[4px]"><div className="kol-reading-contents-fill h-full" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
    </div>
  )
}

export default function ReadingContents(props) {
  return props.variant === 'folio' ? <ReadingContentsFolio {...props} /> : <ReadingContentsDefault {...props} />
}
