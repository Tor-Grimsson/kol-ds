import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PanZoomViewport, ShortcutsOverlay } from '@kolkrabbi/kol-component'
import { ThemeToggle, useTheme } from '@kolkrabbi/kol-framework'
import { BusinessCardFront, BusinessCardBack, Envelope, Letterhead, LetterheadCorrespondence, EmailSignature, brandInfo } from '@kolkrabbi/kol-styleguide'
import { brand } from '@kolkrabbi/kol-brand'
import { Asset } from '@kolkrabbi/kol-brand/svg'
import v1 from '../../../lobby/_assets/2026-10-20-quote-document/v1-original.html?raw'
import v2 from '../../../lobby/_assets/2026-10-20-quote-document/v2-invoice-synced.html?raw'
import v3 from '../../../lobby/_assets/2026-10-20-quote-document/v3-split.html?raw'

/* THE STATIONERY DESK (2026-10-20, user: "a canvas like editor has so we can zoom around … a dotted
 * background like monitor or mirror rack and mixer"): the DS PanZoomViewport — Space + drag pans,
 * ⌘ scroll / pinch zooms at the pointer, ⌘0 resets, ⌘= / ⌘− step — over rack's dot grid (`G`),
 * `S` for the sheet, `T` for the ground. No masthead, no tabs: everything lies on the desk at once,
 * fitted to the window at rest, and the layout moves into a package once it is proved (tier rules §
 * Ownership).
 *
 * THREE ROWS, so the quote is judged against what Kolkrabbi already prints (user: "in
 * brand.kolkrabbi.io … are letterheads and business cards? we might look at them together"):
 *   1. the brand sheets from his iCloud kol-images folder (dev only, `/@fs/`)
 *   2. the brand book's stationery set — kol-styleguide's StationeryMocks wearing kol-brand's marks
 *      and facts, at print size (the brand book shows them in cards; here they are real mm)
 *   3. the A4 sheets: the letterhead and correspondence beside the three kol-atlas quote mockups
 *      (QuoteDocument) and a blank invoice
 *
 * The mockups' `file://` font URLs point at kol-atlas's tree and are rewritten to the repo's /fonts/.
 * Their `.page` was `min-height` and grew with its overflow, which hid the page-fit problem: every
 * sheet IS A4 now (user: "these should all be A4") and what does not fit hangs off the sheet onto the
 * desk, with a red line where A4 ends. The logo is the brand's two-tone lockup — the orange mark
 * beside the navy wordmark, as on his own invoices — not the all-orange one the atlas mockups drew
 * (user: "look at logo"); the lockup svg is two paths, mark then letters. */
const ORANGE = '#AD5038'
const NAVY = '#222D3D'
const A4_EDGE = `<style>body { background: transparent !important; } .page { height: 297mm; box-shadow: 0 0 0 1px rgba(0,0,0,.08); } .page::after { content: ""; position: absolute; left: 0; right: 0; top: 297mm; border-top: 1px dashed #d33; } .logo path:first-child { fill: ${ORANGE}; } .logo path:last-child { fill: ${NAVY}; }</style>`
const local = (html) => html.replace(/file:\/\/\/[^")]*\/public\/fonts\//g, '/fonts/').replace('</head>', `${A4_EDGE}</head>`)
const BLANK = `<!doctype html><html><head><style>
  body { margin: 0; background: transparent; }
  .page { width: 210mm; height: 297mm; margin: 12mm auto; background: #fff; }
</style></head><body><section class="page"></section></body></html>`

/* print sizes at 96dpi */
const MM = 96 / 25.4
const A4 = { w: 210 * MM, h: 297 * MM }
const CARD = { w: 85.6 * MM, h: 53.85 * MM }
const DL = { w: 220 * MM, h: 110 * MM }
/* the mockups carry their own 12mm desk margin either side of the paper */
const SHEET_W = A4.w + 2 * 12 * MM

const ICLOUD = '/@fs/Users/kolkrabbi/Library/Mobile Documents/com~apple~CloudDocs/Workbox/kol-images/kol-brand/'
/* his real invoices (Workbox, "look at table · look at padding"): page one of each PDF, rendered by
 * qlmanage into this app's gitignored _tmp/, served by the dev server from the app root */
const INVOICES = [['aftra-invoice-102.png', 'Aftra · Invoice #102 (March 2026)'], ['studio16-invoice-105.png', 'Studio 16 · Invoice #105 (August 2026)']]
const REFERENCES = [
  ...['01-sheet.png', '01-Brand-sheet-M.png', '01-logo-display.png'].map((f) => ({ src: encodeURI(ICLOUD + f), label: f })),
  ...INVOICES.map(([f, label]) => ({ src: `/_tmp/refs/${f}`, label })),
]

const INFO = brandInfo(brand)
/* kol-brand's SVGs carry a viewBox and no size, and each mock sizes the mark with its own `[&_svg]`
 * utilities (the card `h-full`, the correspondence `h-12` under an outer `h-auto`): the cascade
 * between them left the mark 0 × 0 (measured 2026-10-20). The wrapper gets a definite box from the
 * viewBox ratio and the svg fills it, over whatever the mock says. */
const RATIO = { 'kol-wordmark': 135 / 40, 'kol-lockup-hori': 419 / 128, 'kol-logomark': 1 }
const mark = (name, h, color) => <Asset name={name} title="Kolkrabbi" className="block [&_svg]:block [&_svg]:w-full! [&_svg]:h-full!" style={{ height: h, width: h * RATIO[name], color }} />
/* THE TWO-TONE LOCKUP: kol-brand's `kol-lockup-hori` is one currentColor; only the vertical lockup
 * carries the orange. The brand's horizontal lockup (his invoices, the brand sheets) is the orange
 * mark beside the navy wordmark, so the desk composes it at the lockup's own proportions (viewBox
 * 419 × 128: mark 128 square, letters 80 tall, 20 between). An asset for it is a kol-brand call. */
const lockup = (h) => (
  <span className="inline-flex items-center" style={{ height: h, gap: h * 20 / 128 }}>
    {mark('kol-logomark', h, ORANGE)}
    {mark('kol-wordmark', h * 80 / 128, NAVY)}
  </span>
)
/* the brand's own ink and paper (kol-brand anchors; his invoices), not the mocks' neutral placeholders */
const PALETTE = { paper: '#FFFFFF', ink: NAVY }

const QUOTES = [
  { id: 'v1', label: 'Quote · v1 original', html: local(v1) },
  { id: 'v2', label: 'Quote · v2 invoice-synced', html: local(v2) },
  { id: 'v3', label: 'Quote · v3 split', html: local(v3) },
  { id: 'invoice', label: 'Invoice', html: BLANK },
]

const GAP = 96
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

/* rack's dot grid (apps/rack useDotGrid): fg-12 dots on a 36px cell. Inside the transform layer,
 * so the cell scales with the zoom like rack's and mirror's; oversized so a pan never finds an edge */
const DOTS = { backgroundImage: 'radial-gradient(var(--kol-fg-12) 1px, transparent 1px)', backgroundSize: '36px 36px' }

/* `height` is the paper's; without one the piece hugs its content and draws no edge (the email
 * signature is its own card — a fixed box left an empty outline under it, user 2026-10-20) */
function Piece({ label, width, height, children }) {
  return (
    <figure className="m-0 flex flex-col gap-3 shrink-0" style={{ width }}>
      {/* a hairline edge, so white paper reads on the light ground */}
      <div className="relative" style={{ width, height, boxShadow: height ? '0 0 0 1px var(--kol-fg-08)' : undefined }}>{children}</div>
      <figcaption className="kol-mono-12 text-fg-64">{label}</figcaption>
    </figure>
  )
}

/* the mockups are iframes, and an iframe keeps every pointer event it is given: the wheel would
 * scroll the paper instead of zooming the desk, Space would never reach the viewport. The paper is
 * read, not used, so pointer events are off and the desk gets them all */
function Mockup({ doc }) {
  const [h, setH] = useState(A4.h + 2 * 12 * MM)
  return (
    <figure className="m-0 flex flex-col gap-3 shrink-0" style={{ width: SHEET_W }}>
      <iframe
        title={doc.label}
        srcDoc={doc.html}
        onLoad={(e) => setH(e.currentTarget.contentDocument.documentElement.scrollHeight)}
        className="border-0 pointer-events-none block"
        style={{ width: SHEET_W, height: h }}
      />
      <figcaption className="kol-mono-12 text-fg-64" style={{ paddingLeft: 12 * MM }}>{doc.label}</figcaption>
    </figure>
  )
}

export default function App() {
  const [grid, setGrid] = useState(true)
  const [sheet, setSheet] = useState(false)
  /* the desk's ground follows the theme (user: "put something to change the background"); the
   * paper is white either way */
  const { toggle } = useTheme()
  const stage = useRef(null)
  const desk = useRef(null)
  /* FIT AT REST (the editor's model — CanvasFrame scales its frame to the viewport and the zoom is
   * relative to that): the desk is scaled to the window, so ⌘0 shows all of it */
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
        backdrop={grid ? <div className="absolute" style={{ inset: -8000, ...DOTS }} /> : null}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={desk} className="flex flex-col" style={{ gap: GAP, transform: `scale(${fit})`, transformOrigin: 'center' }}>

            {/* 1 · the brand sheets, at A4 width so they read at the same zoom as the paper */}
            <div className="flex items-start" style={{ gap: GAP }}>
              {REFERENCES.map((r) => (
                <figure key={r.label} className="m-0 flex flex-col gap-3 shrink-0" style={{ width: A4.w }}>
                  <img src={r.src} alt={r.label} className="block w-full h-auto" style={{ boxShadow: '0 0 0 1px var(--kol-fg-08)' }} />
                  <figcaption className="kol-mono-12 text-fg-64">{r.label}</figcaption>
                </figure>
              ))}
            </div>

            {/* 2 · the brand book's stationery set at print size, on the package's own paper/ink */}
            <div className="flex items-end" style={{ gap: GAP }}>
              <Piece label="Business card · front · 85.6 × 53.85" width={CARD.w} height={CARD.h}><BusinessCardFront mark={lockup(64)} palette={PALETTE} /></Piece>
              <Piece label="Business card · back" width={CARD.w} height={CARD.h}><BusinessCardBack info={INFO} palette={PALETTE} /></Piece>
              <Piece label="Envelope · DL · 220 × 110" width={DL.w} height={DL.h}><Envelope mark={mark('kol-logomark', 32, NAVY)} info={INFO} palette={PALETTE} /></Piece>
              <Piece label="Email signature" width={480}><EmailSignature mark={mark('kol-logomark', 64, NAVY)} info={INFO} palette={PALETTE} /></Piece>
            </div>

            {/* 3 · A4: the letterheads the brand book already has, then the quote mockups */}
            <div className="flex items-start" style={{ gap: GAP }}>
              <Piece label="Letterhead · A4 (brand book)" width={A4.w} height={A4.h}>
                <Letterhead mark={mark('kol-wordmark', 40, NAVY)} info={INFO} palette={PALETTE}>
                  <p>Thank you for the visit last week. The proofs are enclosed.</p>
                </Letterhead>
              </Piece>
              <Piece label="Letterhead · correspondence (brand book)" width={A4.w} height={A4.h}>
                <LetterheadCorrespondence
                  mark={mark('kol-wordmark', 48, NAVY)}
                  info={INFO}
                  palette={PALETTE}
                  fields={[{ label: 'Date', value: 'October 2026' }, { label: 'Ref', value: 'Quote 2026-001' }, { label: 'To', value: 'Atlas Cloud ehf.' }]}
                >
                  <p>A fixed-price proposal for a new brand identity for Atlas, from first workshop to a complete handoff.</p>
                </LetterheadCorrespondence>
              </Piece>
              {QUOTES.map((doc) => <Mockup key={doc.id} doc={doc} />)}
            </div>

          </div>
        </div>
      </PanZoomViewport>
      <div className="absolute bottom-3 left-3 z-[3]"><ThemeToggle fill="none" label={false} size="sm" /></div>
      {sheet && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setSheet(false)} />}
    </div>
  )
}
