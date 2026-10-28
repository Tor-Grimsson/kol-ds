# @kolkrabbi/kol-markdown

## 0.2.0 — 2026-10-28

- **What the document examples are written in** (plan-2026-10-28-document W2, kol-website's MarkdownPage ticket; proved in `apps/markdown` on kol-atlas's documents). `parseDocsMarkdown` now reads: heading anchors `{#id}`; numbered headings (`M1`, `1.1`, `1.`; `####` items auto-numbered `phase.n`) as `num` on the block and the TOC entry, with `{ numbered: true }` a `###` may carry a bare integer; ✋ 🅿️ 📍 ✓ ✅ marks and their reasons as `marks`; headings carry `tokens`; a `Dates:` `Date:` `Phases:` `Pages:` `Covers:` `Acceptance:` paragraph as one `meta` block of rows; `[^key]` as a `footnote` token and `[^key]: text` as a `footnote-def` block; `[+key]: Title` pop-out definitions; `![[file|caption]]` runs and `:::tabs` filmstrips as one `media` block (a caption may hold a link, `captionTokens`), a line that is only `![caption](src)` too; `> quote — who` as blockquote `cite`; table `align` and `kv`, a blank line closing a table; a link or code inside bold or italic as nested `tokens`; `%% thumb:` kept as `thumb`, other `%%`, `@name`, `::name`, `{{name}}` lines dropped; backslash escapes. All additive — kol-workshop's and the showcase's readers ignore the new kinds until taught. Selftest: one check per kind.

## 0.1.3 — 2026-10-02

- Republished so the `@kolkrabbi/kol-search` range reaches `^0.3.0` — 0.1.2 pinned `^0.2.0`, so every consumer of kol-component 0.237.0 installed two copies of kol-search. No source change.

## 0.1.2 — 2026-09-30

- Comments only: one spelling, `color`.

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
