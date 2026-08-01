# Session: the rail ladder, the chip, and one search

**Date:** 2026-08-01
**Agent:** Grim (Opus 5)
**Summary:** Four altitudes of the same defect — a shared class name with no owner — closed by giving each an owning component, a class that owns the look, and a gate that counts owners; plus the two search surfaces folded into one.

## Changes Made

### The pattern, stated once

Every drift this session was the same shape: a class **name** shared by many call sites, with the rest of the look hand-written at each. R1/R2 locked the type *voice* and nothing locked anything else. The fix that worked, four times: **the component owns the markup, the class owns the look, the gate counts owners rather than measuring values.**

The proof was already in the repo — L3 was the one rung a component (`DocsToc`) already owned, and the one rung that never drifted.

### Files Modified

- `packages/workshop/src/shell/RailSection.jsx` — NEW. Owns L1 (Category) + L2 (Chapter): the rung's class, the collapse, and where the count sits.
- `packages/workshop/src/shell/RailRow.jsx` — NEW. Owns L3 (Page/Section). Nine hand-written utility stacks across five files became one string.
- `packages/theme/kol-components-workshop.css` — the eyebrow box gets ONE owner; `.shell-nav-item` gains layout/colour/hover/focus/active; `.shell-nav-items` owns the gap; `--kol-pad-rail-row-y` shared by eyebrow and chapter row.
- `packages/component/src/atoms/Tag.jsx` — rebuilt on Pill's model: `primary|secondary|inverse`, one scheme `kol-tag--*`, every variant with hover. `color`, `solid`, `naked` and three of four class schemes deleted.
- `packages/component/src/atoms/Pill.jsx` + `Tag.jsx` — both adopt the `kol-helper-*` ramp (`line-height: 1`); the chip box lost a third of its height.
- `packages/component/src/molecules/ShellSearchOverlay.jsx` — gains an EXPANDED state, chips, mode label; the tag browser is its body, not a sibling.
- `packages/workshop/src/tags/TagModeOverlay.jsx` — demoted from overlay to expanded body; its own search box, scrim, panel chrome, close button and duplicate chips deleted.
- `packages/workshop/src/tags/TagModeContext.jsx` — ONE query `{ text, tags[], view, expanded }`; `isProvided` so the shell can run without a provider.
- `packages/component/src/hooks/useScrollSpy.js` — gains `root`. The shell scrolls `#main` internally, so a viewport-rooted observer could never fire.
- `packages/workshop/src/docs/DocKit.jsx` + `engine/parse-markdown.js` — props cells parse inline markdown; `processInlineMarkdown` exported (it was module-private, which is why the table could not do it).
- `packages/framework/kol-framework.css` — `--kol-shell-toc-w` 14rem → **16rem**, equal to the left rail.
- `packages/framework/src/ShellHeader.jsx` — `HEADER_ICON` exported; the header row mixed two glyph scales.
- `scripts/validate-headings.mjs`, `scripts/validate-chrome.mjs` — NEW gates.
- `scripts/extract-styling.mjs` — NEW. Generates the styling contract.

### Features Added/Removed

- **Added:** `RailSection`, `RailRow`, `validate:headings`, `validate:chrome`, `extract:styling`, the H2 nav-label law, the styling contract on every component page, one search surface with an expanded state.
- **Removed:** `TagModeGate` and its second mount · the tag overlay's search box · Tag's `color`/`solid`/`naked` · the per-colour tag palette · `--kol-shadow-overlay` · the overlay's border and shadow · `.tag-list-item`/`.tag-list-count` (they had no CSS rule anywhere) · the floating node button · the rail's duplicate Search row · 4 slot-page entries from the vault tree.

## Current State

### Working

- **Both rails render one class string** (`shell-nav-item kol-mono-14`), one row height, both with an active row — measured, not read off the diff.
- **Category / Chapter / Page / Section** named in the CSS; Chapter 500 against Page 400. They were identical because the only difference was `.text-body`, a **colour** utility.
- **One search surface.** ⌘K → type → Enter expands into the tag body; a tag row adds a removable chip and keeps the palette open; only a destination dismisses. `matchSearchItems` is the only matcher.
- **14 gates**, all clean; production build green.
- Docs synced: `02-shells.md`, `04-workshop-system.md`, `05-control-chrome.md`, `05-layout-systems.md`, `INDEX.md`, `.kol/docs-framework/01-conventions.md`.

### Known Issues

- **Two rulings held, deliberately not guessed:** a real search **results page** (routing + per-hit previews for components/colour/type), and gruvbox ↔ kolkrabbi colour matching.
- Tag colour by taxonomy is deleted, not lost — it returns layered *on* the variants rather than replacing them.
- `validate:chrome` skips 19 components whose variant map is not a literal. Logged every run, never silent.

### Mistakes worth keeping

- I reported the four right-rail sections as a **regression of mine**. They were never deleted — vault routes always had them; `AutoToc` (every other page) never did. I read a screenshot instead of checking both route families.
- I proposed **deleting** one of the two search overlays. The user's correction — point them at one system that accepts both tags and keywords — was right and is what shipped.
- Enter navigated to a row nobody chose, because `activeIndex` starts at 0. Caught by driving the browser, not by reading.
- Passing a raw string to `renderInlineTokens` (it takes a token array) blanked every props cell. Same catch.
- `validate:chrome` flagged Pill because Pill's *docstring* explains Tag's `onClick` — gates must read code with comments stripped.

## Next Steps

1. Rule on the search **results page** — route shape and which hit types get a preview.
2. Gruvbox ↔ kolkrabbi colour matching, then tag colour returns on top of the chip variants.
3. Publish the bumped packages: theme **0.17.0** · component **0.18.0** · framework **0.11.1** · workshop **0.10.0**.
