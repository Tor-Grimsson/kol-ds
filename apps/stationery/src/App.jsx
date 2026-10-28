import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PanZoomViewport, ShortcutsOverlay } from '@kolkrabbi/kol-component'
import { ThemeToggle, useTheme } from '@kolkrabbi/kol-framework'
import { stationeryBoard } from 'voyager-fixture/stationery'

/* THE STATIONERY DESK — kol-branding's stationery, on VOYAGER (StationeryFromBranding, kol-hq 2026-10-27).
 *
 * Every layout on kol-branding's /guide/stationery canvas page, in its own row groups, as plain HTML in ./boards
 * (ported from kol-branding src/guide/boards): the document elements, the quote, the header, the letterhead set, the
 * letter styles, the cards, the invoices and agreements, the research template. The layouts are kept; the content is
 * VOYAGER's. Kolkrabbi's and the user's own details were swapped for the fixture's, the letters carry the VOYAGER
 * dispute letter (the short document) and the last row is the "Brand comparison" research paper, 16 A4 sheets from
 * the Branding research print canvas (the long document). The previous desk is in _tmp/2026-10-27-stationery-desk/.
 *
 * The desk is the DS PanZoomViewport — Space + drag pans, ⌘ scroll / pinch zooms at the pointer, ⌘0 fits, ⌘= / ⌘−
 * step — over rack's dot grid (`G`), `S` for the sheet, `T` for the ground. */

/* the boards are the fixture's (voyager-fixture/stationery, 2026-10-28 — apps/print reads the same set); the marks filled in */
const html = (name) => stationeryBoard(name)

const A4 = [1190, 1684]
const GROUPS = [
  { title: 'Foundations — document elements', boards: [['Foundations-Text', ...A4, 'F1 Text'], ['Foundations-Lists', ...A4, 'F2 Lists and blocks'], ['Foundations-Tables', ...A4, 'F3 Tables, notes and sign-off']] },
  { title: 'Quote A — Orbital, as sent', boards: [['Main', ...A4, 'A Orbital 1/4'], ['Atlas-2', ...A4, 'A Orbital 2/4'], ['Atlas-3', ...A4, 'A Orbital 3/4'], ['Atlas-4', ...A4, 'A Orbital 4/4'], ['Grotesk-1', ...A4, 'C Template 1/2'], ['Page-2', ...A4, 'C Template 2/2']] },
  { title: 'Header — Grid / Compact / Display', boards: [['Header-Variants', 1190, 764, 'Header, variants'], ['Header', 1190, 200, 'Header, component']] },
  { title: 'Letterhead, letter, envelope and slip', boards: [['Letterhead', ...A4, 'Letterhead, A4'], ['Letter', ...A4, 'Letter, A4'], ['Envelope', 1247, 624, 'Envelope, DL'], ['Compliment-Slip', 1190, 561, 'Compliment slip, 210×99']] },
  { title: 'Letter styles — layout examples', boards: [['Letter-A', ...A4, 'A Clean'], ['Letter-B', ...A4, 'B Centered header'], ['Letter-C', ...A4, 'C Official letter'], ['Letter-D', ...A4, 'D Marks and stamps']] },
  { title: 'Cards — business cards, name badge, signature', boards: [['Business-Cards', 1100, 820, 'Business cards, 85×55'], ['Event-Badge', 596, 840, 'Name badge, A6'], ['Email-Signature', 1200, 440, 'Email signature']] },
  { title: 'Documents — invoices and agreements', boards: [['Invoice-A', ...A4, 'Invoice A, 000'], ['Invoice-B', ...A4, 'Invoice B, quote style'], ['Contract', ...A4, 'Contract'], ['NDA', ...A4, 'NDA']] },
  { title: 'Research — document template, from kol-atlas', boards: [['Research-Spec', 1060, 1500, 'R0 Structure and type'], ['Research-Overview', 1060, 900, 'R1 Overview'], ['Research-Project', 1060, 1700, 'R2 Project'], ['Research-Plan', 1060, 1100, 'R3 Plan'], ['Research-Quote', 1060, 1500, 'R4 Quote'], ['Research-Reference', 1060, 1200, 'R5 Reference'], ['Research-Brief', 1060, 800, 'R6 Brief'], ['Research-Media', 1060, 1900, 'R7 Media'], ['Research-Chapters', 1060, 3100, 'R8 Chapters']] },
  { title: 'Long document — Brand comparison, 16 sheets', boards: Array.from({ length: 16 }, (_, i) => [`Comparison-${String(i + 1).padStart(2, '0')}`, ...A4, `Brand comparison ${i + 1}/16`]) },
]

const GAP = 80
const ROW_GAP = 240
const MARGIN = 48

const SHORTCUTS = [
  {
    section: 'Desk canvas',
    items: [
      { id: 'pan', label: 'Grab and pan the desk', combo: 'Space + drag' },
      { id: 'zoom', label: 'Zoom to cursor', combo: '⌘ scroll / pinch' },
      { id: 'zoom-step', label: 'Zoom in / out', combo: '⌘= / ⌘−' },
      { id: 'zoom-reset', label: 'Fit the desk', combo: '⌘0' },
      { id: 'dot-grid', label: 'Dot grid', combo: 'G' },
      { id: 'theme', label: 'Desk light / dark', combo: 'T' },
      { id: 'shortcuts', label: 'Shortcuts', combo: 'S' },
    ],
  },
]

/* rack's dot grid (apps/rack useDotGrid): fg-12 dots on a 36px cell, inside the transform layer so it scales with the zoom */
const DOTS = { backgroundImage: 'radial-gradient(var(--kol-fg-12) 1px, transparent 1px)', backgroundSize: '36px 36px' }

/* One layout in its own document, so its styles and the desk's never meet. The paper is read, not used: pointer events
 * are off so the wheel and Space reach the desk. A layout that runs longer than its frame grows to its content. */
function Board({ name, w, h, label }) {
  const [height, setHeight] = useState(h)
  return (
    <figure className="m-0 flex flex-col gap-3 shrink-0" style={{ width: w }}>
      <iframe
        title={label}
        srcDoc={html(name)}
        scrolling="no"
        onLoad={(e) => setHeight(Math.max(h, e.currentTarget.contentDocument?.documentElement.scrollHeight || 0))}
        className="border-0 pointer-events-none block bg-white"
        style={{ width: w, height, boxShadow: '0 0 0 1px var(--kol-fg-08)' }}
      />
      <figcaption className="kol-mono-12 text-fg-64">{label}</figcaption>
    </figure>
  )
}

export default function App() {
  const [grid, setGrid] = useState(true)
  const [sheet, setSheet] = useState(false)
  const { toggle } = useTheme()
  const stage = useRef(null)
  const desk = useRef(null)
  /* FIT AT REST: the desk is scaled to the window, so ⌘0 shows all of it */
  const [fit, setFit] = useState(1)

  useLayoutEffect(() => {
    const compute = () => {
      const s = stage.current, d = desk.current
      if (!s || !d) return
      setFit(Math.min((s.clientWidth - 2 * MARGIN) / d.offsetWidth, (s.clientHeight - 2 * MARGIN) / d.offsetHeight, 1))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(stage.current)
    ro.observe(desk.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input, textarea')) return
      if (e.key === 'g') setGrid((v) => !v)
      if (e.key === 's') setSheet((v) => !v)
      if (e.key === 't') toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return (
    <div ref={stage} className="h-dvh w-dvw bg-surface-primary">
      <PanZoomViewport
        showRulers={false}
        backdrop={grid ? <div className="absolute" style={{ inset: -40000, ...DOTS }} /> : null}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={desk} className="flex flex-col" style={{ gap: ROW_GAP, transform: `scale(${fit})`, transformOrigin: 'center' }}>
            {GROUPS.map((g) => (
              <section key={g.title} className="flex flex-col gap-10">
                <h2 className="m-0 text-emphasis" style={{ fontSize: 72, lineHeight: 1, fontWeight: 700 }}>{g.title}</h2>
                <div className="flex items-start" style={{ gap: GAP }}>
                  {g.boards.map(([name, w, h, label]) => <Board key={name} name={name} w={w} h={h} label={label} />)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </PanZoomViewport>
      <div className="absolute bottom-3 left-3 z-[3]"><ThemeToggle fill="none" label={false} size="sm" /></div>
      {sheet && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setSheet(false)} />}
    </div>
  )
}
