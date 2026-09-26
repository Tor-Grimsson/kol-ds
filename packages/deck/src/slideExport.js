import { SLIDE_W, SLIDE_H, resolveColor } from './slideDoc.js'
import { familyFor, googleFontFaces, isThemeFont, toBase64 } from './webFonts.js'

/**
 * slideExport — a deck out as SVG, PNG, PDF and PPTX (kol-olina's brand decks; PPTX added here).
 *
 * The APPROACH is kol-fxr's: build the picture from the DOCUMENT, then rasterise — never screenshot
 * the DOM. Two traps, both olina's:
 *
 * TRAP 1 — FONTS. A standalone SVG drawn through an `<img>` gets no page fonts and no network, so a
 * `url(/fonts/…)` never loads and every layer falls back to a system face. The woff2 is inlined as
 * base64. The theme's two families are found on the PAGE's own `@font-face` rules (so the export
 * embeds whatever the app actually serves — no font list to keep in step), a Google family through
 * `googleFontFaces`. Only the faces a document uses are embedded: one per weight and style.
 *
 * TRAP 2 — `var()` DOES NOT RESOLVE outside the page. `resolveColor` maps the ramp tokens to hex.
 *
 * KNOWN FIDELITY GAP, deliberate: SVG `<text>` does not wrap — an explicit `\n` becomes a `<tspan>`,
 * a line long enough to wrap in its box runs on in the PNG/PDF. The PPTX keeps real text boxes,
 * which wrap.
 *
 * PDF and PPTX are rasterised pages vs editable slides: the PDF is the picture (every page the slide
 * PNG), the PPTX is text boxes, shapes and images PowerPoint and Keynote can edit — fonts are the
 * viewer's own there (a PPTX cannot carry a web font), so a missing face falls back on that machine.
 * Both libraries are imported DYNAMICALLY so a deck that never exports one does not pay for it.
 */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ANCHOR = { left: 'start', center: 'middle', right: 'end' }
const textLayers = (doc) => doc.layers.filter((l) => l.type === 'text' && l.visible !== false)

/* ── the page's own @font-face rules ─────────────────────────────────── */
function pageFaces(family) {
  const out = []
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.cssRules) walk(r.cssRules, base)
      if (typeof CSSFontFaceRule === 'undefined' || !(r instanceof CSSFontFaceRule)) continue
      const fam = r.style.getPropertyValue('font-family').trim().replace(/^["']|["']$/g, '')
      if (fam !== family) continue
      const src = /url\(["']?([^"')]+\.woff2?)["']?\)/.exec(r.style.getPropertyValue('src'))?.[1]
      if (!src) continue
      const [lo, hi = lo] = (r.style.getPropertyValue('font-weight') || '400').split(/\s+/).map(Number)
      out.push({ family, style: r.style.getPropertyValue('font-style') || 'normal', lo, hi, url: new URL(src, base).href })
    }
  }
  for (const sheet of Array.from(document.styleSheets)) {
    let rules
    try { rules = sheet.cssRules } catch { continue } /* a cross-origin sheet */
    walk(rules, sheet.href ?? location.href)
  }
  return out
}
const fileCache = new Map()
const inline = (url) => {
  if (!fileCache.has(url)) fileCache.set(url, fetch(url).then((r) => { if (!r.ok) throw new Error(`font ${url} → ${r.status}`); return r.arrayBuffer() }).then(toBase64).catch((e) => { fileCache.delete(url); throw e }))
  return fileCache.get(url)
}
/* the one face per (weight, style) a document uses — nearest weight in the same style */
async function themeFaceCss(family, uses) {
  const faces = pageFaces(family)
  const picked = new Map()
  for (const { weight, italic } of uses) {
    const style = italic ? 'italic' : 'normal'
    const pool = faces.filter((f) => (f.style === 'italic' || f.style.startsWith('oblique')) === italic)
    const face = (pool.length ? pool : faces).map((f) => ({ f, d: weight < f.lo ? f.lo - weight : weight > f.hi ? weight - f.hi : 0 })).sort((a, b) => a.d - b.d)[0]?.f
    if (face) picked.set(face.url, { ...face, style })
  }
  const rules = await Promise.all([...picked.values()].map(async (f) =>
    `@font-face{font-family:"${f.family}";font-style:${f.style};font-weight:${f.lo === f.hi ? f.lo : `${f.lo} ${f.hi}`};src:url(data:font/woff2;base64,${await inline(f.url)}) format("woff2");}`))
  return rules.join('')
}

/** Every `@font-face` this document needs, inlined. Await it before `slideToSvg`. */
export async function fontCssForDoc(doc) {
  const byFamily = new Map()
  for (const l of textLayers(doc)) {
    const key = l.font || 'sans'
    if (!byFamily.has(key)) byFamily.set(key, [])
    byFamily.get(key).push({ weight: l.weight ?? 400, italic: !!l.italic })
  }
  const parts = await Promise.all([...byFamily].map(([font, uses]) =>
    (isThemeFont(font) ? themeFaceCss(familyFor(font), uses) : googleFontFaces(font)).catch(() => '')))
  return parts.join('')
}

/* ── SVG ─────────────────────────────────────────────────────────────── */
function textLayer(l) {
  const lines = String(l.text ?? '').split('\n')
  const size = l.size ?? 16
  const lh = (l.lineHeight ?? 1.2) * size
  const anchor = ANCHOR[l.align] ?? 'start'
  const x = l.align === 'center' ? l.x + l.w / 2 : l.align === 'right' ? l.x + l.w : l.x
  /* the renderer is a flex COLUMN: justify-content places the block, each line on its own baseline.
     0.78em over the cap is the usual first-baseline approximation for an uppercase-heavy deck. */
  const block = lines.length * lh
  const top = l.valign === 'center' ? l.y + (l.h - block) / 2 : l.valign === 'end' ? l.y + l.h - block : l.y
  const first = top + size * 0.78
  const attrs = [
    `x="${x}"`, `y="${first}"`,
    `font-family="${esc(familyFor(l.font))}, sans-serif"`,
    `font-size="${size}"`,
    `font-weight="${l.weight ?? 400}"`,
    l.italic ? 'font-style="italic"' : '',
    l.tracking ? `letter-spacing="${l.tracking}"` : '',
    `text-anchor="${anchor}"`,
    `fill="${resolveColor(l.color) ?? '#FFFFFF'}"`,
  ].filter(Boolean).join(' ')
  /* `text-transform` is CSS, not SVG — an uppercase layer is uppercased in the STRING */
  const body = lines.map((line, i) => `<tspan x="${x}"${i ? ` dy="${lh}"` : ''}>${esc(l.case === 'upper' ? line.toLocaleUpperCase() : line)}</tspan>`).join('')
  /* `stroke` on a TEXT layer is a BOX (the renderer's CSS border), not a glyph outline */
  const box = l.stroke ? `<rect x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" fill="none" stroke="${resolveColor(l.stroke)}" stroke-width="1"/>` : ''
  return `${box}<text ${attrs}>${body}</text>`
}

function layerSvg(l) {
  if (l.visible === false) return ''
  const rot = typeof l.rotate === 'number' && l.rotate ? ` transform="rotate(${l.rotate} ${l.x + l.w / 2} ${l.y + l.h / 2})"` : ''
  if (l.type === 'rule') {
    const stroke = resolveColor(l.stroke)
    return `<rect x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" fill="${resolveColor(l.color) ?? 'none'}"${stroke ? ` stroke="${stroke}"` : ''}${rot}/>`
  }
  if (l.type === 'image') {
    if (!l.src) return ''
    const fit = l.fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'
    return `<image href="${esc(l.src)}" x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" preserveAspectRatio="${fit}"${rot}/>`
  }
  return rot ? `<g${rot}>${textLayer(l)}</g>` : textLayer(l)
}

/** One slide document → an SVG string. Synchronous: pass `fontCss` from `fontCssForDoc`, awaited. */
export function slideToSvg(doc, fontCss = '') {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${SLIDE_W}" height="${SLIDE_H}" viewBox="0 0 ${SLIDE_W} ${SLIDE_H}">`,
    fontCss ? `<defs><style type="text/css">${fontCss}</style></defs>` : '',
    `<rect width="${SLIDE_W}" height="${SLIDE_H}" fill="${resolveColor(doc.bg) ?? '#000000'}"/>`,
    doc.layers.map(layerSvg).join(''),
    '</svg>',
  ].join('')
}

/* An image layer's src, inlined — an <img>-drawn SVG cannot fetch it, and a same-origin blob or asset
   URL is not reachable from inside the isolated document either. */
async function inlineImages(doc) {
  const layers = await Promise.all(doc.layers.map(async (l) => {
    if (l.type !== 'image' || !l.src || l.src.startsWith('data:')) return l
    try {
      const blob = await (await fetch(l.src)).blob()
      const data = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob) })
      return { ...l, src: data }
    } catch { return l }
  }))
  return { ...doc, layers }
}

/** An SVG string → a PNG blob at `scale`× the 1920×1080 stage. */
export function svgToPngBlob(svg, scale = 1) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(SLIDE_W * scale)
      canvas.height = Math.round(SLIDE_H * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas produced no blob'))), 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('the SVG did not decode')) }
    img.src = url
  })
}

/** The whole path for one slide: fonts, images, build, rasterise. */
export async function slideToPngBlob(doc, scale = 1) {
  const [fontCss, inlined] = await Promise.all([fontCssForDoc(doc), inlineImages(doc)])
  return svgToPngBlob(slideToSvg(inlined, fontCss), scale)
}

/** The whole deck as one PDF — native 1920×1080 pages, each the rasterised slide. Sequential: each
 *  page is a full-size canvas, and fourteen at once spike memory for a one-off action. */
export async function deckToPdfBlob(slides, { scale = 1, onProgress } = {}) {
  const { PDFDocument } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  for (let i = 0; i < slides.length; i += 1) {
    onProgress?.(i, slides.length)
    const png = await pdf.embedPng(await (await slideToPngBlob(slides[i].doc, scale)).arrayBuffer())
    pdf.addPage([SLIDE_W, SLIDE_H]).drawImage(png, { x: 0, y: 0, width: SLIDE_W, height: SLIDE_H })
  }
  return new Blob([await pdf.save()], { type: 'application/pdf' })
}

/* ── PPTX ────────────────────────────────────────────────────────────── */
/* 16:9 at 13.333 × 7.5 in (PowerPoint's own widescreen). 1920 stage px = 13.333 in = 960 pt, so a
   stage px is 1/144 in and half a point. */
const IN = (px) => px / 144
const PT = (px) => px * 0.5
const hex = (c, fallback) => (resolveColor(c) ?? fallback)?.replace('#', '').slice(0, 6).toUpperCase()
const VALIGN = { start: 'top', center: 'middle', end: 'bottom' }
const emOf = (tracking) => { const n = parseFloat(tracking); return Number.isFinite(n) ? n : 0 }

/** The whole deck as an editable PPTX — text boxes, shapes and images, one slide per slide. */
export async function deckToPptxBlob(slides, { title } = {}) {
  const { default: PptxGenJS } = await import('pptxgenjs')
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  if (title) pptx.title = title
  for (const { doc } of slides) {
    const inlined = await inlineImages(doc)
    const s = pptx.addSlide()
    s.background = { color: hex(inlined.bg, '#000000') }
    for (const l of inlined.layers) {
      if (l.visible === false) continue
      const box = { x: IN(l.x), y: IN(l.y), w: IN(l.w), h: IN(l.h), rotate: l.rotate || 0 }
      if (l.type === 'rule') {
        s.addShape('rect', { ...box, fill: l.color ? { color: hex(l.color) } : { type: 'none' }, line: l.stroke ? { color: hex(l.stroke), width: 0.75 } : { type: 'none' } })
      } else if (l.type === 'image') {
        if (!l.src) continue
        s.addImage({ ...box, data: l.src.startsWith('data:') ? l.src : undefined, path: l.src.startsWith('data:') ? undefined : l.src, sizing: { type: l.fit === 'contain' ? 'contain' : 'cover', w: box.w, h: box.h } })
      } else {
        const size = l.size ?? 16
        const t = String(l.text ?? '')
        const em = emOf(l.tracking)
        s.addText(l.case === 'upper' ? t.toLocaleUpperCase() : t, {
          ...box,
          margin: 0,
          fontFace: familyFor(l.font),
          fontSize: PT(size),
          bold: (l.weight ?? 400) >= 600,
          italic: !!l.italic,
          color: hex(l.color, '#FFFFFF'),
          align: l.align ?? 'left',
          valign: VALIGN[l.valign] ?? 'top',
          charSpacing: String(l.tracking ?? '').endsWith('px') ? PT(em) : PT(em * size),
          lineSpacingMultiple: l.lineHeight ?? 1.2,
          line: l.stroke ? { color: hex(l.stroke), width: 0.75 } : undefined,
          fit: 'none',
        })
      }
    }
  }
  return pptx.write({ outputType: 'blob' })
}

/** Save a blob as a file (a download the browser starts). */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
