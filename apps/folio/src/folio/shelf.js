/* Folio on the real Library (/demo-4): the library's books (lib/books.js — the one catalogue /library reads too), with
   Folio's looks on top. A book with no cover of its own gets a generated jacket, picked from its address
   (6 patterns × 6 colourways). */
import { BOOKS, DOCS as LIB_DOCS, SHELVES, SUBSHELVES, keyOf, findDoc as findLibDoc } from '../lib/books'
import { client } from './client'
import { PATTERNS } from './parts'
import { embeds } from './Media'
export { SHELVES, SUBSHELVES, keyOf }

/* the six colourways of the editions (Figma 228:12991, "01 / A rhythm of other worlds"): jacket, ink, band, paper, the
   soft field's colour (the fill inside each edition's blurred SVG) */
const COLOURWAYS = [
  { bg: '#a9c3d9', ink: '#354e66', band: '#eeeadc', paper: '#eeeadc', field: '#7ba8cf' },
  { bg: '#d9806b', ink: '#4c302b', band: '#e9a1a3', paper: '#eeeadc', field: '#d98657' },
  { bg: '#e9cb7e', ink: '#51543a', band: '#eeeadc', paper: '#eeeadc', field: '#ddb969' },
  { bg: '#c5b7d5', ink: '#453a55', band: '#e5d9e8', paper: '#eeeadc', field: '#ada5cf' },
  { bg: '#9ebaa5', ink: '#304c3e', band: '#dae2cd', paper: '#eeeadc', field: '#789d8c' },
  { bg: '#deb7bc', ink: '#623b43', band: '#eeddd6', paper: '#eeeadc', field: '#bf8996' },
]

const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 2166136261)
const coverOf = (key) => {
  const h = hash(key)
  return { pattern: PATTERNS[h % 6], colours: COLOURWAYS[Math.floor(h / 6) % 6] }
}

/* "Opportunities — master year-round list (2026)" → cover title "Opportunities" over "master year-round list (2026)" */
const splitTitle = (t) => {
  const m = /\s+[—–]\s+|:\s+|\s+(?=\()/.exec(t)
  return m && m.index > 0 ? [t.slice(0, m.index), t.slice(m.index + m[0].length)] : [t, '']
}
/* a title's length sets its jacket size: short titles at the edition size, long ones step down so two lines hold them */
const titleSize = (t) => (t.length > 30 ? 15 : t.length > 18 ? 19 : 25.702)

const IMAGE = /\.(jpe?g|png|webp)$/i
/* an original's address comes from the client (record: its dev server's private door in dev, the private door deployed) */
export const urlOf = (f) => f.url || client().assetUrl(f.key)

/* ── documents: the library's, with their Folio address ── */
export const DOCS = LIB_DOCS.map((d) => ({ ...d, href: `/${d.collection}/${d.id}` }))
const BY_KEY = Object.fromEntries(DOCS.map((d) => [d.key, d]))
export const docByKey = (key) => BY_KEY[key]

/* ── books: the library's, dressed as editions ── */
export const VOLUMES = BOOKS.map((b) => {
  const chapters = b.chapters.map((d) => BY_KEY[d.key])
  const first = chapters[0]
  const [coverTitle, sub] = splitTitle(b.title)
  const coverSub = b.ruleSubtitle ? [sub, b.ruleSubtitle].filter(Boolean).join(', ') : sub
  const img = b.originals.find((f) => IMAGE.test(f.key))
  const cover = coverOf(b.id)
  const book = {
    ...b,
    coverTitle,
    subtitle: coverSub,
    titleSize: titleSize(coverTitle),
    series: b.shelfLabel.toUpperCase(),
    ...cover,
    bg: cover.colours.bg,
    ink: cover.colours.ink,
    chapters,
    image: img ? urlOf(img) : null,
    href: first.href,
    /* resumes and CVs were set in mono (user, 2026-11-04) */
    mono: b.code === 'CV' || b.code === 'RES',
  }
  /* the jacket's foot: the call number, or its class and kind and the chapter count — parts apart, no · */
  book.foot = chapters.length > 1 ? [...b.callParts.slice(0, 2), `${chapters.length} CHAPTERS`].join('\u2003') : b.call
  chapters.forEach((d) => { d.book = book })
  b.hidden.forEach((h) => { BY_KEY[h.key].book = book })
  return book
})

/* a document's address → the document; a hidden duplicate's address → the copy that is kept */
export const findDoc = (collection, id) => {
  const doc = findLibDoc(collection, id)
  return doc ? BY_KEY[doc.key] : undefined
}

/* the markdown to read: no frontmatter, no leading `# Title` (the page sets the title), and `[[target|label]]` wikilinks
   turned into links to the document they name on the same collection — or plain text when no document matches */
export function bodyOf(doc) {
  const linkTo = (target) => {
    const stem = target.split('#')[0].split('/').pop()
    return DOCS.find((d) => d.collection === doc.collection && d.id.split('/').pop() === stem)?.href
  }
  return embeds((doc.source ?? '')
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    .replace(/^\s*# .*\n/, ''), urlOf)
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
      const text = label ?? target.split('/').pop()
      const href = linkTo(target)
      return href ? `[${text}](${href})` : text
    })
}
