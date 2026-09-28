# @kolkrabbi/kol-search

The KOL search engine. Plain ESM, no React, no DOM, no dependencies. Engine tier (ARCHITECTURE §3):
the UI — an overlay, chips, a results page — lives in the UI packages and calls this.

```js
import { createIndex, search } from '@kolkrabbi/kol-search'

const index = createIndex(items)                    // items: { id, title, kind?, space?, category?, tags?, headings?, keywords?, description?, body?, date? }
const { results, facets, query, total } = search(index, 'atom tag:pattern/input -legacy', { scope: { space: 'components' } })
results[0].reasons   // [{ term, field, rung, weight, hit? }] — why it ranked there
facets.category      // [{ value, count, selected }]
query.tokens         // how the box was read, for chips
```

## The query language

| write | means |
|---|---|
| `button` | a text term — every term must match somewhere |
| `"exact phrase"` | a text term, never read as a filter |
| `-legacy` | must NOT match |
| `tag:layout` · `#layout` | tag filter |
| `kind:doc` · `is:doc` | kind filter |
| `space:docs` · `in:docs` | space filter |
| `category:atoms` · `cat:atoms` | category filter |
| `-tag:draft` | exclude a facet value |
| `after:2026-09-01` · `before:…` | date bounds on `item.date` |
| `atom` | **smart term** — a bare word naming a facet value (singular or plural) becomes that filter |

Filters are AND across fields, OR within one field.

## Ranking

A term scores the best field it hits: title exact 100 · title prefix 60 · title word start 40
(camelCase splits: `Anatomy` in `ColorAnatomy`) · title contains 25 · tag exact 30 · tag contains 12
· heading 15 · keyword 10 · description 8 · body 3. Ties sort by title. `WEIGHTS` is exported.

## Options

`createIndex(items, { facets, smart, aliases })` — `facets` (default `space · kind · category · tags`)
are counted; `smart` (default `category · kind · space`) feed smart terms, earlier wins a clash;
`aliases` maps extra words to `{ field, value }`.

Proved in `apps/search`.
