---
component: ContentCollectionCols
source: kol-website/apps/web/src/routes/Stack.jsx#L78-L104
staged: 2026-08-27
status: draft
deps: [ContentCollection]
---

# ContentCollectionCols — say "three across", not a track minimum

## Purpose

`ContentCollection` sizes its grid by `min` (a track minimum, default 320px,
`repeat(auto-fill, minmax(min, 1fr))`) — it fits as many cards as fit. Every
filtered grid on kol-website was ruled as a **column count**: `/stack` was
`grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8` (one below `md`, three from
`md`). Moving `/stack` onto the collection (2026-08-27) meant back-solving a
`min` (~440px) that happens to yield three on the 1400/1600/1800 ladder — a
number nobody picked, that breaks the moment the ladder or the gap moves.
User: *"translate that to something usable, consistent."*

## Ask

`cols` on `ContentCollection` (grid form): `cols={3}` → one column below
`md`, N from `md` (`grid-cols-1 md:grid-cols-{N}`), gaps from the house tokens
(24 / 32 at xl — today's `gap` behaviour). `min` stays for the fluid case;
`cols` wins when both are passed. List form ignores it.

## Consumer state

`/stack` passes `cols={3}` on return; `/work`, `/prints`, foundry library
follow as they move onto the collection.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.87.0

ContentCollection cols={N}: one column below md, N from md (2-6, literal classes; the inline auto-fill template steps aside so the classes carry the tracks). min stays the default fluid wall, cols wins when both are passed, the list form ignores it. Gap is unchanged — the wall token is 24 flat, there is no 32-at-xl step in the DS; pass gap={32} if /stack wants it. Measured on the demo: 3 tracks at 1280 and 900, 1 at 390; fluid and list forms byte-identical.

**Remainder here:** none — kol-website bump kol-component 0.87.0; /stack passes cols={3} and drops the back-solved min; /work, /prints, foundry library follow as they move onto the collection.

