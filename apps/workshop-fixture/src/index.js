/* workshop-fixture — the invented corpus apps/workshop, apps/markdown and apps/search share.
 * Vite-only (the docs arrive through import.meta.glob); Node callers use corpus.js with their
 * own module map. */
import { buildCorpus } from './corpus.js'

/* raw markdown, keyed by path — the same seam kol-workshop's consumers glob their vault through */
export const DOC_MODULES = import.meta.glob('./docs/**/*.md', { eager: true, query: '?raw', import: 'default' })

export const CORPUS = buildCorpus(DOC_MODULES)

export { SPACES, DEV_PAGES, docHref, docSpace, componentHref, buildCorpus } from './corpus.js'
export { COMPONENTS, BLOCKS, SETS } from './components.js'
