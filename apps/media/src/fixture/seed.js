/* The seed tree. Content is irrelevant — what matters is that it has the shapes
 * the product has to survive: nesting, mixed kinds, a folder that is EMPTY (so
 * folders are provably real nodes and not derived from keys), a read-only
 * bucket beside a writable one, and enough files that a wall has to scroll.
 *
 * Folders are listed explicitly. That is the whole point: in the real bucket a
 * folder is a prefix inferred from object keys, so it cannot be created, renamed
 * or emptied — which is why none of those verbs exist upstream. */

import { SEED_FILES } from './assets.js'

export const BUCKETS = [
  { id: 'r2', label: 'R2 · kol-media', publicBase: 'fixture://r2', writable: true },
  { id: 'b2', label: 'B2 · website', publicBase: 'fixture://b2', writable: false },
]

export const SEED = {
  r2: {
    folders: [
      'img/',
      'img/01-shoots/',
      'img/01-shoots/reykjavik/',
      'img/01-shoots/hafnarfjordur/',
      'img/02-products/',
      'img/03-scratch/', // deliberately empty — nothing derives this one
      'video/',
      'video/reels/',
      'audio/',
      'docs/',
      'code/',
    ],
    files: SEED_FILES.r2,
  },
  b2: {
    folders: ['website/', 'website/hero/', 'website/icons/'],
    files: SEED_FILES.b2,
  },
}


const TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml',
  mp4: 'video/mp4', webm: 'video/webm',
  wav: 'audio/wav', mp3: 'audio/mpeg', m4a: 'audio/mp4', flac: 'audio/flac',
  pdf: 'application/pdf', ttf: 'font/ttf', woff2: 'font/woff2', woff: 'font/woff', otf: 'font/otf',
  zip: 'application/zip', m3u8: 'application/vnd.apple.mpegurl', ts: 'video/mp2t', md: 'text/markdown', txt: 'text/plain',
  json: 'application/json', yaml: 'text/yaml', yml: 'text/yaml',
  css: 'text/css', js: 'text/javascript',
}

export const contentTypeOf = (key) =>
  TYPES[key.split('.').pop()?.toLowerCase()] ?? 'application/octet-stream'

/* Dates are DERIVED from the key, not stored, so a reset returns a byte-identical
 * tree and two sessions agree. Sizes are the real files' (assets.js). */
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export function uploadedOf(key) {
  // Spread across the last ~18 months, stable per key.
  const days = hash(`${key}:date`) % 540
  return new Date(Date.UTC(2026, 8, 20) - days * 86_400_000).toISOString()
}

/* Tags at rest (the media D1 pass, 2026-09-25) — enough that the tag filter and the chips have
 * something to show on first load. In kol-olina these would be rows in D1 beside `files`. */
export const SEED_TAGS = {
  r2: {
    'img/01-shoots/reykjavik/tt-01.jpg': ['reykjavik', 'shoot'],
    'img/01-shoots/reykjavik/tt-02.jpg': ['reykjavik', 'shoot'],
    'img/01-shoots/hafnarfjordur/tt-05.jpg': ['shoot'],
    'img/02-products/tt-07.jpg': ['product', 'hero'],
    'img/02-products/logo.svg': ['brand'],
    'video/reels/softforms.mp4': ['reel', 'hero'],
    'docs/01-tier-rules.md': ['draft'],
  },
}
