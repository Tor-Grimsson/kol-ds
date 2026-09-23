/* The fake tree, mutable, in session memory. No network, no provider, no
 * credentials — see docs/operations/07-apps-tier/01-tier-rules.md.
 *
 * A folder is a NODE here, not a prefix inferred from keys. That is the single
 * structural difference from the live bucket, and it is what gives create /
 * rename / move / delete something to act on. `listMedia` projects the tree
 * back down to the flat key list the DS pages already take, so the components
 * see exactly the shape they see in production.
 *
 * Every mutation is synchronous against this object. The client wrapper is what
 * makes the verbs async, because the pages await them. */

import { BUCKETS, SEED, contentTypeOf, uploadedOf } from './seed.js'
import { assetFile, assetSize, SEED_TRASH } from './assets.js'

const dir = (p) => (p.endsWith('/') || p === '' ? p : `${p}/`)
const parentOf = (path) => {
  const trimmed = path.replace(/\/$/, '')
  const i = trimmed.lastIndexOf('/')
  return i === -1 ? '' : trimmed.slice(0, i + 1)
}

function build() {
  const out = {}
  for (const { id } of BUCKETS) {
    const seed = SEED[id] ?? { folders: [], files: [] }
    const folders = new Set(seed.folders)
    const files = new Map()
    for (const key of seed.files) {
      /* `file` names the real bytes and rides the record through rename/copy, so a moved file
       * still previews as itself. */
      files.set(key, { key, contentType: contentTypeOf(key), size: assetSize(id, key) ?? 0, uploaded: uploadedOf(key), file: assetFile(id, key) })
      // Every ancestor of a seeded file exists as a folder even if the seed
      // forgot to list it — otherwise the tree and the keys could disagree.
      let p = parentOf(key)
      while (p) { folders.add(p); p = parentOf(p) }
    }
    out[id] = { folders, files }
  }
  return out
}

let tree = build()
/* THE TRASH (user 2026-09-23: *"a temporary trash location … a failsafe"*). Delete moves the
 * records here instead of dropping them; restore puts them back under their old path. Entries
 * older than TRASH_DAYS are purged whenever the trash is read. In a real bucket this is a
 * `.trash/` prefix with a lifecycle rule — the shape is the same: path, bytes, when. */
const TRASH_DAYS = 30
let trash = []
let trashSeq = 0

/** Back to seed. The reset control calls this; nothing else should. */
function seedTrash() {
  return Object.entries(SEED_TRASH).flatMap(([bucket, entries]) => entries.map((e) => {
    const keys = e.files ?? [e.path]
    return {
      id: `t${++trashSeq}`, bucket, path: e.path,
      deletedAt: new Date(Date.now() - e.daysAgo * 86_400_000).toISOString(),
      files: keys.map((key) => ({ key, contentType: contentTypeOf(key), size: assetSize(bucket, key) ?? 0, uploaded: uploadedOf(key), file: assetFile(bucket, key) })),
      folders: e.path.endsWith('/') ? [e.path] : [],
    }
  }))
}
trash = seedTrash()

export function reset() { tree = build(); trash = seedTrash() }

const bucketOf = (id) => tree[id] ?? tree[BUCKETS[0].id]

export const buckets = () => BUCKETS.map((b) => ({ ...b }))

/** Files under `prefix`, deepest included — the flat list the DS pages take. */
export function list(bucketId, prefix = '') {
  const { files } = bucketOf(bucketId)
  const out = []
  for (const f of files.values()) if (!prefix || f.key.startsWith(prefix)) out.push({ ...f })
  return out
}

/** The folders + tallies the column browser draws from. Live, not baked. */
export function folderTree() {
  const out = {}
  for (const { id } of BUCKETS) {
    const { folders, files } = bucketOf(id)
    const counts = {}
    let total = 0
    let bytes = 0
    for (const f of files.values()) {
      total += 1
      bytes += f.size
      // A folder's tally is everything BELOW it, not just direct children —
      // that is what a file browser shows.
      let p = parentOf(f.key)
      while (p) {
        const c = (counts[p] ??= { files: 0, bytes: 0 })
        c.files += 1
        c.bytes += f.size
        p = parentOf(p)
      }
    }
    // An empty folder still has a row, so it still needs a (zero) tally.
    for (const f of folders) counts[f] ??= { files: 0, bytes: 0 }
    out[id] = { folders: [...folders].sort(), counts, files: total, bytes }
  }
  return out
}

const assertWritable = (bucketId) => {
  const b = BUCKETS.find((x) => x.id === bucketId)
  if (!b?.writable) throw new Error(`Not available on ${b?.label ?? bucketId} — read-only`)
}

export function createFolder(bucketId, path) {
  assertWritable(bucketId)
  const p = dir(path)
  const { folders } = bucketOf(bucketId)
  if (folders.has(p)) throw new Error(`${p} already exists`)
  folders.add(p)
  let up = parentOf(p)
  while (up) { folders.add(up); up = parentOf(up) }
  return { ok: true, path: p }
}

/** Delete a file, or a folder and everything under it — into the trash, not out of existence. */
export function remove(bucketId, path) {
  assertWritable(bucketId)
  const { folders, files } = bucketOf(bucketId)
  const entry = { id: `t${++trashSeq}`, bucket: bucketId, path, deletedAt: new Date().toISOString(), files: [], folders: [] }
  if (files.has(path)) {
    entry.files.push(files.get(path))
    files.delete(path)
  } else {
    const p = dir(path)
    if (!folders.has(p)) throw new Error(`${path} not found`)
    for (const key of [...files.keys()]) if (key.startsWith(p)) { entry.files.push(files.get(key)); files.delete(key) }
    for (const f of [...folders]) if (f === p || f.startsWith(p)) { entry.folders.push(f); folders.delete(f) }
  }
  trash.push(entry)
  return { ok: true, deleted: entry.files.length, trashId: entry.id }
}

/** What is in the trash for a bucket, newest first; expired entries are purged on the way. */
export function trashList(bucketId) {
  const cutoff = Date.now() - TRASH_DAYS * 86_400_000
  trash = trash.filter((t) => Date.parse(t.deletedAt) >= cutoff)
  return trash
    .filter((t) => !bucketId || t.bucket === bucketId)
    .map((t) => ({
      id: t.id, bucket: t.bucket, path: t.path, deletedAt: t.deletedAt,
      isFolder: t.folders.length > 0, count: t.files.length,
      size: t.files.reduce((n, f) => n + (f.size || 0), 0),
      expiresAt: new Date(Date.parse(t.deletedAt) + TRASH_DAYS * 86_400_000).toISOString(),
    }))
    .reverse()
}

/** Put a trashed entry back where it was. Refuses if something has taken its place since. */
export function restore(id) {
  const t = trash.find((x) => x.id === id)
  if (!t) throw new Error('not in the trash')
  const { folders, files } = bucketOf(t.bucket)
  const clash = t.files.find((f) => files.has(f.key)) || t.folders.find((f) => folders.has(f))
  if (clash) throw new Error(`${clash.key ?? clash} already exists — rename it first`)
  for (const f of t.files) files.set(f.key, f)
  for (const f of t.folders) folders.add(f)
  for (const f of t.files) { let up = parentOf(f.key); while (up) { folders.add(up); up = parentOf(up) } }
  trash = trash.filter((x) => x !== t)
  return { ok: true, path: t.path }
}

/** Gone for good: one entry, or everything in a bucket's trash. */
export function purge(id) { trash = trash.filter((x) => x.id !== id); return { ok: true } }
export function emptyTrash(bucketId) { trash = trash.filter((x) => x.bucket !== bucketId); return { ok: true } }

/** Rename or move — one verb, because both are "this path becomes that path".
 *  On a folder it rewrites every descendant, which is the move a key-prefix
 *  bucket can only fake one object at a time. */
export function rename(bucketId, from, to) {
  assertWritable(bucketId)
  const { folders, files } = bucketOf(bucketId)

  if (files.has(from)) {
    if (files.has(to)) throw new Error(`${to} already exists`)
    const f = files.get(from)
    files.delete(from)
    files.set(to, { ...f, key: to })
    let up = parentOf(to)
    while (up) { folders.add(up); up = parentOf(up) }
    return { ok: true, from, to }
  }

  const src = dir(from)
  const dst = dir(to)
  if (!folders.has(src)) throw new Error(`${from} not found`)
  if (folders.has(dst)) throw new Error(`${to} already exists`)
  if (dst.startsWith(src)) throw new Error('cannot move a folder into itself')

  for (const key of [...files.keys()]) {
    if (!key.startsWith(src)) continue
    const f = files.get(key)
    const next = dst + key.slice(src.length)
    files.delete(key)
    files.set(next, { ...f, key: next })
  }
  for (const f of [...folders]) {
    if (f !== src && !f.startsWith(src)) continue
    folders.delete(f)
    folders.add(dst + f.slice(src.length))
  }
  let up = parentOf(dst)
  while (up) { folders.add(up); up = parentOf(up) }
  return { ok: true, from: src, to: dst }
}

/** Upload — the surface that exists twice in the estate and nowhere in a package.
 *  `url` is the uploaded file's own bytes (an object URL), so a dropped photo
 *  previews as itself; it rides the record, so a rename or move keeps it. */
export function put(bucketId, key, { size, contentType, url } = {}) {
  assertWritable(bucketId)
  const { folders, files } = bucketOf(bucketId)
  files.set(key, {
    key,
    contentType: contentType || contentTypeOf(key),
    size: size ?? 0,
    uploaded: new Date().toISOString(),
    ...(url && { url }),
  })
  let up = parentOf(key)
  while (up) { folders.add(up); up = parentOf(up) }
  return { ok: true, key }
}

/** Copy one file to a new key — the fixture half of the consumer Duplicate verb. */
export function copy(bucketId, from, to) {
  assertWritable(bucketId)
  const { folders, files } = bucketOf(bucketId)
  const f = files.get(from)
  if (!f) throw new Error(`${from} not found`)
  if (files.has(to)) throw new Error(`${to} already exists`)
  files.set(to, { ...f, key: to, uploaded: new Date().toISOString() })
  let up = parentOf(to)
  while (up) { folders.add(up); up = parentOf(up) }
  return { ok: true, from, to }
}

/** The uploaded bytes behind `key`, if it was uploaded this session. */
export const urlOf = (bucketId, key) => bucketOf(bucketId).files.get(key)?.url ?? null
export const fileOf = (bucketId, key) => bucketOf(bucketId).files.get(key)?.file ?? null

export { parentOf, dir }
