import { Pill } from '@kolkrabbi/kol-component'
import { inkOn } from './colorLab.js'
import CardLogo from './CardLogo.jsx'

/* taxonomy-ok: organism — a logo board: every mark on its ground (marks), or each with the wordmark (lockups) */

/**
 * LayoutLogo — every logo idea on one board: the marks alone, then each with the wordmark. Each mark sits on the card
 * colour it was drawn on (`ground`). kol-atlas's identity lab (apps/lab l1-logo.jsx, 2026-10-30), carried class for class
 * (LayoutGroup, 2026-10-31): the marks, the wordmark and `--lab-display` are props; the cards are `CardLogo variant="plate"`.
 *
 * @param {string} view      `marks` (default) · `lockups`
 * @param {Array}  marks     `[{ id, svg, label, ground, ink? }]` — raw SVG, its card colour, and the wordmark's ink on it
 *                           (default the darker or the lighter of the two wordmark inks, whichever reads)
 * @param {string} wordmark  the name beside each mark in `lockups`
 * @param {string} font      the wordmark's face (default the KOL sans)
 */
export default function LayoutLogo({ view = 'marks', marks = [], wordmark = '', font = 'var(--kol-font-family-sans)', className = '' }) {
  const View = VIEWS[view] ?? VIEWS.marks
  return <div className={className}><View marks={marks} wordmark={wordmark} font={font} /></div>
}

/* A frame as on the canvas: 1200 wide, light paper, padding 96/64 (as LayoutType's Board) */
const Board = ({ children }) => (
  <div data-theme="light" className="mx-auto flex w-full max-w-[1200px] flex-col bg-[var(--kol-surface-primary)] px-16 py-24">{children}</div>
)

/* a mark drawn in `currentColor` takes the wordmark's ink on its ground; a mark with its own fills keeps them */
const Mark = ({ svg, className, ink }) => <div className={`[&>svg]:h-full [&>svg]:w-full ${className}`} style={{ color: ink }} dangerouslySetInnerHTML={{ __html: svg }} />

/* the wordmark's two inks, as the board drew them on its light and dark cards */
const inkFor = (l) => l.ink ?? inkOn(l.ground, { dark: '#24272B', light: '#FFFFFF' }).ink

function LogoMarks({ marks }) {
  return (
    <Board>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {marks.map((l) => (
          <div key={l.id ?? l.label} className="flex flex-col items-center gap-3">
            <CardLogo variant="plate" backdrop={l.ground} className="aspect-square p-8" logo={<Mark svg={l.svg} ink={inkFor(l)} className="size-full" />} />
            <Pill>{l.label}</Pill>
          </div>
        ))}
      </div>
    </Board>
  )
}

function LogoLockups({ marks, wordmark, font }) {
  return (
    <Board>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
        {marks.map((l) => (
          <div key={l.id ?? l.label} className="flex flex-col items-center gap-3">
            <CardLogo variant="plate" backdrop={l.ground} className="h-40 gap-3 px-6" logo={(
              <>
                <Mark svg={l.svg} ink={inkFor(l)} className="size-14 shrink-0" />
                <span className="text-[40px] font-bold leading-none tracking-[-0.02em]" style={{ fontFamily: font, color: inkFor(l) }}>{wordmark}</span>
              </>
            )} />
            <Pill>{l.label}</Pill>
          </div>
        ))}
      </div>
    </Board>
  )
}

const VIEWS = { marks: LogoMarks, lockups: LogoLockups }
export const LAYOUT_LOGO_VIEWS = Object.keys(VIEWS)
