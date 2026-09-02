# ContentFiltersMobileGaps — the filter row's gaps are desktop values with no mobile rung

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `src/organisms/ContentFilters.jsx`
**Origin:** user's mobile review of `/work` and `/stack`. Reported as "the gap between the title and the icons is huge" — and a second, wider gap I found next to it.

## The problem

Two gaps in this organism are fixed values with **no breakpoint variant**, so a
390px phone gets the same air a 1920px desktop does.

**1 — title → icons.** `:322` sets `gap-6` (24px) around the vertical divider, and
the title span at `:335` carries an extra `pr-4` (16px). Title text edge → divider
is **40px**; divider → first icon is 24px. At 390 that is a tenth of the viewport
spent on one seam.

The `pr-4` is **ours** — added by the `ContentFiltersTitleGap` ticket (2026-08-27)
to balance the divider at desktop, where it is right. It is what makes mobile
tight, so this is the other half of that ticket, not a regression.

**2 — facet columns.** `:460` and `:461` both set `gap-16` (64px), on the outer row
and the inner group row. At 390 that is 64px between CATEGORY and YEAR, in a
viewport where the two columns have ~160px each to live in.

## Measured on production, iPhone 13 emulation, 390×700

`/prints` with the filter panel open:

```
.kol-filters-row   height 352px   gap 64px
  facet column     height 352px   (Category · Prints · Year)
  count column     height  12px   ("24 of 24")
```

**352 of a 700px viewport** — half the screen is the filter row before a single print is
visible. The 64px is the `gap-16` above.

## The ask

A mobile rung on both. Values are the DS's call; what kol-website needs is that the
seam scales with the viewport rather than holding a desktop constant. If the
divider seam is meant to stay asymmetric, the `pr-4` half is the piece that should
drop below `md` — it exists for the desktop balance only.

## Remainder here once it ships

bump; no consumer change expected — kol-website passes neither gap. If the fix
lands as a prop rather than a breakpoint, `/work` and `/stack` are the two call
sites.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

Mobile rungs on both. Title seam: gap-3 md:gap-6 + pr-2 md:pr-4 — keeps the exact frame-air balance the ContentFiltersTitleGap ruling wanted (12+8 glyph side, 12+8 title side) at half the spend; was 40px of a 390 viewport. Facet columns: gap-8 md:gap-16 on the outer row and the inner group row, kept equal as before. Breakpoint rungs, not props — /work and /stack pass nothing and keep passing nothing.

**Remainder here:** none — kol-website bump kol-component@0.150.0; no consumer change expected.

