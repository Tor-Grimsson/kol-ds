/* document-fixture — kol-atlas's documents as Vite modules (plan-2026-10-28-document W1). Vite-only: the files
 * arrive through import.meta.glob; Node callers read the disk (fixture.test.mjs). */
export { TABS, CLIENT, tabPath } from './tabs.js'

/* the documents' source, by their path under ./docs (TABS[n].file) */
export const DOC_MODULES = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default', eager: true })
/* the research reviews, by their path under ./research */
export const REVIEW_MODULES = import.meta.glob('./research/**/*.md', { query: '?raw', import: 'default', eager: true })
/* every embedded image, by its path under ./docs (the shared _assets/link-cards too) */
const ASSET_URLS = import.meta.glob('./docs/**/_assets/**/*', { query: '?url', import: 'default', eager: true })
/* kol-atlas's web link cards (apps/workspace/src/link-cards.json, the URLs these documents cite): title, description,
 * site, and the screenshot it stored, carried as a 1000px JPEG under _assets/link-cards */
import LINK_CARDS from './link-cards.json'
export { LINK_CARDS }
export const cardImage = (url) => { const img = LINK_CARDS[url]?.image; return img ? (BY_STEM[stem(`./docs/_assets/link-cards/${img}`)] ?? null) : null }

export const docSource = (file) => DOC_MODULES[`./docs/${file}`]


/* `![[name]]` → the file beside the document (its section's _assets) or the shared _assets, by STEM: a raster over
 * 150 KB was carried as a 1200px JPEG, so its extension may differ from the embed's */
const stem = (p) => p.replace(/\.[a-z0-9]+$/i, '')
const BY_STEM = Object.fromEntries(Object.entries(ASSET_URLS).map(([p, url]) => [stem(p), url]))
export const assetUrl = (docFile, name) => {
  const section = docFile.split('/')[0]
  return BY_STEM[stem(`./docs/${section}/_assets/${name}`)] ?? BY_STEM[stem(`./docs/_assets/${name}`)] ?? null
}
