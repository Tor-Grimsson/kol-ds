/**
 * Icon Component
 *
 * Dynamically loads and renders SVG icons from the svg/ directory (including subdirectories)
 *
 * @param {Object} props
 * @param {string} props.name - Icon name (matches SVG filename without extension)
 * @param {number|string} props.size - Icon size (default: 16)
 * @param {string} props.className - Additional classes
 * @param {Object} props.style - Inline styles
 * @param {ReactNode} props.children - Optional: Direct SVG path content for custom icons
 */
import { useEffect, useState } from 'react'

/* Unified icon home. Canonical mirrored set (stroke + solid) + legacy loader set
 * + web's app-specific set (chess/dashboard/docs), all folded into this package so
 * a name always resolves across web + brand. `variant` picks stroke vs solid.
 *
 * The raw SVG strings live in ./iconData.js and are pulled in via a single
 * dynamic import — that keeps them out of the entry chunk (off the critical first-
 * paint path) and streams them in their own async chunk. Once loaded the maps are
 * cached at module scope, so resolution stays synchronous for every render after. */
let ICONS = null            // { STROKE, SOLID, WEB, LEGACY } once the chunk resolves
let loadPromise = null
const subscribers = new Set()

const loadIcons = () => {
  if (!loadPromise) {
    loadPromise = import('./iconData.js').then((mod) => {
      ICONS = mod
      subscribers.forEach((fn) => fn())
      return mod
    })
  }
  return loadPromise
}

// Start fetching the icon chunk the moment this module evaluates, in parallel with
// the rest of boot — by first paint it's usually already in flight or resolved.
loadIcons()

const useIconsReady = () => {
  const [ready, setReady] = useState(() => !!ICONS)
  useEffect(() => {
    if (ICONS) return undefined
    const cb = () => setReady(true)
    subscribers.add(cb)
    loadIcons()
    return () => subscribers.delete(cb)
  }, [])
  return ready
}

/* Consumer-registered icons — a repo brings its OWN svg folder and registers it,
 * so <Icon name> resolves app-specific icons that never ship in the package. They
 * win over the packaged set (a repo can also override a shared icon). Resolves
 * synchronously, so custom icons render without waiting on the packaged chunk. */
const CUSTOM = Object.create(null)

/**
 * Register a consumer's own SVGs with <Icon>. Call once at app boot with a Vite
 * glob of your icon folder — `import.meta.glob` is a compile-time, path-relative
 * macro, so it must run in YOUR source, not in this package:
 *
 *   import { registerIcons } from '@kolkrabbi/kol-icons'
 *   registerIcons(import.meta.glob('./icons/**\/*.svg',
 *     { eager: true, query: '?raw', import: 'default' }))
 *
 * Keys are the filename (basename, no extension). SVGs should use `currentColor`.
 */
export const registerIcons = (globMap) => {
  for (const [path, svg] of Object.entries(globMap || {})) {
    const name = (path.split('/').pop() || '').replace('.svg', '')
    if (name && typeof svg === 'string') CUSTOM[name] = svg
  }
}

/* Resolution order: consumer-registered → kol-icon-set-v1 (the curated set) →
 * legacy stroke/solid/svg/svg-web. Falling through to the legacy set warns once:
 * that name isn't in v1, so it's on borrowed time — register it locally or migrate
 * to a v1 name before the legacy set is dropped (a future major). */
const warnedLegacy = new Set()
const resolveIcon = (name, variant) => {
  if (CUSTOM[name]) return CUSTOM[name]
  if (!ICONS) return undefined
  if (ICONS.V1[name]) return ICONS.V1[name]
  const legacy = (variant === 'solid' ? ICONS.SOLID : ICONS.STROKE)[name]
    ?? (variant === 'solid' ? ICONS.STROKE : ICONS.SOLID)[name]
    ?? ICONS.LEGACY[name]
    ?? ICONS.WEB[name]
  if (legacy && !warnedLegacy.has(name)) {
    warnedLegacy.add(name)
    console.warn(`[kol-icons] "${name}" resolved from the legacy set — not in kol-icon-set-v1. registerIcons() it locally or migrate to a v1 name; the legacy set is dropped in a future major.`)
  }
  return legacy
}

const normalizeSize = (value) => {
  if (typeof value === 'number') {
    return `${value}px`
  }
  if (typeof value === 'string') {
    return value
  }
  return '16px'
}

const applySizeToMarkup = (markup, sizeValue) => {
  let updated = markup

  if (/width="/i.test(updated)) {
    updated = updated.replace(/width="[^"]*"/i, `width="${sizeValue}"`)
  } else {
    updated = updated.replace('<svg', `<svg width="${sizeValue}"`)
  }

  if (/height="/i.test(updated)) {
    updated = updated.replace(/height="[^"]*"/i, `height="${sizeValue}"`)
  } else {
    updated = updated.replace('<svg', `<svg height="${sizeValue}"`)
  }

  return updated
}

const Icon = ({
  name,
  size = 16,
  variant = 'stroke',
  className = '',
  style = {},
  children
}) => {
  const ready = useIconsReady()

  // If children are provided, render directly (for custom icons)
  if (children) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${className}`}
        style={{
          verticalAlign: 'middle',
          ...style
        }}
      >
        {children}
      </svg>
    )
  }

  const dimension = normalizeSize(size)

  // Consumer-registered icons resolve synchronously; the packaged set needs its
  // chunk. resolveIcon checks CUSTOM first, so custom icons paint on first render.
  const svgMarkup = resolveIcon(name, variant)

  if (!svgMarkup) {
    // Not resolved yet. If the packaged chunk is still streaming, hold the layout
    // box so the icon pops in without shifting. (Custom icons never reach here.)
    if (!ready) {
      return (
        <span
          aria-hidden="true"
          className={`inline-flex items-center justify-center ${className}`}
          style={{ width: dimension, height: dimension, lineHeight: 0, ...style }}
        />
      )
    }
    console.warn(`Icon "${name}" not found in icon set`)
    return null
  }

  const sizedMarkup = applySizeToMarkup(svgMarkup, dimension)

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: dimension,
        height: dimension,
        lineHeight: 0,
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: sizedMarkup }}
    />
  )
}

export default Icon
