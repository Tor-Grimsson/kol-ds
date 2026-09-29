/**
 * searchItems — any list of objects, searched by the KOL engine (`@kolkrabbi/kol-search`).
 *
 * `ContentFilters` ran `String(item[key]).toLowerCase().includes(q)` over its `searchKeys` — one more
 * private engine (apps review 2026-09-29: *"one engine with tiers not endless individual engines each
 * slightly different"*). Through this, every catalog searches the same way: several words must ALL
 * match, `-word` must not, `"a phrase"`, `tag:x` / `#x` against the item's `tags`. A single word still
 * finds everything the substring found.
 *
 * The FIRST search key is the title (ranked highest); the rest are keywords. The items come back in
 * THEIR order — a catalog sorts itself.
 */
import { createIndex, search } from '@kolkrabbi/kol-search'

const list = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v])

export function filterItems(items, query, { keys = ['title'] } = {}) {
  const q = String(query ?? '').trim()
  if (!q) return items
  const [first, ...rest] = keys
  const index = createIndex(items.map((item, i) => ({
    id: i,
    title: String(item[first] ?? ''),
    keywords: rest.flatMap((k) => list(item[k])).map(String),
    tags: list(item.tags).map(String),
    item,
  })), { facets: ['tags'], smart: [] })
  const hit = new Set(search(index, q).results.map((r) => r.item.item))
  return items.filter((it) => hit.has(it))
}
