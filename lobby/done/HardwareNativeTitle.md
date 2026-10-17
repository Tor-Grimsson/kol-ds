# HardwareNativeTitle — kol-hardware's `IconButton` and `JackSocket` draw the browser's native tooltip

**Staged:** 2026-10-15 · from a kol-monitor session
**Change:** two files in kol-hardware — `switches/IconButton.jsx`, `indicators/JackSocket.jsx`

---

## The problem, in one case

kol-component's native-title sweep (2026-09-26) put every DS tooltip on `Tooltip`. kol-hardware didn't follow:
`IconButton` renders `<button title={title}>` and `JackSocket` takes `title` the same way. Monitor's plan 13 cleared
every native `title` it owns (stage clock, bezel, dock, Magneto, Create), and what's left in the rack is all
these two: Magneto's four transport keys, GenHifi / GenLofi / Dither's mode grids, `IconSelect`, and all
318 jacks (`label || port`).

Monitor can't fix it locally without hand-rolling around the package. A wrapper in its seam would also
change the grid geometry `IconSelect` relies on, and would put a hover tooltip on every jack a cable crosses
mid-drag.

## The fix

- `IconButton`: `title` → the DS `Tooltip` (the trigger is the button itself; kol-component's `IconToggle`
  is the precedent).
- `JackSocket`: the same, **suppressed while a cable is pending** (`pending` is already a prop), so patching
  doesn't flash tooltips.

## Definition of done

- [ ] no `title=` attribute rendered by kol-hardware
- [ ] a jack shows its tooltip on hover at rest and none while `pending`
- [ ] monitor bumps; no call-site change (the `title` prop keeps its name)

## ✅ RESOLUTION — 2026-10-16 · kol-hardware@0.5.0

`IconButton`, `JackSocket` and `ModuleHeader`'s remove / bypass dots render the DS `Tooltip` attached to the element itself (`asChild`, no wrapper — grid geometry unchanged); kol-hardware renders no `title=` attribute. A jack's tooltip is silent while `pending` or `dimPending` — via the new kol-component@0.262.0 `Tooltip disabled`, so the jack never remounts under the pointer mid-drag. `IconButton` also takes `title` as its `aria-label`. The `title` prop keeps its name. Verified: no `[title]` in the DOM, the key and the jack show their tooltip at rest, none on the jack while pending.

**Remainder here:** none — kol-monitor bump kol-hardware@0.5.0 + kol-component@0.262.0; no call-site change.

