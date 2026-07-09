/**
 * Brand asset loader — the <Icon>/<Graphic> pattern, rehomed to kol-brand for
 * the brand marks (logos, wordmark, favicons). It sits in the same folder as
 * the SVGs and globs its siblings (`./*.svg`, `?raw`), injecting the markup so
 * `currentColor` styling works. Nothing is inlined in source — the assets are
 * files, loaded.
 *
 * Name = filename without extension:
 *   kol-wordmark · kol-logomark · kol-lockup-hori · kol-lockup-vert
 *   favicon-kolkrabbi · favicon-kol-ds
 *
 *   import { Asset, ASSET_NAMES } from '@kolkrabbi/kol-brand/svg'
 *   <Asset name="kol-wordmark" className="h-6 w-auto text-fg-88" />
 *
 * Raw single-file imports still work too: `@kolkrabbi/kol-brand/svg/kol-wordmark.svg?raw`.
 */
const raw = import.meta.glob('./*.svg', { eager: true, query: '?raw', import: 'default' })

// name → raw SVG string
export const ASSETS = Object.fromEntries(
  Object.entries(raw).map(([path, svg]) => [path.replace('./', '').replace('.svg', ''), svg]),
)

export const ASSET_NAMES = Object.keys(ASSETS).sort()

/**
 * @param {string} name   asset name (see ASSET_NAMES)
 * @param {string} className  classes on the wrapper (sizing / color)
 * @param {string} title  accessible label (omit → decorative)
 */
export function Asset({ name, className = '', title, ...rest }) {
  const svg = ASSETS[name]
  if (!svg) return null
  return (
    <span
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
    />
  )
}
