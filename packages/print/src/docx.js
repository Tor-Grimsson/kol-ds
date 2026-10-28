/* Paginated sheet HTML → .docx. Scale: the sheet is 1190px for A4's 595pt, so 1 px = 0.5pt = 10 twips,
 * and a font of N px = N half-points. Ported from kol-atlas's 2026-10-24 build.js — kol-print's lib/docx.js (dotfiles),
 * verbatim but for its seams: the studio, the logo (PNG bytes) and the output are the caller's, so it runs in Node and in a
 * browser alike (`Packer.toBuffer` · `Packer.toBlob`). */
import { parse } from 'node-html-parser'
import * as D from 'docx'
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType,
  ImageRun, Header, Footer, PageNumber, TabStopType, ShadingType, LevelFormat, LineRuleType, VerticalAlign, TableLayoutType } = D

const T = (px) => Math.round(px * 10)
const W = 1062 // content width, px
const INK = '111111', GREY = '888888', MID = '666666', TB = '444444', RUST = 'AD5038', RULE = 'E2E2E2'
const FONT = 'Helvetica Neue'
const line = (px) => ({ line: T(px), lineRule: LineRuleType.EXACT })
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const NOB = { top: NONE, bottom: NONE, left: NONE, right: NONE }
const bd = (color) => ({ style: BorderStyle.SINGLE, size: 6, color }) // 1.5px = 0.75pt = 6 eighths
const CAPS = { size: 15, bold: true, allCaps: true, characterSpacing: 15, color: GREY }

// ---------- header and footer (the canvas's Header, Grid variant, and the sheet footer) ----------
const colX = 9 * ((W - 11 * 22.7) / 12 + 22.7) // grid column 10 of 12
function header(STUDIO, LOGO) {
  return new Header({ children: [new Table({
    width: { size: T(W), type: WidthType.DXA }, columnWidths: [T(colX), T(W - colX)], borders: { ...NOB, insideHorizontal: NONE, insideVertical: NONE },
    layout: TableLayoutType.FIXED,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: T(colX), type: WidthType.DXA }, borders: NOB, margins: { left: 0, right: 0 },
        children: [new Paragraph({ children: LOGO ? [new ImageRun({ type: 'png', data: LOGO, transformation: { width: 155.8, height: 47.6 }, altText: { name: STUDIO.studio ?? '', description: STUDIO.studio ?? '', title: STUDIO.studio ?? '' } })] : [] })] }),
      new TableCell({ width: { size: T(W - colX), type: WidthType.DXA }, borders: NOB, margins: { left: 0, right: 0 },
        children: (STUDIO.contacts ?? []).map((t) => new Paragraph({ spacing: line(30), children: [new TextRun({ text: t, size: 20 })] })) }),
    ] })],
  })] })
}
function footer(text, perSection) {
  return new Footer({ children: [new Paragraph({
    border: { top: { ...bd(RULE), space: 8 } }, spacing: line(22), tabStops: [{ type: TabStopType.RIGHT, position: T(W) }],
    children: [new TextRun({ text, size: 15, color: GREY }), new TextRun({ children: ['\t', PageNumber.CURRENT, ' / ', perSection ? PageNumber.TOTAL_PAGES_IN_SECTION : PageNumber.TOTAL_PAGES], size: 15, color: GREY })],
  })] })
}
const page = { size: { width: 11906, height: 16838 }, margin: { top: T(226), bottom: T(140), left: T(64), right: T(64), header: T(64), footer: T(64) } }
const styles = { default: { document: { run: { font: FONT, size: 18, color: INK }, paragraph: { spacing: { ...line(27), before: 0, after: 0 } } } } }
const numbering = { config: [
  { reference: 'bul', levels: [0, 1, 2].map((l) => ({ level: l, format: LevelFormat.BULLET, text: ['•', '–', '◦'][l], alignment: AlignmentType.LEFT, style: { run: { font: FONT }, paragraph: { indent: { left: T(34 * (l + 1)), hanging: T(34) } } } })) },
  { reference: 'bultb', levels: [0, 1].map((l) => ({ level: l, format: LevelFormat.BULLET, text: ['•', '–'][l], alignment: AlignmentType.LEFT, style: { run: { font: FONT }, paragraph: { indent: { left: T(112 + 34 * (l + 1)), hanging: T(34) } } } })) },
  { reference: 'numtb', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { run: { font: FONT }, paragraph: { indent: { left: T(146), hanging: T(34) } } } }] },
] }

// ---------- inline: HTML nodes → TextRuns ----------
function runs(node, s = {}) {
  const out = []
  for (const n of node.childNodes) {
    if (n.nodeType === 3) { const t = n.text.replace(/\s+/g, ' '); if (t) out.push(new TextRun({ text: t, ...s })); continue }
    if (n.nodeType !== 1) continue
    const tag = n.rawTagName.toLowerCase(), cl = n.classList
    if (tag === 'br') out.push(new TextRun({ break: 1, ...s }))
    else if (tag === 'b' || tag === 'strong') out.push(...runs(n, { ...s, bold: true }))
    else if (tag === 'em') out.push(...runs(n, { ...s, italics: true }))
    else if (tag === 'sup' && cl.contains('fn')) out.push(new TextRun({ text: n.text.trim(), superScript: true, bold: true, color: RUST, size: s.size || 18 }))
    else if (cl.contains('num')) out.push(new TextRun({ text: n.text.trim(), ...s, bold: s.numNormal ? false : s.bold, color: s.numColor || GREY }), new TextRun({ text: '\t', ...s }))
    else if (cl.contains('tn') || cl.contains('fnn')) out.push(new TextRun({ text: n.text.trim(), ...s, color: cl.contains('tn') ? GREY : s.color }), new TextRun({ text: '\t', ...s }))
    else if (cl.contains('k')) out.push(...runs(n, { ...s, bold: true, color: INK }))
    else if (cl.contains('lbl')) out.push(new TextRun({ text: n.text.trim(), ...CAPS }))
    else if (cl.contains('mk')) out.push(new TextRun({ text: '  ', ...s }), ...runs(n, s))
    else if (cl.contains('st')) out.push(new TextRun({ text: '●', size: 12, color: RUST, bold: false }), new TextRun({ text: ' ' + n.text.trim(), size: 15, color: MID, bold: false }))
    else if (cl.contains('tag')) out.push(new TextRun({ text: ' ' + n.text.trim() + ' ', size: 15, bold: true, color: 'FFFFFF', shading: { type: ShadingType.CLEAR, fill: RUST, color: 'auto' } }))
    else if (cl.contains('cp')) out.push(new TextRun({ text: '■ ', size: 16, color: INK }))
    else if (cl.contains('why')) out.push(new TextRun({ text: '  ' + n.text.trim(), size: 17, color: MID, bold: false }))
    else if (cl.contains('url')) out.push(new TextRun({ text: '  ' + n.text.trim(), ...s, color: GREY }))
    else if (cl.contains('cnt')) out.push(new TextRun({ text: '\t' + n.text.trim(), size: 17, color: GREY, bold: false }))
    else if (tag === 'i') {}
    else out.push(...runs(n, s))
  }
  // trim leading/trailing spaces of the block
  return out
}

// ---------- tables ----------
function colWidths(rows, head) {
  const n = Math.max(...rows.map((r) => r.length), head ? head.length : 0)
  const fixed = Array(n).fill(0), weight = Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    const cells = rows.map((r) => r[i]).filter(Boolean)
    const len = (c) => c.text.trim().length
    const maxl = Math.max(0, ...cells.map(len)), headl = head && head[i] ? head[i].text.trim().length : 0
    const isNum = cells.length && cells.every((c) => c.classList.contains('num'))
    const nowrap = cells.some((c) => /nowrap/.test(c.getAttribute('style') || ''))
    if (isNum && i === 0) fixed[i] = 56
    else if (isNum || nowrap) fixed[i] = Math.max(maxl * 9.6, headl * 11) + 24
    else weight[i] = Math.max(Math.sqrt(cells.reduce((a, c) => a + len(c), 0) / Math.max(cells.length, 1)) * 1.4 + Math.sqrt(maxl), headl * 0.5, 4)
  }
  const free = W - fixed.reduce((a, b) => a + b, 0), wsum = weight.reduce((a, b) => a + b, 0)
  const w = fixed.map((f, i) => f || (free * weight[i]) / wsum)
  const tw = w.map(T); tw[n - 1] += T(W) - tw.reduce((a, b) => a + b, 0)
  return tw
}
function table(el) {
  const kv = el.classList.contains('kv')
  const headCells = el.querySelectorAll('thead th')
  const bodyRows = el.querySelectorAll('tbody tr').map((tr) => tr.querySelectorAll('td'))
  let widths = colWidths(bodyRows, headCells.length ? headCells : null)
  if (kv) { const first = T(192.8); widths = [first, T(W) - first] }
  const n = widths.length
  const cell = (c, i, isHead, last) => {
    const num = c.classList.contains('num')
    const firstNum = num && i === 0
    const s = isHead ? { ...CAPS } : { color: (kv && i === 0) || firstNum ? GREY : INK }
    return new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders: { top: kv && !isHead && last === 'first' ? bd(INK) : NONE, left: NONE, right: NONE, bottom: isHead ? bd(INK) : bd(RULE) },
      margins: { top: isHead ? 0 : T(14), bottom: T(14), left: 0, right: i === n - 1 ? 0 : T(22) },
      verticalAlign: isHead ? VerticalAlign.BOTTOM : VerticalAlign.TOP,
      children: [new Paragraph({ spacing: line(isHead ? 22 : 27), alignment: num && !firstNum ? AlignmentType.RIGHT : AlignmentType.LEFT, children: runs(c, s) })],
    })
  }
  const rows = []
  if (headCells.length) rows.push(new TableRow({ tableHeader: true, cantSplit: true, children: headCells.map((c, i) => cell(c, i, true)) }))
  bodyRows.forEach((r, ri) => rows.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, i, false, ri === 0 ? 'first' : '')) })))
  return [new Table({ width: { size: T(W), type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, borders: { ...NOB, insideHorizontal: NONE, insideVertical: NONE }, rows }),
    new Paragraph({ spacing: { ...line(30), before: 0, after: 0 }, children: [] })]
}

// ---------- blocks ----------
const RIGHT = T(W - 839)
function blocks(els, docTitle) {
  const out = []
  let lastWasParties = false
  els.forEach((el, idx) => {
    const tag = el.rawTagName.toLowerCase(), cl = el.classList
    const P = (o) => out.push(new Paragraph(o))
    if (cl.contains('eyebrow')) P({ pageBreakBefore: idx > 0, keepNext: true, ...(idx === 0 ? { outlineLevel: 0 } : {}), spacing: line(22), children: [new TextRun({ text: el.text.trim(), ...CAPS })] })
    else if (tag === 'h1' || (tag === 'h2' && cl.contains('chap'))) P({ keepNext: true, outlineLevel: 1, spacing: { ...line(52), before: T(8) }, children: runs(el, { size: 44, bold: true, numColor: RUST }) })
    else if (tag === 'h2') P({ keepNext: true, outlineLevel: 2, spacing: { ...line(38), before: T(56), after: T(16) }, children: runs(el, { size: 30, bold: true, numColor: RUST }) })
    else if (tag === 'h3') P({ keepNext: true, outlineLevel: 3, spacing: { ...line(30), before: T(44), after: T(8) }, indent: { left: T(56), hanging: T(56) }, tabStops: [{ type: TabStopType.LEFT, position: T(56) }], children: runs(el, { size: 20, bold: true }) })
    else if (tag === 'h4') P({ keepNext: true, spacing: { ...line(27), before: T(26), after: T(4) }, indent: { left: T(112), hanging: T(56) }, tabStops: [{ type: TabStopType.LEFT, position: T(112) }], children: runs(el, { size: 18, bold: true, numNormal: true }) })
    else if (cl.contains('parties')) {
      const cols = el.childNodes.filter((n) => n.nodeType === 1), cw = T(W / 3)
      out.push(new Table({ width: { size: T(W), type: WidthType.DXA }, columnWidths: [cw, cw, T(W) - 2 * cw], layout: TableLayoutType.FIXED, borders: { ...NOB, insideHorizontal: NONE, insideVertical: NONE },
        rows: [new TableRow({ children: cols.map((c, i) => new TableCell({ width: { size: i < 2 ? cw : T(W) - 2 * cw, type: WidthType.DXA }, borders: NOB, margins: { top: T(34), left: 0, right: T(22.7), bottom: 0 }, children: [new Paragraph({ spacing: line(27), children: runs(c) })] })) })] }))
      lastWasParties = true; return
    }
    else if (tag === 'p') {
      const k = (c) => cl.contains(c)
      if (k('lead')) P({ spacing: { ...line(32), before: T(lastWasParties || els[idx - 1]?.rawTagName === 'h1' ? 46 : 40), after: T(12) }, indent: { right: T(W - 840) }, children: runs(el, { size: 22 }) })
      else if (k('stats')) P({ spacing: { ...line(25.5), before: T(16), after: T(8) }, children: el.childNodes.filter((n) => n.nodeType === 1).flatMap((s, i) => [...(i ? [new TextRun({ text: '      ', size: 17 })] : []), ...runs(s, { size: 17, color: MID })]) })
      else if (k('when') || k('dw')) P({ spacing: { ...line(25.5), before: T(els[idx - 1]?.classList.contains('chap') ? 16 : 8), after: T(8) }, indent: { right: RIGHT }, children: runs(el, { size: 17, color: MID }) })
      else if (k('note')) P({ spacing: { ...line(22.5), before: T(12), after: T(12) }, indent: { right: RIGHT }, children: runs(el, { size: 15, italics: true, color: MID }) })
      else if (k('tb')) P({ spacing: { ...line(27), before: T(4), after: T(12) }, indent: { left: T(112), right: RIGHT }, children: runs(el, { color: TB }) })
      else P({ spacing: { ...line(27), before: T(12), after: T(12) }, indent: { right: RIGHT }, children: runs(el) })
    }
    else if (tag === 'ul' && cl.contains('phl')) {
      const lis = el.querySelectorAll(':scope > li')
      lis.forEach((li) => P({ spacing: line(27), indent: { left: T(112), hanging: T(56) }, tabStops: [{ type: TabStopType.LEFT, position: T(112) }], children: runs(li) }))
      P({ spacing: { line: T(14), lineRule: LineRuleType.EXACT, after: T(6) }, border: { bottom: { ...bd(RULE), space: 0 } }, children: [new TextRun({ text: '', size: 2 })] })
    }
    else if (tag === 'ul' || tag === 'ol') {
      if (cl.contains('fns')) {
        if (!cl.contains('cont')) P({ spacing: { line: T(20), lineRule: LineRuleType.EXACT }, indent: { right: T(W - 120) }, border: { bottom: { ...bd(INK), space: 0 } }, children: [new TextRun({ text: '', size: 2 })] })
        const lis = el.querySelectorAll(':scope > li')
        lis.forEach((li, i) => P({ spacing: { ...line(22), before: i === 0 ? T(14) : 0, after: i === lis.length - 1 ? T(28) : T(2) }, indent: { left: T(34), hanging: T(34), right: RIGHT }, tabStops: [{ type: TabStopType.LEFT, position: T(34) }], children: runs(li, { size: 15, color: MID }) }))
        return
      }
      const tb = cl.contains('tb'), ref = tag === 'ol' ? 'numtb' : tb ? 'bultb' : 'bul'
      const inst = ++listInst
      const walk = (list, level) => list.querySelectorAll(':scope > li').forEach((li, i, arr) => {
        const own = { childNodes: li.childNodes.filter((n) => !(n.nodeType === 1 && /^(ul|ol)$/i.test(n.rawTagName))) }
        P({ numbering: { reference: ref, level, instance: inst }, spacing: { ...line(27), before: T(3), after: T(3) }, indent: undefined, children: runs(own, { color: tb ? TB : INK }) })
        li.querySelectorAll(':scope > ul, :scope > ol').forEach((sub) => walk(sub, level + 1))
      })
      walk(el, 0)
      P({ spacing: { line: T(11), lineRule: LineRuleType.EXACT }, children: [] })
    }
    else if (tag === 'table') out.push(...table(el))
    else if (cl.contains('phh')) P({ keepNext: true, spacing: { ...line(27), before: T(20), after: T(8) }, tabStops: [{ type: TabStopType.LEFT, position: T(56) }, { type: TabStopType.RIGHT, position: T(W) }], children: runs(el, { bold: true }) })
    else if (tag === 'blockquote') P({ spacing: { ...line(32), before: T(18), after: T(18) }, indent: { left: T(56), right: RIGHT }, children: [new TextRun({ text: '\u201C ', size: 22, color: RUST }), ...runs(el, { size: 22, italics: true })] })
    else if (tag === 'hr') P({ spacing: { line: T(17), lineRule: LineRuleType.EXACT, before: T(17), after: T(34) }, border: { bottom: { ...bd(RULE), space: 0 } }, children: [new TextRun({ text: '', size: 2 })] })
    else if (tag === 'pre') el.text.replace(/<\/?code[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\n$/, '').split('\n').forEach((l, i, a) => P({ spacing: { ...line(24), before: i ? 0 : T(12), after: i === a.length - 1 ? T(12) : 0 }, shading: { type: ShadingType.CLEAR, fill: 'F4F4F4', color: 'auto' }, children: [new TextRun({ text: l || ' ', font: 'Menlo', size: 16 })] }))
    else { console.warn('unhandled', docTitle, tag, cl.value); P({ children: runs(el) }) }
    lastWasParties = false
  })
  return out
}
let listInst = 0

// ---------- the pages back into one flow: rejoin what the pagination split ----------
function merge(pages) {
  const els = []
  for (const html of pages) {
    for (const k of parse(html).childNodes.filter((n) => n.nodeType === 1)) {
      const prev = els[els.length - 1]
      if (prev && k.classList.contains('cont') && k.rawTagName === prev.rawTagName) {
        const into = k.rawTagName === 'table' ? prev.querySelector('tbody') : prev
        const from = k.rawTagName === 'table' ? k.querySelector('tbody') : k
        from.childNodes.forEach((n) => into.appendChild(n))
        continue
      }
      els.push(k)
    }
  }
  return els
}

/* the Document; `toDocxBuffer` (Node) and `toDocxBlob` (a browser) pack it */
function docxDocument(pages, { foot = '', title = '', studio = {}, logoPng } = {}) {
  listInst = 0
  const section = { properties: { page }, headers: { default: header(studio, logoPng) }, footers: { default: footer(foot) }, children: blocks(merge(pages), title) }
  return new Document({ creator: studio.studio ?? '', title, styles, numbering, sections: [section] })
}
export const toDocxBuffer = (pages, opts) => Packer.toBuffer(docxDocument(pages, opts))
export const toDocxBlob = (pages, opts) => Packer.toBlob(docxDocument(pages, opts))
export { docxDocument }
