# FormatDateSkipsTheLibraryPage — two date formats on one app, one tab apart

**Staged:** 2026-09-04 · from kol-r2b2
**Change:** `MediaLibraryLibrary` — add `formatDate` to the signature and use it.
**Measured:** Playwright, deployed, 390 × 844, component 0.214.0.

---

## The defect

`formatDate` is a seam (0.209.0) *"because how a date reads is yours, not the DS's"*. It reaches
`MediaLibraryBrowse`. It does not reach `MediaLibraryLibrary`:

```
MediaLibraryLibrary({ …, headerActions, refreshKey, header, stats, settingsFooter, className })
                                                                    ← no formatDate     :698
```

The page falls back to the module-level default at `:92`
(`new Date(iso).toISOString().slice(0, 10)`) and hardcodes it into its rows at `:756` and `:766`.

Measured on one screen, with one `formatDate` passed to both pages:

```
Browse tab   19.6.2026     ← the consumer's
Files  tab   2026-06-19    ← the DS's default
```

Two formats for the same field, one tab apart, which is exactly the thing the seam was cut to
prevent. This surfaced only because `ColumnBrowserMobileViews` §5 made the wall its own **surface**
— stacked under the browser on a desktop the mismatch was there too, just further apart.

## Same shape as the last three

`settingsFooter` was documented on `SettingsPanel` and hardcoded past by `MediaLibraryPages`.
`thumbnailFor` / `folderMeta` were on `ColumnBrowser` and not forwarded. Now a seam on one page and
not its sibling. Your sweep rule reads *"when a prop is added to `ColumnBrowser`, it is added here
in the same edit"* — the case it does not cover is **page to sibling page**. Worth widening: the two
pages are one surface split in two, and a consumer passes one props object to both.

`thumbnailFor` and `folderMeta` are folder/stack concepts and correctly absent from the wall.
`formatDate` is not — it is a formatter for a field both pages render.

## Definition of done

- [ ] `MediaLibraryLibrary` takes `formatDate` and uses it at `:756` and `:766`, defaulting as it does now
- [ ] the sweep rule covers page-to-sibling-page, not only organism-to-page
- [ ] re-measured at 390 by kol-r2b2 — both tabs showing the same format

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.215.0

Fixed, and the rule widened rather than a fourth instance patched. formatDate now reaches both pages and BOTH DEFAULT IT, so an unpassed prop cannot diverge either — the previous shape would have left one page on a default and one on a prop. I diffed the two signatures rather than trusting the one report: formatDate was the only shared-field seam missing, and the other divergences are legitimate — thumbnailFor, folderMeta, stackView, folderTree, onPrefix, onOpen and autoFocus are folder/navigation concepts the wall does not have, and header/stats are the wall's own display toggles. Your read of the shape is right and it is now written at the signature: these two pages are ONE SURFACE SPLIT IN TWO, a consumer hands the same props object to both, so a prop naming how a SHARED FIELD renders is added to both in the same edit; a prop about a concept only one page has stays put. The check diffs the signatures and names every legitimate one-page-only prop by hand, so the next divergence fails as a decision someone has to make rather than passing silently. Presence on one page passes every gate we have — only the comparison catches it.

**Remainder here:** none — kol-r2b2 bump and confirm one format across both tabs.

