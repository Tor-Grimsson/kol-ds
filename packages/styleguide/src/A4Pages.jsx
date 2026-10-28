import { useRef, useState, useLayoutEffect } from 'react'

/* A4 portrait @96dpi, with print-style page margins. */
const A4_W = 794
const A4_H = 1123
const MARGIN = 48
/* A few px of headroom so a printed sheet stays just under a physical A4 page
   (1123px ≈ 297.3mm > A4's 297mm) and never spills onto a blank trailing page. */
const PRINT_SAFETY = 8
const CONTENT_W = A4_W - MARGIN * 2
const CONTENT_H = A4_H - MARGIN * 2 - PRINT_SAFETY

/**
 * A4Pages — flows any content across as many real A4 sheets (1:√2) as it needs, at natural size. kol-website apps/record's
 * `A4Page`, carried verbatim (PdfToolsFromStudio, 2026-10-28 — record's kit preview, now the DS's); the sheet's box is
 * kol-theme's `.kol-a4-sheet` · `.kol-a4-clip` · `.kol-a4-measure`, and printing maps each sheet to one A4 page.
 *
 * A4 page wrapper — flows a kit section across as many real A4 sheets (1:√2) as
 * it needs, at natural size. No scaling: the section is measured once off-screen,
 * page breaks are snapped to element top-edges (so nothing is cut mid-element),
 * and each page renders the section clipped to its slice via a translateY window.
 *
 * Re-measured on resize and as images (heroes) finish loading.
 */
export default function A4Pages({ children, label }) {
  const measureRef = useRef(null)
  // breaks[k]..breaks[k+1] is page k's vertical slice of the content.
  const [breaks, setBreaks] = useState([0, CONTENT_H])

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const compute = () => {
      const top = el.getBoundingClientRect().top
      // Break candidates = the top edge of every block, so a page can only end
      // *between* elements — never through one.
      const ys = new Set([0])
      el.querySelectorAll('*').forEach((node) => {
        const y = Math.round(node.getBoundingClientRect().top - top)
        if (y > 0) ys.add(y)
      })
      const total = el.scrollHeight
      ys.add(total)
      const sorted = [...ys].sort((a, b) => a - b)

      const pts = [0]
      let cursor = 0
      while (cursor < total) {
        const limit = cursor + CONTENT_H
        let next = -1
        for (const c of sorted) {
          if (c > cursor && c <= limit) next = c
          else if (c > limit) break
        }
        // An element taller than a page can't be snapped — hard-cut at the limit.
        if (next === -1) next = Math.min(limit, total)
        if (next <= cursor) break
        pts.push(next)
        cursor = next
      }
      setBreaks(pts)
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    const imgs = el.querySelectorAll('img')
    imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', compute) })
    return () => {
      ro.disconnect()
      imgs.forEach((img) => img.removeEventListener('load', compute))
    }
  }, [])

  const pageCount = Math.max(1, breaks.length - 1)

  return (
    <>
      {/* Off-screen measurer at exact page-content width. */}
      <div ref={measureRef} className="kol-a4-measure" aria-hidden="true">
        {children}
      </div>

      {Array.from({ length: pageCount }, (_, k) => {
        const from = breaks[k] ?? 0
        const to = breaks[k + 1] ?? from + CONTENT_H
        return (
          <section key={k} className="kol-a4-sheet" aria-label={`${label} — page ${k + 1} of ${pageCount}`}>
            <div className="kol-a4-clip" style={{ height: to - from }}>
              {/* Negative margin (not transform) shifts the slice — Chrome's
                  print engine drops images inside transformed containers. */}
              <div style={{ marginTop: -from }}>{children}</div>
            </div>
          </section>
        )
      })}
    </>
  )
}
