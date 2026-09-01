# RowThumbRatioDead — `ContentRow`'s documented `ratio` prop reaches nothing

**Staged:** 2026-08-30 · from **kol-website** (`/prints` list)
**Nature:** a documented prop that is silently inert.

## The defect

`ContentRow.jsx:18` documents:

> `@param {string} ratio  thumb aspect-ratio — overrides the ruled default`

It does not. Two things override it, both unconditionally:

1. `ContentRow.jsx:146` passes **`ratio={null}`** to `ContentMedia` — the prop is
   destructured (`:76`) and then never forwarded.
2. kol-theme `kol-components-molecules.css:1004-1008` hard-codes the box:

```css
.kol-row > .kol-row-thumb { width: var(--kol-row-thumb); aspect-ratio: 1 / 1; }
```

So every row thumb is square regardless of what a consumer passes, and the
consumer gets no error — kol-website set `ratio="1 / 1.41421"` on `/prints` and
it looked identical, which cost a round trip to notice.

## Why prints wants it

Every art print, its photograph and its certificate are **A-series** — one
`1 / 1.41421` box, not square. A square thumb crops the top and bottom off a
poster, which is the whole subject of the row.

## Ask

Either honour the prop — forward it and let it set `aspect-ratio` on
`.kol-row-thumb` (a CSS variable with `1 / 1` as the default keeps every current
consumer pixel-identical) — **or delete it from the signature and the docstring**.
A prop that silently does nothing is worse than no prop.

The `is-fill` case matters here: `showcase`'s thumb derives its width from
`minH`, so a non-square ratio changes the row's height budget. Ruling that is
part of the ask, not an afterthought.

## Definition of done

- [ ] `ratio` either drives the row thumb's aspect-ratio, or is gone
- [ ] the `fill` thumb's height behaviour under a non-square ratio is ruled
- [ ] kol-website's `/prints` row renders A-series thumbs

## Remainder in kol-website once it ships

bump; put `ratio="1 / 1.41421"` back on the `/prints` `ContentRow` — it is
removed for now precisely because it reads as working code and is not.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-theme 0.99.0** + **kol-component 0.135.0**. The prop is honoured,
not deleted — `/prints` has a real need for it and the fix is smaller than the
removal.

### Both blocks cleared

1. **The forward.** `ContentRow` publishes `--kol-row-thumb-ratio` (`ratio ??
   box.ratio`). It was destructured and then dropped.
2. **The hard-code.** `.kol-row > .kol-row-thumb` reads
   `aspect-ratio: var(--kol-row-thumb-ratio, 1 / 1)` instead of declaring
   `1 / 1`. The `ratio={null}` passed to ContentMedia stays — the wrapper owns
   the box now, and two things setting it is how this started.

### The `fill` ruling — the ask's third box

**Under `thumb="fill"`, the rung is the thumb's HEIGHT, not its width.** "Fill"
promises to fill the row's content height; keeping the rung as the width would
make an A-series fill thumb 1.41× taller than the row it fills, which is exactly
what the 2026-08-27 "an image never sizes a row" ruling exists to prevent. So a
non-square ratio widens the thumb instead. At `1 / 1` the two readings are the
same number, so nothing that exists moves.

### Verified in the browser, not asserted

Measured on `/sets/content-set-reference`:

- Existing rows **pixel-identical**: `48×48`, `120×120`, `fill 136×136` ×2,
  `48×48` — the `fill` rows are the same 136 square they were when the rung was
  the width.
- The row publishes `--kol-row-thumb-ratio: 1 / 1`, proving the forward.
- Overridden to `1 / 1.41421`, the thumb goes **48×48 → 48×68**. A-series.

### Definition of done

- [x] `ratio` drives the row thumb's aspect-ratio
- [x] the `fill` thumb's behaviour under a non-square ratio is ruled
- [ ] kol-website's `/prints` renders A-series thumbs — **yours on the bump**

**Remainder here:** none.
