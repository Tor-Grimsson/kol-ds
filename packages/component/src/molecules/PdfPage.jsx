import { useEffect, useRef, useState } from 'react'

/* taxonomy-ok: molecule — a renderer KindPreview composes; no DS parts of its own to nest. */

/**
 * PdfPage · PdfDocument — a PDF drawn flat to canvases. The thumbnail Finder, Drive and Dropbox
 * all show (user 2026-09-23: *"why is pdf preview inconsistent"*). The browser's `<embed>` is a
 * viewer — Chrome paints its toolbar over the tile whatever the URL fragment says — so every fit
 * draws pictures with pdf.js instead, and Quick Look gets Finder's layout from the same renderer.
 *
 *   PdfPage      page one, sized to its box — tiles and the column pane
 *   PdfDocument  every page in a scroller with a thumbnail rail — the Quick Look window
 *
 * pdf.js is imported on first use, so a page with no PDF never loads it. A canvas paints at its
 * box's width × device pixel ratio, and only once it scrolls into view.
 *
 * @param {string}    src       the PDF's URL
 * @param {ReactNode} fallback  shown if the file cannot be parsed
 */
let pdfjs = null
async function loadPdfjs() {
  if (pdfjs) return pdfjs
  const [lib, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  lib.GlobalWorkerOptions.workerSrc = worker.default
  pdfjs = lib
  return lib
}

function usePdf(src) {
  const [state, setState] = useState({ src: null, doc: null, failed: false })
  useEffect(() => {
    let cancelled = false
    let loading = null
    loadPdfjs()
      .then((lib) => { loading = lib.getDocument({ url: src }); return loading.promise })
      .then((doc) => { if (!cancelled) setState({ src, doc, failed: false }) })
      .catch(() => { if (!cancelled) setState({ src, doc: null, failed: true }) })
    return () => { cancelled = true; loading?.destroy() }
  }, [src])
  return state.src === src ? state : { doc: null, failed: false }
}

function PdfCanvas({ doc, page, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!doc || !canvas) return undefined
    let task = null
    let done = false
    const paint = async () => {
      done = true
      const p = await doc.getPage(page)
      const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 400
      const base = p.getViewport({ scale: 1 })
      const viewport = p.getViewport({ scale: (width / base.width) * (window.devicePixelRatio || 1) })
      canvas.width = viewport.width
      canvas.height = viewport.height
      task = p.render({ canvas, viewport })
      await task.promise.catch(() => {})
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !done) { io.disconnect(); paint() } })
    io.observe(canvas)
    return () => { io.disconnect(); task?.cancel() }
  }, [doc, page])
  return <canvas ref={ref} className={`kol-pdf-page ${className}`.trim()} />
}

export default function PdfPage({ src, fallback = null, className = '' }) {
  const { doc, failed } = usePdf(src)
  if (failed) return fallback
  return <PdfCanvas doc={doc} page={1} className={className} />
}

export function PdfDocument({ src, fallback = null }) {
  const { doc, failed } = usePdf(src)
  const [current, setCurrent] = useState(1)
  const mainRef = useRef(null)
  const pages = doc ? Array.from({ length: doc.numPages }, (_, i) => i + 1) : []
  /* the rail follows the scroller: whichever page holds the middle of the view is current */
  useEffect(() => {
    const main = mainRef.current
    if (!main || !doc) return undefined
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent(Number(e.target.dataset.page))
    }, { root: main, rootMargin: '-50% 0px -50% 0px' })
    main.querySelectorAll('[data-page]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [doc])
  if (failed) return fallback
  const go = (n) => mainRef.current?.querySelector(`[data-page="${n}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  return (
    <div className="kol-pdf-document">
      <div ref={mainRef} className="kol-pdf-document-main">
        {pages.map((n) => <div key={n} data-page={n}><PdfCanvas doc={doc} page={n} /></div>)}
      </div>
      {pages.length > 1 && (
        <div className="kol-pdf-document-rail">
          {pages.map((n) => (
            <button key={n} type="button" onClick={() => go(n)} aria-label={`Page ${n}`} aria-current={n === current || undefined}>
              <PdfCanvas doc={doc} page={n} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
