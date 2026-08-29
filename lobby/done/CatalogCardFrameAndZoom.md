# CatalogCardFrameAndZoom — the catalog card's frame is inverted, and its zoom only reaches `img`

**Staged:** 2026-08-28 · from **kol-website** (brand `/icons`)
**Nature:** two defects in `ContentCard variant="catalog"` / `ContentMedia`, both carried locally today.

## 1. The frame reads backwards

`catalog` ships `border: var(--kol-fg-04)` at rest stepping to
`frameHover: var(--kol-fg-16)`. On a dark plane a 212-tile grid of `fg-04`
frames is a grid of boxes — the frame is louder than the content it holds, and
the hover step barely registers against it.

User ruling 2026-08-28, on the live page: **no frame at rest; the old rest value
is the hover.**

| | today | ruled |
|---|---|---|
| rest | `--kol-fg-04` | none (transparent) |
| hover | `--kol-fg-16` | `--kol-fg-04` |

Carried in kol-website as:

```css
[id^="icons-"] .kol-card { border-color: transparent; }
[id^="icons-"] .kol-content-hover-frame:hover { border-color: var(--kol-fg-04); }
```

Note both had to set `border-color` directly: `--kol-card-border` and
`--kol-content-hover-border` are written as **inline styles** by ContentCard, so
a consumer cannot re-point the variables. If the values stay overridable at all,
they want a class seam, not an inline custom property.

## 2. The plate hairline is inline-only

`.kol-card-plate` draws `borderTop: 1px solid var(--kol-fg-04)` as an inline
style. Turning it off consumer-side needs `!important` — there is no prop and no
token:

```css
[id^="icons-"] .kol-card-plate { border-top-color: transparent !important; }
```

**Ask:** a `plateRule` prop (or the same class seam as above). An `!important`
in a consumer stylesheet is the tell that a component has no seam.

## 3. `.kol-media-zoom` only zooms `img` and `video`

```css
.kol-media-zoom > img,
.kol-media-zoom > video { … }
.group:hover .kol-media-zoom > img,
.group:hover .kol-media-zoom > video { transform: scale(1.06) }
```

A catalog card whose media is anything else — brand `/icons` renders an SVG glyph
on a fixed specimen plate, and `zoom` resolves **true** for it (`variant ===
'catalog' ? media != null`) — gets the class, the transition, and no zoom. The
component promises motion it cannot deliver for its own declared case.

Carried in kol-website by re-declaring the DS rule against `> div`, same 1.06,
same `--kol-ease-house`.

**Ask:** the zoom targets the zoom wrapper's child, whatever element it is —
`.kol-media-zoom > *`, or an explicit `.kol-media-zoom-target`.

## Definition of done

- [ ] catalog frame: none at rest, `--kol-fg-04` on hover
- [ ] the plate hairline is switchable without `!important`
- [ ] `.kol-media-zoom` zooms a non-`img` child
- [ ] kol-website deletes all four local rules

## Remainder in kol-website once it ships

bump; delete the catalog-card, plate-hairline and glyph-zoom blocks from
`apps/brand/src/styles/controls-tone.css`.

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-component 0.121.0** + **kol-theme 0.83.0**:

- [x] catalog frame: `border: transparent` at rest (the 1px stays, no relayout on hover), `frameHover: fg-04`
- [x] the plate hairline: `ContentCard plateRule` (default the variant's; `false` off) — a prop, as asked; the variables stay inline (they are the card's own state — `selected` rewrites the border — so a class seam would race them)
- [x] `.kol-media-zoom > :not(.kol-media-ring)` — the wrapper's child whatever it is; the ring hairline carries `.kol-media-ring` so it is the one child that does not scale
- [ ] kol-website deletes all four local rules — **kol-website's**

Verified in source + showcase build only. Remainder in kol-website: bump both; delete the catalog-card, plate-hairline and glyph-zoom blocks from `controls-tone.css`.
