# SettingsShortcutsGridColumns — six hardcoded columns, 18px each at 390

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** defect in `kol-shell` `SettingsShortcuts`. Measured in a browser, not inferred.
**Version seen:** kol-shell **0.35.0** (current head), kol-theme 0.121.0, kol-component 0.152.0

## What

`SettingsShortcuts.jsx:30`:

```jsx
<div className={`grid grid-cols-6 grid-rows-2 grid-flow-col gap-x-12 gap-y-6 ${className}`.trim()}>
```

`grid-cols-6` is a desktop constant with no mobile rung. Measured on kol-mirror's
`/settings` at **390 × 844**, Playwright, 2026-09-01:

| | |
|---|---|
| Container | 350px |
| `gap-x-12` × 5 | 60px of it |
| Computed tracks | `18.33px 18.33px 18.33px 18.33px 18.33px 18.33px` |

Every shortcut group renders in an 18px sliver. The section is a column of
single characters — the combo glyph survives, the label is gone. Screenshot in
kol-mirror `_tmp/2026-09-01-mobile-qa/`.

## Why this is the DS's and not ours

There is no consumer seam. `SettingsShortcuts` takes `items` / `searchKeys` /
`className`; `className` lands on the same element, so a consumer would be
fighting `grid-cols-6` with a specificity override on a class the DS owns.
kol-mirror passes nothing unusual — `items` + `searchKeys`, per
`SettingsMastheadCluster`.

## This is the same defect you have already closed twice

- `ContentCollectionMinColumnWidth` / `ContentGridMinColumnWidth`
- `CatalogPageMobileColumns` (kol-monitor) — shell **0.33.0**, whose changelog
  line is the ruling this asks you to apply once more: ***"CatalogPage's cols is
  a ceiling, not a command"***, `repeat(6, 1fr)` computing six 29px slivers at 390.

`SettingsShortcuts` is the fourth home and was not swept with the third.

## Asked shape

The 0.33.0 idiom, unchanged: **up to** 6 columns, no track under a floor, none
wider than the container — so the count falls out of the width. A shortcut
group's floor is wider than a card's; the widest label in mirror's set is
`GRAB AND PAN THE DESK` and the widest combo `Space + drag`, so **~150px** is
the honest floor. Two columns at 390, six on the desk, and desktop does not
move.

`gap-x-12` (48px) is the second half — 60px of a 350px row is 17% spent on
gutters. `gap-x-6 md:gap-x-12` is the rung `ContentFiltersMobileGaps` already
established for this exact shape.

## What kol-mirror is doing meanwhile

**Nothing.** There is no override worth carrying for this one — a specificity
fight with a DS-owned utility class is the mechanism this ledger exists to stop,
and the section is legible on the desk where it is actually used. We will bump
and re-measure at 390.

## Not asks

- The two-row `grid-rows-2` shape. It is right on the desk and falls out of the
  fix on a phone.
- Anything about `SettingsScaffold`'s tab strip, which clips at 390 (`REPO` is
  cut) but scrolls and is legible. Filed only if you want it — say so and we
  will measure it properly rather than bundle a guess.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.36.0

The 0.33.0 idiom, applied once more: repeat(auto-fill, minmax(min(100%, max(150px, sixth-share)), 1fr)) — no track under 150 (your GRAB AND PAN THE DESK / Space + drag, the widest cells in the estate), none wider than the container, so the count falls out of the width: two at 390, six on the desk, where the sixth-share clears the floor and nothing moves. Below md the grid flows by ROW — the column-first two-row shape stays a desk ruling, because with a fixed row count the extra groups would spill into implicit columns off the right edge, which is the one way the ceiling idiom can still overflow. Gap gap-x-6 md:gap-x-12, the ContentFiltersMobileGaps rung. You were right that it was the fourth home and unswept with the third; I grepped the shell for grid-cols- after this one and it is now the last. The tab-strip clip you mentioned: file it when you have the measurement, I will not guess at it. Verified in the published tarball. No consumer change.

**Remainder here:** none — kol-mirror bump kol-shell@0.36.0 and re-measure /settings at 390 — expect two columns of 150+.

