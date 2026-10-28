#!/usr/bin/env node
/**
 * Render one URL to a PDF via the installed Chrome (puppeteer-core / CDP).
 *
 * The point of going through CDP instead of `chrome --print-to-pdf`: we can wait
 * for document.fonts.ready and image decode BEFORE the print snapshot, so the PDF
 * never bakes a fallback font (the Right Grotesk cuts use font-display:swap and
 * lose the load race under a bare --print-to-pdf) or drops a half-loaded image.
 *
 * Two modes:
 *   a4 (default) — honors the page's own @page CSS (A4 portrait, margin:0 — the
 *                  kit sets its own inner sheet margins) and prints backgrounds.
 *                  <out> is the PDF file.
 *   continuous   — one page per .kol-kit-page sheet, each sized to fit its own
 *                  content length (no A4 pagination). Renders the SCREEN layout
 *                  the /resume/t/kit-continuous treatment shows, isolating one sheet at a
 *                  time. <out> is a DIRECTORY of numbered per-section PDFs (merge
 *                  with pdfunite downstream, like render-svg.mjs).
 *
 * Usage: node render-pdf.mjs <url> <out> [a4|continuous]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [url, out, mode = 'a4'] = process.argv.slice(2)
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

if (!url || !out) {
  console.error('usage: render-pdf.mjs <url> <out> [a4|continuous]')
  process.exit(2)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 1600 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  // Block on the things --print-to-pdf won't wait for: web fonts and image bytes.
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => {}))))
  })

  if (mode === 'continuous') {
    // Match the on-screen continuous preview (not print media, whose @page would
    // force uniform A4 pages). Screen media means the app shell renders too, so
    // replicate what kol-print.css does: hide the sidenav chrome + the download
    // toolbar, and collapse the shell grid to one full-width column (else its
    // sidenav gutter column offsets the sheet). Then measure every sheet.
    const rects = await page.emulateMediaType('screen').then(() =>
      page.evaluate(() => {
        document
          .querySelectorAll('.kol-sidenav, .kol-sidenav-hamburger, .kol-sidenav-backdrop, .kol-kit-preview .print\\:hidden')
          .forEach((el) => (el.style.display = 'none'))
        const layout = document.querySelector('.kol-brand-layout')
        if (layout) layout.style.display = 'block'
        const prev = document.querySelector('.kol-kit-preview')
        Object.assign(prev.style, { background: '#fff', padding: '0', gap: '0', minHeight: '0' })
        return [...document.querySelectorAll('.kol-kit-page')].map((el) => {
          const r = el.getBoundingClientRect()
          return { w: Math.ceil(r.width), h: Math.ceil(r.height), label: el.getAttribute('aria-label') || 'page' }
        })
      }),
    )
    if (!rects.length) { console.error('no .kol-kit-page sections found'); process.exit(1) }
    mkdirSync(out, { recursive: true })
    for (let i = 0; i < rects.length; i++) {
      // Show only sheet i; page.pdf sized to it → exactly one fit-to-length page.
      await page.evaluate((idx) => {
        document.querySelectorAll('.kol-kit-page').forEach((el, k) => { el.style.display = k === idx ? '' : 'none' })
      }, i)
      const { w, h, label } = rects[i]
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const name = `${String(i + 1).padStart(2, '0')}-${slug}.pdf`
      // pageRanges:'1' guards against a phantom trailing page from sub-px rounding
      // (h is ceil'd, so page 1 always contains the whole sheet).
      await page.pdf({ path: join(out, name), printBackground: true, width: `${w}px`, height: `${h}px`, pageRanges: '1' })
      console.log(`  · ${name}  (${w}×${h}px)`)
    }
  } else {
    await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true })
  }
} finally {
  await browser.close()
}
