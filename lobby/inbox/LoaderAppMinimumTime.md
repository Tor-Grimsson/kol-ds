# LoaderAppMinimumTime

**Staged:** 2026-10-22 · from a kol-monitor session
**Change:** one option on `hideLoaderApp` (kol-framework `src/loaderApp.js`)

---

## The problem, in one case
The user, 2026-10-20: *"monitor and app loader timer? very short? should have minimum ms?"* — ruled 2026-10-22: **yes, 600 ms**.

`hideLoaderApp()` marks the loader done two frames after it is called and removes it 300 ms later. There is no minimum, so on a fast load the mark is on screen for a blink. Monitor, mirror and fxr all call it.

## The fix
`hideLoaderApp({ minMs = 600 } = {})`: wait `max(0, minMs - performance.now())` before the two frames and the fade. `performance.now()` counts from navigation start, which is when the static loader in index.html first paints — so a slow load adds nothing, and a fast one holds the mark for 600 ms. Default 600 so every app gets the same behaviour; `minMs: 0` keeps today's.

## Rejected alternative
A `setTimeout` around the call in monitor's `main.jsx` — it fixes one app and is a local copy of a rule every loader user needs.

## Definition of done
- [ ] `hideLoaderApp` holds the loader for at least `minMs` (default 600) from navigation start, measured on a fast load
- [ ] Reduced motion still drops the fade, not the minimum
- [ ] Published; kol-monitor's receipt names the version
