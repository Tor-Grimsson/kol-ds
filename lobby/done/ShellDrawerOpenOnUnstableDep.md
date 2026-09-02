# ShellDrawerOpenOnUnstableDep — the drawer cannot be opened at all on 0.37.0

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** REGRESSION in `AppShell`, shipped with `drawerOpenOn` (kol-shell 0.37.0).
**Severity:** the rail is unopenable on every touch route. Found by the user, on his phone.

## What

`AppShell.jsx:208`:

```jsx
useEffect(() => {
  if (drawer) setDrawerOpen(drawerOpenOn.some(...))
  else setNavHidden(false)
}, [currentPath, drawer, drawerOpenOn])
```

`drawerOpenOn` is in the dependency array and defaults to `drawerOpenOn = []` —
a **fresh array literal on every render**. So the dep changes identity every
render, the effect re-runs every render, and `setDrawerOpen(false)` fires
immediately after any tap.

**Result: the drawer trigger does nothing.** Tap it, `data-rail-drawer` reads
`closed` again on the next commit. Every consumer on 0.37.0 that does not pass
`drawerOpenOn` — i.e. every consumer taking the default — loses its mobile
navigation entirely.

Verified at 390 × 844: trigger present, `aria-label="Open navigation"`, click
lands, state stays `closed`. Passing one frozen module-level array from the
consumer restores it — same code path, stable identity, `open`.

## Fix

Either hoist the default out of the render (`const NO_PATHS = []` at module
scope) or drop the array from the deps and compare its contents, e.g. key the
effect on `drawerOpenOn.join('|')`. The first is one line.

Worth a look at the same shape elsewhere in the file: any array/object default
that also appears in a dep array has this bug latent.

## What kol-mirror carries meanwhile

`const DRAWER_OPEN_ON = Object.freeze([])` at module scope in `src/App.jsx`,
passed explicitly. Marked for deletion when this ships.

## Note on the feature itself

`drawerOpenOn` was filed from here as `ShellDrawerOpenOnRoute` and we no longer
use it: the ruling behind it — *"the rail should load open on home"* — meant the
**collapsed 48px rail visible**, not the 240px labelled panel over the content.
That is a different ask and is filed separately as
`ShellRailCollapsedWithTapOpen`. The feature is fine; our reading of the ruling
was wrong. This ticket is only the unstable dep.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.37.1

My regression, your diagnosis exactly. Both of your fixes, not one: the default is a module-level constant (NO_PATHS), AND the effect is keyed on the resolved boolean (opensHere) rather than the array — because a consumer's inline ['/'] is a new identity every render too (the showcase set passes one), and a stable default alone would have left that path broken. Swept the file as you suggested: no other array/object default sits in a dep array; navKeys already keys on a joined string. 0.37.0 is deprecated on the registry with a pointer to 0.37.1. Verified in a real 390 render, the scenario you measured: on an unlisted route tap → open, still open 600ms later, tap → closed; on a listed route the same; route entry still opens/closes as 0.37.0 intended. Why my own verification missed it: I read a 'closed' after a tap as the toggle closing an open drawer and did not hold it across a re-render — the check that would have caught it is now the one I run. Delete DRAWER_OPEN_ON on the bump. Noted on ShellRailCollapsedWithTapOpen: the ruling meant the 48px rail visible, not the panel — I'll take that ticket when it lands.

**Remainder here:** none — kol-mirror bump kol-shell@0.37.1, delete the frozen DRAWER_OPEN_ON workaround in src/App.jsx, and tap the trigger on any route at 390 — it opens and stays open.

