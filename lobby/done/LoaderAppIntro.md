---
component: loaderApp intro mode → GrowthLineStage intro → HubHome chrome fade (the loader is the line)
source: kol-fxr/index.html#L6-L11 · kol-fxr/src/components/intro.js · kol-fxr/src/main.jsx#L34-L37 · kol-fxr/src/components/HomeStage.jsx#L29-L130
staged: 2026-11-01
status: draft
deps: [loaderApp (kol-framework/vite), hideLoaderApp (kol-framework), GrowthLineStage (kol-component), HubHome (kol-shell)]
---

# LoaderAppIntro

**Staged:** 2026-11-01 · from kol-fxr (user: *"package the loader specially for atlas repo … maybe even make it part of the loader component … we want the growth to affect the form and all that we have on this site home"*)

## Purpose
GrowthLineIntro (kol-growth 0.4.0 · kol-component 0.322.0) gave Atlas the line and its intro, and Atlas runs it (`kol-atlas/apps/workspace/src/components/Home.jsx`: `<GrowthLineStage shape={HEX} params={MARK} intro … />`). What Atlas still has is a **static boot curtain in front of it** — its own `#atlas-boot` in `apps/workspace/index.html` (a pulsing hexagon, held ~1.5 s by `src/main.jsx`, then lifted) — so a load plays two things: a pulse, a cut, then the line. On fxr the loader **is** the line: the loader paints the ground only, the stage takes over on its first frame, the page's chrome fades in while the line breathes in the mark, then the line grows out to fill.

That handoff lives only in fxr today (four files of wiring). Ask: make it part of KOL's app loader so any app gets it with one option, and Atlas drops its curtain.

## Anatomy — the three pieces and their contract

### 1. `loaderApp({ intro })` — kol-framework/vite
- New option `intro`: `true` (path `/`) or a path string / array. Default off — today's loader, untouched.
- When on, the plugin also writes a **pre-paint inline script** into `<head>` that, on a matching `location.pathname` and with motion allowed (`!matchMedia('(prefers-reduced-motion: reduce)').matches`), adds a class to `<html>` (`kol-intro`), plus one CSS rule `.kol-intro #kol-loader-app svg{display:none}` — the loader shows its **ground only**, no mark, so nothing flashes before the line.
- fxr's version: `index.html` L10-11.

### 2. The claim — kol-framework runtime (beside `hideLoaderApp`)
- A tiny module, fxr's `src/components/intro.js` verbatim in shape: `INTRO` (the class is on `<html>`), `claimIntro()` (true while unended — StrictMode's second mount gets it again), `introClaimed()`, `endIntro()` (removes the class).
- **The fallback lives in KOL, not the app:** if no stage claims the intro within a beat (600 ms — signed in, no stage, an error), the loader goes the plain way (`endIntro(); hideLoaderApp({ minMs: 0 })`). fxr does this in `main.jsx` L36-37; an app should only have to call `hideLoaderApp()` as it does today, and `hideLoaderApp` should do the claim-or-fallback itself when `kol-intro` is set.

### 3. `GrowthLineStage intro` claims it — kol-component
- With `intro` on, the stage calls `claimIntro()` on mount; on its **first drawn frame** it calls `hideLoaderApp({ minMs: 0 })` — the loader's ground fades out over a canvas that is already drawing the line in the mark.
- On `onIntroEnd` (release done) it calls `endIntro()`.
- No `kol-intro` on the page (a route that isn't `/`, a SPA navigation back to Home, reduced motion) → `intro` behaves as 0.322.0 does today: no loader involved.
- fxr's version: `HomeStage.jsx` L67-83 (claim; unplayable → end + hide) and L117-118 (first frame → hide).

### 4. HubHome holds its chrome under the intro — kol-shell
- While the stage plays the intro, HubHome's own controls (the mark at top left, the +, the dock — everything in `[data-hub-signed-out]` except the stage) start at opacity 0 and **fade in (700 ms) 800 ms into the breath** (i.e. MARK_MS 3800 + 800 from the intro's first frame).
- Needs one signal from the stage. Proposal: GrowthLineStage gains `onIntroBreath` (fires when the rest begins) beside `onIntroEnd`; HubHome passes its own handler when its `stage` is an intro stage — or HubHome reads the `kol-intro` class and listens. Pick the cleaner one; fxr's version does it from inside the stage by reaching into the parent (`HomeStage.jsx` L54-56 `page()` / `showPage()`), which is exactly what a KOL piece should not do.
- The fade clears its inline styles at the end (fxr L130), so the signed-in / sign-in-column transitions are untouched.

## Timeline (one line from load to page, fxr plan 45 — keep it)
| t (from the stage's first frame) | what |
|---|---|
| before | loader ground only (theme-correct, from the boot script) |
| 0 | loader fades (240 ms) over the stage; the line grows inside the shape, emphasis ink |
| 3 800 | rest: breath `ink = 0.7 + 0.3·cos`, 2 s period; growth off after the first breath |
| 4 600 | HubHome chrome fades in, 700 ms |
| 7 800 | release, 4 s: density blends shape → orb, the line grows out to fill |
| 11 800 | `onIntroEnd`; pointer live |

## Props / options (new)
| where | name | type | default |
|---|---|---|---|
| `loaderApp` | `intro` | `boolean \| string \| string[]` | off |
| `GrowthLineStage` | `onIntroBreath` | fn | — (only if HubHome takes the signal this way) |

## Acceptance
- Atlas (`apps/workspace`) on `loaderApp({ graphic: <hex>, intro: true })` and **no** `#atlas-boot`: a reload of `/` shows ground → the line in the hexagon with no mark flash and no cut (record it; no frame where the loader's ground and the stage's line both read at full strength for more than the 240 ms fade).
- Reduced motion: the loader goes as today (mark, `minMs` 600), the stage draws its finished line, chrome visible at once.
- A route other than `/`, and signed in on `/` with no intro stage: plain loader, gone after `minMs` — never stuck (the 600 ms fallback).
- kol-monitor / mirror / any `loaderApp()` without `intro`: byte-identical HTML.
- studio-hub (or `apps/growth`) shows the whole handoff on a reload.

## Remainder — not here
- **kol-atlas:** bump; `apps/workspace/vite.config.js` → `loaderApp({ graphic: <the hexagon>, intro: true })`; retire the `#atlas-boot` curtain (`index.html` L41-56, and the copy `vite.login.config.js` makes for `login/index.html`) and the `HOLD` timer in `src/main.jsx` L25-27 to `_tmp/`; `Home.jsx` unchanged. Return the receipt to **both** kol-fxr and kol-atlas.
- **kol-fxr:** may adopt later and retire `src/components/intro.js`, `index.html` L6-11's stamp and HomeStage's page fade — not asked now (fxr keeps its own engine by ruling).

## ✅ RESOLUTION — 2026-11-01 · kol-component@0.331.0 · kol-framework@0.69.0 · kol-shell@0.99.0

1. **`loaderApp({ intro })`** (kol-framework 0.69.0): `true` = `/`, or a path / paths. On a match with motion allowed a pre-paint script stamps `kol-intro` on <html>; `.kol-intro #kol-loader-app svg{display:none}` leaves the ground only. Without `intro` the HTML is byte-identical to 0.68.0 (checked against a snapshot of the old plugin's output).
2. **The claim**: `claimIntro` · `introClaimed` · `endIntro` (+ `releaseIntro`) beside `hideLoaderApp`, which does the claim-or-fallback itself: stamped and unclaimed, it waits 600 ms, then `endIntro()` + hides at once. One deviation: the source lives in kol-component (`src/utilities/loaderApp.js`) because GrowthLineStage claims it and kol-component never imports kol-framework (ARCHITECTURE §3); kol-framework re-exports all of it, `src/loaderApp.js` included, so fxr's import path still works.
3. **`GrowthLineStage intro`** (kol-component 0.331.0) claims on mount, `hideLoaderApp({ minMs: 0 })` on its first drawn frame, `endIntro()` at the end; unmounted before its first frame it releases (StrictMode reclaims, a real leave falls back). No stamp → as 0.322.0.
4. **HubHome** (kol-shell 0.99.0): `GrowthLineStage onIntroBreath` (fires as the rest begins); HubHome chains its handler onto an intro stage via `cloneElement` — no reaching into the parent. The chrome (mark, +, the dock inside AppFloatNav's `contents` wrapper) holds at opacity 0, fades in 700 ms after 800 ms, and the classes leave after.

Verified on studio-hub (wired: `loaderApp({ intro })`, `hideLoaderApp()`, the stage is `GrowthLineStage intro` in the hexagon), Playwright 1440×900: loader ground only, mark hidden; loader fading by 0.3 s, gone by 0.8 s; chrome 0 to 4.3 s, 0.80 at 5.0 s, 1 at 5.6 s with the classes gone; `kol-intro` cleared by 12.5 s. Reduced motion: mark shown, loader gone by 1.2 s, chrome at 1. `/create`: no stamp, loader gone by 1.5 s. A node check covers the stamp per path and motion setting, and the claim / fallback / release paths. Not done here: the Atlas recording (kol-atlas's swap).
