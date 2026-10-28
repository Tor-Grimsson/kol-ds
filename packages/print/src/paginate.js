/* Pours the flow into 1318px pages in a real browser. Headings never end a page, a table splits only when both halves
 * keep ≥2 rows (the header repeats), and a block taller than a page is left whole, never looped on — kol-print's
 * lib/paginate.js (dotfiles), the script verbatim. It runs in a DOM: `PAGINATE_SCRIPT` is the page script the Node CLI
 * hands headless Chrome; `paginateHtml` builds that page; `paginateInDocument` runs the same logic in the browser you are
 * in (PrintStudio), so the two cut the same pages. */
import { SHEET_CSS } from './sheetCss.js'

export const PAGE_LIMIT = 1318
export const PAGINATE_SCRIPT = `
const LIMIT = 1318, src = document.getElementById('src'), out = document.getElementById('out'), pages = []
let page
const newPage = () => { page = document.createElement('div'); page.className = 'c page'; out.appendChild(page); pages.push(page) }
const over = () => page.scrollHeight > LIMIT + 1
const isHead = (el) => /^H[1-4]$/.test(el.tagName) || el.classList.contains('eyebrow') || el.classList.contains('kn')
const rows = (t) => t.tBodies[0] ? t.tBodies[0].rows : []
function place(el, fresh) {
  page.appendChild(el)
  if (!over()) return
  if (el.tagName === 'TABLE' && rows(el).length > 1) {
    const rest = el.cloneNode(true); rest.classList.add('cont'); rest.tBodies[0].innerHTML = ''
    while (over() && rows(el).length > 1) rest.tBodies[0].prepend(rows(el)[rows(el).length - 1])
    if (!over() && rows(el).length >= 2 && rows(rest).length >= 2) { newPage(); place(rest, true); return }
    while (rows(rest).length) el.tBodies[0].appendChild(rows(rest)[0])
  }
  if (fresh) return // already at the top of a page: taller than a page, leave it whole
  el.remove()
  const carry = []
  while (page.lastElementChild && isHead(page.lastElementChild)) carry.unshift(page.removeChild(page.lastElementChild))
  if (!page.children.length) { carry.forEach((c) => page.appendChild(c)); page.appendChild(el); return }
  newPage(); carry.forEach((c) => page.appendChild(c)); place(el, true)
}
newPage()
for (const el of [...src.children]) place(el, false)
const json = JSON.stringify(pages.map((p) => p.innerHTML))
document.body.setAttribute('data-pages', btoa(unescape(encodeURIComponent(json))))
`

/* the page the CLI hands Chrome (`--dump-dom`), reading the pages back off body[data-pages] */
export function paginateHtml(html, css = SHEET_CSS) {
  return `<!doctype html><meta charset="utf-8"><style>body{margin:0}${css}
.page{width:1062px;height:1318px;overflow:hidden;position:relative}</style>
<body><div id="src" class="c" style="width:1062px">${html}</div><div id="out"></div><script>${PAGINATE_SCRIPT}</script></body>`
}

/* the same cut in the browser you are in: a hidden 1062px column, the script run against it, the pages returned */
export function paginateInDocument(html, doc = document, css = SHEET_CSS) {
  const host = doc.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden'
  const style = doc.createElement('style')
  style.textContent = `${css}\n.page{width:1062px;height:1318px;overflow:hidden;position:relative}`
  host.appendChild(style)
  const src = doc.createElement('div'); src.id = 'src'; src.className = 'c'; src.style.width = '1062px'; src.innerHTML = html
  const out = doc.createElement('div'); out.id = 'out'
  host.append(src, out)
  doc.body.appendChild(host)
  try {
    /* the script reads #src / #out by id and writes body[data-pages]; scope both to this host */
    const run = new Function('document', `${PAGINATE_SCRIPT.replace("document.body.setAttribute('data-pages', btoa(unescape(encodeURIComponent(json))))", 'return json')}`)
    const shim = { getElementById: (id) => host.querySelector('#' + id), createElement: (t) => doc.createElement(t) }
    return JSON.parse(run(shim))
  } finally {
    host.remove()
  }
}
