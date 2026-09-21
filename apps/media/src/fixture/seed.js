/* The seed tree. Content is irrelevant — what matters is that it has the shapes
 * the product has to survive: nesting, mixed kinds, a folder that is EMPTY (so
 * folders are provably real nodes and not derived from keys), a read-only
 * bucket beside a writable one, and enough files that a wall has to scroll.
 *
 * Folders are listed explicitly. That is the whole point: in the real bucket a
 * folder is a prefix inferred from object keys, so it cannot be created, renamed
 * or emptied — which is why none of those verbs exist upstream. */

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
    // ponytail: the folders above are also implied by the keys below; listing
    // them explicitly is what lets `img/03-scratch/` exist while empty.
    files: [
      'img/01-shoots/reykjavik/harbour-01.jpg',
      'img/01-shoots/reykjavik/harbour-02.jpg',
      'img/01-shoots/reykjavik/harbour-03.jpg',
      'img/01-shoots/reykjavik/quay-dusk.jpg',
      'img/01-shoots/reykjavik/quay-dusk-alt.png',
      'img/01-shoots/hafnarfjordur/lava-field.jpg',
      'img/01-shoots/hafnarfjordur/lava-field-wide.jpg',
      'img/01-shoots/contact-sheet.pdf',
      'img/02-products/mug-front.png',
      'img/02-products/mug-side.png',
      'img/02-products/tote-flat.png',
      'img/02-products/tote-hang.png',
      'img/02-products/poster-a2.png',
      'img/cover-fallback.jpg',
      'video/reels/studio-loop.mp4',
      'video/reels/press-cut.mp4',
      'video/walkthrough.mp4',
      'audio/voice-note.wav',
      'audio/room-tone.wav',
      'audio/interview-cut.wav',
      'docs/brand-guidelines.pdf',
      'docs/press-release.md',
      'docs/shot-list.txt',
      'docs/manifest.json',
      'docs/deploy.yaml',
      'code/tooltip.css',
      'code/listMedia.js',
      'readme.md',
    ],
  },
  b2: {
    folders: ['website/', 'website/hero/', 'website/icons/'],
    files: [
      'website/hero/home-01.jpg',
      'website/hero/home-02.jpg',
      'website/hero/about.jpg',
      'website/icons/mark.svg',
      'website/icons/wordmark.svg',
      'website/favicon.svg',
      'website/og-default.png',
    ],
  },
}

import { assetSize } from './assets.js'

const TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml',
  mp4: 'video/mp4', webm: 'video/webm',
  wav: 'audio/wav', mp3: 'audio/mpeg', m4a: 'audio/mp4',
  pdf: 'application/pdf', md: 'text/markdown', txt: 'text/plain',
  json: 'application/json', yaml: 'text/yaml', yml: 'text/yaml',
  css: 'text/css', js: 'text/javascript',
}

export const contentTypeOf = (key) =>
  TYPES[key.split('.').pop()?.toLowerCase()] ?? 'application/octet-stream'

/* Sizes and dates are DERIVED from the key, not stored, so a reset returns a
 * byte-identical tree and two sessions agree. A real bucket's numbers are
 * arbitrary; the only property that matters here is that they are stable. */
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export function sizeOf(key) {
  // A file carried as real bytes reports ITS size, never a generated one — the
  // meta line is read before anything is fetched and must not disagree with
  // what the player then loads.
  const real = assetSize(key)
  if (real) return real

  const h = hash(key)
  const ct = contentTypeOf(key)
  if (ct.startsWith('audio/')) return 32_000 + (h % 4_000) // the generated WAVs, near enough
  if (ct.startsWith('image/')) return 90_000 + (h % 400_000)
  return 1_200 + (h % 40_000)
}

export function uploadedOf(key) {
  // Spread across the last ~18 months, stable per key.
  const days = hash(`${key}:date`) % 540
  return new Date(Date.UTC(2026, 8, 20) - days * 86_400_000).toISOString()
}
