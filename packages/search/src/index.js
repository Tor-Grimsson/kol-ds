/**
 * @kolkrabbi/kol-search — the search engine. Plain ESM: no React, no DOM, no dependencies.
 * Engine tier (ARCHITECTURE §3). The UI (overlay, chips, results page) lives in the UI packages.
 */
export { createIndex, search, WEIGHTS } from './search.js'
export { parseQuery, FIELD_ALIASES } from './query.js'
export { highlightRanges, norm, singular } from './text.js'
/* the substring predicate kol-workshop's palette runs on today — kept until the palette moves to `search` */
export { matchSearchItems } from './match.js'
