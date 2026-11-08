/* THE BOOKS — the library read as books of chapters (plan 2026-11-04-no-bullets-audit W4): which documents are one book
 * (catalogue.js rules), what each book and chapter is called, which copies are the same text twice (duplicates.json,
 * from scripts/library-overlap.mjs) and his own edits (overrides.json, written by the Folio editor). One source for
 * /library and Folio (/demo-4); Folio adds only its looks (covers) on top. Nothing on disk moves or changes. */
import { LIBRARY, CLASSES } from './library'
import { bookOf, titleOf, chapterOf, fmtDate, subOf, SUBSHELVES } from './catalogue'
import { client } from '../folio/client'
import { glob } from './files'
import { subjectsOf, tagSlug } from './subjects'
import { TWINS } from './twins'
/* a twin hides under the version that opens, the way a duplicate hides under the copy that is kept */
const TWIN_OF = Object.fromEntries(TWINS.map(([main, other]) => [other, main]))
const DUPLICATES = client().read('duplicates')
const OVERRIDES = client().meta()
const keptOf = (key) => DUPLICATES[key] ?? TWIN_OF[key]

export { SUBSHELVES }
export const SHELVES = [
  ...CLASSES.map((c) => ({ id: c.id, label: c.label, note: c.note })),
  { id: 'reference', label: 'Reference', note: 'The registry — the card index' },
]
const LABEL = Object.fromEntries(SHELVES.map((s) => [s.id, s.label]))
export const keyOf = (row) => `${row.collection}/${row.id}`

/* ── documents ── */
/* plain text and code written in the Folio editor (data/documents/new/*.txt · *.js …) — the library reads Markdown only,
   so these are read here; their shelf and title come from overrides.json */
const LOOSE = glob(/^data\/documents\/new\/[^/]+\.(txt|js|jsx|ts|json|css|html|py|sh|yaml)$/)
const looseRows = Object.entries(LOOSE).map(([file, source]) => {
  const name = file.split('/').pop()
  const ext = name.split('.').pop()
  const code = ext === 'txt' ? 'TXT' : ext.toUpperCase()
  /* .html is a rich-text document (W14) — not code */
  const format = ext === 'txt' ? 'txt' : ext === 'html' ? 'rich' : 'code'
  const callParts = [code, 'n.d.']
  return { collection: 'documents', id: `new/${name}`, file, source, title: name, kind: { txt: 'Text', rich: 'Document', code: 'Code' }[format], code, date: '', lang: '', folder: 'self', files: [], call: callParts.join(' '), callParts, sortKey: `9|${code}|${name}`, origin: '', record: null, format, ext }
})

/* his own edits win over every rule: title, shelf, book */
/* a vault chapter's title is written by the import exactly as it should read — the file-name rebuild would lower-case names */
const vaultTitle = (row) => (row.collection === 'vault' ? /^title:\s*"?(.*?)"?\s*$/m.exec(row.source || '')?.[1] : null)
export const DOCS = [...LIBRARY.rows, ...looseRows].map((row) => {
  const vt = vaultTitle(row)
  if (vt) row = { ...row, title: vt }
  const key = keyOf(row)
  const own = OVERRIDES[key] ?? {}
  const folder = LABEL[own.shelf] ? own.shelf : row.folder
  return {
    ...row,
    key,
    folder,
    own,
    rawTitle: row.title,
    title: own.title || titleOf({ ...row, folder, rawTitle: row.title }),
    langs: (row.lang || '').split(/,\s*/).filter(Boolean),
    /* tags (plan library-connections W3.1): the shelf, then every subject the text names (lib/subjects.js) */
    tags: [...new Set([LABEL[folder], ...subjectsOf((row.source || '').replace(/\(?https?:\/\/[^\s)]+\)?/g, ''))].filter(Boolean))],
    shelf: folder,
    shelfLabel: LABEL[folder],
    hidden: Boolean(keptOf(key)),
    to: `/library/${row.collection}/${row.id}`,
  }
})
export const BY_KEY = Object.fromEntries(DOCS.map((d) => [d.key, d]))
/* each version knows the other: `twins` is every language the text is read in, this one first */
for (const pair of TWINS) {
  const docs = pair.map((k) => BY_KEY[k]).filter(Boolean)
  for (const d of docs) d.twins = docs.map((x) => ({ lang: (x.langs[0] ?? '').toUpperCase(), key: x.key }))
}

/* ── books ── */
const groups = new Map()
for (const doc of DOCS) {
  const owner = doc.hidden ? BY_KEY[keptOf(doc.key)] : doc
  const rule = owner.own.book ? { key: `own-${owner.own.book.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: owner.own.book } : bookOf(owner)
  const id = rule ? `${owner.shelf}:${rule.key}` : owner.key
  if (!groups.has(id)) groups.set(id, { id, rule, docs: [], hidden: [] })
  groups.get(id)[doc.hidden ? 'hidden' : 'docs'].push(doc)
}

/* a vault book keeps its folders' order (the chapter ids are numbered); every other book reads by date */
const byDate = (a, b) => (a.collection === 'vault' && b.collection === 'vault' ? a.sortKey.localeCompare(b.sortKey) : (a.date || '9999').localeCompare(b.date || '9999') || a.sortKey.localeCompare(b.sortKey))

export const BOOKS = [...groups.values()].map(({ id, rule, docs, hidden }) => {
  const chapters = [...docs].sort(byDate)
  const first = chapters[0]
  const files = [...chapters, ...hidden].flatMap((d) => d.files ?? [])
  const dates = chapters.map((d) => d.date).filter(Boolean).sort()
  const book = {
    id,
    rule,
    shelf: first.shelf,
    shelfLabel: first.shelfLabel,
    sub: subOf(first),
    subLabel: SUBSHELVES[first.shelf]?.find((x) => x.id === subOf(first))?.label ?? null,
    title: rule?.title ?? first.title,
    ruleSubtitle: rule?.subtitle ?? '',
    chapters,
    hidden,
    originals: [...new Map(files.map((f) => [f.key, f])).values()],
    date: dates.at(-1) ?? '',
    first: dates[0] ?? '',
    langs: [...new Set(chapters.flatMap((d) => d.langs))],
    origin: chapters.map((d) => d.origin).find(Boolean) ?? '',
    call: first.call,
    callParts: first.callParts,
    code: first.code,
    kind: first.kind,
    sortKey: first.sortKey,
    records: [...new Set(chapters.map((d) => d.record).filter(Boolean))],
    to: first.to,
  }
  chapters.forEach((d) => { d.bookId = id; d.chapter = chapters.length > 1 ? chapterOf(d, rule ?? { key: '' }) : d.title })
  /* two chapters with one name: the day tells them apart, else their order */
  const named = (n) => chapters.filter((d) => d.chapter === n)
  chapters.forEach((d) => { if (named(d.chapter).length > 1 && d.date && !d.chapter.includes(fmtDate(d.date))) d.chapter = `${d.chapter}, ${fmtDate(d.date)}` })
  chapters.forEach((d) => { const twins = named(d.chapter); if (twins.length > 1) d.chapter = `${d.chapter} (${twins.indexOf(d) + 1})` })
  hidden.forEach((d) => { d.bookId = id })
  return book
}).sort((a, b) => a.sortKey.localeCompare(b.sortKey))
export const BOOK_BY_ID = Object.fromEntries(BOOKS.map((b) => [b.id, b]))

/* a document's address → the document; a hidden duplicate's address → the copy that is kept */
export const findDoc = (collection, id) => {
  const doc = BY_KEY[`${collection}/${id}`]
  return doc?.hidden ? BY_KEY[keptOf(doc.key)] : doc
}
export const bookOfDoc = (doc) => (doc ? BOOK_BY_ID[doc.bookId] : null)

/* related books (plan library-connections W2.2): the books a book links to, and the books that link to it */
const RELATED = new Map(BOOKS.map((b) => [b.id, new Set()]))
for (const b of BOOKS) for (const d of b.chapters) for (const m of (d.source || '').matchAll(/\]\(\/library\/([^/)#\s]+)\/([^)#\s]+)/g)) {
  const other = bookOfDoc(findDoc(m[1], decodeURI(m[2])))
  if (other && other.id !== b.id) { RELATED.get(b.id).add(other.id); RELATED.get(other.id).add(b.id) }
}
/* a tag → the books whose chapters carry it; a book's tags are its chapters' together */
export const tagsOfBook = (book) => [...new Set(book.chapters.flatMap((d) => d.tags))]
export const TAGS = [...new Set(DOCS.filter((d) => !d.hidden).flatMap((d) => d.tags))].sort((a, b) => a.localeCompare(b))
export const booksTagged = (slug) => BOOKS.filter((b) => b.chapters.some((d) => d.tags.some((t) => tagSlug(t) === slug)))
export { tagSlug }
export const relatedOf = (book) => [...(RELATED.get(book?.id) ?? [])].map((id) => BOOK_BY_ID[id]).filter(Boolean).sort((a, b) => a.title.localeCompare(b.title))

/* ── /library's rows: one per book ── */
const strip = (src = '') => src.replace(/^---\n[\s\S]*?\n---\n?/, '').replace(/^\s*# .*\n/, '')
/* a chapter's headings one level down — not the lines inside a code block (a `# comment` in a shell block stays one) */
const down = (src) => {
  let fence = null
  return src.split('\n').map((l) => {
    const f = /^\s*(`{3,}|~{3,})/.exec(l)
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence) fence = null; return l }
    return fence ? l : l.replace(/^(#{1,5}) /, '#$1 ')
  }).join('\n')
}
/* a book of chapters reads as one page: its title, then each chapter under its own heading (the chapter's own headings one
   level down, so the contents rail lists the chapters) */
/* a chapter in the chosen language: its twin's text when it has one in that language */
const inLang = (d, lang) => { const t = lang && d.twins?.find((x) => x.lang === lang); return t ? BY_KEY[t.key] : d }
export const bookSourceIn = (book, lang) => bookSource({ ...book, chapters: book.chapters.map((d) => ({ ...inLang(d, lang), chapter: d.chapter })) })
export const twinLangs = (book) => [...new Set(book.chapters.flatMap((d) => (d.twins ?? []).map((t) => t.lang)))]
export const bookSource = (book) => (book.chapters.length > 1
  ? `# ${book.title}\n\n${book.chapters.map((d) => `## ${d.chapter}\n\n${down(strip(d.source))}`).join('\n\n')}`
  : book.chapters[0].source)

const LIBRARY_SHELVES = [...CLASSES.map((c) => ({ id: c.id, label: c.label })), { id: 'reference', label: 'Reference desk' }]
const bookRow = (b) => {
  const first = b.chapters[0]
  return {
    id: first.id,
    collection: first.collection,
    bookId: b.id,
    title: b.title,
    folder: b.shelf,
    to: b.to,
    files: b.originals,
    lang: b.langs.join(', '),
    kind: first.kind,
    date: b.date,
    call: b.call,
    callParts: b.callParts,
    chapters: b.chapters.length,
    record: b.records[0] ?? null,
    get source() { return bookSource(b) },
  }
}
const bookRows = BOOKS.map(bookRow)
export const CATALOGUE = {
  rows: bookRows,
  folders: LIBRARY_SHELVES.map((s) => ({ ...s, label: `${s.label} (${bookRows.filter((r) => r.folder === s.id).length})` })),
  pages: LIBRARY_SHELVES.map((s) => ({ to: `/library/${s.id}`, label: s.label })),
}
export const rowOfBook = (b) => bookRows.find((r) => r.bookId === b.id)
