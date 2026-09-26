/* THE FAKE D1, second half — the NOTES and DECKS tables (notes and presentation as tools,
 * 2026-09-27). olina's D1 holds both beside the bucket's rows; these are those tables, imagined:
 *
 *   notes  (slug, title, body, favourite, updated_at)    — a note is a ROW with a markdown body
 *   decks  (slug, name, doc, favourite, updated_at)      — `doc` is `{ version: 1, slides }`
 *
 * In memory with a reset, like the rest of the fixture. Synchronous; the client makes it async.
 * Rows are handed out as copies, so a caller can never mutate the table behind the verbs. */

import { SEED_NOTES } from './seed.js'
import { seedDecks } from './deckSeed.js'

let notes = new Map()
let decks = new Map()

const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString()
const now = () => new Date().toISOString()
const copy = (v) => structuredClone(v)

export function reset() {
  notes = new Map(SEED_NOTES.map((n) => [n.slug, { slug: n.slug, title: n.title, body: n.body, favourite: !!n.favourite, updated_at: ago(n.minutesAgo) }]))
  decks = new Map(seedDecks().map((d) => [d.slug, { slug: d.slug, name: d.name, doc: { version: 1, slides: d.slides }, favourite: !!d.favourite, updated_at: ago(d.minutesAgo) }]))
}
reset()

const byNewest = (a, b) => b.updated_at.localeCompare(a.updated_at)

// ── notes ────────────────────────────────────────────────────────────────
/* titles and dates only — the list never ships bodies; `preview` is the head, cut as SQL would */
export const listNotes = () => [...notes.values()].sort(byNewest)
  .map(({ slug, title, body, favourite, updated_at }) => ({ slug, title, preview: body.slice(0, 240), favourite, updated_at }))
export function loadNote(slug) {
  const n = notes.get(slug)
  if (!n) throw new Error('No such note.')
  return copy(n)
}
/* upsert; `body` undefined keeps the stored one (a favourite toggle from the list) */
export function saveNote({ slug, title, body, favourite }) {
  if (!slug) throw new Error('A note needs a slug.')
  const was = notes.get(slug)
  const row = { slug, title: title ?? was?.title ?? '', body: body ?? was?.body ?? '', favourite: favourite ?? was?.favourite ?? false, updated_at: now() }
  notes.set(slug, row)
  return { slug, updated_at: row.updated_at }
}
export function deleteNote(slug) {
  if (!notes.delete(slug)) throw new Error('No such note.')
  return { ok: true }
}

// ── decks ────────────────────────────────────────────────────────────────
/* names, dates and the first slide for the card's cover — not whole documents */
export const listDecks = () => [...decks.values()].sort(byNewest)
  .map(({ slug, name, doc, favourite, updated_at }) => ({ slug, name, count: doc.slides.length, first: copy(doc.slides[0]?.doc ?? null), favourite, updated_at }))
export function loadDeck(slug) {
  const d = decks.get(slug)
  if (!d) throw new Error(`No saved deck called "${slug}".`)
  return { slug: d.slug, name: d.name, slides: copy(d.doc.slides), favourite: d.favourite, updated_at: d.updated_at }
}
/* upsert; an absent `slides` / `name` / `favourite` keeps the stored one */
export function saveDeck({ slug, name, slides, favourite }) {
  if (!slug) throw new Error('A deck needs a slug.')
  if (slides && !slides.every((s) => s?.doc && Array.isArray(s.doc.layers))) throw new Error('The deck is malformed.')
  const was = decks.get(slug)
  const row = {
    slug,
    name: name ?? was?.name ?? slug,
    doc: { version: 1, slides: slides ? copy(slides) : (was?.doc.slides ?? []) },
    favourite: favourite ?? was?.favourite ?? false,
    updated_at: now(),
  }
  decks.set(slug, row)
  return { slug, updated_at: row.updated_at }
}
export function deleteDeck(slug) {
  if (!decks.delete(slug)) throw new Error('No such deck.')
  return { ok: true }
}
