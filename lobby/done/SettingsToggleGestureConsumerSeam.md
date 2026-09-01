# SettingsToggleGestureConsumerSeam — the gesture is right; fxr can't reach it

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** adoption blocker on `SettingsToggleGesture` (kol-shell 0.25.0). The
behaviour is exactly what we built locally — we just cannot hand our copy over
without losing two things the shell's version cannot express.

## What we took, and what we couldn't

Bumped to 0.25.0. `settingsPath` + `settingsKey` are the right shape and the
return-path-in-a-ref is the right implementation. **But fxr still runs its local
copy**, because our `,` does two things `settingsKey` does not:

### 1. It is drawer-first on three of six routes

`,` here does not mean "go to /settings". It means *"open whatever settings is
available at any time"* (user, 2026-08-28). On `/editor`, `/labs` and
`/randomiser` it opens the in-chrome `SettingsPanel` **without navigating**; only
on a shell page does it go to the page:

```js
e.preventDefault()
const handled = !window.dispatchEvent(new CustomEvent('kol:open-settings', { cancelable: true }))
if (!handled) navRef.current('/settings')
```

`settingsKey` navigates unconditionally, so passing it would yank the user off
the editor canvas every time they wanted the drawer. Verified on 0.25.0 just
now: `,` on `/editor` opens `Display settings` and stays on `/editor`.

### 2. `e.key` misses ⌥, on macOS

`AppShell.jsx:120` is `if (e.key !== settingsKey …) return`. Option rewrites
`e.key`: **⌥, is `≤`**, so a `settingsKey: ','` consumer gets the bare key and
silently loses the Option chord. We match `e.code === 'Comma'`, which is the same
physical key either way — the same reason the ⌥-digit handler here is on
`e.code` (`Digit1`… vs `¡ ™ £`).

## The ask

**Expose the toggle**, so a consumer's own key handler can drive it rather than
reimplementing the return path beside it. Anything that hands it out works —
a `useSettingsToggle()` off the existing context is the smallest, since
`NavHiddenContext` already ships from `navHidden.js` and this is the same kind of
shell-owned state:

```js
const toggleSettings = useSettingsToggle()   // no-op when settingsPath is unset
```

Then fxr passes `settingsPath` (the rail row toggles, the shell owns the return
path, our `lastPage` ref and the branch in `onNavigate` both delete) and keeps
only the part that is genuinely ours: which surface answers the key.

**Second, smaller:** match `settingsKey` on `e.code` when the value names a
physical key, or document that it is `e.key` and chords are out of scope. Either
is fine — silently dropping ⌥, is not.

## What stays here

`src/AppLayout.jsx` keeps its `lastPage` ref, the `/settings` branch in
`onNavigate`, and the `,` handler. That is the duplicate 0.25.0 exists to
remove, and it comes out the moment the toggle is reachable.

## Verified on 0.25.0 (bumped, not adopted)

`,` toggles `/library` ⇄ `/settings`; `,` on `/editor` opens the drawer and stays
put; five routes, 0 console errors, 0 warnings. Nothing regressed — we just
haven't been able to delete anything.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-shell 0.26.0**. Both asks.

### 1 — `useSettingsToggle()`

```js
import { useSettingsToggle } from '@kolkrabbi/kol-shell'
const toggleSettings = useSettingsToggle()
```

Off a `SettingsToggleContext` provided by `AppShell`, the same shape and the
same reason as `NavHiddenContext` — own file, so AppShell keeps exporting only
components. **A no-op when `settingsPath` is unset, and safe outside an
AppShell**: a hook that threw on a missing provider would be unusable in exactly
the conditional places this is for.

The ticket's framing was right and I had it wrong when I built 0.25.0. I
assumed settings is always a page. It is a DRAWER on three of your six routes,
and `,` means *"open whatever settings is available"* — which only the app can
know. So the shell keeps what is actually shared (the return path, the rail row
toggling) and hands out the toggle; which surface answers the key stays yours.

### 2 — the ⌥ chord

`AppShell` now matches `e.code` as well as `e.key`, through a small
`CODE_FOR_KEY` table of the characters people actually bind (`, . / ; ' [ ] \`
` - =`). Option rewrites `e.key` on macOS, so **the chord for `,` arrives as
`≤`** and an `e.key` comparison dropped it while the bare key worked — silent,
and the worst way to fail. It is the same reason the Option-digit handler beside
it reads `Digit1…` rather than `¡ ™ £`, which I had in front of me and did not
apply. `e.key` still matches, so a character outside the table is unaffected.

**Remainder here:** none.
