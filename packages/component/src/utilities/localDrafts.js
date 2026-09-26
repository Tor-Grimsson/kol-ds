/**
 * localDrafts — a text file's unsaved edit, in BROWSER memory (media D1 plan v2, user ruling
 * 2026-09-26: "draft saves can rely on browser memory … only what's needed goes to D1"). A draft is
 * work in progress on one device; the database holds what must outlive the device. So the DS keeps
 * drafts itself, keyed by bucket + file key, and no client needs a draft verb.
 *
 * Every write announces itself on `window` (`kol-media-drafts`), so a list elsewhere on the page
 * (a Home shelf, the "unsaved draft" mark) re-reads without prop drilling. Storage can be missing
 * or full (private mode, a quota) — every call degrades to "no draft", never to a throw.
 */
const PREFIX = 'kol-media-draft:'
const EVENT = 'kol-media-drafts'
const store = () => { try { return globalThis.localStorage ?? null } catch { return null } }
const k = (bucket, key) => `${PREFIX}${bucket ?? ''}:${key}`
const announce = () => { try { globalThis.dispatchEvent?.(new Event(EVENT)) } catch { /* no window */ } }

export const DRAFTS_EVENT = EVENT

/** `{ text, at }` (at = epoch ms) or null */
export function readDraft(bucket, key) {
  try { const raw = store()?.getItem(k(bucket, key)); return raw ? JSON.parse(raw) : null } catch { return null }
}
export function writeDraft(bucket, key, text) {
  try { store()?.setItem(k(bucket, key), JSON.stringify({ text, at: Date.now() })); announce() } catch { /* quota */ }
}
export function clearDraft(bucket, key) {
  try { store()?.removeItem(k(bucket, key)); announce() } catch { /* nothing to clear */ }
}
/** every draft in a bucket, newest first — `[{ key, at, size }]` */
export function listDrafts(bucket) {
  const s = store()
  if (!s) return []
  const head = k(bucket, '')
  const out = []
  for (let i = 0; i < s.length; i++) {
    const name = s.key(i)
    if (!name?.startsWith(head)) continue
    try { const d = JSON.parse(s.getItem(name)); out.push({ key: name.slice(head.length), at: d.at, size: d.text?.length ?? 0 }) } catch { /* a foreign value */ }
  }
  return out.sort((a, b) => b.at - a.at)
}
/** a file or a folder moved: its drafts follow (a folder is a path ending in `/`) */
export function moveDrafts(bucket, from, to) {
  const moved = listDrafts(bucket).filter((d) => d.key === from || (from.endsWith('/') && d.key.startsWith(from)))
  for (const d of moved) {
    const draft = readDraft(bucket, d.key)
    try { store()?.removeItem(k(bucket, d.key)); store()?.setItem(k(bucket, to + d.key.slice(from.length)), JSON.stringify(draft)) } catch { /* quota */ }
  }
  if (moved.length) announce()
}
