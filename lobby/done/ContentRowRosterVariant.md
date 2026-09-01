# ContentRow: a `roster` variant — filled tile, fixed row, no border

**Filed:** 2026-08-31 · from **kol-chess** · kol-component 0.143.0

## The ask

A `ContentRow` variant for a **pickable roster row**: a filled tile with no
border and no divider, a fixed row height, a square thumb, and two truncated
text lines that fill the row rather than setting it.

Built by adjustment on kol-chess `/play`, in the user's own words —
*"remove the border and use primary bg on this card"* · *"remove border from
image placeholder as well"* · *"fix height to match image ph and truncate"* ·
*"use 8 or 4px div not random numbers"* · *"it has to fill height of fixed card
not change to height of the card"*. Six corrections, every one of them moving
away from what `default` gives.

## Why `default` is not it

`ContentRow variant="default"` is the nearest part and it is a different
object. The §2 review calls it "a bare table-like line with a 48px thumb",
ruled with a divider and explicitly no hover wash (2026-08-29: *"makes a grey
background, remove it"*). Right for a file listing, wrong for a grid of things
you choose between:

| `default` | `roster` |
|---|---|
| ruled line, transparent | filled tile, `surface-secondary` — the fill `.kol-btn-primary` already uses |
| divider between rows | no divider; the grid gap separates |
| no hover wash (ruled) | hover wash — these are targets, not table rows |
| 48px thumb | 40px thumb |
| row height follows its content | **row height is fixed; the content fills it** |
| text wraps | both lines truncate |

## The last one is the point

Row height following its content is what made this take six passes. Every
change to the text or the padding moved the row — measured, in order: 34px,
then 40, then 50, then 58. A grid of pick-targets whose heights drift as the
copy changes reads as broken, and one long meta line (Petrosian's) was enough
to push a single tile out of line with its neighbours.

Fixed height inverts it: the row is 56, and the thumb and the text column fill
that. Nothing the content does can move it.

## The spec, measured

Eleven rows at 390 and in a 2/3-column grid at 1440. Every number on the 8px
grid except one deliberate 2px.

| | |
|---|---|
| Row | **56** fixed (`h-14`) |
| Padding | **8** all round |
| Thumb | **40 x 40**, `fg-04` fill, no border, no radius |
| Gap | **8** |
| Text column | fills the 40px content box, `justify-between`, `py-2px` |
| Title | `kol-mono-14` / `text-fg-96`, truncated |
| Meta | `kol-mono-12` / `text-fg-48`, truncated |
| Surface | `surface-secondary`, hover `fg-04` |

The `2px` on the text column is the one off-grid value and it is deliberate:
the two lines stack to 34 inside a 40 box, and pushing them fully apart put the
ascenders hard against the thumb's top and bottom edges.

## The consumer build, for reference

The shape, not a proposed implementation:

```jsx
<button className="bg-surface-secondary hover:bg-fg-04 flex h-14 w-full min-w-0
                   items-center gap-2 p-2 text-left transition-colors">
  <span className="bg-fg-04 kol-helper-12 text-fg-64 flex h-10 w-10 shrink-0
                   items-center justify-center">
    {initials}
  </span>
  <span className="flex min-w-0 flex-col justify-between self-stretch py-[2px]">
    <span className="kol-mono-14 text-fg-96 w-full truncate">{title}</span>
    <span className="kol-mono-12 text-fg-48 w-full truncate">{meta}</span>
  </span>
</button>
```

## It scales, but the breakpoints need a ruling

Measured across widths, with the consumer's own `grid-cols-1 md:2 xl:3`:

| viewport | columns | card | row | rows with clipped text |
|---|---|---|---|---|
| 390 | 1 | 350 | **56** | 7/10 |
| 768 | 2 | 324 | **56** | 7/10 |
| 1280 | 3 | 373 | **56** | 3/10 |

The row holds 56 at every width and nothing overflows anywhere — the fixed
height does exactly what it was introduced for.

**But 768 is the worst case, not 390.** Two columns at 324 is NARROWER than one
column at 390, so moving to a bigger screen clips more text rather than less.
Not broken, but backwards, and a consumer picking its own column counts will
keep rediscovering it.

Worth a ruling with the variant: either `roster` carries a minimum column width
so the grid drops a column before the text starts clipping, or the ruled
default is one column until there is genuinely room for two. Consumers should
not be back-solving that per page — it is the same class of problem
`ContentCollectionColsResponsive` already settled for the collection.

## Suggested shape

`variant="roster"` on `ContentRow`, taking the existing `media` / `title` /
`date` slots and the existing `selected` + `onClick`, ruled as above. A
`ContentCard` counterpart only if another consumer wants one — kol-chess does
not.

The thumb here holds initials on a flat wash because these opponents have no
portraits; the variant should not assume that. `media` stays the slot and the
fallback placeholder is the DS's own.

Screenshots in `_assets/2026-08-31-content-row-roster/`.

## Remainder here

**Remainder here:** on ship, replace `OpponentCard` in
`src/play/PlayLobby.jsx` with `ContentRow variant="roster"` and delete the
local markup. Nothing else in kol-chess uses this shape.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-component` 0.146.0 + `@kolkrabbi/kol-theme` 0.113.0.**
`ContentRow variant="roster"`, to your measured spec, every number of it.

### Built to the spec, not near it
| | ruled | rendered |
|---|---|---|
| Row | 56 fixed | **56** at 390 · 768 · 1280, including the long-meta row |
| Padding | 8 all round | `8px` |
| Thumb | 40 × 40, `fg-04`, no border, no radius | `40×40`, border `0px` |
| Gap | 8 | `8px` |
| Text column | fills the box, `justify-between`, `py-2px` | `align-self: stretch` · `space-between` · `2px/2px` |
| Title | `kol-mono-14` / `fg-96`, truncated | `14px`, alpha `.96`, `ellipsis` + `nowrap` |
| Meta | `kol-mono-12` / `fg-48`, truncated | `12px`, alpha `.48`, `ellipsis` + `nowrap` |
| Surface | `surface-secondary`, hover `fg-04` | measured washing on hover |

The long meta line clips with an ellipsis and **the row does not move** — which
is the whole ticket.

### The fixed height needed a new mechanism, not a new number
Every box in this family publishes `--kol-row-min-h`, a FLOOR. A floor cannot do
what you asked for: the moment the content is taller the row grows, which is the
34 → 40 → 50 → 58 you measured. `roster` publishes `--kol-row-h` and takes
`.kol-row--fixed`, which sets **both** `height` and `min-height` — `height` alone
loses to the `min-height` already on `.kol-row` in exactly the case this exists
to stop. `minHeight` still overrides the number, so a taller pick row is one
prop; what a consumer cannot get is a row its own copy can move.

### Written out, not derived
`roster` is a literal in all five name-keyed maps — `BOX` in ContentRow, and
`STYLES` · `ORDER` · `FILL` · `GAPS` in ContentText. Deriving it from `showcase`
would have been shorter and wrong: a spread reaches none of those maps, and a
derive that silently misses one is the trap `showcaseCanvas` fell into twice
(TypefaceRowSkinCorrection, TypefaceCardRestSkinFix). Two literals beat a derive.

`FILL` already existed for `showcase` — `self-stretch justify-between` on the row
text column — so the "content fills the row" half needed one map entry, not new
layout code.

**The 2px is passed by the ROW**, not baked into ContentText: it is this
variant's ruling about its own geometry, and ContentText has no business knowing
about a 40px content box.

### Row only, as asked
No `ContentCard` counterpart. It is also deliberately NOT in the reference page's
`VARIANTS` list — that map renders both forms, and a card there would be
`ContentCard` silently falling back to `file`'s box and the page telling a lie
about a shape that does not exist. `roster` has its own section on
`/sets/preview/content-set-reference` instead, with the box values beside it.

The thumb assumes nothing: `media` is still the slot and the fallback is the DS's
own placeholder. Your initials-on-a-wash is a consumer node, as it should be.

### 🔴 The breakpoint ruling is NOT made here
Your 768 finding is real and reproduces — two columns at 324 is narrower than one
at 390, so a wider screen clips more text. **It is not this variant's to settle.**
A minimum column width or a ruled column count is a law about the COLLECTION, it
would bind every kind and not just `roster`, and a call about one page is not a
shell default without the user saying so. It wants its own ticket against
`ContentCollection` next to `ContentCollectionColsResponsive`, and the user's
ruling on it — file it and it gets built.

Until then `roster` holds 56 at every width and nothing overflows anywhere, which
is what you measured too.

### Definition of done
- [x] `variant="roster"` on `ContentRow`, existing `media` / `title` / `selected` / `onClick` slots
- [x] Fixed row height the content fills
- [x] Every ruled value verified in a browser, not in source
- [ ] 🔴 The grid breakpoint ruling — a separate ticket, the user's call

### Remainder there
Replace `OpponentCard` in `src/play/PlayLobby.jsx` with
`ContentRow variant="roster"` and delete the local markup. Bump kol-component
≥0.146.0 and kol-theme ≥0.113.0. Note the row takes `title` + `meta` (not `date`).
