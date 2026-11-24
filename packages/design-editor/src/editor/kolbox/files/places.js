import { useSyncExternalStore } from 'react'

/* WHERE A FILE LIVES (plan-2026-11-19-kolbox-whats-left C8, W30.3 and 30.4): the account's folders, the ONE folder each file
 * is in, and what each file keeps with it (its media, its theme). A file is the engine's stored preset (the library,
 * `kol.editor.library.v3`); its validator keeps only the fields it knows, so the place is held here, by file id, and
 * a file with no entry is in Drafts.
 * THE BACKEND SEAM: kol-fxr's D1 holds folders and files per account; this repo is not connected, so this module is the
 * local stand-in and its calls are the ones a backend replaces: listFolders, createFolder, placeOf, moveFile,
 * keepOf/setKeep, trashFile/restoreFile, toggleStar, renameFolder/removeFolder (and forget, on delete). Each answers at once from this browser's storage; a backend makes them async
 * behind the same names and pushes `kolbox:places` when the account's rows change. */
const KEY = 'kolbox.places.v1'
export const DRAFTS = { id: 'drafts', name: 'Drafts', builtIn: true }
/* what a new file keeps, by default: its media (photos as data in the file) and its theme (the palette) */
export const KEEP_DEFAULT = { media: true, theme: true }

const EMPTY = { folders: [], placeOf: {}, keepOf: {}, trashed: {}, starred: [] }
let cache = null
function read() {
  if (cache) return cache
  try { cache = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || 'null') } } catch { cache = { ...EMPTY } }
  return cache
}
function write(next) {
  cache = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch (e) { console.warn('places: could not save to this browser:', e?.message || e) }
  window.dispatchEvent(new CustomEvent('kolbox:places'))
}
const subscribe = (on) => {
  const storage = (e) => { if (e.key === KEY) { cache = null; on() } }
  window.addEventListener('kolbox:places', on)
  window.addEventListener('storage', storage)
  return () => { window.removeEventListener('kolbox:places', on); window.removeEventListener('storage', storage) }
}

/* Drafts first, then the account's folders in the order they were made */
export const listFolders = () => [DRAFTS, ...read().folders]
export const folderOf = (id) => listFolders().find((f) => f.id === id) ?? DRAFTS
export function createFolder(name) {
  const n = String(name ?? '').trim()
  if (!n) return null
  const s = read()
  const hit = s.folders.find((f) => f.name.toLowerCase() === n.toLowerCase())
  if (hit) return hit.id
  const id = `f-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  write({ ...s, folders: [...s.folders, { id, name: n, created: Date.now() }] })
  return id
}
/* the folder a file lives in; Drafts when it has none (every file saved before this) */
export const placeOf = (fileId) => (read().placeOf[fileId] && listFolders().some((f) => f.id === read().placeOf[fileId]) ? read().placeOf[fileId] : DRAFTS.id)
export function moveFile(fileId, folderId) {
  if (!fileId) return
  const s = read()
  write({ ...s, placeOf: { ...s.placeOf, [fileId]: folderId || DRAFTS.id } })
}
export const keepOf = (fileId) => ({ ...KEEP_DEFAULT, ...(read().keepOf[fileId] ?? {}) })
export function setKeep(fileId, keep) {
  if (!fileId) return
  const s = read()
  write({ ...s, keepOf: { ...s.keepOf, [fileId]: { ...KEEP_DEFAULT, ...keep } } })
}
/* a removed file leaves no place, no trash entry and no star behind */
export function forget(fileId) {
  const s = read()
  const { [fileId]: _p, ...placeOf } = s.placeOf
  const { [fileId]: _k, ...keepOf } = s.keepOf
  const { [fileId]: _t, ...trashed } = s.trashed
  write({ ...s, placeOf, keepOf, trashed, starred: s.starred.filter((x) => x !== fileId) })
}

/* Trash, as Figma's file browser has it: Delete moves a file there (it keeps its folder), Restore brings it back to that
   folder; the time it was trashed, for Trash's "Date trashed" order */
export const trashedAt = (fileId) => read().trashed[fileId] ?? null
export function trashFile(fileId) {
  const s = read()
  write({ ...s, trashed: { ...s.trashed, [fileId]: Date.now() }, starred: s.starred.filter((x) => x !== fileId) })
}
export function restoreFile(fileId) {
  const s = read()
  const { [fileId]: _t, ...trashed } = s.trashed
  write({ ...s, trashed })
}

/* Starred: file and folder ids, in the order they were starred */
export const starredIds = () => read().starred
export const isStarred = (id) => read().starred.includes(id)
export function toggleStar(id) {
  const s = read()
  write({ ...s, starred: s.starred.includes(id) ? s.starred.filter((x) => x !== id) : [...s.starred, id] })
}

/* a folder's own rows: Rename, and Delete, whose files go to Trash and come back to Drafts */
export function renameFolder(id, name) {
  const n = String(name ?? '').trim()
  const s = read()
  if (n) write({ ...s, folders: s.folders.map((f) => (f.id === id ? { ...f, name: n } : f)) })
}
export function removeFolder(id) {
  const s = read()
  const now = Date.now()
  const inside = Object.keys(s.placeOf).filter((f) => s.placeOf[f] === id)
  const trashed = { ...s.trashed }
  inside.forEach((f) => { trashed[f] ??= now })
  write({ ...s, folders: s.folders.filter((f) => f.id !== id), trashed, starred: s.starred.filter((x) => x !== id) })
}

/* React: re-render when the places change (here or in another tab) */
export function usePlaces() {
  return useSyncExternalStore(subscribe, read, read)
}
