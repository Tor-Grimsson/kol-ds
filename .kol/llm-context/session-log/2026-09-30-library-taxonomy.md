# Session: Library taxonomy

**Date:** 2026-09-30
**Agent:** Grim (kol-ds-ui, MBP)
**Summary:** The showcase's parents named, drawn and made the header tabs: Styles · Composition · Collection · Docs · Search · Development. Showcase and docs only; no package changed, nothing to publish.

## Changes Made

### Files Modified
- `showcase/src/nav/shell-nav.js` — six parent tabs, `LIBRARY_CHILDREN` + `parentOf`, prefixes re-owned (no URL moved), search items carry the parent space, blocks/sets/packages rows
- `showcase/src/lib/ShellChrome.jsx` — Composition rail (Components · Blocks · Apps), Collection rail (Sets with Cards first · Packages), Search rail (four views)
- `showcase/src/pages/Library.jsx` — new: Library · Composition · Collection pages, each home + `CompositionDiagram`
- `showcase/src/homes/{library,composition,collection,search}.md` — new homes; `sets` · `cards` · `blocks` · `components` corrected to the new Set
- `showcase/src/App.jsx` — `/library` · `/composition` · `/collection`; `/sets/family/*` → `/packages/*`
- `showcase/src/pages/Packages.jsx` — the package page carries its family (sets + tier tables); `Sets.jsx` lost the families list; `Search.jsx` shows its home until a query is typed
- `showcase/src/lib/sets-registry.js` — `familyHref` gone, SET_FAMILY comment re-stated
- `SetFamily.jsx` → `_tmp/2026-09-30-set-family/`
- Docs: `05-names.md` (the tree, Library, Composition, Collection, Reference, Package; Set redefined), `02-shells.md` space table, `01-blocks-and-sets.md` two-axes note, phase log entry *Library taxonomy* + INDEX row, plan archived in `_files/`

### Features Added/Removed
- Added: the parent tabs, parent homes with diagrams, Search as a space
- Removed: Sets as package families (now the package page); Cards as a Blocks category (now a set)

## Current State

### Working
- 32 gates clean, showcase build ✓, 14 routes rendered in preview with 0 console errors.

### Known Issues
- Right rail "This page" is empty on the new homes (same as other homes).
- Package page lists its family below the changelog; may bury it.

## Next Steps
1. The user reviews the header, rails and three diagrams by eye.
2. `.md` with frontmatter (`uses`) beside every block and app.
3. Styles › Ladders quick reference.
