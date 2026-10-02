# @kolkrabbi/kol-search

## Unreleased

- **`indexGraph(items, { files, orphans, filter })`** — the index as a network of tags and the items that carry them: a node per tagged item joined to its tags, a node per untagged item, and a text filter. With nothing switched on it is `tagGraph`.

## 0.2.0 — 2026-09-29

- **`tagGraph(items)`** — the index's tags as a network: `{ nodes: [{ id, count, type }], edges: [{ source, target, weight }] }` over engine items (`id` + `tags[]`), tags lower-cased. The node graph is a view of the search index (ruling D4); moved here from kol-markdown's `buildTagCooccurrence`. In the self-check.

## 0.1.0 — 2026-09-28

- **First release — the engine tier's second package** (ARCHITECTURE §3).
- `parseQuery` — the query language: `tag:` · `#tag` · `kind:`/`is:` · `space:`/`in:` ·
  `category:` · `-negation` · `"phrases"` · `after:`/`before:` dates, and **smart terms** — a bare
  word that names a facet value in the index (`atom` → category Atoms) becomes that filter; quote
  it to search the text. Every token is returned with how it was read.
- `createIndex` + `search` — AND across terms, each term scored by the best field it hits
  (title exact › prefix › word start › contains › tag › heading › keyword › description › body),
  every hit returned as a **reason**; facet counts are disjunctive (a field is counted with every
  other filter applied); `scope` is the UI's hard filter.
- `matchSearchItems` — kol-workshop's substring predicate, moved here unchanged; the palette runs
  on it until it moves to `search`.
