import documentTabs from './documentTabs.js'

/* DOCUMENT LIBRARY — a folder of markdown as one library: rows with a kind, a clean title, a date, a language and the
 * originals each one came from, grouped by folder. record's `library()` (kol-website apps/record/src/lib/documents.js),
 * made the DS's so brand and record read their documents the same way (DocumentLibraryAndBoardParts, kol-website
 * 2026-10-29 — *"Record and brand should treat markdown parsing and render the SAME WAY"*). `documentTabs` underneath.
 *
 *   documentLibrary(import.meta.glob('./data/documents/**\/*.md', { query: '?raw', import: 'default', eager: true }), {
 *     base: 'documents', root: './data/documents/', files: BUCKET_FILES })
 *   → { rows, folders, pages }
 *
 *   rows     [{ id, to, folder, title, kind, date, lang, files, source, file, group }]
 *            id       the path under `root`, no `.md` (`press/press-2011-en-tincan`) — two names in two folders never collide
 *            to       `/${base}/${id}`
 *            kind     the file name's first word through `kinds` (record's KINDS by default); '' when it names no kind
 *            title    a heading wins; a title that is only the file name is rebuilt without the kind, date, language and
 *                     `-01` counters
 *            date     the frontmatter `date`, else the file name's (`2024`, `2024-04`, `2024-04-28`)
 *            lang     the frontmatter `lang`, else the file name's language tokens, else the originals' — `IS, EN`
 *            files    the originals that belong to the row (`match`)
 *   folders  [{ id, label }] — a directory under `root`; `INDEX.md` is the folder's note, never a row ('' is the root)
 *   pages    [{ to, label }] — one per folder, for a rail
 *
 * Options
 *   base     the route the rows live under (default '')
 *   root     the glob prefix to strip (default '')
 *   files    the originals, from any source: `[{ key, name?, size?, type?, url? }]`, `key` the path under `root`'s twin
 *            (`press/press-2011-en-tincan.pdf`) — record passes its bucket manifest, brand its private URLs
 *   match    (row, files) => files — default `matchOriginals`: the file the frontmatter `description` names in the row's
 *            folder plus that folder's files sharing its stem; none named, the folder's files with the same stem once the
 *            language tokens are out (`about-2025-11-22-short.md` → `about-2025-11-22-en-short.pdf` + `-is-short.pdf`)
 *   kinds    `{ word: 'Label' }` — merged over KINDS; `false` turns kinds off
 *   langs    the language tokens (default `['is', 'en', 'de']`)
 *   label    (folderId, rows) => string — a folder's label (default its group, else `base`)
 */
export const KINDS = {
  application: 'Application', invitation: 'Invitation', recommendation: 'Recommendation', registration: 'Registration',
  artwork: 'Artwork', comment: 'Comment', pamphlet: 'Pamphlet', poster: 'Poster', programme: 'Programme', catalogue: 'Catalogue',
  about: 'About', cover: 'Cover letter', resume: 'Resume', cv: 'CV', testimonial: 'Testimonial', skills: 'Skills',
  erasmus: 'Erasmus', thesis: 'Thesis', press: 'Press', info: 'Info', lyrics: 'Lyrics', write: 'Writing',
}
export const LANGS = ['is', 'en', 'de']

const stemOf = (k) => k.split('/').pop().replace(/\.[^.]+$/, '')
const words = (s) => s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

export function matchOriginals(row, files, { langs = LANGS } = {}) {
  const bare = (s) => s.split('-').filter((t) => !langs.includes(t)).join('-')
  const named = /([\w.-]+\.(?:pdf|jpe?g|png|webp|svg|docx?))/i.exec(/^description:.*$/m.exec(row.source)?.[0] ?? '')?.[1]
  const inFolder = files.filter((f) => (row.folder ? f.key.startsWith(`${row.folder}/`) : !f.key.includes('/')))
  const original = inFolder.find((f) => f.key === (row.folder ? `${row.folder}/${named}` : named))
  /* the named file, then its siblings by stem (record's) and its language twins (the IS beside a named EN) */
  if (original) return [original, ...inFolder.filter((f) => f !== original && (stemOf(f.key).startsWith(stemOf(original.key)) || bare(stemOf(f.key)) === bare(stemOf(original.key))))]
  return inFolder.filter((f) => bare(stemOf(f.key)) === bare(row.stem))
}

export function kindAndTitle(stem, title, { kinds = KINDS, langs = LANGS } = {}) {
  const first = stem.split(/[-_ ]/)[0].toLowerCase()
  const kind = (kinds && kinds[first]) || ''
  const fromName = title === stem || title === words(stem) || title.toLowerCase() === words(stem).toLowerCase()
  let t = fromName
    ? words(stem.split('-').filter((x, i) => !(i === 0 && kind) && !(first === 'cover' && x === 'letter') && !langs.includes(x) && !/^\d{4}$/.test(x) && !/^\d{2}$/.test(x)).join('-'))
    : title.replace(/\s+—\s+\d{4}-\d{2}-\d{2}/, '').replace(/,\s*\d{4}(?=$|\s\()/, '').replace(/\s+—\s+\d{4}$/, '')
  if (kind && !fromName) t = t.replace(new RegExp(`^${kind}\\s+—\\s+`, 'i'), '')
  if (fromName) t = t.replace(/^[a-z]/, (c) => c.toUpperCase())
  return { kind, title: t || kind }
}

export default function documentLibrary(modules = {}, { base = '', root = '', files = [], match = matchOriginals, kinds = {}, langs = LANGS, label } = {}) {
  const kindMap = kinds === false ? false : { ...KINDS, ...kinds }
  const tokens = (s) => s.split('-').filter((t) => langs.includes(t))
  const rows = documentTabs(modules, { root }).filter((r) => !/(^|\/)INDEX\.md$/.test(r.file)).map((r) => {
    const id = (root && r.file.startsWith(root) ? r.file.slice(root.length) : r.file).replace(/^\.?\//, '').replace(/\.md$/i, '')
    const folder = id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : ''
    const stem = id.split('/').pop()
    const own = match({ ...r, id, folder, stem }, files, { langs })
    const fm = (k) => new RegExp(`^${k}:\\s*["']?([^"'\\n]+)`, 'm').exec(r.source)?.[1]?.trim()
    /* `lang`, else the file name's tokens, else the originals' (one md holding both languages) */
    const lang = fm('lang')?.split(/[-,\s]+/).filter(Boolean)
      ?? (tokens(stem).length ? tokens(stem) : [...new Set(own.flatMap((f) => tokens(stemOf(f.key))))])
    return {
      ...r,
      id,
      to: `${base ? `/${base}` : ''}/${id}`,
      folder,
      /* the frontmatter's `date` (an archive carries the document's own), else the file name's */
      date: /^date:\s*["']?(\d{4}(?:-\d{2}){0,2})/m.exec(r.source)?.[1] ?? /-(\d{4}(?:-\d{2}){0,2})(?=-|$)/.exec(stem)?.[1] ?? '',
      lang: lang.map((t) => t.toUpperCase()).join(', '),
      ...kindAndTitle(stem, r.title, { kinds: kindMap, langs }),
      files: own,
    }
  })
  const folders = [...new Set(rows.map((r) => r.folder))].map((id) => {
    const in_ = rows.filter((r) => r.folder === id)
    return { id, label: label ? label(id, in_) : (in_[0].group || base) }
  })
  return { rows, folders, pages: folders.map((f) => ({ to: `${base ? `/${base}` : ''}${f.id ? `/${f.id}` : ''}`, label: f.label })) }
}

/* a [[wikilink]] or relative .md link → its row's page, matched by file name within the library; anything else as written */
export const libraryLinks = (library) => (url) => {
  if (/^https?:|^mailto:|^#/.test(url)) return url
  const stem = url.replace(/\|.*$/, '').replace(/\.md(#.*)?$/, '').split('/').pop()
  return library.rows.find((r) => r.id.split('/').pop() === stem)?.to ?? url
}
