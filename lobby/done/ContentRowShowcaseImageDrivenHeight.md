# ContentRowShowcaseImageDrivenHeight — the row's height follows its text, and the thumb never grows with it

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `ContentRow.jsx:65` (`showcase`)
**Origin:** user ruling on kol-website `/work`, 2026-08-31: the card's height should be **a function of the image**, and content should fit inside that. Not a question — the constraint is fixed.

## The problem

`showcase` is declared with a **floor**, not a rung:

```js
showcase: { thumb: 'fill', ratio: '1 / 1', pad: S4, gap: S4, …, minH: 168, align: 'items-stretch' }
```

`minH` maps to `min-height` (`--kol-row-min-h`), so content grows the row past it freely. Measured
on production `/work`, iPhone 13 emulation, 390 wide — the first four rows:

```
row height   text column   thumb        over the floor
   230           196       136×136          +62
   208           174       136×136          +40
   198           164       136×136          +30
   170           136       136×136           +2
```

**60px of ragged heights down one list**, and the thumb is `self-start` at a fixed 136×136 in every
one of them — it is the floor's inner height (168 − 2×16 pad) and it never grows. So the row grows
downward and leaves the image stranded at the top with dead space beside it. The image is not
driving the height; it is not even responding to it.

The driver is the tag block. In the 230px row:

```
title      18px   (kol-mono-14, correct)
tags      124px   (5 tags, kol-tag--sm, wrapping to 4 rows in a ~180px column)
body       30px
```

124 of the 196. The tags themselves are correct — `kol-tag--tertiary kol-tag--sm`, JetBrains Mono
10px — there is nothing wrong with them individually; there are simply five of them in a column
that narrow.

## The ask

Give `showcase` a fixed rung on the stacked/mobile case rather than a floor, so the row is
`thumb + padding` and the text fits inside it. The mechanism already exists in this file —
`roster` uses `height` (`:80`, "A FIXED rung, not a floor"), mapped through `--kol-row-h`, and
there is already a breakpoint seam for the floor at `--kol-row-min-h-md`.

At the current geometry that rung is **168** (136 thumb + 2×16 pad) — the same number the floor
already carries, which is why this is a change of KIND rather than of value. The text then has
136px to live in: 18 title + 30 body = 48, leaving ~88 for tags, about two rows.

Which lever absorbs the difference is yours — the user's own two candidates were shrinking the
image on mobile or dropping the tags there, and he has left the choice to the DS. What is fixed is
the constraint: **content never sets the row's height.**

## Remainder here once it ships

bump; `/work` passes no height today and should still pass none. If the lever lands as a prop,
`/work`'s list is the call site.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

showcase carries heightSm: 168 — a FIXED rung below the md container (.kol-row--fixed-sm, kol-theme 0.117.0), the floor above it, unchanged. 168 is the floor's own number (136 thumb + 2×16 pad): a change of KIND, not value — content never sets the row's height. The lever: the tags line goes single-row below md (max-md:flex-nowrap overflow-hidden in the showcase row ramp) so the cut lands on the chips' edge, not mid-row; title and body already truncate by ramp. minHeight still overrides the rung.

**Remainder here:** none — kol-website bump kol-component@0.150.0 + kol-theme@0.117.0; /work passes no height and should still pass none.

