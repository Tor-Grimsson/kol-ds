# @kolkrabbi/kol-markdown

## 0.1.1 — 2026-09-29

- `buildTagCooccurrence` is **deprecated** — an adapter onto kol-search's `tagGraph` (new dependency), same output; it goes at the next minor. Import `tagGraph` from `@kolkrabbi/kol-search`.

## 0.1.0 — 2026-09-28

- **First release — the engine tier's first package** (ARCHITECTURE §3). Lifted out of
  `kol-workshop/src/engine/` unchanged: `parseDocsMarkdown` · `extractHashtags` ·
  `processInlineMarkdown` · `buildInventory` · `buildInventoryCounts` · `buildTagCounts` ·
  `buildTagCooccurrence` and the doc helpers (`cleanTitle`, `fileLabel`, `getTagColor`, …).
- **One frontmatter module.** `parseFrontmatter` existed twice, byte-for-byte (kol-workshop's
  engine and kol-component's utilities); `splitFrontmatter` / `joinFrontmatter` (the editor's
  lossless round-trip pair) came from kol-component. Both packages now re-export from here.
- `pnpm test` runs the self-check, now covering the round-trip and the tag math.
