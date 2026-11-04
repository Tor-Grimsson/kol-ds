# Session: Figma library mirrors the showcase, Modules tier, screens from slotted modules

**Date:** 2026-11-03
**Agent:** Claude Opus 5.5 (Grim)
**Summary:** Rebuilt the Figma library on the showcase's structure in three rounds, added the Modules tier to code and docs, and rebuilt every Apps screen from slotted module instances.

## Changes Made

### Files Modified
- packages/component — Rail, ShellDrawer → organisms; ButtonGroup → molecules; exports aliases keep old deep paths; 0.333.1 published.
- showcase/src/nav/{classification,registry,roster}.js, scripts/validate-roster.mjs, showcase/src/lib/ShellChrome.jsx — new `modules` tier (ShellLayout, AppHub, AppStudio, PageShell, SiteLayout, WebsiteLayout).
- showcase/src/pages/{Library,Components}.jsx — LADDER (App › Module › Organism › Molecule › Atom) and "The ladder" section on /components.
- docs/documentation/03-components/00-taxonomy.md (§ The ladder), 00-overview/05-names.md (Module).
- 8 single-organism showcase examples → `_tmp/2026-11-03-single-organism-modules/`.
- scripts/extract-figma-manifest.mjs + `pnpm figma:manifest`; figma/scripts/{kol-card,kol-sheet}.js + README; Code Connect files for the new parts.
- Plans: plan-2026-11-03-figma-mirrors-showcase.md, -figma-round-2.md, -figma-round-3.md.

### Features Added/Removed
- Figma sidebar in his convention (Cover, dividers, ➤ Library / Styles / Collection, ↳ pages, _trash); master pages vs view pages.
- Components page: tier columns incl. Modules, 110 cards + 323 placeholders; Foundations sheets; Icons as an instance gallery.
- ~30 new parts measured from live (shell parts, website parts, Section family, brand pages); ShellLayout, SiteLayout, AppShell, AppStudio, PageShell, WebsiteLayout with slots + phone variants.
- Apps screens rebuilt as module instances (0 captured HTML frames).
- Avatar initials bound to font/sans-narrow + font-style/narrow-dark at the code's sizes (12/14/16/20).
- Lobby: HubHomeSignedOutPinned, FloatsOverlayNoBands, FloatsRailOverlaysShadow, FloatFoldBothSidesGrey built and closed (kol-shell 0.99.2–0.100.0, kol-component 0.333.0).

## Current State

### Working
- Figma library structure final; the DELETE pages are gone (he removed them).

### Known Issues
- TabsRow `text-[var(--slot-ink)]` never generated — the floating nav's icon ink doesn't apply.
- Not drawn: BrandBook below the fold, BrandAssets below Logos, /work list view, CodeBlock, Avatar xs.
- Showcase still has the old "Modules" composition chapter beside the new Modules tier.

## Next Steps
1. He republishes the library.
2. Fix the TabsRow `--slot-ink` bug.
3. Draw the undrawn parts above when he wants a round 4.

## Amended — 2026-11-03

- Avatar initials: the font-style variable stuck on "SemiBold" after the swap cleared; he replaced it by hand with Right Grotesk Narrow Dark.
- JetBrains Mono NL on Icons WIP (a pasted frame, not script-built) replaced by him with JetBrains Mono.
- He deleted the DELETE pages and republished the library — round 3 is live.
- Lesson: binding a font-style variable under the Schibsted swap leaves Schibsted's style name ("SemiBold") behind when the mode clears; set the RG style name by hand or avoid scripting style bindings.
