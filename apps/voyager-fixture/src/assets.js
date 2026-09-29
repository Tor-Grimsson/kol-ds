/* VOYAGER's files, as Vite URLs — carried from `_tmp/kol-client` (the client template, rebranded
 * VOYAGER) on 2026-09-29. SVGs up to 2 MB verbatim; anything heavier (deck slides and device mocks
 * that embed rasters, the mood PNGs) as a 1600px JPEG render of the original. Vite-only — the
 * fixture is consumed by the apps, which are Vite apps. */

const urls = import.meta.glob('./assets/**/*.{svg,jpg,png}', { query: '?url', import: 'default', eager: true })
const raws = import.meta.glob('./assets/marks/*.svg', { query: '?raw', import: 'default', eager: true })

const file = (path) => {
  const name = path.split('/').pop()
  return { name, id: name.replace(/\.[a-z]+$/, ''), url: urls[path], format: name.split('.').pop(), rendered: name.endsWith('.jpg') }
}
const under = (dir) => Object.keys(urls).filter((p) => p.startsWith(`./assets/${dir}/`)).sort().map(file)

export const MARKS = under('marks')
export const STATIONERY = under('stationery')
export const DECK = under('deck')
export const DIAGRAMS = under('diagrams')
export const MOOD = under('mood')
export const GRAPHICS = Object.fromEntries(['abstract', 'patterns', 'web', 'devices'].map((c) => [c, under(`graphics/${c}`)]))

/* the marks as raw SVG, by file id — what kol-styleguide's `logoSources` takes */
export const MARK_SVG = Object.fromEntries(Object.entries(raws).map(([p, svg]) => [p.split('/').pop().replace(/\.svg$/, ''), svg]))

export const ASSET_GROUPS = [
  { id: 'marks', label: 'Marks', files: MARKS },
  { id: 'stationery', label: 'Stationery', files: STATIONERY },
  { id: 'deck', label: 'Deck', files: DECK },
  { id: 'diagrams', label: 'Diagrams', files: DIAGRAMS },
  ...Object.entries(GRAPHICS).map(([c, files]) => ({ id: `graphics/${c}`, label: `Graphics · ${c}`, files })),
  { id: 'mood', label: 'Mood', files: MOOD },
]
