---
component: IconSetExternal
source: kol-website/apps/metric (plan 2026-10-30-metric-style, 9.5) — files already placed in packages/icons/src/kol-icon-set-external/
staged: 2026-10-31
status: draft
deps: [Icon]
---

# IconSetExternal — a fourth kol-icons set for marks drawn by others

## Purpose
The metric dashboard needs country flags and third-party brand marks (browsers, OS, socials, service providers). They are colour, drawn by others, and never recoloured — so they cannot live in `interface` (single-ink `currentColor`). The user named the set **`external`** (2026-10-31), groups `flags` and `brands`.

## What is already in the repo (placed by /lobby-icon, 2026-10-31)
- `packages/icons/src/kol-icon-set-external/flags/flag-<iso>.svg` — 39 round flags (the user's library, Figma 91RgXQdroY01wN96lAiOv1, 151-25994).
- `packages/icons/src/kol-icon-set-external/brands/<name>.svg` — 20: android apple bing chrome duckduckgo edge facebook firefox github google instagram ios kagi linux openai opera pinterest safari twitter windows. Colour from 151-27903 where it exists; solid (`currentColor`) for apple, github, windows, openai; openai is Bootstrap Icons (MIT).
- `packages/icons/src/kol-icon-set-interface/device/` — `laptop.svg` (stroke 1.5), `laptop-solid.svg`, `vr-headset.svg` (from 160-20584 / 160-20551 / Bootstrap headset-vr).
- Every external glyph is fitted to the KOL keyline on the 24 grid: viewBox `0 0 24 24`, round marks fill 20, square 18, as a `<g transform>` around the source drawing. Ids are prefixed per icon. The review page: https://claude.ai/artifact/8cumZayEFVa9pBiCVdxKTp

## Ask
Wire the set into the package the way `identity` was added (0.49.0):
1. `iconNames.js` — `EXTERNAL_NAMES` from `./kol-icon-set-external/**/*.svg`; `setOf` resolves `interface → signal → identity → external`.
2. `Icon.jsx` — an `external` chunk loader beside the other three (`./sets/external.js`).
3. `index.js` — `KOL_ICON_SET_EXTERNAL` (grouped by folder: `flags`, `brands`) and its names export, for the gallery.
4. The colour rule: this set is exempt from `currentColor` (flags and colour brand marks keep their fills); its solid members already use `currentColor`. `cuts.json` / `extract-icon-cuts` should record them (`cut: 'color'` or skip).
5. The showcase Icons page shows the new set.
6. Publish kol-icons.

## Not asked
- No recolouring or redrawing. Raster favicons are not in the set (metric keeps them locally).
- The `time` group comes from ClaudeListIconSet's import, not from here.

## Definition of done
- [ ] `<Icon name="flag-is" />`, `<Icon name="chrome" />`, `<Icon name="laptop" />` render from the published package
- [ ] the showcase lists `external › flags · brands`
- [ ] kol-icons published; version cited here

## Built — 2026-10-31

Files changed:
- `packages/icons/src/iconNames.js` — `EXTERNAL_NAMES`; `setOf` resolves interface → signal → identity → external.
- `packages/icons/src/sets/external.js` — new: the external chunk (all SVGs under `kol-icon-set-external/**`).
- `packages/icons/src/Icon.jsx` — `external` chunk loader beside the other three; doc comments.
- `packages/icons/src/index.js` — `KOL_ICON_SET_EXTERNAL` (flags · brands), `_NAMES`, `_META`, folded into `KOL_ICON_META`.
- `scripts/extract-icon-cuts.mjs` — walks the external set; a glyph there without `fill="currentColor"` is cut `color`.
- `packages/icons/src/cuts.json` — regenerated: 431 glyphs (79 solid · 297 stroke · 55 color); also picks up `laptop` · `laptop-solid` · `vr-headset`.
- `showcase/src/pages/IconsGallery.jsx` — `kol-icon-set-external` in `ICON_SETS`; Type filter gains `Color`.
- `showcase/src/nav/icon-categories.js` — `kol-icon-set-external: []` (each group its own page, like identity).
- `packages/icons/CHANGELOG.md` — Unreleased entry.
- `docs/documentation/02-icons/01-inventory.md` — External set section; `device` row + count 263.
- `docs/documentation/02-icons/INDEX.md` — four sets, resolution order, `color` cut.

Verified:
- Gates: `icon-cuts` clean (431), `validate:imports` clean, `validate:relative-imports` clean. `validate:icon-ink` has 3 violations, all pre-existing in files not touched here (AppItemMenuProvider, NavRailSite, kol-framework.css); the gate scans call-site classes, not SVG fills, so the colour set needs no exemption.
- Showcase (Playwright, :5293): the rail lists External › Brands · Flags; `/icons/kol-icon-set-external/flags` renders `flag-is` (its mask in the DOM, in colour), `/brands` renders `chrome` in colour and the solid `apple` in ink, `/icons/kol-icon-set-interface/device` renders `laptop` · `laptop-solid` · `vr-headset` — all via `<Icon name>`.

Not done (out of this build's scope): version bump, publish, ticket close — DoD items 1 (from the published package) and 3 stay open.

## ✅ RESOLUTION — 2026-10-31 · kol-icons@0.54.0

kol-icon-set-external is the fourth set in kol-icons 0.54.0: flags (39 flag-<iso>) and brands (20), colour marks never recoloured; the solid brands (apple, github, openai, windows) ink currentColor. Its own chunk (sets/external.js); setOf resolves interface → signal → identity → external; KOL_ICON_SET_EXTERNAL · _NAMES · _META exported; cuts.json records a new cut, color (55 glyphs). device gains laptop · laptop-solid · vr-headset. The showcase lists External › Brands · Flags and the gallery's Type filter has Color. Verified in the showcase: flag-is, chrome and laptop render through <Icon name>.

**Remainder here:** none — kol-website bump kol-icons 0.54.0.

