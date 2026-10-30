# AsciiCursorFireworkSetStateInRender — kol-component's AsciiCursor lost kolkrabbi.io's 2026-08-25 fix

**Staged:** 2026-10-29 · from kol-website (consuming LayoutsAndWebsiteLayout)
**Files:** `lobby/_assets/AsciiCursorFireworkSetStateInRender/kol-website-AsciiCursor.jsx` — the site's copy that was retired

## The problem
kolkrabbi.io on `WebsiteLayout cursor`: every click burst logs
`Cannot update a component (AsciiCursorOverlay) while rendering a different component (Firework)`.
`kol-component/src/utilities/AsciiCursor.jsx:151` calls `onDone()` inside the `setFrame` updater. React runs updaters during the child's render, so the parent's `setFireworks` fires mid-render. The interval also restarts on every parent re-render (`onDone` is a new closure each time), which stalls the burst while the cursor moves.

The site's copy fixed exactly this on 2026-08-25 (mobile audit). LayoutsAndWebsiteLayout retired that copy as the "older twin" of kol-component's, but the site's was the fixed one.

## The fix
Take the site's `Firework` (`_assets/…/kol-website-AsciiCursor.jsx:125–150`):
- advance frames on the interval, with `[frames]` as the only dependency
- report completion from an effect guarded by a `doneRef`

Check `Invader` and any other burst for the same updater pattern. Then diff the rest of the site's file against the package for any other fix that went missing.

## Definition of done
- [ ] no setState-in-render on a click burst
- [ ] published

**Remainder at kol-website:** bump; click on a page with the cursor on.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-component 0.311.3 · kol-framework 0.62.3**. LayoutsAndWebsiteLayout called the site's copy the older twin. On these points it was the fixed one, and every fix it carried is now in the package:
- **Firework:** the site's code, verbatim. The interval advances the frames with `[frames]` as its only dependency, and done is reported from an effect behind a `doneRef`. `Invader` was checked: it reports done from a timer, never an updater.
- **Context menu:** the site's 2026-08-25 fix had gone missing. A right-click spawns the invader and the browser's menu still opens.
- **Light mode:** the site's `.ascii-cursor-fg` rule is now in the component as Tailwind, at 0.9 in light and 0.5 in dark.
- **Native cursor:** `WebsiteLayout cursor` passes `hideCursor`, so the native cursor hides as the site always had it.
- Walked in apps/layouts' website frame: four click bursts, no render warning, bursts clear, the context menu not prevented, the native cursor hidden, the opacity 0.9 in light and 0.5 in dark. The star comment in the site's copy (800–2000ms) was stale; both copies spawn every 400–1200ms.
