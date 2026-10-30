# ReaderBlockRenderers — `DocumentationReader` takes a `blocks` prop so a consumer can draw a block its own way

**Staged:** 2026-10-29 · from kol-hq (`site/`, the estate docs app on kol-workshop). User: *"how and if we can inject other assets to markdown docs? f.e. dotfiles has a bunch of shortcuts listed in ref-* and sections in note-* that might be subject to some custom visualisation. how would that work?"*

## The problem
`DocumentationReader`'s `renderBlock` is a closed `switch (block.type)` (paragraph, list, blockquote, divider, code, table, …). Every block draws the same way in every doc. kol-hq's site now mirrors dotfiles' ref and note cards (`docs/estate/dotfiles/{ref,note}/`) and wants, for example, a ref card's `keys` table drawn as keycaps. There is no seam to do that without forking the reader.

## The fix
- `DocumentationReader` takes an optional **`blocks`** prop: `{ [blockType]: (block, ctx) => ReactNode | null }`, where `ctx` carries at least `docId` and the doc's `file` path.
- `renderBlock` asks `blocks[block.type]` first; a missing entry or a `null` return falls through to the built-in case. Without the prop nothing changes.
- The prop only: no visuals, no keycap component. The views are built in the consumer.

## Definition of done
- [ ] `blocks` prop on `DocumentationReader`, falling through on `null`
- [ ] `ctx` gives the doc id and file path
- [ ] no change for consumers that do not pass it
- [ ] published


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-workshop 0.43.0**.

- `DocumentationReader` takes **`blocks`**: `{ [blockType]: (block, ctx) => node | null }`, where `ctx` is `{ docId, file, metadata, key }` (`file` is the doc's path as the inventory has it). The reader asks `blocks[block.type]` first; a missing entry or `null` falls through to its own case. Nested blocks go through the same seam. Without the prop nothing changes. The prop only, no views.
- Walked in apps/workshop on `/docs/03-sizes` with a temporary `blocks`: the table drew the consumer's node with `ctx` = `docs/documentation/01-foundations/03-sizes.md | 03-sizes`, and the paragraphs (renderer returning `null`) drew as the reader's own. With the prop removed, the table is back.

**Remainder at kol-hq:** bump; pass `blocks` from `site/` (the keycap view is yours).
