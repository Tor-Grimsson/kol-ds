/**
 * hideLoaderApp — the app loader's other half (`loaderApp()` in `@kolkrabbi/kol-framework/vite` writes it into
 * index.html). Call it once React has committed: two frames later the loader fades (240 ms, none under reduced
 * motion — the CSS drops the transition) and leaves the DOM. Safe to call when there is no loader.
 */
export function hideLoaderApp() {
  if (typeof document === 'undefined') return
  const el = document.getElementById('kol-loader-app')
  if (!el) return
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.add('is-done')
    setTimeout(() => { el.remove(); document.getElementById('kol-loader-app-css')?.remove() }, 300)
  }))
}
