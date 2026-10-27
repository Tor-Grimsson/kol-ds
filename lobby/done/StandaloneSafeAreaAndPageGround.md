# StandaloneSafeAreaAndPageGround

**Staged:** 2026-10-26 · from a kol-mirror session
**Change:** every app saved to the iPhone home screen needs two rules the KOL does not ship to every app — the top safe-area padding, and a dark `html`

---

## The problem, in one case
Mirror and Monitor both ship `apple-mobile-web-app-status-bar-style: black-translucent` + `viewport-fit=cover` (fxr's head). Opened from the home screen on iOS 26.5 (simulator, iPhone 17 Pro), Mirror's home page has:
- the **title under the status bar** — nothing pads the top safe-area inset;
- a **~62pt white strip at the bottom** — standalone, the page's viewport is shorter than the screen by the top inset, and `html` is unpainted, so the bare canvas shows white below the shell. Dark mode does not help: kol-theme sets tokens but nothing paints `html`.

FXR looks right only by accident: `kol-editor.css` (its editor's stylesheet) carries `@media (display-mode: standalone) { body { padding-top: env(safe-area-inset-top) } }`, and it loads on every route because `App.jsx` imports `./index.jsx` eagerly (→ LabsView → EditorShell). Its `html` is dark because it imports `kol-framework.css`; Mirror and Monitor do not (Mirror dropped it 2026-08-28, nothing there renders a `.kol-brand-*` class).

## The fix
Ship both in `kol-theme/kol-base-tokens.css`, next to the existing `html { overscroll-behavior: none; }` — `kol-theme/core` is the one stylesheet Mirror, Monitor and FXR all load (kol-shell ships no CSS), not kol-framework:
1. `@media (display-mode: standalone) { body { padding-top: env(safe-area-inset-top, 0px); } }`
2. `html { background: var(--kol-surface-primary); }`

Verified in the simulator: with both, Mirror's home screen matches FXR — title clear of the status bar, no white top or bottom. With (1) alone the bottom strip goes but the status-bar band turns white; (2) is what fixes that. fxr's padding covers the bottom by overflow (its content runs past the short viewport) — say so deliberately in the rule's comment rather than leave it a side effect.

## Definition of done
- [ ] Both rules ship in a layer Mirror, Monitor and FXR all load
- [ ] Home-screen Mirror on iOS: title clear of the status bar, no white top or bottom
- [ ] Published; kol-mirror's receipt names the version
