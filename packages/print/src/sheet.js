/* The A4 sheet around a page of flow: the header (logo · the studio's contacts on the 12-column grid), the content box,
 * the footer (the document line · page n / N) — kol-print's kol-print.js (dotfiles), verbatim. A sheet is 1190 × 1684 px;
 * `printHtml` sets them at A4 for print (zoom 0.6665 — 1190px sheet onto 595pt, or five sheets print as ten pages). */
import { SHEET_CSS } from './sheetCss.js'

/* the logo sized for the header; `logoSvg` is the caller's markup */
const headerLogo = (logoSvg) => (logoSvg ? logoSvg.replace('<svg ', '<svg style="height:71.4px;width:auto;display:block" ') : '')

export function sheetHtml(body, i, n, { studio = {}, logoSvg = '', foot = '' } = {}) {
  const contacts = (studio.contacts ?? []).join('<br>')
  const header = `<div style="position:absolute;left:64px;right:64px;top:64px;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:22.7px;align-items:start;font-size:20px;line-height:30px"><div style="grid-column:1/4;height:71.4px">${headerLogo(logoSvg)}</div><div style="grid-column:10/13">${contacts}</div></div>`
  return `<section class="sheet"><div style="width:1190px;height:1684px;position:relative;box-sizing:border-box;background:#fff;color:#111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;line-height:27px;font-variant-numeric:tabular-nums">${header}<div class="c" style="position:absolute;left:64px;right:64px;top:226px;height:1318px;overflow:hidden">${body}</div><div style="position:absolute;left:64px;right:64px;bottom:64px;display:flex;justify-content:space-between;font-size:15px;line-height:22px;color:#888;border-top:1.5px solid #E2E2E2;padding-top:17px"><span>${foot}</span><span>${i + 1} / ${n}</span></div></div></section>`
}

/* the footer line the sheets and the DOCX share */
export const footLine = (studio, meta, doc) => `${studio?.studio ?? ''}${studio?.studio ? ', ' : ''}${meta.project} · ${doc}`

/* every sheet in one printable document — Chrome's --print-to-pdf, or the browser's own print */
export function printHtml(pages, { title = '', ...opts } = {}) {
  const n = pages.length
  return `<!doctype html><meta charset="utf-8"><title>${title}</title><style>@page{size:A4;margin:0}html{zoom:0.6665}body{margin:0}.sheet{width:1190px;height:1684px;overflow:hidden;break-after:page}${SHEET_CSS}</style>${pages.map((p, i) => sheetHtml(p, i, n, opts)).join('')}`
}
