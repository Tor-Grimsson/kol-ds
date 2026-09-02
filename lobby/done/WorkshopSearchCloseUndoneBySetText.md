# WorkshopSearchCloseUndoneBySetText — the scrim's close is undone in the same event

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-workshop` — `src/shell/ShellLayout.jsx:365` + `src/tags/TagModeContext.jsx:49`
**Origin:** the `OverlayScrimTapDismiss` re-check on 0.150.1. The button landed and fires; the overlay still cannot be dismissed by tap.

## The problem

The 0.150.1 scrim `<button>` works — instrumented under iPhone 13 emulation, a tap
on the dimmed area fires `touchstart` → `touchend` → `click` on the button, and
`onClick={onClose}` runs. The overlay stays open anyway.

ShellLayout wires close as two calls:

```jsx
onClose={() => { setIsSearchOpen(false); setSearchQuery('') }}
```

With a TagModeProvider mounted (kol-website `/workshop`), `setIsSearchOpen(false)`
→ `closeTagMode()` sets `isOpen: false` — and then `setSearchQuery('')` →
`tagMode.setText('')`, and `setText` force-opens:

```jsx
setState((prev) => ({ ...prev, isOpen: true, text }))
```

Both land in one React batch; final state is `isOpen: true, text: ''`. The close
never renders.

Measured on 0.150.1: tap scrim → dialog still mounted, 3/3 attempts, with and
without a typed query. Escape DOES close — but only because TagModeContext's own
window-level keydown listener calls `closeTagMode()` directly and runs after the
overlay's `onClose`, so its write wins the batch. On a phone there is no Escape,
the overlay renders no close control of its own, and post-select navigates — so
the scrim is the only non-navigating exit and it is undone every time.

Desktop scrim CLICK shares the wiring, so it likely never worked on `/workshop`
either — masked before 0.150.0 by the div never firing on touch at all.

## The ask

The close must survive its own query reset. `closeTagMode()` already resets
`text: ''`, so the trailing `setSearchQuery('')` is redundant on the provided
path — dropping it there is the one-line fix. Whether `setText` keeps its
open-on-type behaviour is yours.

## Remainder here once it ships

bump; re-check `/workshop` under touch emulation — open search, tap the dimmed
area, confirm it closes, with and without a typed query.

## ✅ RESOLUTION — 2026-09-01 · kol-workshop@0.26.0

One closeSearch helper: the provided path is closeTagMode() alone (it already resets text — the trailing setSearchQuery('') was the local path's job and force-opened via setText on yours), the local path closes and clears. onSelect's destination branch carried the same broken pair and navigated with the palette still up — same helper, both call sites. setText keeps open-on-type: its call sites are all palette-open paths and the seam stays for consumers.

**Remainder here:** none — kol-website bump kol-workshop@0.26.0; re-check /workshop under touch emulation — open search, tap the dimmed area, confirm it closes, with and without a typed query.

