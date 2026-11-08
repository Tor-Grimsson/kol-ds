/* THE LIBRARY — one shelf for every document the studio keeps (Documents · the founder archive · brand's business docs),
 * shelved by a CALL NUMBER computed from what a document is, never from the folder it came from: class · kind · date ·
 * language. The folders stay on disk; they become ORIGIN, a filter. The founder registry is the reference desk, not stock.
 * Brief: https://claude.ai/artifact/JrePi2nY96ftSTDn6ZSm1L · playbook .kol/llm-context/playbook/2026-11-01-library.md */
import { documentLibrary, matchOriginals } from '@kolkrabbi/kol-framework'
import { client } from '../folio/client'
import { glob } from './files'
import { DOCUMENTS, FOUNDER } from './documents'

const ORIGINALS = client().read('originals')
const VAULT_BOOKS = client().read('vault-books')

/* the six classes — what a document IS. `tone` is the cover's palette token, `deep` its saturated twin (the blur on a
 * demo-2 cover) (light ramp, ink stays black: a cover is an
 * object, it does not change with the theme) */
export const CLASSES = [
  { n: 1, id: 'studio', label: 'Studio', note: 'Definition, services, pitch, business plans', tone: 'var(--kol-palette-blue-light)', deep: 'var(--kol-palette-blue)' },
  { n: 2, id: 'self', label: 'Self', note: 'Bio, about, resumes, cover letters, testimonials', tone: 'var(--kol-palette-orange-light)', deep: 'var(--kol-palette-orange)' },
  { n: 3, id: 'applications', label: 'Applications', note: 'Applications, recommendations, registrations, invitations', tone: 'var(--kol-palette-teal-light)', deep: 'var(--kol-palette-teal)' },
  { n: 4, id: 'schooling', label: 'Schooling', note: 'Theses, Erasmus, coursework, catalogues', tone: 'var(--kol-palette-purple-light)', deep: 'var(--kol-palette-purple)' },
  { n: 5, id: 'work', label: 'Work', note: 'Artworks, music, posters, programmes, notes', tone: 'var(--kol-palette-green-light)', deep: 'var(--kol-palette-green)' },
  { n: 6, id: 'press', label: 'Press', note: 'Articles, reviews, interviews, replies', tone: 'var(--kol-palette-red-light)', deep: 'var(--kol-palette-red)' },
]
const BY_N = Object.fromEntries(CLASSES.map((c) => [c.n, c]))

/* kind (the file name's first word) → class + a three-letter code for the spine */
const KIND = {
  pitch: [1, 'PIT'], elevator: [1, 'PIT'], services: [1, 'SRV'], studio: [1, 'STU'], business: [1, 'PLN'], example: [1, 'PLN'],
  about: [2, 'ABT'], bio: [2, 'BIO'], cover: [2, 'CVL'], resume: [2, 'RES'], cv: [2, 'CV'], testimonial: [2, 'TST'], skills: [2, 'SKL'], torg: [2, 'ABT'],
  application: [3, 'APP'], invitation: [3, 'INV'], recommendation: [3, 'REC'], registration: [3, 'REG'],
  thesis: [4, 'THS'], erasmus: [4, 'ERA'], catalogue: [4, 'CAT'], lhi: [4, 'LHI'],
  artwork: [5, 'ART'], pamphlet: [5, 'PAM'], poster: [5, 'PST'], programme: [5, 'PRG'], lyrics: [5, 'LYR'], write: [5, 'WRI'], info: [5, 'INF'], hugmyndir: [5, 'NTS'],
  press: [6, 'PRS'], comment: [6, 'CMT'],
}
/* no kind word → a known prefix, else the folder decides (class + spine code); the deepest matching folder wins */
const PREFIX = { 'tsh-review': [6, 'REV'], 'tsh-bio': [5, 'BIO'], 'stef-': [3, 'REG'] }
const FOLDER = {
  'business/bio': [2, 'BIO'], business: [1, 'DOC'],
  'archive/docs-about': [2, 'ABT'], 'archive/docs-cv': [2, 'CV'], 'archive/docs-lhi': [4, 'CRS'],
  'archive/docs-lhi/lhi-ritgerdir': [4, 'ESS'], 'archive/docs-lhi/lhi-verkefni': [4, 'ASG'], 'archive/docs-lhi/lhi-rasmus': [4, 'ERA'],
  'archive/docs-art': [5, 'ART'], 'archive/docs-tsh': [5, 'MUS'], 'archive/docs-konsulat': [5, 'MUS'], 'archive/docs-ae': [5, 'ART'],
  'archive/docs-archive': [5, 'NTS'], cv: [2, 'CV'], applications: [3, 'APP'], lhi: [4, 'CRS'], art: [5, 'ART'], press: [6, 'PRS'],
  /* the five folders the tools read (2026-11-03, plan record-library W1.1): shelved by folder, the files stay where they are */
  letters: [2, 'CVL'], portfolio: [5, 'PRT'], studio: [1, 'STU'], prints: [5, 'PRN'], opportunities: [3, 'OPP'],
}
/* where a document came from — a filter, never a shelf */
const ORIGIN = { lhi: 'LHÍ', 'docs-lhi': 'LHÍ', 'frumkvaedi-2024': 'Frumkvæði', 'docs-tsh': 'Two Step Horror', 'docs-konsulat': 'Konsulat', 'docs-ae': 'Another Creation' }

const BUSINESS_FILES = ORIGINALS.files.map((key) => ({ key, name: key.split('/').pop(), url: `${ORIGINALS.base}/${key}` }))
const NAMED = { 'bio/about-letter': 'bio/about-2023-04-28-en-letter.pdf' }
const BUSINESS = documentLibrary(glob(/^data\/business\/.+\.md$/), {
  base: 'business', root: 'data/business/', files: BUSINESS_FILES,
  match: (row, files) => (NAMED[row.id] ? files.filter((f) => f.key === NAMED[row.id]) : matchOriginals(row, files)),
})

/* the five tool folders: no originals in kol-private; README is the folder's note, not a book */
const plain = (name) => documentLibrary(Object.fromEntries(Object.entries(glob(/^data\/(letters|portfolio|studio|prints|opportunities)\/[^/]+\.md$/))
  .filter(([k]) => k.includes(`/data/${name}/`) && !/\/README\.md$/.test(k))), { base: name, root: `data/${name}/` })
/* the vault's media notes as books (plan 2026-11-05-vault-media-books, written by scripts/import-vault.mjs): one folder per
   book, one file per chapter; the book's shelf and spine code come from books.json */
const VAULT = documentLibrary(glob(/^data\/vault\/.+\.md$/), { base: 'vault', root: 'data/vault/', kinds: false })
const VAULT_SHELF = { studio: 1, self: 2, work: 5 }
for (const [id, b] of Object.entries(VAULT_BOOKS)) FOLDER[`vault/${id}`] = [VAULT_SHELF[b.shelf] ?? 5, b.code ?? 'DOC']

const TOOLS = ['letters', 'portfolio', 'studio', 'prints', 'opportunities'].map((name) => [name, plain(name)])

/* DATES the file name does not carry (plan record-library W1.2, 2026-11-03) — each from a source, none guessed:
 * printed on the clipping (OCR text), or the Records row the article is (data/records/timeline.json). The Records row is
 * also the link back (W4.1). */
export const DATED = {
  'press/press-is-dv-interview-a-opolandi-kott': { date: '2010-12-19' }, /* printed: "19. desember 2010" */
  'press/press-is-frettabladid-48-stundir-i-berlin-01': { date: '2009-03' }, /* printed: "MARS 2009" — the four parts are one article */
  'press/press-is-frettabladid-48-stundir-i-berlin-02': { date: '2009-03' },
  'press/press-is-frettabladid-48-stundir-i-berlin-03': { date: '2009-03' },
  'press/press-is-frettabladid-48-stundir-i-berlin-04': { date: '2009-03' },
  'press/press-is-mbl-two-step-horror-lokkandi-drungi': { date: '2011', record: 'Two Step Horror — Living Room Music (review)' },
  'press/press-is-frettatiminn-two-step-horror-svol-sosa': { date: '2011', record: 'Two Step Horror — Living Room Music (review)' },
  'press/press-is-mbl-konsulat-innrasin-mikla-01': { date: '2020', record: 'Konsulat — "Innrásin mikla"' },
  'press/press-is-mbl-konsulat-innrasin-mikla-02': { date: '2020', record: 'Konsulat — "Innrásin mikla"' },
}
/* a dateline ("Reykjavík · July 2026", "júlí 2026") → YYYY-MM; a folder named for its year (`frumkvaedi-2024`) → YYYY */
const MONTHS = ['january|janúar', 'february|febrúar', 'march|mars', 'april|apríl', 'may|maí', 'june|júní', 'july|júlí', 'august|ágúst', 'september', 'october|október', 'november|nóvember', 'december|desember']
const fromDateline = (s = '') => {
  const m = String(s).toLowerCase().match(new RegExp(`(${MONTHS.join('|')})\\s+((?:19|20)\\d\\d)`))
  return m ? `${m[2]}-${String(MONTHS.findIndex((x) => x.split('|').includes(m[1])) + 1).padStart(2, '0')}` : ''
}
const fromFolder = (folder = '') => folder.match(/-((?:19|20)\d\d)(?:\/|$)/)?.[1] ?? ''

const word = (id) => id.split('/').pop().split(/[-_ ]/)[0].toLowerCase()
const byFolder = (path) => {
  const hit = Object.keys(FOLDER).filter((f) => path.startsWith(`${f}/`)).sort((a, b) => b.length - a.length)[0]
  return hit ? FOLDER[hit] : null
}
const byPrefix = (id) => {
  const name = id.split('/').pop().toLowerCase()
  return Object.entries(PREFIX).find(([p]) => name.startsWith(p))?.[1] ?? null
}

/* one row → a shelved book. `path` is the row's id under its collection (`founder` rows are `archive/…`) */
export function shelve(row, collection) {
  const path = collection === 'documents' || collection === 'founder' ? row.id : `${collection}/${row.id}`
  /* only a real date shelves (a letter's `date` is its dateline, "Reykjavík · July 2026") */
  const iso = /^\d{4}(-\d{2}){0,2}$/.test(row.date || '') ? row.date : ''
  const known = collection === 'documents' ? DATED[row.id] : null
  /* undated (audit 2026-11-05, 54 documents): a portfolio piece's own `year:`; a living document — the studio's texts, the
     registry, business, prints, opportunities, the vault books — dates from its `updated:`, the revision you are reading.
     An archived piece (press, art, coursework) never takes `updated:`: that is when it was filed, not written. */
  const own = (k) => new RegExp(`^${k}:\\s*["']?(\\d{4}(?:-\\d{2}){0,2})`, 'm').exec(/^---\n([\s\S]*?)\n---/.exec(row.source || '')?.[1] ?? '')?.[1]
  const living = ['studio', 'prints', 'business', 'opportunities', 'letters', 'vault'].includes(collection) || (collection === 'founder' && row.id.startsWith('registry/'))
  row = { ...row, date: iso || known?.date || fromDateline(/^date:\s*["']?([^"'\n]+)/m.exec(row.source || '')?.[1]) || fromFolder(row.folder) || own('year') || (living ? own('updated') : '') || '', record: known?.record ?? null }
  const [n, code] = (collection === 'vault' && byFolder(path)) || byPrefix(row.id) || KIND[word(row.id)] || byFolder(path) || [0, 'DOC']
  const year = (row.date || '').slice(0, 4)
  const origin = row.folder.split('/').map((s) => ORIGIN[s]).find(Boolean) || ''
  /* the call number's parts: class, kind, date, language (none when unknown) — drawn apart with a gap, never joined by · (user, 2026-11-04) */
  const callParts = [String(n || '?'), code, row.date || 'n.d.', ...(row.lang ? [row.lang] : [])]
  const call = callParts.join('\u2003')
  /* a title rebuilt from a file name's leftovers (`draft-1`, `short`) gets its kind back: "Resume, draft 1" */
  const bare = /^[a-z0-9-]+$/.test(row.title) && row.kind
  const title = bare ? `${row.kind}, ${row.title.replace(/-/g, ' ')}` : row.title
  return { ...row, title, collection, cls: BY_N[n] || null, code, year, origin, call, callParts, sortKey: collection === 'vault' ? `${n || 9}|${code}|${row.id}` : `${n || 9}|${code}|${row.date || '0000'}|${title}` }
}

const archive = FOUNDER.rows.filter((r) => r.id.startsWith('archive/') && !r.id.split('/').pop().startsWith('_'))

/* every book, in call-number order */
export const BOOKS = [
  ...DOCUMENTS.rows.map((r) => shelve(r, 'documents')),
  ...archive.map((r) => shelve(r, 'founder')),
  ...BUSINESS.rows.map((r) => shelve(r, 'business')),
  ...TOOLS.flatMap(([name, lib]) => lib.rows.map((r) => shelve(r, name))),
  ...VAULT.rows.map((r) => shelve(r, 'vault')),
].sort((a, b) => a.sortKey.localeCompare(b.sortKey))

/* the reference desk — the registry is the librarian's card index, not stock */
export const REFERENCE = FOUNDER.rows.filter((r) => r.id.startsWith('registry/'))

export const LIBRARIES = { documents: DOCUMENTS, founder: FOUNDER, business: BUSINESS, vault: VAULT, ...Object.fromEntries(TOOLS) }

/* THE LIBRARY AS ONE documentLibrary (plan record-library W2.1, 2026-11-03): a "folder" is a shelf — the six classes, then
 * the reference desk — so kol-styleguide's DocumentLibrary draws a table per shelf and DocumentView opens a document, the
 * same parts Documents uses. A document's address is `/library/<collection>/<its id>`; the files stay where they are. */
/* a shelf's name is its name — no number, no · in a title (user, 2026-11-04) */
const SHELVES = [...CLASSES.map((c) => ({ id: c.id, label: c.label })), { id: 'reference', label: 'Reference desk' }]
const libRow = (b) => ({ ...b, folder: b.cls?.id ?? 'reference', to: `/library/${b.collection}/${b.id}` })
const libRows = [...BOOKS.map(libRow), ...REFERENCE.map((r) => ({ ...shelve(r, 'founder'), cls: null, call: `R\u2003${r.id.split('/').pop()}`, callParts: ['R', r.id.split('/').pop()], folder: 'reference', to: `/library/founder/${r.id}` }))]
export const LIBRARY = {
  rows: libRows,
  folders: SHELVES.map((s) => ({ ...s, label: `${s.label} (${libRows.filter((r) => r.folder === s.id).length})` })),
  pages: SHELVES.map((s) => ({ to: `/library/${s.id}`, label: s.label })),
}

/* Records → Library (plan record-library W4.1): the documents a Records row is, keyed by the row's title (library.js `DATED`) */
export const DOCS_BY_RECORD = LIBRARY.rows.filter((r) => r.record).reduce((m, r) => ({ ...m, [r.record]: [...(m[r.record] ?? []), r] }), {})
