/**
 * Vite plugins for KOL apps — Node-side, no React (import from `@kolkrabbi/kol-framework/vite` in vite.config).
 *
 * devFavicon — THE DEV TAB IS TELLABLE AT A GLANCE (2026-10-17 — user: "I need to be able to tell which tabs
 * are localhost dev and which are production"). On the dev server the favicon becomes a solid tile with the
 * app's letters; a build never sees it (`apply: 'serve'`). It REPLACES the page's icon link: fxr appended a
 * second one and browsers pick their own (Firefox kept prod's), mirror swapped it at runtime after load.
 * Each app picks its letters and ground once — the table lives in 16-app-anatomy.md § Dev favicon.
 *
 * @param {Object} [opts]
 * @param {string} [opts.label='K']   ONE letter (user 2026-10-18: *"dev favicon should only use letter like M for monitor"*) —
 *                                     a longer label is cut to its first letter
 * @param {string} [opts.ground='#7C5CFF']  the tile's colour — unique per app
 * @param {string} [opts.ink='#FFFFFF']
 */
export function devFavicon({ label = 'K', ground = '#7C5CFF', ink = '#FFFFFF' } = {}) {
  const text = String(label).slice(0, 1).toUpperCase()
  const size = 28
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${ground}"/>`
    + `<text x="16" y="${(16 + size * 0.36).toFixed(1)}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${size}"`
    + ` fill="${ink}">${text}</text></svg>`
  const link = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(svg)}">`
  return {
    name: 'kol-dev-favicon',
    apply: 'serve',
    transformIndexHtml(html) {
      return /<link rel="icon"[^>]*>/.test(html) ? html.replace(/<link rel="icon"[^>]*>/, link) : html.replace('</head>', `${link}</head>`)
    },
  }
}

/**
 * loaderApp — THE APP LOADER, OWNED ONCE (AppLoader, kol-monitor 2026-10-17 — user: *"shouldnt that loader just be
 * owned in DS and consumed by the fxr monitor and mirror? with custom graphic input as prop?"*). The app's mark
 * centred on the theme's ground, pulsing while the bundle downloads. It has to be static HTML in `index.html` —
 * a React component would only appear after the wait it covers — so this plugin writes it there: fxr's loader,
 * once, with the graphic as an option. Call `hideLoaderApp()` (kol-framework) after the first commit — it holds the loader 600 ms from navigation start (`minMs`).
 *
 * Ground and ink follow the stored `data-theme`, else the system (run `THEME_BOOT_SCRIPT` before it, as every
 * KOL app does). Reduced motion: no pulse, no fade.
 *
 * @param {Object} opts
 * @param {string} opts.graphic   an SVG — the markup itself, or a path (relative to the app root) to an .svg file;
 *                                draw it in `currentColor` so it takes the ground's ink
 * @param {number} [opts.size=64] the mark's edge in px
 */
export function loaderApp({ graphic, size = 64 } = {}) {
  let root = process.cwd()
  const css = `#kol-loader-app{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#FAFAFA;color:#0E0E11;transition:opacity 240ms ease}`
    + `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) #kol-loader-app{background:#121215;color:#FFFFFF}}`
    + `:root[data-theme="dark"] #kol-loader-app{background:#121215;color:#FFFFFF}`
    + `#kol-loader-app svg{width:${size}px;height:${size}px;animation:kol-loader-app-pulse 1.6s ease-in-out infinite}`
    + `#kol-loader-app.is-done{opacity:0;pointer-events:none}`
    + `@keyframes kol-loader-app-pulse{50%{opacity:.35}}`
    + `@media (prefers-reduced-motion: reduce){#kol-loader-app svg{animation:none}#kol-loader-app{transition:none}}`
  return {
    name: 'kol-loader-app',
    configResolved(config) { root = config.root },
    async transformIndexHtml(html) {
      let svg = String(graphic ?? '').trim()
      if (svg && !svg.startsWith('<')) {
        const { readFile } = await import('node:fs/promises')
        const { resolve } = await import('node:path')
        svg = (await readFile(resolve(root, svg), 'utf8')).trim()
      }
      svg = svg.replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '')
      return html
        .replace('</head>', `<style id="kol-loader-app-css">${css}</style></head>`)
        .replace(/<body([^>]*)>/, `<body$1><div id="kol-loader-app" aria-hidden="true">${svg}</div>`)
    },
  }
}
