# Session: five mobile tickets — measured first, three built, one already built, one ruled

**Date:** 2026-08-26
**Agent:** Grim (Haiku 4.5)
**Summary:** kol-website's five mobile-audit briefs closed in one run. Every
ticket was measured on production at 393 before anything was touched — three
of the five described chrome that already existed (`overflow-x: auto` on the
table wrapper, the code block and the tab strip), so the real defects were
narrower than filed: a utility beating a media rule, a third-party theme
beating three `pre-wrap` declarations, and an active tab the strip never
brought on screen. Shipped theme 0.50.2 → **0.51.0**, component **0.68.1**,
framework **0.23.0**, all registry-verified.

## Changes Made

### Files Modified

**framework (0.23.0)**
- `kol-framework.css` — `.kol-sidenav` owns its box (sticky/top/align-self/
  height/flex/z-index); the 767px drawer rule now wins by source order.
  `.kol-shell-header-tabs` gains `scroll-snap-type: x proximity`, tabs
  `scroll-snap-align: start`
- `src/SideNav.jsx` — seven box utilities off the aside; colour utilities stay
- `src/ShellHeader.jsx` — layout effect scrolls the active tab to the strip's
  start edge, only when it is out of view, keyed on the active href

**component (0.68.1)**
- `molecules/CodeBlock.jsx` — `whiteSpace: 'pre-wrap'` in the
  `code[class*="language-"]` override (oneDark's `pre` was spread AFTER
  `wrapLongLines`); every line stamped `.kol-codeblock-line`

**theme (0.50.2, 0.51.0)**
- `kol-components-molecules.css` — chipless block's first line reserves the
  copy control's lane (`calc(2rem + --kol-spacing-3)`)
- `kol-components-atoms.css` — the touch floor: bare ToggleSwitch `::before`
  extent 24px; Slider range input 24px tall, track centred by the UA

**docs · lobby**
- `03-components/05-control-chrome.md` § Touch floor (the ruling);
  `01-foundations/06-code-surface.md` `-line` class; shipped-packages table
  regenerated (was three packages and several majors stale)
- `lobby/INDEX.md` — five closes via `lobby-close`, rows moved to Closed; four
  08-15 rows that had closed but still sat in the queue moved too; queue → 1
- kol-website `lobby/outbox/*` + `INDEX.md` — receipts returned, rows synced

### Features Added/Removed
- SideNav's position is DS-owned again on phones (every consumer opened one
  viewport down)
- CodeBlock wraps, as `06-code-surface.md` always said it did
- ShellHeader keeps the current section's tab on screen
- The touch floor: 24px hit box, no type floor, drawn size never moves

## Current State

### Working
- Everything rendered, not assumed: SideNav replayed on brand production's DOM
  (393 → `fixed`, content top 0; 1280 → `sticky`, holds on scroll); CodeBlock
  `<code>` computes `pre-wrap`, chip removed live → 44px lane; tab effect at a
  width where two tabs overflow (fresh load 44px, in-view load 0, route change
  44px); toggle extent hit-tests 2px beyond a 20px box on both sides; slider
  pixel-checked at 3×
- 20 gates clean; four publishes registry-verified

### Known Issues
- The Playwright MCP wedged after a `click` stalled on brand production and
  every later call queued behind it (twenty minutes lost); recovered by
  running Playwright directly with kol-website's install + the cached
  headless shell 1234. Lesson: hard per-step timeouts, and never feed a page
  that has already hung
- kol-website's remainders are open until they bump: delete the sidenav
  stopgap, stack `DashboardComponents.jsx`'s two-up rows (their code, not
  DS), give their 16px table buttons the same hit box
- The two showcase sidenav blocks are replicas, not the package `SideNav` —
  nothing in this repo renders the real one, which is why brand production
  had to stand in

## Next Steps
1. When kol-website bumps: re-walk brand `/assets` and web `/stack/vcap`,
   `/workshop/*` at 393 — the real-device pass the audit could not do
2. A live package-`SideNav` surface in the showcase, so the next rail change
   can be rendered here
3. The retirement wave from 08-15 is still untouched (ten absorbed components
   exporting, `GridCard` naming two components)
