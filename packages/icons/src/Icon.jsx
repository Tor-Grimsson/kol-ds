/**
 * Icon Component
 *
 * Dynamically loads and renders SVG icons from kol-icon-set-interface,
 * kol-icon-set-signal and kol-icon-set-identity (or consumer-registered sets)
 *
 * @param {Object} props
 * @param {string} props.name - Icon name (matches SVG filename without extension)
 * @param {number|string} props.size - Icon size (default: 16)
 * @param {string} props.className - Additional classes
 * @param {Object} props.style - Inline styles
 * @param {ReactNode} props.children - Optional: Direct SVG path content for custom icons
 */
import { useEffect, useState } from 'react'
import { setOf } from './iconNames.js'

/* THREE SETS, THREE CHUNKS (1.5, plan-2026-10-28-identity — user: "I cant believe you have to take every icon we
 * ship if you only need one? is kol-icon just one tier?"). Until 0.50.0 every set's SVG text sat in ONE async
 * module, so the first <Icon> on a website pulled every rack waveform and every app mark too — the "a website pays
 * nothing for the rest" claim was never true in the bundle. Now each set is its own module under ./sets/, and a
 * name's set is known from the keys-only index (iconNames.js, no SVG text) BEFORE anything is fetched: the first
 * interface name fetches the interface chunk and nothing else; signal and identity load the first time one of their
 * names renders. Within a set it is still the whole set — one request, not one per glyph. Once a chunk lands its map
 * is cached at module scope, so resolution stays synchronous for every render after. Nothing is prefetched at boot. */
const SETS = {
  interface: () => import('./sets/interface.js'),
  signal: () => import('./sets/signal.js'),
  identity: () => import('./sets/identity.js'),
}
const LOADED = {}           // set → { name: svg } once its chunk resolves
const PENDING = {}          // set → the in-flight import
const subscribers = new Set()

const loadSet = (set) => {
  if (!set || !SETS[set]) return Promise.resolve(null)
  if (LOADED[set]) return Promise.resolve(LOADED[set])
  if (!PENDING[set]) {
    PENDING[set] = SETS[set]().then((mod) => {
      LOADED[set] = mod.default
      subscribers.forEach((fn) => fn())
      return mod.default
    })
  }
  return PENDING[set]
}

/* ready = the set this name lives in has landed (a name no set ships is "ready" at once — it is a consumer's
 * registered glyph or a miss, and neither waits on a chunk) */
const useIconsReady = (name) => {
  const set = setOf(name)
  const [ready, setReady] = useState(() => !set || !!LOADED[set])
  useEffect(() => {
    /* the chunk can land BETWEEN the render (which read the set as missing) and this effect — under a
       Suspense boundary that gap is as long as the lazy route takes. Nobody was subscribed then, so
       returning here without setting the state left the icon blank for good (kol-fxr's rail on
       /editor and /randomiser, found in apps/editor-hub 2026-10-03). */
    if (!set || LOADED[set]) { setReady(true); return undefined }
    setReady(false)
    const cb = () => { if (LOADED[set]) setReady(true) }
    subscribers.add(cb)
    loadSet(set)
    return () => subscribers.delete(cb)
  }, [set])
  return ready
}

/* Consumer-registered icons — a repo brings its OWN svg folder and registers it,
 * so <Icon name> resolves app-specific icons that never ship in the package. They
 * fill the names the packaged set has none for and NEVER override a shipped name
 * (2026-10-24; they used to win). Resolves synchronously, so custom icons render
 * without waiting on the packaged chunk. */
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

/* Resolution order: kol-icon-set-interface → kol-icon-set-signal → kol-icon-set-identity (0.49.0) → consumer-registered.
 * That's the whole chain — a miss is a real miss.
 *
 * v1 BEFORE signal, and it decides the twelve names both sets drew (2026-08-28):
 * `chevron-*`, `nav-*`, `dith-flow`, `ptrn-checker`, `ptrn-dot`. The name map is
 * flat — one name, one glyph — so a second drawing under a shipped name cannot
 * be expressed, only silently win. Those twelve were left out of the signal set
 * rather than shipped to collide; v1's are what render. */
/* RENAMED GLYPHS — the old name still resolves to the new glyph, so a consumer's bump does not
 * blank an icon. Drop each once no repo in the estate names it (Retirements R2).
 *   customize → nav-settings (2026-10-09: two drawings of one sliders mark; nav-settings has the
 *     punched hole)
 *   user-interface → metrics → metric (2026-10-09: it is the metrics app's mark, moved to `identity`)
 *   metrics → metric (2026-10-28: one word, singular, the app's own name — `apps/metric`, metric.kolkrabbi.io)
 *   rack → rack-v (2026-10-09: beside the new rack-h) */
export const RENAMED_ICONS = { customize: 'nav-settings', 'user-interface': 'metric', metrics: 'metric', rack: 'rack-v' }

/* A REGISTERED GLYPH NEVER OVERRIDES A DS NAME (user 2026-10-24: kol-mirror registered its own set over the resolver and
 * its `refresh` replaced the DS's in the settings rail's reset — *"how can it register its own in a FIXED PRESET OF
 * SETTINGS?"*). The packaged sets win for every name they ship; a consumer's glyph resolves only for names the DS has
 * none for. Before the packaged chunk lands a colliding custom glyph may paint once; the DS's takes over on load.
 * Dev warns once per overridden name, so a collision is seen, not silently lost. */
const overridden = new Set()
const resolveIcon = (name) => {
  const n = RENAMED_ICONS[name] ?? name
  const set = setOf(n)
  if (set) {
    /* a DS name: its set's map, or nothing yet while that chunk streams — never the custom glyph */
    if (CUSTOM[name] && import.meta.env?.DEV && !overridden.has(name)) {
      overridden.add(name)
      console.warn(`kol-icons: "${name}" is a DS glyph — the registered one is ignored (a registration never overrides a shipped name, 2026-10-24). Register it under another name if it is a different drawing.`)
    }
    return LOADED[set]?.[n]
  }
  return CUSTOM[name]
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

/* Size the ROOT <svg> tag only. The old unanchored regex rewrote the first
 * `width="…"` anywhere in the markup — on a cleaned (viewBox-only) SVG that
 * was a path's `stroke-width`, turning the glyph into a solid blob. The
 * lookbehind keeps `stroke-width` untouched even on the root tag. */
const applySizeToMarkup = (markup, sizeValue) => {
  return markup.replace(/<svg\b[^>]*>/i, (tag) => {
    let t = tag
    t = /(?<![-\w])width="/i.test(t)
      ? t.replace(/(?<![-\w])width="[^"]*"/i, `width="${sizeValue}"`)
      : t.replace('<svg', `<svg width="${sizeValue}"`)
    t = /(?<![-\w])height="/i.test(t)
      ? t.replace(/(?<![-\w])height="[^"]*"/i, `height="${sizeValue}"`)
      : t.replace('<svg', `<svg height="${sizeValue}"`)
    return t
  })
}

const Icon = ({
  name,
  size = 16,
  className = '',
  style = {},
  children
}) => {
  const ready = useIconsReady(RENAMED_ICONS[name] ?? name)

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
  const svgMarkup = resolveIcon(name)

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

  /* AN ICON IS NEVER THE CLICK TARGET (editor review #7, 2026-09-27: the design editor's settings
   * drawer would not close on its X). The markup is injected as HTML, so when the icon's subtree
   * re-renders between press and release the <path> the press landed on is replaced, and the
   * browser drops the click — it needs the SAME node under both. With pointer events off, the press
   * lands on the button around the glyph, which survives. Esc and the scrim always worked, which is
   * how it hid. */
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: dimension,
        height: dimension,
        lineHeight: 0,
        pointerEvents: 'none',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: sizedMarkup }}
    />
  )
}

export default Icon
