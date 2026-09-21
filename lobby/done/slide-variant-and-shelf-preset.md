# slide-variant-and-shelf-preset — a `slide` content variant and `CatalogPage preset="shelf"`

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-component@0.177.0` — `ContentCard.jsx`, `ContentRow.jsx`, `ContentText.jsx` · `@kolkrabbi/kol-shell@0.49.0` — `CatalogPage.jsx`
**Origin:** the user, after building `/slide-deck` by hand through eleven props and two CSS lines: *"this is a look I DO NOT want to do this again… this is a layout SET."* And, ruled: a deck is genuinely a different thing from a file — *"why don't we make a new variant for slides, they are genuinely different with 16:9 layout and those exposed properties?"* Yes.

The reference render is `apps/brand/src/pages/SlideDeckManager.jsx` as it stands
today. Everything below is read off it, nothing invented.

## 1 — `slide` variant on `ContentCard` and `ContentRow`

A deck is a 1920×1080 stage. Its card is that shape, and its text carries what a deck
has — a date, a size, a slide count — not what a file has.

| | card | row |
|---|---|---|
| ratio | `16 / 9` | `16 / 9` |
| thumb | fill-width media, `cover` | `fill` — height at the rung, width from the ratio (48 tall, 85 wide), NOT the 48px square |
| text | title · date · size · meta (`N slides`) | same, one line |
| `control` (on the image) | download, `ActionButton chrome="media"` | — |
| `actions` (plate) | column, `justify-between`: star (toggle, `star`/`star-solid`) top, trash (confirm) bottom | row, `gap-2`: download · star · trash, inline chrome |
| size cell | `SizeOrDownload` — the number at rest, the download on hover | same |
| plate | `surface-primary`, rest **and** hover | — |

Add `slide` to `ALIAS`/`BOX`/`RATIOS` in both, and to `ContentText`'s `ORDER` as
`['title', ['group', 'date', 'size', 'meta']]`. `formatSize` from
`MediaLibraryPages.jsx:91` becomes an export — olina restated it.

## 2 — `CatalogPage preset="shelf"`

One prop that sets the page half. `'catalog'` = today's defaults, byte-identical.
`'shelf'`:

```
width 'capped' · maxColumns 3 · minColumn 280
cardVariant 'slide' · rowVariant 'slide' · listLayout 'stack'
tone 'secondary'          the page root carries kol-tone-secondary — every control on the page
actionSize 'md'           the bottom action row's Buttons (the page's are md, not sm)
header no eyebrow         an app masthead is title + subtitle; the eyebrow is the site register's
views the strip           [{ value:'all', label:'All' }, { value:'recent', label:'Recent' }], default 'all'
```

**The preset is the WHOLE page as it stands** — the user: *"freeze this so I can use AS
IS again"* — not the grid half. Anything the reference render sets, the preset sets.
Explicit props win over the preset. `toCard` still returns the item's fields and
handlers — `title date bytes count cover href onNavigate onDownload onFavourite
onDelete favourited` — and the `slide` variant renders them. The consumer writes no
JSX for actions.

## 3 — Blast radius

None. A new variant and a new preset value; `catalog` and every existing page are
untouched.

## Consumer status

`/slide-deck` carries the whole layout by hand. On ship it becomes
`<CatalogPage preset="shelf" items={decks} header={…} toCard={fields + handlers} />`,
and `.deck-shelf` in `olina.css` retires.

## ✅ RESOLUTION — 2026-09-03 · kol-shell@0.50.0

kol-component 0.178.0 · kol-shell 0.50.0. `slide` is a fifth content kind on `ContentCard` and `ContentRow`: file's stack at `16 / 9`, the plate on `surface-primary` rest and hover; the row's thumb fills the rung — 48 tall, 85 wide, the whole frame — on a 64 rung (the thumb plus the row's pads; without a rung a fill thumb fell to the 96 fallback and rendered 80 × 142). Text `title · date · size · meta`. `formatSize` is exported. `CatalogPage preset="shelf"` is the whole page as one word — capped, 3 tracks on a 280 floor, `slide` card and row, stacked list, `kol-tone-secondary` on the root, the All / Recent view strip, `'all'` default — and `toCard` returns fields and handlers (`title date bytes count cover href onNavigate onDownload onFavourite onDelete favourited`) while the page renders the slots in the media admin's idiom; a slot the consumer supplies is left alone. Explicit props win. One thing the preset cannot set: the action row's Buttons are the consumer's JSX (`<Button size="md">`), so their size stays at the call site. Rendered and measured on the showcase (`/components/catalog-page` → shelf): 16:9 media, plate 250 / 250 / 250, download on the image, star and trash on the plate, `17.5 MB` in the size cell, `32 slides`, three stacked rows with an 85 × 48 thumb, no errors.

**Remainder here:** none — kol-client-olina bump kol-component@0.178.0 · kol-shell@0.50.0 (pin the numbers); /slide-deck becomes <CatalogPage preset="shelf" …> with toCard returning fields + handlers; retire .deck-shelf in olina.css and the local formatSize.

