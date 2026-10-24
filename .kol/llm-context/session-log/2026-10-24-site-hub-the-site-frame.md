# Session: site-hub — the site frame made once, the rail as a system

**Date:** 2026-10-24
**Agent:** Claude (Grim)
**Summary:** `apps/site-hub` is to the sites what studio-hub is to the Studio apps: kol-framework's frame (now `SiteLayout`) with `NavRail variant="site"` on VOYAGER — and a day of his rulings on the rail landed in the packages: the foldernote, uppercase groups at one ink, the theme row, the clip-model collapse, the rung on a press, no auto-expand, the app rail's phone drawer, the chrome inset. Plus the content parts for W4 (`.kol-sheet`, `PageControls`, `CategoryPage`, the article card's zoom off) and `apps/shell` under either rail. Unpublished. Earlier the same session: fxr's final pass (71/71), the Studio's chrome mark question, fxr's Library to forty files.

## Changes Made

### Files Modified
- `apps/site-hub/*` — new apps/* member (5205, `host: true`, `/apps/site-hub`): Home (the landing hero on VOYAGER's mood), Brand (a foldernote, every chapter grouped), Assets, Research (Overview · Compare · Sheet · Boards), the rest of the rail as rows; `OPENERS` so the bare row lights at the top; the walks in `_tmp/2026-10-24-site-hub-walk/`
- `packages/framework/src/SiteLayout.jsx` (was `PageLayout.jsx`; `PageLayout` and `AppShell` alias it) — the phone mode is the app rail's drawer: `data-rail-drawer`, the 32px nav Button top-right, the scrim button, Escape; the old hamburger/backdrop in `_tmp/2026-10-24-site-drawer/`
- `packages/framework/src/SideNav.jsx` · `ThemeToggle.jsx` — the theme slot is a tree row (`variant="row"`), its tooltip the rail's, present in both states
- `packages/framework/src/CategoryPage.jsx` — new: the foldernote's overview from the nav tree (`card` rows)
- `packages/component/src/organisms/NavRailSite.jsx` — the foldernote (`to` with `pages`: the row opens and discloses, the caret alone toggles); group headers uppercase at one ink; rows under a group 2px in; `RouteLeaf` hoisted (rows no longer remount); the Tooltip wraps rows in both states; `expandOnSelect` defaults off; the x geometry on `--kol-pad-chrome-x`
- `packages/component/src/molecules/PageControls.jsx` — new: the page's own controls strip (toggles · views · count · jump · legend)
- `packages/component/src/molecules/ContentCard.jsx` — article's hover zoom off
- `packages/component/src/hooks/useDragResize.js` — a press from collapsed lands on the viewport's rung (clears a dragged width)
- `packages/framework/kol-framework.css` — the clip-model collapse (gutter and gap eased, label faded, caret faded), the gutter on the chrome inset, the phone drawer on the shell's curve, reduced-motion guards
- `packages/theme/kol-components-atoms.css` — the rail row's transition list carries padding and gap
- `packages/theme/kol-typography.css` — `.kol-sheet`, the Research-Spec's document voice on KOL tokens
- `apps/shell/src/App.jsx` — the Variants button, one axis: Rail app · site (SiteLayout on a hash router)
- `apps/brand/src/App.jsx` · `showcase/src/{nav,pages,previews,docs}` · `scripts/validate-render.mjs` — the rename, the two previews, the classification, the routes
- `docs/documentation/04-compositions/18-site-frame.md` · `docs/operations/07-apps-tier/08-site-adoption.md` — new; rows in `01-inventory`, `03-typography`, the apps tier, the two INDEXes; `SideNav.mdx`, `ThemeToggle.mdx`, `ContentCard.mdx`
- `_tmp/2026-10-24-hubs-pass/pass*.mjs` — fxr's FileCover allow row; the pass 71/71
- `lobby/outbox/one-search-modal.md` + `kol-branding/lobby/inbox/one-search-modal.md` — the second search modal, filed

### Features Added/Removed
- The site frame as a system: `SiteLayout` + a nav tree + routes; the tree contract (category · foldernote · link · page · group · card · lede)
- The rail: the foldernote, uppercase groups at one ink, the theme row, one-motion collapse, the rung on a press, no auto-expand, the app rail's drawer on the phone, the chrome inset gutter
- The content parts: `.kol-sheet`, `PageControls`, `CategoryPage`; the article card no longer zooms
- `apps/shell` shows both rails; `apps/site-hub` is the reference for the sites

## Current State

### Working
- site-hub walks green at 1440 and 390, both themes (the W1 walk 14/14, the research walk 38/38, the theme row 14/14, the drawer, the collapse sampled per frame); render gate clean on site-hub, shell, brand; roster · taxonomy · syntax · imports · props · helper-text · reachable · metadata · vault-links clean
- fxr: the final pass 71/71 from here; its Library forty files with Upload image on every card (its session's report)

### Known Issues
- Unpublished: kol-theme, kol-component, kol-framework carry the wave — `/upig`
- The previews browser gate was stopped mid-crawl (a whole-showcase walk); StudioDetail's missing preview and three docs' long descriptions are the morning session's
- His review of site-hub's content pages is parked at plan 4.7 (the hero band on Overview/Compare/Boards, the strip's ground, the plane's width, the sheet specimen, the board plate)
- The chrome mark on fxr's card hover was dropped on his word ("its fine")

## Next Steps
1. `/upig` the wave; then the sites adopt per `docs/operations/07-apps-tier/08-site-adoption.md` (kol-branding first — its `one-search-modal` ticket waits in its lobby)
2. Plan 4.7 when he has time; W3 (the pass against the site repos) parked
3. The package default footer (the credit) — site-hub passes `footer: false`; whether the default follows is his

## Amended — 2026-10-24

- Published: kol-theme 0.186.0 · kol-component 0.298.0 · kol-framework 0.54.0 (`/upig`), changelogs written, `docs/operations/01-release/02-shipped-packages.md` bumped, `PageLayout` → `SiteLayout` on `04-retirements.md`.
- The registry showed the previous versions on the one check after the PUT (the usual lag); push pinged.
