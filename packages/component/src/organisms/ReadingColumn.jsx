import ReadingChapterNav from '../molecules/ReadingChapterNav.jsx'

/* taxonomy-ok: organism — the reader's whole text region: position line, head, prose, chapter nav */

/**
 * ReadingColumn — The text itself, set for reading (float-everything W11 row 145, 2026-11-04 — kol-float--style W2.9
 * `Reading column`). A column `width` wide (default 760): the position line in `kol-float-ruler` (where in the book ·
 * `125 / 297`), the eyebrow, the title in the reading face at 48 / 1.25, the standfirst in Inter 12 / 1.6 (fg-64),
 * then `children` — the prose, 24 between blocks: paragraphs in the reading face at `size` / `leading` on fg-88, `h2`
 * at 28 / 1.45 on the emphasis ink, a `blockquote` on the fg-04 lift at radius 12, 20 in (the quote at 26 / 1.45, its
 * `cite` in `kol-float-label`), `ol`/`small` as notes in Inter 12 (fg-64); `ReadingHighlight` sits among them. Last the
 * `ReadingChapterNav` from `prev` / `next`. The reading face is the reader's (`font`, default Literata — the consumer
 * loads it; Georgia stands in); the chrome around it stays Inter and JetBrains Mono.
 *
 * @param {ReactNode} [position]  the position line's start (`The Waves / Interlude 03`)
 * @param {ReactNode} [page]      its end (`125 / 297`)
 * @param {ReactNode} [eyebrow]   · {ReactNode} [title] · {ReactNode} [standfirst]
 * @param {ReactNode} children    the prose
 * @param {Object}    [prev]      · {Object} [next] — `ReadingChapterNav`'s sides
 * @param {string}    [font]      default `'Literata', Georgia, serif`
 * @param {number}    [size]      px (default 22) · {number} [leading] (default 1.6) · {number} [width] px (default 760)
 * @param {string}    [className]
 */
export default function ReadingColumn({ position, page, eyebrow, title, standfirst, children, prev, next, font = "'Literata', Georgia, serif", size = 22, leading = 1.6, width = 760, className = '' }) {
  return (
    <article className={`mx-auto flex w-full flex-col gap-6 ${className}`.trim()} style={{ maxWidth: width, '--reading-font': font, '--reading-size': `${size}px`, '--reading-leading': leading }}>
      {(position || page) && (
        <div className="flex items-baseline justify-between gap-4">
          <span className="kol-float-ruler truncate uppercase text-fg-64">{position}</span>
          {page && <span className="kol-float-ruler shrink-0 text-[11px] tabular-nums text-fg-64">{page}</span>}
        </div>
      )}
      {eyebrow && <span className="kol-float-ruler mt-4 uppercase text-fg-64">{eyebrow}</span>}
      {title && <h1 className="m-0 -mt-2 text-[48px] font-normal leading-[1.25] text-fg-emphasis [font-family:var(--reading-font)]">{title}</h1>}
      {standfirst && <p className="m-0 font-[family-name:var(--kol-font-family-float)] text-[12px] leading-[1.6] text-fg-64">{standfirst}</p>}
      <div className="flex flex-col gap-6 [&_p]:m-0 [&_p]:text-[length:var(--reading-size)] [&_p]:leading-[var(--reading-leading)] [&_p]:[color:var(--kol-fg-88)] [&_p]:[font-family:var(--reading-font)] [&_h2]:m-0 [&_h2]:mt-2 [&_h2]:text-[28px] [&_h2]:font-normal [&_h2]:leading-[1.45] [&_h2]:[color:var(--kol-fg-emphasis)] [&_h2]:[font-family:var(--reading-font)] [&_blockquote]:m-0 [&_blockquote]:flex [&_blockquote]:flex-col [&_blockquote]:gap-4 [&_blockquote]:rounded-xl [&_blockquote]:[background:var(--kol-fg-04)] [&_blockquote]:p-5 [&_blockquote_p]:text-[26px] [&_blockquote_p]:leading-[1.45] [&_blockquote_p]:[color:var(--kol-fg-emphasis)] [&_cite]:font-[family-name:var(--kol-font-family-float)] [&_cite]:text-[11px] [&_cite]:leading-4 [&_cite]:not-italic [&_cite]:[color:var(--kol-fg-64)] [&_small]:font-[family-name:var(--kol-font-family-float)] [&_small]:text-[12px] [&_small]:leading-[1.6] [&_small]:[color:var(--kol-fg-64)]">
        {children}
      </div>
      {(prev || next) && <ReadingChapterNav prev={prev} next={next} className="mt-2" />}
    </article>
  )
}
