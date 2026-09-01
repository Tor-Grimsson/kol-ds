# InputTypeScaleZoomsIOS — every DS input auto-zooms iOS Safari

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `src/atoms/Input.jsx:49`
**Severity:** every consumer with an input, on every iPhone.

## The defect

```js
const SIZE_TYPE = { sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
```

`md` is the **default** size. iOS Safari zooms the page whenever a text field
under **16px** takes focus, and it does not zoom back out when the field blurs.
So `sm` (12px) and `md` (14px) both trigger it; only `lg` is safe.

## How it was found

A mobile audit of kolkrabbi.io produced 27 screenshots, most of which looked like
a catastrophic page-gutter failure — content clipped past the left edge, the `/`
of a heading sliced in half, whole sections flush to x=0.

**None of it was layout.** Measured at 390×844 on production: `scrollWidth` equals
`innerWidth` on `/`, `/work`, `/workshop` and `/foundry/typefaces/:slug`. Nothing
overflows the document anywhere.

What actually happened: the newsletter band's mail field is a `<Input size="md">`
at 14px. Tapping it zoomed the viewport, and every screenshot taken afterwards was
of a zoomed page. The same section photographed before the tap renders perfectly.

That is the real cost of this one — it does not look like a font-size bug, it
looks like the layout is broken, and it sent a consumer session chasing a
non-existent overflow across a dozen routes.

## The ask

Touch devices get a ≥16px input. The drawn size on pointer devices should not move
— this is not a request to change the type scale.

Suggested shape, in the theme rather than the atom so it reaches every input at once:

```css
@media (pointer: coarse) {
  .kol-control-sm, .kol-control-md { font-size: 16px; }
}
```

…or the equivalent inside `Input`'s size map keyed on a coarse-pointer query.
The DS owns which; the constraint is only that a coarse pointer never focuses a
sub-16px field.

**Explicitly not a re-litigation of `MobileTouchFloor`** (2026-08-26, "no type
floor, 24px hit floor"). That ruling was about *legibility* — how big text should
be drawn for a human to read. This is a hard platform behaviour in one browser:
Safari's zoom trigger fires on the computed `font-size` of the focused field
regardless of how legible it is. A design that deliberately draws 14px still needs
16px in the input while a coarse pointer is in use, or it zooms.

## Not in scope

`maximum-scale=1` on the viewport meta would also stop it and is the wrong fix —
it disables pinch-zoom for everyone and fails WCAG 1.4.4.

## Remainder here once it ships

bump kol-component (+ kol-theme if the rule lands there); re-check the `/`
newsletter field on a real iPhone — tap it and confirm the page does not zoom.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-theme` 0.112.0.**

The rule landed in the theme, as the ticket suggested, but keyed on the FIELDS
rather than the control sizes:

```css
@media (pointer: coarse) {
  .kol-control input, .kol-expand input { font-size: 16px; line-height: 22px; height: 22px; }
  .kol-control textarea { font-size: 16px; line-height: 22px; }
}
```

Two things the `.kol-control-sm/.kol-control-md` shape would have missed:

1. **The type class sits on the SHELL and the field inherits it.** A rule on
   `.kol-control-md` would have tied with `kol-mono-14` on the same element —
   one class each — and the winner would be whichever sheet loaded last, which
   is ARCHITECTURE §5's exact failure. An element+class selector on the inner
   field beats an inherited value outright.
2. **The height pin travels with the size.** `Input` pins its inner field to the
   token's line-height (`h-4` / `h-[18px]` / `h-[22px]`) because Chromium sizes
   an `<input>` from font metrics, not CSS line-height. A 16px face in an
   unlifted 16px box clips, so the pin lifts with it.

`.kol-expand input` covers `SearchInput`'s bare/expanding path, which types on
`kol-mono-*` directly and is not inside a `.kol-control` shell.

### Measured
| | |
|---|---|
| Fine pointer, `/components/input` | `12px 12px 12px 12px 12px` — **unchanged** |
| Coarse pointer, same page | `16px ×5` · **0 of 5 fields under 16px** |

Verified in a browser with real touch emulation, not in source.

### Definition of done
- [x] A coarse pointer never focuses a sub-16px field
- [x] The drawn size on pointer devices does not move
- [x] `maximum-scale=1` not used
