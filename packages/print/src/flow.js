/* kol-docs markdown → the sheet's HTML — kol-print's lib/flow.js (dotfiles), carried verbatim as ESM. `studio` is the
 * caller's ({ studio, designer, address }): no studio's details ship in this package. */
// kol-docs markdown → the sheet vocabulary (`.c`): eyebrow, h1, parties, lead, numbered h3, kv tables, footnotes, marks.
import { marked } from 'marked'
// raw HTML in prose (a literal `<title>` in a research note) is text, not markup: passed through, it opens a
// raw-text element that swallows the rest of the page and the pagination script with it
marked.use({ renderer: { html: ({ text }) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;') } })

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/)
  const fm = {}
  if (!m) return { fm, body: src }
  let list = null
  for (const l of m[1].split('\n')) {
    const item = l.match(/^\s+-\s+(.*)$/)
    if (item && list) { fm[list].push(item[1].replace(/^["']|["']$/g, '')); continue }
    const kv = l.match(/^([\w-]+):\s*(.*)$/)
    if (!kv) continue
    if (kv[2] === '') { list = kv[1]; fm[list] = [] } else { list = null; fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '') }
  }
  return { fm, body: src.slice(m[0].length) }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function parties(meta, studio) {
  const site = meta.site ? `<br>${esc(meta.site)}` : ''
  return '<div class="parties">' +
    `<div><span class="lbl">Client</span><br><b>${esc(meta.client)}</b>${meta.contact ? ', ' + esc(meta.contact) : ''}${site}</div>` +
    `<div><span class="lbl">Dates</span><br><b>${esc(meta.dates)}</b></div>` +
    `<div><span class="lbl">Designer</span><br><b>${esc(studio.studio)}</b>, ${esc(studio.designer)}<br>${esc(studio.address)}</div></div>`
}

// ponytail: marks read up to the next tag or punctuation; a mark mid-sentence with a comma in its label loses the tail.
function marks(html) {
  return html
    .replace(/✋\uFE0F?\s*([^<|.;,()✋🅿📍]*)/gu, (_, t) => `<span class="st"><i></i>${t.trim() || 'To confirm'}</span>`)
    .replace(/🅿\uFE0F?\s*([^<|.;,()✋🅿📍]*)/gu, (_, t) => `<span class="tag">${t.trim() || 'Optional'}</span>`)
    .replace(/📍\uFE0F?\s*/gu, '<span class="cp"></span>')
}

function footnotes(body) {
  const defs = [], order = {}
  body = body.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, (_, k, t) => { defs.push([k, t]); return '' })
  body = body.replace(/\[\^([^\]]+)\]/g, (_, k) => `\uE000${order[k] ??= Object.keys(order).length + 1}\uE001`) // → <sup> once marked has run
  const items = defs.filter(([k]) => order[k]).sort((a, b) => order[a[0]] - order[b[0]])
    .map(([k, t]) => `<li><span class="fnn">${order[k]}</span>${marked.parseInline(t)}</li>`)
  return { body, fns: items.length ? `<ol class="fns">${items.join('')}</ol>` : '' }
}

function flow(src, meta, studio) {
  const { fm, body: raw } = frontmatter(src)
  const doc = fm.title || 'Untitled'
  const { body, fns } = footnotes(raw)
  let html = marked.parse(/^#\s/m.test(body) ? body : `# ${doc}\n\n${body}`) + fns
  html = html.replace(/<h1[^>]*>(.*?)<\/h1>\s*(<p>)?/, (_, h, p) =>
    `<div class="eyebrow">${esc(meta.project)} · ${esc(doc)}</div><h1>${h}</h1>${parties(meta, studio)}${p ? '<p class="lead">' : ''}`)
  html = html.replace(/<h3[^>]*>([A-Z0-9]{1,3})[.)] (.*?)<\/h3>/g, '<h3><span class="num">$1</span><span class="t">$2</span></h3>')
  html = html.replace(/<h3[^>]*>(?!<span)(.*?)<\/h3>/g, '<h3><span class="num"></span><span class="t">$1</span></h3>')
  html = html.replace(/<h2[^>]*>/g, '<h2>').replace(/<h4[^>]*>/g, '<h4>')
  // an all-empty header row means a key-value table
  html = html.replace(/<table>\s*<thead>\s*<tr>\s*(<th[^>]*>\s*<\/th>\s*)+<\/tr>\s*<\/thead>/g, '<table class="kv">')
  // a section's intro paragraph stays with its heading
  html = html.replace(/(<\/h3>)\s*<p>/g, '$1<p class="kn">')
  html = html.replace(/\uE000(\d+)\uE001/g, '<sup class="fn">$1</sup>')
  return { fm, doc, html: marks(html).replace(/>\s+</g, '><') }
}

export { flow, frontmatter }
