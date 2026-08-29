# MediaKindsExportPath — `utilities/mediaKinds` and `utilities/ratios` resolve to files that do not exist

**Staged:** 2026-08-27 · from **kol-r2b2** (hit while adopting MediaLibraryPages, component 0.118.0)
**Change:** kol-component `package.json` `exports` — two missing entries

## The gap

`exports` maps `"./utilities/*": "./src/utilities/*.jsx"`. Both files promoted from kol-r2b2 in 0.118.0 are `.js`:

```
./src/utilities/mediaKinds.js   ← kindOf · KINDS · KIND_LABEL · DEFAULT_KINDS · partition · groupVariants · groupSegments · posterFor · isSystemFile · isSegment
./src/utilities/ratios.js       ← nearestRatio · RATIOS
```

So `@kolkrabbi/kol-component/utilities/mediaKinds` resolves to `mediaKinds.jsx`, which is not there — `ERR_MODULE_NOT_FOUND` in node, and the same path in a bundler. The barrel exports both (index.js:153-154) but is not reachable from a consumer that lacks `react-router-dom`, which `ExitPreview` drags in.

This is the same fault fixed for `id3` and `frontmatter` in 0.114.0 — they got explicit entries; these two were missed.

## The ask

```json
"./utilities/id3": "./src/utilities/id3.js",
"./utilities/frontmatter": "./src/utilities/frontmatter.js",
"./utilities/mediaKinds": "./src/utilities/mediaKinds.js",
"./utilities/ratios": "./src/utilities/ratios.js"
```

Better, if you would rather not add one line per file: map the extension-less subpath to both, `"./utilities/*": { "default": ["./src/utilities/*.jsx", "./src/utilities/*.js"] }` — or rename the four `.js` utilities to `.jsx` so the wildcard covers them. Any of the three closes it; the explicit entries match what is already there.

## Meanwhile

kol-r2b2 restates `KINDS` and `DEFAULT_KINDS` as two literals in `src/lib/settings.js` — the only thing it needs — with a pointer to this ticket. Nothing else is forked.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.118.1

Explicit `exports` entries for every `.js` utility — `utilities/mediaKinds`, `utilities/ratios` (beside the 0.114.0 `id3` / `frontmatter` ones) — so the subpaths resolve without the barrel. 22 gates clean.

**Remainder here:** none — kol-r2b2: bump kol-component 0.118.1; drop the two restated literals in `src/lib/settings.js` and import `KINDS` / `DEFAULT_KINDS` from `@kolkrabbi/kol-component/utilities/mediaKinds`.
