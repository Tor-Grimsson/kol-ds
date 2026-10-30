# Session: Resume kit, the Layouts app, the website frame, and a run of lobby tickets

**Date:** 2026-10-29
**Agent:** Claude (Grim)
**Summary:** Fifteen lobby tickets closed with receipts: the resume kit as a package, kolkrabbi.io's frame in the DS, the Layouts app (four frames, every page), a context-split fix across the packages, the Hub's rows editable with an Account tab, and the time set.

## Changes Made

### Packages (published)
- **kol-resume 0.1.0 → 0.2.0** (new): record's resume kit verbatim, the person through `ResumeProvider`; `kitExportPlugin` (export + `/api/out`); controls on DS parts, the treatment toolbar.
- **kol-framework 0.62.0 → 0.62.5**: `WebsiteLayout` + `WebsiteNavbar` · `TakeoverMenu` · `WebsiteFooter` · cursor layer · `WorkViewProvider`, content as props; CategoryPage's header on the cards' edge.
- **kol-foundry 0.14.0**: `WebsiteIntroLoader`.
- **kol-component 0.311.1 → 0.314.0**: `VariantsControl` (catalog's, shipped; drags, `children`, scrolling rows); AsciiCursor's lost fixes; useTilt anti-alias; `TimeSet` (atlas's views + Day); `useScrollFade`.
- **kol-shell 0.87.1 → 0.88.0**: account row outline glyph; editable Hub rows (`home.menu` · `home.signedOutActions` · `shell.foot` · `phoneNav.more`); `signIn.account` tab.
- **kol-styleguide 0.15.0**: AssetTable on the column; `A4Pages paged`.
- **kol-theme 0.197.0**: `kol-components-time.css`, `.kol-scroll-fade`.
- **kol-hardware 0.9.0/0.9.1**: `TimeStrip` docked (`framed` · `span` · `gutter`).
- Sweeps: every relative import names its file (148); every context made once on a global key (25) — Vite 5 split contexts in installed copies. kol-chess · dashboards · workshop · deck · print patched along the way.

### Apps and fixtures
- `apps/resume` (5211), `apps/layouts` (5212: four frames, VariantsControl chooser with page info, navs as used).
- `voyager-fixture`: résumé person, letters, portfolio; marks on currentColor (self-test); `documents/field-manual-brief.md`; `timeline.js`.
- `media-fixture` deck text is VOYAGER's (it carried another client's name, people, brands).
- studio-hub's sign-in uses the Account tab.

### Gates and docs
- `validate-placements` (pages under a frame, docs tables match, page info), `validate-relative-imports` (extensions + bare contexts). `showcase/src/nav/placements.js` is the one list.
- Docs: `22-resume`, `23-website-frame`, page tables in 18/16/04, Hub rows/Account in 16, fade in 18.

## Current State

### Working
- Inbox empty; every ticket closed with a receipt and the filer's row flipped.

### Known Issues
- AssetTable at 1280 scrolls inside the brand book's 790px column (seven columns need 945).
- `phoneNav.more` built but not walked on a touch device.
- The user's own `pnpm layouts` (5212) needs a restart to pick up CategoryPage's `mx-0`.

## Next Steps
1. Push (his).
2. kol-website: record onto kol-resume, WebsiteLayout, TimeSet; drop `outLibraryPlugin`.
3. kol-fxr: AccountRail → `signIn.account`; TimelineDock on docked `TimeStrip`.
