/**
 * mediaSearch — the media library's search, on the KOL engine (`@kolkrabbi/kol-search`).
 *
 * Four places in the media pages each ran their own `key.toLowerCase().includes(q)` — the browse
 * filter, the ⌘K search modal, the smart-folder text match, the picker's filter (apps review,
 * 2026-09-29). One helper now, so the media search speaks the same language as every other KOL
 * search: several words must ALL match, `-word` must not, `"a phrase"`, `tag:x` / `#x`,
 * `kind:image` / `is:video`, `after:2026-09-01`. A plain substring still finds what it found.
 *
 * An object becomes an engine item: its file name is the title (ranked first), the whole key is a
 * keyword (so a folder name in the path still matches), its tags and kind are facets, its upload
 * date the date.
 */
import { createIndex, search } from '@kolkrabbi/kol-search'
import { kindOf } from './mediaKinds.js'

const toItem = (o, nameOf) => ({
  id: o.key,
  title: nameOf ? nameOf(o) : o.displayName ?? (o.key.slice(o.key.lastIndexOf('/') + 1) || o.key),
  keywords: [o.key],
  tags: o.tags ?? [],
  kind: o.kind ?? kindOf(o),
  date: o.uploaded ? String(o.uploaded).slice(0, 10) : undefined,
  o,
})

/** ranked hits, best first — the search modal's order. `nameOf(o)` overrides the title (a display key). */
export function rankMedia(objects, query, { nameOf, limit } = {}) {
  const q = String(query ?? '').trim()
  if (!q) return limit ? objects.slice(0, limit) : objects
  const index = createIndex(objects.map((o) => toItem(o, nameOf)), { facets: ['kind', 'tags'], smart: ['kind'] })
  return search(index, q, { limit }).results.map((r) => r.item.o)
}

/** the matches in their ORIGINAL order — for views that sort on their own afterwards. */
export function filterMedia(objects, query, opts) {
  const q = String(query ?? '').trim()
  if (!q) return objects
  const hit = new Set(rankMedia(objects, q, opts))
  return objects.filter((o) => hit.has(o))
}
