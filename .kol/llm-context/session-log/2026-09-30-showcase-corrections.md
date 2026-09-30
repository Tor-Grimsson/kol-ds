# Session: Showcase corrections (W1–W6)

**Date:** 2026-09-30
**Agent:** Grim (kol-ds-ui, MBP)
**Summary:** The user's review of the showcase build, answered — the ⌘K palette, the rails, homes for every level, Group by as a page, Packages as a space, Search views. Published kol-icons 0.31.0 · kol-component 0.231.0 · kol-workshop 0.34.0.

## Changes Made

### Files Modified
- `packages/component/src/organisms/ShellSearchOverlay.jsx` — inset field, `suggestions`, group headings, rows on the field's geometry, `kol-tone-grey`, footer that says what Enter does
- `packages/component/src/molecules/SearchInput.jsx` — `bare` on the size ladder, `oq-48` glyph, ⌘ drawn as an icon, chip → `Kbd`
- `packages/component/src/atoms/Kbd.jsx` — new atom (sm/md, `icon`); demo + classification added
- `packages/icons/…/arrow/corner-down-left.svg`, `…/code/command.svg` — new glyphs; cuts regenerated, inventory header corrected 219 → 233
- `packages/workshop/src/shell/RailSection.jsx` · `ShellSidebar.jsx` — own chevron, label opens page / chevron folds, folded by default, childless = row
- `packages/workshop/src/docs/DocumentationReader.jsx` — `rail` prop; `search/ResultRow.jsx` + `SearchPage.jsx` restored from 0.32.0
- `showcase/src/homes/*.md` — 17 new homes (Foundations, Icons, Guides, Group by, Open questions, 10 Functions, Block + Card categories); `scripts/validate-homes.mjs` gate
- `showcase/src/pages/GroupBy.jsx`, `GuidesHome.jsx`, `Components.jsx`, `Blocks.jsx`, `Cards.jsx`, `Search.jsx`, `DevTools.jsx`, `App.jsx`, `lib/ShellChrome.jsx`, `nav/shell-nav.js` — routes, rails, Packages space, Search views
- Docs: `05-names`, `04-workshop-system`, phase log entry *Showcase fixes*, plan `plan-2026-09-30-showcase-corrections.md`

### Features Added/Removed
- Added: `Kbd`, `suggestions` on the palette, `/components/group-by`, `/components/function/:fn`, `/blocks|cards/category/:cat`, `/styles/guides`, `/packages`, `/search/{tags,graph,index}`, `validate:homes`
- Removed: Package as a Group-by axis (now a filter); Cards and Packages-in-Development as such (Cards → Blocks rail; Packages → own space); the `ResultRow` deprecation

## Current State

### Working
- 32 gates clean; three packages published. The `ContentRow` swap was reversed — the originals are in `_tmp/2026-09-30-resultrow-restore/`.

### Known Issues
- Palette, results page and rails are gate-clean but not looked at in a browser.
- Filters on the Components index are read from the URL but not written back.
- Right-rail tags (own tags by namespace) — a Settings toggle back to the old rail is proposed, undecided.
- Group-by page: custom categories deferred (in AGENT-CONTEXT "Later").

## Next Steps
1. The user's review by eye: palette (Round 5), results page, rails, homes.
2. Write component-index filters back into the URL.
3. Decide the right-rail tags toggle.
