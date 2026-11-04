/**
 * hideLoaderApp — the app loader's other half (`loaderApp()` in `@kolkrabbi/kol-framework/vite` writes it into
 * index.html). Call it once React has committed: two frames later the loader fades (240 ms, none under reduced
 * motion — the CSS drops the transition) and leaves the DOM. Safe to call when there is no loader.
 *
 * `minMs` (default 600, LoaderAppMinimumTime — kol-monitor, user ruling 2026-10-22) holds the loader at least
 * that long from navigation start, which is when the static loader first paints: a fast load flashed the mark
 * for a blink, a slow one waits nothing extra. Reduced motion drops the fade, never the minimum. `minMs: 0` is
 * the old behaviour.
 *
 * THE INTRO (LoaderAppIntro, kol-fxr 2026-11-01 — the loader is the line): `loaderApp({ intro })` stamps `kol-intro`
 * on <html> before paint and the loader shows its ground only. A stage claims it (`claimIntro()`, GrowthLineStage
 * `intro`) and hides the loader on its own first frame; while it is stamped and unclaimed, `hideLoaderApp()` waits a
 * beat (600 ms) and, still unclaimed, ends the intro and goes the plain way — so an app calls it exactly as before.
 *
 * Lives in kol-component because the stage that claims it does (ARCHITECTURE §3, no reverse deps); kol-framework
 * re-exports all of it from `src/loaderApp.js`, its documented home.
 */
const INTRO_CLASS = 'kol-intro'
const live = () => typeof document !== 'undefined' && document.documentElement.classList.contains(INTRO_CLASS)
let claimed = false

/* true while the intro is the caller's to play — StrictMode's second mount gets it again */
export const claimIntro = () => { if (!live()) return false; claimed = true; return true }
export const introClaimed = () => claimed
export const endIntro = () => { if (typeof document !== 'undefined') document.documentElement.classList.remove(INTRO_CLASS) }
/* a claimant that leaves before its first frame lets go — unclaimed a beat later, the plain loader goes */
export const releaseIntro = () => { claimed = false; fallback() }
const fallback = () => setTimeout(() => { if (live() && !claimed) { endIntro(); hideLoaderApp({ minMs: 0 }) } }, 600)

export function hideLoaderApp({ minMs = 600 } = {}) {
  if (typeof document === 'undefined') return
  if (live() && !claimed) { fallback(); return }
  const el = document.getElementById('kol-loader-app')
  if (!el) return
  setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.add('is-done')
    setTimeout(() => { el.remove(); document.getElementById('kol-loader-app-css')?.remove() }, 300)
  })), Math.max(0, minMs - performance.now()))
}
