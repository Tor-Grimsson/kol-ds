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

import { BUCKETS, SEED, contentTypeOf, sizeOf, uploadedOf } from './seed.js'

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
      files.set(key, { key, contentType: contentTypeOf(key), size: sizeOf(key), uploaded: uploadedOf(key) })
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

/** Back to seed. The reset control calls this; nothing else should. */
export function reset() { tree = build() }

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

/** Delete a file, or a folder and everything under it. */
export function remove(bucketId, path) {
  assertWritable(bucketId)
  const { folders, files } = bucketOf(bucketId)
  if (files.has(path)) { files.delete(path); return { ok: true, deleted: 1 } }
  const p = dir(path)
  if (!folders.has(p)) throw new Error(`${path} not found`)
  let deleted = 0
  for (const key of [...files.keys()]) if (key.startsWith(p)) { files.delete(key); deleted += 1 }
  for (const f of [...folders]) if (f === p || f.startsWith(p)) folders.delete(f)
  return { ok: true, deleted }
}

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

/** Upload — the surface that exists twice in the estate and nowhere in a package. */
export function put(bucketId, key, { size, contentType } = {}) {
  assertWritable(bucketId)
  const { folders, files } = bucketOf(bucketId)
  files.set(key, {
    key,
    contentType: contentType || contentTypeOf(key),
    size: size ?? sizeOf(key),
    uploaded: new Date().toISOString(),
  })
  let up = parentOf(key)
  while (up) { folders.add(up); up = parentOf(up) }
  return { ok: true, key }
}

export { parentOf, dir }
