# Session: The Content Set drop, the token families, and the sunken tone

**Date:** 2026-08-29 → 2026-08-30
**Agent:** kol-ds-ui (iMac)
**Summary:** Eleven tickets closed, the Content Set retirement finished, six page-named card variants became four content kinds, the opacity families were split into flipping and frozen, and the `sunken` tone was found to have been rendering RAISED since it shipped.

## Changes Made

### The retirement wave, finished
`ContentSetRetirement` step 3: nine exports dropped from five barrels — `MediaCard` · `MediaRow` · `GridCard` (shell) · `PrintGridCard` · `ListingCard`/`ArticleCard` · `WorkCard` · `WorkListItem` · `TypefaceLibraryItem`. Sources quarantined to `_tmp/2026-08-30-content-set-exports/`. Six surfaces migrated in the same pass, including kol-store's own `PrintsGrid` (which imported `PrintGridCard` internally). Dropped early on evidence — the estate sweep showed no consumer outside this repo — rather than aged out.

### Variants are content kinds now
Six page names → four kinds: `default`→`file`, `print`→`catalog` (folded; `flip`/`fade` became props), `work`→`showcase`, `typeface`→`showcase layout="canvas"`. All four old names alias. The ask was "name them by SHAPE" and that could not work — one variant name drives BOTH `ContentCard` and `ContentRow` and their shapes diverge by design.

### The token families
`ab` (pure `#000`/`#fff`) now FLIPS toward the ground; `absolute` (the theme's `#0e0e11`/`#fcfbf8`) is the frozen family and stopped being a deprecated alias. Three ladders that never existed were added: `fg-ab-inverse-*`, `fg-absolute-inverse-*`, `oq-absolute-*`+inverse. The `ab` ladder gained a `100` stop — the pole with no mix.

### Files Modified — the load-bearing ones
- `packages/theme/kol-base-tokens.css` — the two pole pairs, `--kol-surface-sunken`
- `packages/theme/kol-opaque.css` · `kol-opacity.css` — the four families, the 100 stop
- `packages/theme/kol-components-molecules.css` — the sunken tone, the three-rung state ladder
- `packages/component/src/molecules/ContentCard.jsx` · `ContentRow.jsx` — the kinds, `specs`, `ratio`, `minHeight`, `ratioAxis`
- `packages/component/src/molecules/Slider.jsx` · `atoms/RotaryDial.jsx` — dual thumbs, playhead, `readout`, alt-click reset
- `packages/component/src/utilities/useGrabEdge.js` — new, the shared grab gesture
- `packages/shell/src/SettingsScaffold.jsx` — rebuilt on `ContentFilters`
- `packages/shell/src/AppShell.jsx` — settings toggle, `useSettingsToggle`
- `scripts/validate-props.mjs` · `validate-dd-trigger.mjs` — new gates 24 and 25

### Shipped
theme 0.95.0 → **0.111.0** · component 0.130.0 → **0.143.0** · shell 0.19.1 → **0.30.0** · framework → **0.36.0** · store **0.3.0** · content **0.14.0** · foundry **0.9.0**

## Current State

### Working
- 25 gates clean, showcase builds, inbox empty, queue at 20.
- Two new gates: `props` (a docstring and its signature must agree) and `dd-trigger` (rest and open only).
- `/sets/content-set-reference` — every kind in both forms, real components, box values from source, and where each renders.

### Known Issues
- ⚠️ **`sunken` was RAISED since it shipped.** It borrowed `--kol-oq-inverse-96`, built from the theme's near-white, landing 23.7 on an 18.2 dark page. Reported repeatedly by the user and missed every time, because the diagnosis was written twenty lines above the rule and never applied.
- ⚠️ **Three defects this session were "a documented seam wired to nothing"** — Slider's `style`, Slider's `--kol-slider-track`, ContentRow's `ratio`. All three found by consumers, none by the gates. That is what gate 24 exists for now.
- ⚠️ **I shipped a fix at the wrong layer and had to revert it.** 0.108.0 made every sunken component paint the page wash; the user's objection — *"we are talking about components, wash affects background"* — was correct, and portalling proved it inside the hour.
- ⚠️ **`showcase`/`showcaseCanvas` took four tickets** for one sentence ("make it look like /work"), because each pass named only the state someone had looked at. Diff EVERY state: rest, hover, selected, focus.
- ⚠️ Two maps keyed by variant NAME (`FILL` in ContentText, `RATIO`/`HOVER`/`MEDIA` in ContentCard) mean a spread between boxes silently misses them. Two honest literals beat a derive.
- ⚠️ The lobby is one-way: a publish pokes nobody, so the user had to tell three repos to bump by hand. His call when to fix.

## Next Steps
1. 🔴 **Shadow vs mirror** — light-mode sunken is the pure pole now by the user's call; dark stayed at 96. Ruled, but the general principle is not written down.
2. 🔴 **`PageGutterOwnership`** — answered without building (`.kol-page` has been the owner since 2026-07-30), but kol-website has to adopt it on ~8 routes.
3. The `navKeys` gap: only kol-mirror uses it. fxr and monitor run local copies for reasons that are partly stale (fxr's comment cites a bug fixed in 0.19.0) and partly real (dynamic `items`, sticky-⌥).
4. No repo renders `SettingsScaffold`'s masthead cluster or `useDragResize`'s new grab yet — both are source-verified only.
