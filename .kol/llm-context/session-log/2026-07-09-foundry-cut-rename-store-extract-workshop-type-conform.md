# Session: kol-foundry cut/rename (0.2.0) + kol-store extraction + workshop chrome type-conformance

**Date:** 2026-07-09
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Extracted the store delta from kol-monorepo, cut kol-foundry to type-only (membership test) and republished it 0.2.0 after a specimen→foundry naming detour, then moved the workshop shell/docs/nav chrome's type+color onto inline `kol-*` classes (dev-tools-visible) and gutted the `.shell-*`/`.docs-*` CSS clusters.

## Changes Made

### kol-store — delta extracted from kol-monorepo
- **`packages/store/src/`** — added `PrintsGrid`, `PrintGridCard`, `PrintGridCardGsap`, `PrintBuyButton` (URLs severed to injected config) + `./data/prints.js` (24-print demo fixture, chess pattern). `ProductDetailLayout` gained opt-in commerce props (`editionOptions`/`shippingOptions`/`computePrice`/`renderActions`); old API intact. `package.json` gained the `./data` subpath.
- **`ScrollDriftGallery` de-duped** — the "Drift" gallery already ships in `@kolkrabbi/kol-content`; store composes content's engine with a prints `renderCard` rather than shipping a twin.
- `PriceDisplay` confirmed store-only (not in kol-component — no duplicate).

### kol-foundry — cut to type-only + republished 0.2.0
- **Deleted 13 non-type components** (failed the membership test *"does it render/inspect/manipulate a live font?"*): `ButtonGroup`, `FoundryCTA`, `FoundryFeatureSection`, `FoundryLicenseQuestions`, `InDevelopmentSection`, `FoundryTypefaceDetails`, `FoundryOtherTypefaces`, `FoundryTypefacePairing`/`PairingsList`/`PairingCard`, `FoundryOpentypeFeatures`/`FeatureGrid`/`FeatureCard`.
- **Kept 13** — specimen tools + typeface-catalog grid + `TypefaceSpecimenPage` (reworked to drop the cut sections). `kol-components-foundry.css` deleted (all 3 classes were cut-only) + theme import removed.
- **Naming detour** — renamed → `kol-specimen`, then **reverted to `kol-foundry`** after finding `kol-foundry@0.1.0` is already live on npm (a stale AGENT-CONTEXT note said "unpublished"). Reuse the live name, hand-bump **0.2.0** (cut = breaking). "specimen" reserved for a future paragraph/layout tester.
- `packages/foundry/COMPONENTS.md` = the roster. Docs synced: ARCHITECTURE §3, 05-foundry-system, package-topology, INDEXes.

### Workshop chrome — type/color moved into JSX
- **~18 JSX files** (package `packages/workshop/src/*` + drifted local `showcase/src/workshop/*`) — nav rows, TOC lines, tabs, doc headings, frontmatter, search fields/results, tags now carry `kol-helper-*` / `kol-mono-*` / `kol-sans-*` + `text-meta/body/emphasis/subtle` **inline** (dev-tools-visible). Rendered markdown body wrapped in `.kol-prose`.
- **`packages/theme/kol-components-workshop.css` + `showcase/src/workshop/shell/shell.css`** — stripped `font-family/-size/-weight`, `line-height`, `letter-spacing`, `color` from every `.shell-*`/`.docs-*` rule; structure only. Killed `.shell-tab`/`.shell-nav-header` type that was overriding the new inline classes.
- Fixed undefined `--kol-palette-red` → `--kol-color-red-200`; deleted dead `--kol-palette-blue` rule.

## Current State

### Working
- kol-foundry@0.2.0 staged (13 exports), kol-store delta in place — both import-clean, `pnpm install` clean.
- Workshop chrome renders kol type/color from the markup; CSS clusters carry structure only.

### Known Issues
- **NOT render-verified** — foundry/store deltas + workshop conformance are structurally sound but un-eyeballed. User validates live.
- `.kol-prose` caps the docs body at 720px (DS prose measure) — `max-w-none` if full width wanted.
- Workshop kol classes lost the 1600px responsive font-size bump (fixed classes can't step size at a breakpoint).
- `--kol-palette-blue/red` still referenced by the **dashboards** local files (out of scope; defined in showcase `index.css`, so not broken there).

## Next Steps
1. **Publish kol-foundry@0.2.0** — push → CI publishes (reuse of live 0.1.0 name; optional `npm deprecate` 0.1.0).
2. Render-verify `/workshop-docs` + `/workshop-preview` (nav/markdown/search/tags read right) and the foundry/store showcase sets.
3. Deferred: extract `@kol/fontviewer` VF engine + the site loader (`ColorLoader`/`TextPressure`) + `FontPreviewCard` into kol-foundry.
