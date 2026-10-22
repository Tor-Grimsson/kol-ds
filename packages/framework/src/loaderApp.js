/**
 * hideLoaderApp — the app loader's other half (`loaderApp()` in `@kolkrabbi/kol-framework/vite` writes it into
 * index.html). Call it once React has committed: two frames later the loader fades (240 ms, none under reduced
 * motion — the CSS drops the transition) and leaves the DOM. Safe to call when there is no loader.
 *
 * `minMs` (default 600, LoaderAppMinimumTime — kol-monitor, user ruling 2026-10-22) holds the loader at least
 * that long from navigation start, which is when the static loader first paints: a fast load flashed the mark
 * for a blink, a slow one waits nothing extra. Reduced motion drops the fade, never the minimum. `minMs: 0` is
 * the old behaviour.
 */
export function hideLoaderApp({ minMs = 600 } = {}) {
  if (typeof document === 'undefined') return
  const el = document.getElementById('kol-loader-app')
  if (!el) return
  setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.add('is-done')
    setTimeout(() => { el.remove(); document.getElementById('kol-loader-app-css')?.remove() }, 300)
  })), Math.max(0, minMs - performance.now()))
}
