/**
 * @kolkrabbi/kol-search — the search engine. Plain ESM: no React, no DOM, no dependencies.
 * Engine tier (ARCHITECTURE §3). The UI (overlay, chips, results page) lives in the UI packages.
 */
export { createIndex, search, WEIGHTS } from './search.js'
export { parseQuery, FIELD_ALIASES } from './query.js'
export { highlightRanges, norm, singular } from './text.js'
/* the index's tags as a network — the node graph's data (ruling D4, 2026-09-29) */
export { tagGraph, indexGraph } from './graph.js'
/* the substring predicate kol-workshop's palette runs on today — kept until the palette moves to `search` */
export { matchSearchItems } from './match.js'
