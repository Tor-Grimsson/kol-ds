/* The fixture wearing kol-media-client's shape — the imagined olina setup, a bucket with a D1
 * beside it (plan v2, 2026-09-26). Same seams and call signatures a real client has, no fetch
 * behind any of them, so the DS pages cannot tell the difference.
 *
 * Two stores, kept apart on purpose: `bucket.js` is what R2 holds (bytes, keys, folders, trash),
 * `d1.js` is what the database holds (tags, favourites, events, smart folders, settings). Each verb
 * below says which one it touches, so the line olina's real client would draw is drawn here too.
 *
 * `createFixtureClient({ settings })` — an app may keep its own settings pair (`{ load(bucket),
 * save(bucket, settings | null) }`); without one they are the fake D1's. */

import * as bucket from './bucket.js'
import * as d1 from './d1.js'
import { fileUrl } from './assets-urls.js'

d1.reset({ idOf: bucket.idOf })

const B = (b) => b ?? 'r2'
const urlFor = (key, b = 'r2') =>
  bucket.urlOf(b, key) ?? fileUrl(bucket.fileOf(b, key)) ?? `fixture:///${key}`
const isDir = (p) => p.endsWith('/')

export function createFixtureClient({ settings } = {}) {
  return {
    // ── the bucket: read ────────────────────────────────────────────────
    buckets: () => bucket.buckets(),
    /* the listing, with the D1 rows joined on — as olina's /api/list joins `files` to its tags */
    async listMedia(prefix = '', { bucket: b } = {}) {
      return bucket.list(B(b), prefix).map((o) => ({ ...o, tags: d1.tagsOfFile(o.id), favourite: d1.isFavourite(o.id) }))
    },
    /* An uploaded or saved file's own bytes, else the real file the seed carries. */
    mediaUrl: (key, b) => urlFor(key, B(b)),
    downloadUrl: (key, b) => urlFor(key, B(b)),
    proxied: (url) => url,
    folderTree: () => bucket.folderTree(),

    // ── the bucket: write ───────────────────────────────────────────────
    async deleteObject(key, b) { return bucket.remove(B(b), key) },
    async renameObject(from, to, b) {
      const r = bucket.rename(B(b), from, to)
      if (isDir(r.from ?? from)) d1.movePath(B(b), r.from, r.to) // folder rows are keyed by path; file rows by id
      return r
    },
    async createFolder(path, b) { return bucket.createFolder(B(b), path) },
    /* A NEW FILE, empty or with a first text (the document editor's New). Typed by its extension. */
    async createFile(key, b, text) {
      const r = bucket.put(B(b), key, { size: 0, url: 'data:,' })
      if (text != null) bucket.writeText(B(b), key, text)
      d1.logEvent(B(b), 'created', { fileId: bucket.idOf(B(b), key) })
      return r
    },
    async uploadFile(file, key, b) {
      const url = typeof Blob !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : undefined
      const r = bucket.put(B(b), key, { size: file?.size, contentType: file?.type, url })
      d1.logEvent(B(b), 'uploaded', { fileId: bucket.idOf(B(b), key) })
      return r
    },
    async copyObject(from, to, b) { return bucket.copy(B(b), from, to) },

    // ── the trash (bucket; a purge also drops the D1 rows) ────────────────
    trashList: (b) => bucket.trashList(b),
    async restore(id) { return bucket.restore(id) },
    async purge(id) { const r = bucket.purge(id); d1.dropFiles(r.fileIds); return r },
    async emptyTrash(b) { const r = bucket.emptyTrash(b); d1.dropFiles(r.fileIds); return r },

    // ── text: the bytes are the bucket's; drafts are the browser's, never here ──
    /* `{ text }` — what a save wrote, else the file's own bytes read from its URL (a data: URL or a
     * bundled asset: nothing leaves the page) */
    async readText(key, b) {
      const saved = bucket.textOf(B(b), key)
      if (saved != null) return { text: saved }
      const url = urlFor(key, B(b))
      const text = url.startsWith('fixture:') ? '' : await fetch(url).then((r) => r.text()).catch(() => '')
      return { text }
    },
    async writeText(key, text, b) {
      const r = bucket.writeText(B(b), key, text)
      d1.logEvent(B(b), 'edited', { fileId: bucket.idOf(B(b), key) })
      return r
    },

    // ── D1: tags · favourites · folders · events · smart folders ─────────
    /* one verb for files and folders: a path ending in `/` is a folder */
    async setTags(path, tags, b) {
      if (isDir(path)) return { path, tags: d1.setFolderTags(B(b), path, tags) }
      const id = bucket.idOf(B(b), path)
      if (!id) throw new Error(`${path} not found`)
      return { path, tags: d1.setFileTags(id, tags) }
    },
    async setFavourite(path, on, b) {
      if (isDir(path)) return { path, favourite: d1.setFolderFavourite(B(b), path, on) }
      const id = bucket.idOf(B(b), path)
      if (!id) throw new Error(`${path} not found`)
      return { path, favourite: d1.setFavourite(id, on) }
    },
    /* `{ [folderPath]: { tags, favourite } }` — the folder rows, read beside the listing */
    async folderInfo(b) { return d1.folderInfo(B(b)) },
    /* newest first, each resolved to its CURRENT key; a file since purged drops out */
    async recent(b, limit) {
      return d1.recent(B(b), limit).map((e) => {
        const key = e.fileId ? bucket.keyOfId(B(b), e.fileId) : e.path
        return key ? { kind: e.kind, at: e.at, key } : null
      }).filter(Boolean)
    },
    async logEvent(kind, path, b) {
      const ref = isDir(path) ? { path } : { fileId: bucket.idOf(B(b), path) }
      if (ref.path || ref.fileId) d1.logEvent(B(b), kind, ref)
      return { ok: true }
    },
    async smartFolders(b) { return d1.smartFolders(B(b)) },
    async saveSmartFolder(sf, b) { return d1.saveSmartFolder(B(b), sf) },
    async deleteSmartFolder(id) { return d1.deleteSmartFolder(id) },

    // ── D1: settings (or the app's own pair) ────────────────────────────
    async loadSettings(b) { return settings ? settings.load(B(b)) : d1.loadSettings(B(b)) },
    async saveSettings(b, s) { return settings ? settings.save(B(b), s) : d1.saveSettings(B(b), s) },

    /* Clear changes: the bucket and every D1 row pointing into it, back to seed. Settings stay — a
     * person's preferences are not "changes to the data". */
    reset: () => { bucket.reset(); d1.reset({ idOf: bucket.idOf }) },
  }
}

export const fixtureClient = createFixtureClient()
export default fixtureClient
