/* REAL FILES — every file in the fixture is one of these, and nothing is generated
 * (user 2026-09-23: *"just use real files, not these generated colors"*). A key with no
 * file behind it renders as the generic file icon, which is what an empty or unknown
 * file honestly is.
 *
 * CSS and JS are carried as `.txt` bytes (`kol-core.css.txt`): under their own extension Vite
 * runs them through Tailwind and the module transform before serving, and the preview got a 500
 * instead of the file. The KEY keeps the real name, so the product sees `code/kol-core.css`.
 *
 * Pure data, no imports, so the store's Node self-check can read it; the URLs live in
 * `assets-urls.js`, which uses Vite's asset imports and only resolves in the browser.
 * Sizes are the real byte counts — the meta line is read before anything is fetched.
 *
 * Provenance: renders from kol-labs-single, PDFs from kol-proofer, stills + svgs from
 * this repo's `public/`, audio 15s cuts of the user's own tracks (casino.mp3 keeps its
 * cover art, the rest are stripped), text files are this repo's own. */

export const FILE_OF = {
  'r2:img/01-shoots/reykjavik/tt-01.jpg': 'tt-01.jpg',
  'r2:img/01-shoots/reykjavik/tt-02.jpg': 'tt-02.jpg',
  'r2:img/01-shoots/reykjavik/tt-03.jpg': 'tt-03.jpg',
  'r2:img/01-shoots/reykjavik/tt-04.jpg': 'tt-04.jpg',
  'r2:img/01-shoots/hafnarfjordur/tt-05.jpg': 'tt-05.jpg',
  'r2:img/01-shoots/hafnarfjordur/tt-06.jpg': 'tt-06.jpg',
  'r2:img/01-shoots/kol-kerner-2.pdf': 'kol-kerner-2.pdf',
  'r2:img/02-products/tt-07.jpg': 'tt-07.jpg',
  'r2:img/02-products/radar-ascii.png': 'radar-ascii.png',
  'r2:img/02-products/logo.svg': 'logo.svg',
  'r2:video/reels/softforms.mp4': 'softforms.mp4',
  'r2:video/reels/softforms-3d.mp4': 'softforms-3d.mp4',
  'r2:video/optic-reaction.mp4': 'optic-reaction.mp4',
  'r2:audio/casino.mp3': 'casino.mp3',
  'r2:audio/andvaka.mp3': 'andvaka.mp3',
  'r2:audio/dobani.wav': 'dobani.wav',
  'r2:audio/invaders.flac': 'invaders.flac',
  'r2:docs/kol-kerner.pdf': 'kol-kerner.pdf',
  'r2:docs/01-tier-rules.md': '01-tier-rules.md',
  'r2:docs/package.json': 'package.json',
  'r2:docs/pnpm-workspace.yaml': 'pnpm-workspace.yaml',
  'r2:code/kol-core.css': 'kol-core.css.txt',
  'r2:code/client.js': 'client.js.txt',
  'r2:README.md': 'README.md',
  'b2:website/hero/tt-01.jpg': 'tt-01.jpg',
  'b2:website/hero/tt-05.jpg': 'tt-05.jpg',
  'b2:website/hero/tt-07.jpg': 'tt-07.jpg',
  'b2:website/icons/logo.svg': 'logo.svg',
  'b2:website/icons/favicon-kol-ds.svg': 'favicon-kol-ds.svg',
  'b2:website/favicon.svg': 'favicon.svg',
  'b2:website/radar-ascii.png': 'radar-ascii.png',
  'r2:fonts/TGRotVF.ttf': 'TGRotVF.ttf',
  'r2:fonts/PPRightGrotesk-Fine.woff2': 'PPRightGrotesk-Fine.woff2',
  'r2:video/softforms-stream/poster.jpg': 'softforms-poster.jpg',
  'r2:video/softforms-stream/hls/index.m3u8': 'hls/index.m3u8',
  'r2:video/softforms-stream/hls/segment_000.ts': 'hls/segment_000.ts.bin',
  'r2:video/softforms-stream/hls/segment_001.ts': 'hls/segment_001.ts.bin',
  'r2:video/softforms-stream/hls/segment_002.ts': 'hls/segment_002.ts.bin',
  'r2:video/softforms-stream/hls/segment_003.ts': 'hls/segment_003.ts.bin',
  'r2:docs/readme.zip': 'readme.zip',
  'r2:docs/credits.txt': 'credits.txt',
  'r2:misc/.gitignore': 'gitignore.txt',
  'r2:img/old-cover.jpg': 'tt-03.jpg',
  'r2:drafts/notes.md': '01-tier-rules.md',
  'r2:drafts/sketch.png': 'radar-ascii.png',
  'r2:audio/take-2.mp3': 'andvaka.mp3',
}

export const FILE_SIZES = {
  '01-tier-rules.md': 5682,
  'README.md': 5991,
  'andvaka.mp3': 241205,
  'casino.mp3': 293967,
  'client.js.txt': 2662,
  'dobani.wav': 661578,
  'favicon-kol-ds.svg': 2780,
  'favicon.svg': 9556,
  'invaders.flac': 942219,
  'kol-core.css.txt': 2163,
  'kol-kerner-2.pdf': 868934,
  'kol-kerner.pdf': 491750,
  'logo.svg': 9250,
  'optic-reaction.mp4': 851585,
  'package.json': 920,
  'pnpm-workspace.yaml': 101,
  'radar-ascii.png': 1797647,
  'softforms-3d.mp4': 295018,
  'softforms.mp4': 253748,
  'tt-01.jpg': 398407,
  'tt-02.jpg': 356880,
  'tt-03.jpg': 368135,
  'tt-04.jpg': 409512,
  'tt-05.jpg': 405300,
  'tt-06.jpg': 379276,
  'tt-07.jpg': 366838,
  'PPRightGrotesk-Fine.woff2': 48660,
  'TGRotVF.ttf': 69336,
  'credits.txt': 1361,
  'hls/index.m3u8': 220,
  'hls/segment_000.ts.bin': 41548,
  'hls/segment_001.ts.bin': 38352,
  'hls/segment_002.ts.bin': 37600,
  'hls/segment_003.ts.bin': 37600,
  'readme.zip': 2812,
  'softforms-poster.jpg': 65227,
  'gitignore.txt': 232,
}

export const SEED_FILES = {
  r2: [
    'img/01-shoots/reykjavik/tt-01.jpg',
    'img/01-shoots/reykjavik/tt-02.jpg',
    'img/01-shoots/reykjavik/tt-03.jpg',
    'img/01-shoots/reykjavik/tt-04.jpg',
    'img/01-shoots/hafnarfjordur/tt-05.jpg',
    'img/01-shoots/hafnarfjordur/tt-06.jpg',
    'img/01-shoots/kol-kerner-2.pdf',
    'img/02-products/tt-07.jpg',
    'img/02-products/radar-ascii.png',
    'img/02-products/logo.svg',
    'video/reels/softforms.mp4',
    'video/reels/softforms-3d.mp4',
    'video/optic-reaction.mp4',
    'audio/casino.mp3',
    'audio/andvaka.mp3',
    'audio/dobani.wav',
    'audio/invaders.flac',
    'docs/kol-kerner.pdf',
    'docs/01-tier-rules.md',
    'docs/package.json',
    'docs/pnpm-workspace.yaml',
    'code/kol-core.css',
    'code/client.js',
    'README.md',
    'fonts/TGRotVF.ttf',
    'fonts/PPRightGrotesk-Fine.woff2',
    'video/softforms-stream/poster.jpg',
    'video/softforms-stream/hls/index.m3u8',
    'video/softforms-stream/hls/segment_000.ts',
    'video/softforms-stream/hls/segment_001.ts',
    'video/softforms-stream/hls/segment_002.ts',
    'video/softforms-stream/hls/segment_003.ts',
    'docs/readme.zip',
    'docs/credits.txt',
    'misc/.gitignore',
  ],
  b2: [
    'website/hero/tt-01.jpg',
    'website/hero/tt-05.jpg',
    'website/hero/tt-07.jpg',
    'website/icons/logo.svg',
    'website/icons/favicon-kol-ds.svg',
    'website/favicon.svg',
    'website/radar-ascii.png',
  ],
}

/* WHAT THE TRASH HOLDS ON A FRESH LOAD (user 2026-09-23: *"while developing, put dummy files in
 * trash.. how else can we understand the function?"*). Real files, deleted at different ages, so
 * Restore, Delete forever and the 30-day expiry all have something to act on — one of them close
 * to its end. */
export const SEED_TRASH = {
  r2: [
    { path: 'img/old-cover.jpg', daysAgo: 2 },
    { path: 'drafts/', files: ['drafts/notes.md', 'drafts/sketch.png'], daysAgo: 12 },
    { path: 'audio/take-2.mp3', daysAgo: 27 },
  ],
}

export const assetFile = (bucket, key) => FILE_OF[`${bucket}:${key}`] ?? null
export const assetSize = (bucket, key) => FILE_SIZES[assetFile(bucket, key)] ?? null
