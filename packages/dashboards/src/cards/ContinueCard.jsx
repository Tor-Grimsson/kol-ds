/** ContinueCard — pick the book up where it was left: the cover, the chapter eyebrow, title and author, the page and
 * its share as a progress line, a resume button and when it was last read (float-everything W7 row 109, 2026-11-04;
 * the exploration's "THE THIRD INTERLUDE · The Waves · Page 125 of 297 · 42% · Resume reading →").
 *
 * `cover` a node (the typeset jacket, 88 wide) or `src`; `eyebrow` in mono ruler, `title` in Inter section, `author`
 * hint, `page` + `pct` the progress line (4px, the ink at fg-64), `resume` the inverted float button's label
 * (`onResume`), `lastRead` in ruler at the right. */
import { Button } from '@kolkrabbi/kol-component'
import { SHEET } from './_shared/float.js'
import ProgressLine from './_shared/ProgressLine.jsx'

export default function ContinueCard({ cover, src, eyebrow, title, author, page, pct = 0, resume = 'Resume reading', onResume, lastRead, className = '' }) {
  return (
    <section className={`${SHEET} flex gap-6 p-5 pl-5 ${className}`.trim()}>
      <span className="block w-[88px] aspect-[5/7] rounded-[1px] overflow-hidden bg-fg-08 shrink-0 self-start">
        {cover ?? (src && <img src={src} alt="" className="block w-full h-full object-cover" />)}
      </span>
      <div className="flex-1 min-w-0 flex flex-col">
        {eyebrow && <span className="kol-float-ruler text-fg-64 uppercase">{eyebrow}</span>}
        <h3 className="kol-float-section text-fg-96 mt-1 truncate">{title}</h3>
        {author && <span className="kol-float-hint text-fg-64 mt-0.5">{author}</span>}
        <div className="mt-3"><ProgressLine label={page} pct={pct} light /></div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-4">
          <Button variant="float" tone="inverted" size="sm" iconRight="arrow-right" onClick={onResume}>{resume}</Button>
          {lastRead && <span className="kol-float-ruler text-fg-64 truncate">{lastRead}</span>}
        </div>
      </div>
    </section>
  )
}
