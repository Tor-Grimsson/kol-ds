/**
 * Graphic — SVG illustration loader.
 *
 * Globs ./svg/<category>/<name>.svg at build time. Usage:
 *   <Graphic category="patterns" name="pattern-05" />
 *
 * The raw SVG strings (~4.8 MB) live in ./graphicData.js behind a single
 * dynamic import — their chunk streams in parallel with boot instead of
 * bloating the consumer's entry chunk (same pattern as kol-loader's Icon).
 * Until the chunk lands, renders a sized empty box (no layout shift); a
 * genuinely missing asset renders an AssetPlaceholder so it's visible rather
 * than silently empty.
 */
import { useEffect, useState } from 'react'
import AssetPlaceholder from '../atoms/AssetPlaceholder.jsx'

let RAW = null              // category → name → raw svg, once the chunk resolves
let loadPromise = null
const subscribers = new Set()

const loadGraphics = () => {
  if (!loadPromise) {
    loadPromise = import('./graphicData.js').then((mod) => {
      RAW = mod.GRAPHIC_RAW
      subscribers.forEach((fn) => fn())
      return mod
    })
  }
  return loadPromise
}

// Start fetching at module eval — in flight alongside the rest of boot.
loadGraphics()

const useGraphicsReady = () => {
  const [ready, setReady] = useState(() => !!RAW)
  useEffect(() => {
    if (RAW) return undefined
    const cb = () => setReady(true)
    subscribers.add(cb)
    loadGraphics()
    return () => subscribers.delete(cb)
  }, [])
  return ready
}

/* Inventory (category → sorted names) from a keys-only glob — paths resolve at
 * build time without pulling any SVG content into the chunk. */
export const GRAPHICS = Object.keys(import.meta.glob('./svg/**/*.svg')).reduce((acc, path) => {
  const [category, file] = path.replace('./svg/', '').split('/')
  ;(acc[category] ||= []).push(file.replace('.svg', ''))
  return acc
}, {})
for (const names of Object.values(GRAPHICS)) names.sort()

export default function Graphic({
  category,
  name,
  className = '',
  style,
  title,
  aspectRatio = '1 / 1',
}) {
  const ready = useGraphicsReady()

  // Chunk still streaming — hold a same-sized box so layout doesn't shift.
  if (!ready) {
    return (
      <span
        aria-hidden="true"
        className={`kol-graphic inline-flex w-full h-auto ${className}`.trim()}
        style={{ aspectRatio, ...style }}
      />
    )
  }

  const raw = RAW[category]?.[name]
  if (!raw) {
    if (import.meta.env.DEV) console.warn(`Graphic: ${category}/${name} not found`)
    return <AssetPlaceholder category={category} name={name} aspectRatio={aspectRatio} note="pending" className={className} />
  }
  return (
    <span
      className={`kol-graphic inline-flex w-full h-auto ${className}`.trim()}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}
