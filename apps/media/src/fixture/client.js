/* The fixture wearing kol-media-client's shape. This is what replaces
 * kol-r2b2's `src/lib/client.js` — same seams, same call signatures, no fetch
 * behind any of them, so the DS pages cannot tell the difference.
 *
 * It also carries the verbs a real bucket cannot offer (`createFolder`,
 * `uploadFile`, `reset`, `folderTree`). Those are the point of the app: the
 * operations get designed against something that can actually perform them. */

import * as store from './store.js'
import { fileUrl } from './assets-urls.js'
import { loadSettings as loadLocal, saveSettings as saveLocal, resetSettings } from '../lib/settings.js'

const urlFor = (key, bucket = 'r2') =>
  store.urlOf(bucket, key) ?? fileUrl(store.fileOf(bucket, key)) ?? `fixture:///${key}`

export const fixtureClient = {
  // ── kol-media-client's read surface ──────────────────────────────
  buckets: () => store.buckets(),

  async listMedia(prefix = '', { bucket } = {}) {
    return store.list(bucket ?? 'r2', prefix)
  },

  /* An uploaded file's own bytes, else the real file the seed carries. Nothing is generated: a
   * key with neither gets the fixture scheme and renders as the generic file icon. */
  mediaUrl: (key, bucket) => urlFor(key, bucket),
  downloadUrl: (key, bucket) => urlFor(key, bucket),
  proxied: (url) => url,

  // ── the write seams that make the pages writable ─────────────────
  async deleteObject(key, bucket) { return store.remove(bucket ?? 'r2', key) },
  async renameObject(from, to, bucket) { return store.rename(bucket ?? 'r2', from, to) },

  // ── what a key-prefix bucket cannot do, and this app exists to design ──
  async createFolder(path, bucket) { return store.createFolder(bucket ?? 'r2', path) },
  /* A NEW, EMPTY FILE. The store already had `put`; nothing called it with no bytes. A file
   * manager that can make a folder but not a text file is half a file manager. */
  /* Typed by its EXTENSION (`notes.md` is markdown, `a.json` JSON) and truly empty — `data:,` is
   * zero bytes. */
  async createFile(key, bucket) { return store.put(bucket ?? 'r2', key, { size: 0, url: 'data:,' }) },
  async uploadFile(file, key, bucket) {
    const url = typeof Blob !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : undefined
    return store.put(bucket ?? 'r2', key, { size: file?.size, contentType: file?.type, url })
  },
  async copyObject(from, to, bucket) { return store.copy(bucket ?? 'r2', from, to) },

  // ── the trash ──
  trashList: (bucket) => store.trashList(bucket),
  async restore(id) { return store.restore(id) },
  async purge(id) { return store.purge(id) },
  async emptyTrash(bucket) { return store.emptyTrash(bucket) },

  // ── what D1 holds beside the bucket (the media D1 pass, 2026-09-25) ──
  /* Tags ride the listed objects (`o.tags`); this is the one write. */
  async setTags(key, tags, bucket) { return store.setTags(bucket ?? 'r2', key, tags) },
  /* `{ text, draft }` — the file's text (saved here, else its bytes) and the pending draft, or null.
   * Reading the bytes is a fetch of the file's own URL (a data: URL or a bundled asset), not a
   * provider: nothing leaves the page. */
  async readText(key, bucket) {
    const b = bucket ?? 'r2'
    const { text, draft } = store.textOf(b, key)
    if (text != null) return { text, draft }
    const url = urlFor(key, b)
    const bytes = url.startsWith('fixture:') ? '' : await fetch(url).then((r) => r.text()).catch(() => '')
    return { text: bytes, draft }
  },
  async saveDraft(key, draft, bucket) { return store.saveDraft(bucket ?? 'r2', key, draft) },
  async writeText(key, text, bucket) { return store.writeText(bucket ?? 'r2', key, text) },
  /* Per-person view settings. In kol-olina a row per person in D1; here the browser's own storage
   * (lib/settings.js), which is what the app already used — it just moved behind the client. */
  async loadSettings(bucket) { return loadLocal(bucket ?? 'r2') },
  async saveSettings(bucket, settings) { if (settings === null) return resetSettings(bucket ?? 'r2'); saveLocal(bucket ?? 'r2', settings); return settings },

  folderTree: () => store.folderTree(),
  reset: () => store.reset(),
}

export default fixtureClient
