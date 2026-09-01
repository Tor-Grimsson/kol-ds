# RowRungAndFillThumb — the rung is not a prop, and the fill thumb ignores it anyway

**Staged:** 2026-08-30 · from **kol-website** (`/prints` list)
**Nature:** two coupled gaps found immediately after `RowThumbRatioDead` shipped.

## Why

`ratio` now works (theme 0.99.0), and the ruling was "the rung is the thumb's
HEIGHT, so a non-square ratio widens the thumb". On `/prints` that shrank the
thumb from **136 × 136** to **96 × 136** — the ratio was paid for out of the
width. The user wants the opposite: **hold the width, give on height** (136 × 192),
because the width is what sets the row's rhythm against the rest of the page.

That is not expressible today.

### 1. The rung is not a prop

`showcase` sets `minH: 168`; the row publishes it as `--kol-row-min-h` **as an
inline style**. No `minHeight` prop exists, and an inline custom property cannot
be reached from a stylesheet. kol-website carries:

```css
.kol-row.print-row { --kol-row-min-h: 224px !important; }
```

### 2. The fill thumb derives from the VARIANT, not the effective rung

`ContentRow.jsx:109`:

```js
'--kol-row-thumb': thumbPx === 'fill' ? `calc(${box.minH ?? 96}px - 2 * ${padY})` : …
```

`box.minH` is the variant's literal. So raising the rung grows the row and
leaves the thumb at its old height — the row got taller with the same thumb
floating in it. A second override was needed:

```css
--kol-row-thumb: 192px !important;
```

Two `!important`s on one component is the tell.

## Ask

- **`minHeight` prop** on `ContentRow` (and the rung as a variable the CSS reads,
  not an inline literal), so the rung is settable without `!important`.
- **The fill thumb derives from the EFFECTIVE rung**, whatever set it — variant
  default or consumer override. `calc(var(--kol-row-min-h) - 2 * var(--kol-row-pad-y))`
  rather than a JS literal.
- Optionally: a way to say *which axis pays for a non-square ratio* — today it is
  always the width. `/prints` wants the height to pay. If that is one prop
  (`ratioAxis="width" | "height"`), it removes the need for the consumer to
  compute 192 and 224 by hand at all.

## Definition of done

- [ ] the rung is settable as a prop
- [ ] the `fill` thumb follows the effective rung, not `box.minH`
- [ ] kol-website deletes both `!important` lines from `.kol-row.print-row`

## Remainder in kol-website once it ships

bump; replace the `.kol-row.print-row` block in `styles/ui.css` with the prop(s),
and drop the `print-row` className if nothing else needs it.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-theme 0.100.0** + **kol-component 0.136.0**. All three asks,
including the optional one — it is the one that removes the hand arithmetic.

| ask | shipped |
|---|---|
| the rung is a prop | `minHeight` — publishes `--kol-row-min-h`, overriding the variant |
| the fill thumb follows the EFFECTIVE rung | `--kol-row-thumb` is now `calc(var(--kol-row-min-h, 96px) - 2 * var(--kol-row-pad-y, 0px))`, resolved in CSS. It read `box.minH`, the variant's literal, so raising the rung grew the row and left the thumb floating |
| which axis pays | `ratioAxis="width" \| "height"` |

### My ruling three hours ago was wrong, and this is the correction

`RowThumbRatioDead` ruled "the rung is the thumb's HEIGHT, so a non-square ratio
widens the thumb" — and on `/prints` that *narrowed* it, 136×136 → 96×136. The
ratio came out of the width, and the width is what sets a listing's rhythm
against the rest of the page. I picked one axis where a choice belonged. The
default keeps the old behaviour so nothing that exists moves; `ratioAxis="height"`
holds the width at the rung and lets the thumb grow taller.

### Measured in the browser, all four cases

- default square — **136×136**, unchanged
- A-series, width pays (default) — **96×136**, the old behaviour intact
- A-series, `ratioAxis="height"` — **136×192**, the number the ticket asked for
- `minHeight={224}` + height pays — **192×272**, the thumb tracking the rung it
  was given rather than the variant's

### Definition of done

- [x] the rung is settable as a prop
- [x] the `fill` thumb follows the effective rung, not `box.minH`
- [ ] kol-website deletes both `!important` lines — **yours on the bump**

**Remainder here:** none.
