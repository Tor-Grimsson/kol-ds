/* THE FAKE D1 — olina's database beside the bucket, imagined (plan v2, 2026-09-26).
 *
 * What a bucket cannot hold: tags, favourites, the event log recents are read from, smart folders,
 * and the person's view settings. One user, ever (user ruling) — so no person column, no
 * conflicts. Drafts are NOT here: they are browser memory, the DS keeps them (ruling, same day).
 *
 * The tables, as olina would declare them:
 *   file_tags     (file_id, tag)                   → Map file id → tags
 *   file_meta     (file_id, favourite)             → Set of favourite file ids
 *   folder_meta   (bucket, path, tags, favourite)  → Map `${bucket}:${path}` → { tags, favourite }
 *   events        (at, bucket, kind, file_id?, path?) → array, newest last
 *   smart_folders (id, bucket, name, query)        → array
 *   settings      (bucket, json)                   → browser storage, so it survives a reload the
 *                                                     way a D1 row does; everything else resets with
 *                                                     the bucket, since its rows point into it
 *
 * Synchronous, like the bucket; the client makes it async. */

import { SEED_TAGS, SEED_D1 } from './seed.js'

export const normalizeTags = (tags) => [...new Set((tags ?? []).map((t) => String(t).trim().toLowerCase()).filter(Boolean))]

let fileTags = new Map()
let favourites = new Set()
let folderMeta = new Map()
let events = []
let smart = []
let smartSeq = 0

const fk = (bucket, path) => `${bucket}:${path}`

/** Back to seed. `idOf(bucket, key)` resolves the seed's keys to the bucket's fresh ids. */
export function reset({ idOf }) {
  fileTags = new Map(); favourites = new Set(); folderMeta = new Map(); events = []; smart = []; smartSeq = 0
  for (const [bucket, byKey] of Object.entries(SEED_TAGS)) {
    for (const [key, tags] of Object.entries(byKey)) { const id = idOf(bucket, key); if (id) fileTags.set(id, normalizeTags(tags)) }
  }
  const seed = SEED_D1 ?? {}
  for (const [bucket, keys] of Object.entries(seed.favourites ?? {})) for (const key of keys) {
    if (key.endsWith('/')) folderMeta.set(fk(bucket, key), { ...(folderMeta.get(fk(bucket, key)) ?? { tags: [] }), favourite: true })
    else { const id = idOf(bucket, key); if (id) favourites.add(id) }
  }
  for (const [bucket, byPath] of Object.entries(seed.folderTags ?? {})) for (const [path, tags] of Object.entries(byPath)) {
    folderMeta.set(fk(bucket, path), { favourite: false, ...(folderMeta.get(fk(bucket, path)) ?? {}), tags: normalizeTags(tags) })
  }
  const now = Date.now()
  for (const e of seed.events ?? []) {
    const id = e.key && !e.key.endsWith('/') ? idOf(e.bucket, e.key) : null
    events.push({ at: new Date(now - e.minutesAgo * 60_000).toISOString(), bucket: e.bucket, kind: e.kind, ...(id ? { fileId: id } : { path: e.key }) })
  }
  events.sort((a, b) => a.at.localeCompare(b.at))
  for (const sf of seed.smartFolders ?? []) smart.push({ id: `s${++smartSeq}`, ...sf })
}

// ── file_tags · file_meta ────────────────────────────────────────────────
export const tagsOfFile = (id) => [...(fileTags.get(id) ?? [])]
export function setFileTags(id, tags) { const t = normalizeTags(tags); if (t.length) fileTags.set(id, t); else fileTags.delete(id); return t }
export const isFavourite = (id) => favourites.has(id)
export function setFavourite(id, on) { if (on) favourites.add(id); else favourites.delete(id); return !!on }

// ── folder_meta ──────────────────────────────────────────────────────────
export function folderInfo(bucket) {
  const out = {}
  for (const [k, v] of folderMeta) if (k.startsWith(`${bucket}:`)) out[k.slice(bucket.length + 1)] = { tags: [...v.tags], favourite: !!v.favourite }
  return out
}
const folderRow = (bucket, path) => folderMeta.get(fk(bucket, path)) ?? { tags: [], favourite: false }
export function setFolderTags(bucket, path, tags) { const t = normalizeTags(tags); folderMeta.set(fk(bucket, path), { ...folderRow(bucket, path), tags: t }); return t }
export function setFolderFavourite(bucket, path, on) { folderMeta.set(fk(bucket, path), { ...folderRow(bucket, path), favourite: !!on }); return !!on }

/** A folder moved: its rows, and every sub-folder's, follow the path. File rows need nothing —
 *  they are keyed by id, which a move does not change. */
export function movePath(bucket, from, to) {
  for (const [k, v] of [...folderMeta]) {
    if (!k.startsWith(`${bucket}:`)) continue
    const path = k.slice(bucket.length + 1)
    if (path !== from && !path.startsWith(from)) continue
    folderMeta.delete(k)
    folderMeta.set(fk(bucket, to + path.slice(from.length)), v)
  }
  for (const e of events) if (e.bucket === bucket && e.path && (e.path === from || e.path.startsWith(from))) e.path = to + e.path.slice(from.length)
}

/** Files purged from the trash for good: their rows go with them. */
export function dropFiles(ids) {
  for (const id of ids) { fileTags.delete(id); favourites.delete(id) }
  events = events.filter((e) => !e.fileId || !ids.includes(e.fileId))
}

// ── events ───────────────────────────────────────────────────────────────
/* INTENTIONS, not interactions (olina's schema note): opened in Quick Look, opened in the editor,
 * saved, uploaded, created. Never a hover or a keystroke. */
export function logEvent(bucket, kind, ref) {
  events.push({ at: new Date().toISOString(), bucket, kind, ...ref })
  if (events.length > 500) events = events.slice(-500)
}
/** The newest event per file or folder, newest first. */
export function recent(bucket, limit = 12) {
  const seen = new Set()
  const out = []
  for (let i = events.length - 1; i >= 0 && out.length < limit; i--) {
    const e = events[i]
    if (e.bucket !== bucket) continue
    const ref = e.fileId ?? e.path
    if (seen.has(ref)) continue
    seen.add(ref)
    out.push({ ...e })
  }
  return out
}

// ── smart_folders ────────────────────────────────────────────────────────
export const smartFolders = (bucket) => smart.filter((s) => s.bucket === bucket).map((s) => ({ ...s, query: { ...s.query } }))
export function saveSmartFolder(bucket, { id, name, query }) {
  const clean = { tags: normalizeTags(query?.tags), kinds: [...(query?.kinds ?? [])], text: String(query?.text ?? '').trim() }
  const at = id ? smart.findIndex((s) => s.id === id) : -1
  const row = { id: at >= 0 ? id : `s${++smartSeq}`, bucket, name: String(name || 'Smart folder').trim(), query: clean }
  if (at >= 0) smart[at] = row; else smart.push(row)
  return { ...row }
}
export function deleteSmartFolder(id) { smart = smart.filter((s) => s.id !== id); return { ok: true } }

// ── settings ─────────────────────────────────────────────────────────────
const SETTINGS_KEY = 'media-fixture.d1.settings'
const readSettings = () => { try { return JSON.parse(globalThis.localStorage?.getItem(SETTINGS_KEY) ?? '{}') || {} } catch { return {} } }
const writeSettings = (all) => { try { globalThis.localStorage?.setItem(SETTINGS_KEY, JSON.stringify(all)) } catch { /* private mode: this session only */ } }
let memorySettings = null // node / no storage
export function loadSettings(bucket) {
  const all = globalThis.localStorage ? readSettings() : (memorySettings ?? {})
  return all[bucket] ?? null
}
export function saveSettings(bucket, settings) {
  const all = globalThis.localStorage ? readSettings() : (memorySettings ??= {})
  if (settings === null) delete all[bucket]; else all[bucket] = settings
  if (globalThis.localStorage) writeSettings(all)
  return settings
}
