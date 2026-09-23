/* The fixture wearing kol-media-client's shape. This is what replaces
 * kol-r2b2's `src/lib/client.js` — same seams, same call signatures, no fetch
 * behind any of them, so the DS pages cannot tell the difference.
 *
 * It also carries the verbs a real bucket cannot offer (`createFolder`,
 * `uploadFile`, `reset`, `folderTree`). Those are the point of the app: the
 * operations get designed against something that can actually perform them. */

import * as store from './store.js'
import { fileUrl } from './assets-urls.js'

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

  folderTree: () => store.folderTree(),
  reset: () => store.reset(),
}

export default fixtureClient
