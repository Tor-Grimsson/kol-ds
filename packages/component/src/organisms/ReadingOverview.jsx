import Button from '../atoms/Button.jsx'
import Tag from '../atoms/Tag.jsx'
import ProgressBar from '../atoms/ProgressBar.jsx'
import { floatSurfaceClass } from '../utilities/tone.js'

/* taxonomy-ok: organism — the book's page: cover, metadata, the saved place, the two ways in */

/**
 * ReadingOverview — A book before you open it: cover, what it is, and where you left it (float-everything W11 row 152,
 * 2026-11-04 — kol-float--style W2.9 `Book overview`). The way back as a quiet float capsule over two columns: the
 * `cover` (300 × 420, the consumer's image) and, 52 off it, the title in the reading face at 52 / 1.45, the author in
 * `kol-float-window` (fg-64), the metadata as float Tags (md, 12 apart), the description in `kol-float-body-lg` (fg-64),
 * the saved place as a card on `surface-secondary` at the sheet radius (24 in: `kol-float-ruler` label, the chapter in
 * `kol-float-window`, the page line and share over the float ProgressBar), then `Resume reading →` as the inverted lg
 * capsule beside the secondary one on the float's solid ground (it sits on the page, not a sheet). Stacks under the cover on a phone.
 *
 * @param {Function}  [onBack]       · {string} [backLabel] default `Back to my library`
 * @param {ReactNode} [cover]
 * @param {ReactNode} title          · {ReactNode} [author]
 * @param {string[]}  [meta]         `['Fiction', 'EPUB', 'Reading']`
 * @param {ReactNode} [description]
 * @param {Object}    [place]        `{ label?, title, line, progress }` — label default `Your place`, `line` `Page 125 of 297`, progress 0–100
 * @param {Function}  [onResume]     · {string} [resumeLabel] default `Resume reading`
 * @param {Function}  [onCollect]    · {string} [collectLabel] default `Add to collection`
 * @param {string}    [font]         the title's face (default `'Literata', Georgia, serif`)
 * @param {string}    [className]
 */
export default function ReadingOverview({ onBack, backLabel = 'Back to my library', cover, title, author, meta = [], description, place, onResume, resumeLabel = 'Resume reading', onCollect, collectLabel = 'Add to collection', font = "'Literata', Georgia, serif", className = '' }) {
  return (
    <section className={`flex flex-col gap-8 ${className}`.trim()}>
      {onBack && <Button variant="float" tone="ghost" size="sm" iconLeft="arrow-left" onClick={onBack} className="-ml-3 self-start">{backLabel}</Button>}
      <div className="flex flex-col gap-8 md:flex-row md:gap-[52px]">
        {cover && <div className="aspect-[300/420] w-full max-w-[300px] shrink-0 self-start overflow-hidden rounded-sm">{cover}</div>}
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="m-0 text-[52px] font-normal leading-[1.45] text-fg-emphasis" style={{ fontFamily: font }}>{title}</h1>
          {author && <span className="kol-float-window mt-3 font-normal text-fg-64">{author}</span>}
          {meta.length > 0 && <div className="mt-5 flex flex-wrap gap-3">{meta.map((m) => <Tag key={m} variant="float" size="md" hash={false}>{m}</Tag>)}</div>}
          {description && <p className="kol-float-body-lg m-0 mt-6 text-fg-64">{description}</p>}
          {place && (
            <div className="mt-10 flex flex-col rounded-[var(--kol-float-menu-r)] bg-surface-secondary px-6 py-4">
              <span className="kol-float-ruler uppercase text-fg-64">{place.label ?? 'Your place'}</span>
              <span className="kol-float-window mt-2 font-normal text-fg-emphasis">{place.title}</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="kol-float-hint text-fg-64">{place.line}</span>
                {place.progress != null && <span className="kol-float-timecode tabular-nums text-fg-emphasis">{Math.round(place.progress)}%</span>}
              </div>
              {place.progress != null && <ProgressBar variant="float" value={place.progress} ariaLabel={place.label ?? 'Your place'} className="mt-2" />}
            </div>
          )}
          {(onResume || onCollect) && (
            <div className="mt-5 flex flex-wrap gap-4">
              {onResume && <Button variant="float" tone="inverted" size="lg" iconRight="arrow-right" onClick={onResume}>{resumeLabel}</Button>}
              {onCollect && <Button variant="float" tone="secondary" size="lg" onClick={onCollect} className={floatSurfaceClass('solid')}>{collectLabel}</Button>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
