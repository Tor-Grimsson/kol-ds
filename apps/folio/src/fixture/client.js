/* THE FIXTURE CLIENT — what apps/folio hands Folio (src/folio/client.js has the contract). Thirteen short texts (data/:
   three public-domain books of three chapters, two public-domain pieces, one EN/DE twin, one invented sampler), two images
   and a tone in a fake private bucket (bucket/), everything in memory; a save, a new document, a
   convert and his edits persist in this browser (localStorage), so a reload keeps them. Reset: clear the two keys. */
import VAULT_BOOKS from './vault-books.json'

const FILES_KEY = 'folio-fixture-files'
const META_KEY = 'folio-fixture-meta'
const load = (k) => { try { return JSON.parse(localStorage.getItem(k) ?? '{}') } catch { return {} } }
const keep = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage blocked — the session keeps it */ } }

/* the corpus, keyed as record's globs were: data/<collection>/… */
const SHIPPED = Object.fromEntries(Object.entries(import.meta.glob('./data/**/*.md', { query: '?raw', import: 'default', eager: true }))
  .map(([k, v]) => [k.replace(/^\.\//, ''), v]))
const files = { ...SHIPPED, ...load(FILES_KEY) }
const meta = load(META_KEY)
const persist = () => {
  keep(FILES_KEY, Object.fromEntries(Object.entries(files).filter(([k, v]) => SHIPPED[k] !== v)))
  keep(META_KEY, meta)
}

/* the bucket: its files by key, served by Vite */
const ASSETS = Object.fromEntries(Object.entries(import.meta.glob('./bucket/**/*.{png,jpg,svg}', { query: '?url', import: 'default', eager: true }))
  .map(([k, v]) => [k.replace(/^\.\/bucket\//, ''), v]))
const BUCKET = { folders: [{ files: Object.keys(ASSETS).map((key) => ({ key, name: key.split('/').pop(), type: 'image/png' })) }] }

/* the four buckets record names (labels and hosts only — nothing here reaches them) */
const BUCKETS = [
  { id: 'private', label: 'Private', note: 'kol-private, private.kolkrabbi.io', host: 'private.kolkrabbi.io', upload: 2 },
  { id: 'r2', label: 'Media', note: 'kol-media, r2.kolkrabbi.io', host: 'r2.kolkrabbi.io', upload: 1 },
  { id: 'b2', label: 'Website', note: 'B2 kolkrabbi, b2.kolkrabbi.io', host: 'b2.kolkrabbi.io' },
  { id: 'b2vault', label: 'Vault', note: 'B2 kol-vault-media, b2v.kolkrabbi.io', host: 'b2v.kolkrabbi.io' },
]
const uploads = {}

const INDEXES = {
  bucket: BUCKET,
  originals: { base: '', files: [] },
  'vault-books': VAULT_BOOKS,
  duplicates: {},
  timeline: [],
  twins: [['documents/press-1863-en-gettysburg-address', 'documents/press-1863-de-gettysburg-address']],
  buckets: BUCKETS,
  signin: null,
}

const slugOf = (s) => String(s || 'untitled').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/\.\w+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled'
const NEW = 'data/documents/new/'
const idOf = (file) => `new/${file.slice(NEW.length).replace(/\.md$/, '')}`
const keyOfMeta = (fields) => Object.fromEntries(Object.entries(fields).filter(([k, v]) => ['title', 'shelf', 'book'].includes(k) && String(v ?? '').trim()))

export const fixtureClient = {
  list(bucket) {
    if (!bucket) return files
    const images = (uploads[bucket] ?? []).concat(bucket === 'r2' ? Object.entries(ASSETS).map(([key, url]) => ({ key, name: key.split('/').pop(), url, bucket })) : [])
    return Promise.resolve(images)
  },
  read: (name) => INDEXES[name],
  async save({ file, source }) {
    if (!(file in files)) throw new Error('not a library file')
    files[file] = source; persist()
    return { ok: true }
  },
  async create({ name, title, shelf, book, source, ext = 'md' }) {
    const slug = slugOf(name || title)
    let free = slug
    for (let i = 2; `${NEW}${free}.${ext}` in files; i++) free = `${slug}-${i}`
    const file = `${NEW}${free}.${ext}`
    files[file] = typeof source === 'string' ? source : ''
    const id = idOf(file)
    meta[`documents/${id}`] = keyOfMeta({ title, shelf, book })
    persist()
    return { ok: true, collection: 'documents', id, file }
  },
  async convert({ file, ext, source }) {
    if (!file.startsWith(NEW)) throw new Error('not a document written here')
    const to = file.replace(/\.\w+$/, `.${ext}`)
    if (to in files) throw new Error(`${to.split('/').pop()} exists`)
    delete files[file]; files[to] = source
    const oldKey = `documents/${idOf(file)}`, id = idOf(to)
    if (meta[oldKey]) { meta[`documents/${id}`] = meta[oldKey]; delete meta[oldKey] }
    persist()
    return { ok: true, collection: 'documents', id, file: to }
  },
  meta(fields) {
    if (!fields) return meta
    const { key, ...rest } = fields
    const kept = keyOfMeta(rest)
    if (Object.keys(kept).length) meta[key] = kept; else delete meta[key]
    persist()
    return Promise.resolve({ ok: true })
  },
  async upload({ bucket, name, source, type }) {
    const url = URL.createObjectURL(new Blob([source], { type }))
    ;(uploads[bucket] ??= []).push({ key: name, name, url, bucket })
    return { url }
  },
  assetUrl: (key) => ASSETS[key] ?? '',
  /* the code editor's check: JSON parses, and trailing whitespace (record's dev server checks every format) */
  async check({ ext, source }) {
    const problems = []
    if (ext === 'json') try { JSON.parse(source) } catch (e) { problems.push({ from: 0, to: Math.min(1, source.length), message: e.message, severity: 'error' }) }
    let at = 0
    for (const l of source.split('\n')) { const m = /[ \t]+$/.exec(l); if (m) problems.push({ from: at + m.index, to: at + l.length, message: 'Trailing whitespace', severity: 'warning' }); at += l.length + 1 }
    return { problems }
  },
}
