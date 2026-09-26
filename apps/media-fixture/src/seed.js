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

/* The rest of the fake D1 at rest (plan v2, 2026-09-26) — favourites, folder tags, a short event
 * log for Recents — so Home and the filters show something on first load. Smart folders are gone
 * (user, 2026-09-26: not wanted). */
export const SEED_D1 = {
  favourites: {
    r2: ['img/02-products/tt-07.jpg', 'docs/01-tier-rules.md', 'img/01-shoots/'],
  },
  folderTags: {
    r2: { 'img/01-shoots/': ['shoot'], 'video/reels/': ['reel'] },
  },
  events: [
    { bucket: 'r2', kind: 'uploaded', key: 'img/02-products/radar-ascii.png', minutesAgo: 2880 },
    { bucket: 'r2', kind: 'opened', key: 'video/reels/softforms.mp4', minutesAgo: 600 },
    { bucket: 'r2', kind: 'edited', key: 'docs/01-tier-rules.md', minutesAgo: 240 },
    { bucket: 'r2', kind: 'opened', key: 'img/02-products/tt-07.jpg', minutesAgo: 90 },
    { bucket: 'r2', kind: 'opened', key: 'README.md', minutesAgo: 30 },
  ],
}

/* Notes at rest (notes as a tool, 2026-09-27) — rows in the fake D1's `notes` table, markdown with a
 * frontmatter block, as kol-olina's brand notes store them. Enough for a list, a favourite and a
 * search to have something to find. */
export const SEED_NOTES = [
  {
    slug: 'shoot-reykjavik-call-sheet', favourite: true, minutesAgo: 45,
    title: 'Reykjavík shoot — call sheet',
    body: `---
title: Reykjavík shoot — call sheet
date: 2026-09-20
tags: [shoot, reykjavik]
---

# Reykjavík shoot — call sheet

**Call** 06:30 at the harbour, first light at 07:12.

- Crew: director, DP, 1st AC, gaffer, producer
- Kit: two bodies, the 35 and the 85, one light kit
- Weather call at 05:30 — if the wind is above 12 m/s we move to the studio

## Shot list

1. Wide on the pier, fog if we get it
2. Product on the wet stone, low angle
3. Portrait series against the corrugated wall
`,
  },
  {
    slug: 'brand-voice-notes', favourite: false, minutesAgo: 60 * 20,
    title: 'Brand voice notes',
    body: `---
title: Brand voice notes
date: 2026-09-12
tags: [brand]
---

# Brand voice notes

Calm is a method, not a mood. Say the thing once, plainly, and stop.

| Say | Not |
|---|---|
| We handle it | We are passionate about handling it |
| On time | Timely delivery solutions |

> Great production feels effortless, even when it isn't.
`,
  },
  {
    slug: 'deck-to-do', favourite: false, minutesAgo: 60 * 72,
    title: 'Deck to-do',
    body: `---
title: Deck to-do
date: 2026-09-08
tags: [deck, todo]
---

# Deck to-do

- [x] Cover and the wide stamp
- [ ] Replace the index rows with this year's work
- [ ] Export a PDF for the agency and a PPTX for the client
`,
  },
]
