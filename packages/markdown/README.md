# @kolkrabbi/kol-markdown

The KOL markdown engine. Plain ESM, no React, no DOM, no dependencies — it runs in a browser, in
Node scripts and in tests alike. Engine tier (ARCHITECTURE §3).

```js
import { parseDocsMarkdown, parseFrontmatter, splitFrontmatter, joinFrontmatter, buildInventory } from '@kolkrabbi/kol-markdown'

const meta = parseFrontmatter(raw)                 // { title, tags: [...], … } — keys lowercased
const { sections, toc, introBlocks } = parseDocsMarkdown(raw)
const { fields, body } = splitFrontmatter(raw)     // keys keep case + order
joinFrontmatter(fields, body) === raw              // lossless
```

## Exports

| export | what |
|---|---|
| `parseDocsMarkdown(md)` | block + inline tokenizer → `{ sections, toc, introBlocks, inlineTags }`. Tokens, not elements — rendering is the consumer's (kol-workshop's `DocKit`) |
| `processInlineMarkdown(text)` | the inline token producer (bold, italic, code, links, images, swatches, hashtags) |
| `extractHashtags(text)` | `#tags` in body text, lowercased |
| `parseFrontmatter(raw)` | the YAML-subset reader for display — keys lowercased, `[a, b]` and block lists become arrays |
| `splitFrontmatter(raw)` · `joinFrontmatter(fields, body)` | the editor's round-trip pair — `[[key, value]]` in order, quoting only where YAML needs it |
| `buildInventory(modules)` | path → raw map into `[{ id, file, title, metadata, headings }]` — the content-injection seam (the consumer globs, never this package) |
| `buildInventoryCounts(inventory)` | status / category / content-type tallies |
| `buildTagCounts(inventory)` · `buildTagCooccurrence(inventory)` | tag counts, and the tag graph's nodes + weighted edges |
| doc helpers | `cleanTitle` · `fileLabel` · `extractDocNumber` · `isIndexFile` · `getTagColor` · `groupDocsByMajor` · `capitalise` |

Consumers: kol-workshop (the reader, the tag browser, the graph), kol-component (re-exports the
frontmatter trio), kol-notes. Proved in `apps/markdown`.
