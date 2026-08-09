# Session: the review burst — re-files, the menu float bug, header glyphs md

**Date:** 2026-08-09
**Agent:** Grim (Fable 5)
**Summary:** The live-review burst after the utilities-shelf run: four more tier re-files on user rulings (EmptyState + PaletteHarmonyWheel → molecules, AsciiCursor → utilities, InteractiveImage retired to `_tmp/`), the portalled-menu float bug killed with closed-trigger Cards, the /components page given its breather, header glyphs re-ruled md + full ink at the `nav` variant root, and IconFrame finally in the showcase. All 19 gates clean; everything rides the unpublished delta.

## Changes Made

### Tier re-files (user rulings, one per instruction)
- **EmptyState** atoms → molecules ("built from multiple things") + type-conform fix: title `helper-16`→`mono-16`, footer `helper-12`→`mono-12` (helper is single-line chrome; both wrap).
- **PaletteHarmonyWheel** atoms → molecules — its own `taxonomy-ok` comment had argued this all along.
- **AsciiCursor** atoms → utilities — fixed-position whole-viewport chrome fails "stands alone" (ExitPreview precedent; also why its index card was empty).
- **InteractiveImage** RETIRED → `_tmp/2026-08-09-interactive-image-retire/` (component + demo) — zero consumers anywhere, ever. Barrel export, classification entry, registry description all stripped.
- Boundary call #3 in `00-taxonomy.md` reworded (examples now RotaryDial/CurveOverlay — all three originals left atoms the same day); every re-file recorded in `02-placement.md`.
- Missed-import correction mid-burst: FeaturedCarousel's `OverlayGlassPanel` path (Vite error) — repointed; repo-wide sweep confirmed no other stale paths.

### The menu float BUG (user: "literally floats out of its preview")
- Root cause: MenuItem's panel is **portalled to `<body>`** (floating-ui) — the index card's `overflow-hidden` cannot clip it, and `defaultOpen` demos mount open on scroll. Closed-trigger `Card` exports added to all four portalled demos: MenuItem, MenuDropdownItem, MenuDropdownNest, MenuDropdownDivider. (DropdownTagFilter's panel is absolute-in-place — clips, doesn't float; Wave C's business.)

### Showcase chrome
- **/components breather** — page wrapped `flex flex-col gap-8` (Foundations rhythm); header/filter/sections were flush.
- **Header glyphs md + 100%** (re-rules the 2026-08-01 lg ruling): `.kol-icon-frame-nav` rest color oq-64 → full ink (its 3 call sites are exactly the header controls); size lg→md on GitHub (ShellChrome), search (ShellLayout), hamburger (ShellHeader); ThemeToggle lg→md with the lg+-split spans collapsed to one.
- **IconFrame demo** written (`demos/IconFrame.jsx`) — one instance, variant + sizes toolbar pickers, canonical Card. Missing-demo audit: remaining visual gaps are MediaLibrary + FoundryCTA only (rest = sub-parts/data/deprecated).

## Published (end of session, on the user's "publish packages")

The whole delta went out as one wave, registry-verified: **theme 0.34.0** · **component 0.34.0** (job line now atoms → molecules → organisms → utilities; InteractiveImage export removed) · **framework 0.18.0** · **workshop 0.21.0**. Workspace deps resolved to real carets; SHIPPED-PACKAGES updated; 19 gates clean after the bumps. Repo and registry agree — adoption is the consumers' (kol-website, fxr).

## Current State

### Working
- All 19 gates clean. Tier counts: atoms **25** · molecules **34** · organisms **19** · utilities **15**.

### Known Issues
- Waves A–D of `plan-2026-08-09-membership-and-preview-contract.md` still open: Card backfill (~170) + `validate:demos` gate, labelFromSlug `displayName` wiring, Badge→StatusChip box, helper-mono sweep, rails-hidden home, KOL-DS wordmark (blocked: which typeface?).
- Process fault named by the user ("why do I have to say these things so many times"): the first run executed only the signed 13 and left his other named items as flags — cleared this burst, but the lesson is to queue named verdicts visibly, not hold them.

## Next Steps
1. Wave C proper — Card backfill + `validate:demos` gate (kills the last clipped/empty cards, incl. DropdownTagFilter).
2. Wave D — `displayName` via labelFromSlug (Section Label).
3. Waves B + A remainder; MediaLibrary + FoundryCTA demos. (The publish wave shipped — see above.)
