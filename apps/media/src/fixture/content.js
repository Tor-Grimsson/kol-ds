/* REAL BYTES FOR THE FIXTURE. The tree is fake, but a file that cannot be
 * opened proves nothing — the point of the app is to exercise the product, and
 * half the product is what a file looks like when you click it.
 *
 * Everything here is generated in the browser as a `data:` URI, so there is
 * still no network and nothing to serve. `KindPreview` fetches the URL for text
 * kinds and `fetch()` reads a data URI happily; `<img>` and `<audio>` take one
 * directly. */

import { assetUrl } from './assets-urls.js'

const b64 = (s) => btoa(unescape(encodeURIComponent(s)))
const ext = (key) => key.split('.').pop()?.toLowerCase() ?? ''

function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/* An image with the file's own name in it, so a wall of tiles is readable as
 * distinct files rather than one repeated swatch. */
function image(key) {
  const hue = hash(key) % 360
  const name = key.split('/').pop()
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${hue} 42% 46%)"/>` +
    `<stop offset="1" stop-color="hsl(${(hue + 40) % 360} 38% 28%)"/>` +
    `</linearGradient></defs>` +
    `<rect width="1200" height="800" fill="url(#g)"/>` +
    `<text x="600" y="420" font-family="monospace" font-size="44" fill="hsl(${hue} 24% 94%)" ` +
    `text-anchor="middle">${name.replace(/[<>&]/g, '')}</text></svg>`
  return `data:image/svg+xml;base64,${b64(svg)}`
}

/* A real WAV — 16-bit mono PCM, one short tone per file, pitched off the key so
 * two audio files do not sound identical. Enough to prove the player mounts,
 * scrubs and plays. */
function wav(key, seconds = 2) {
  const rate = 8000
  const freq = 180 + (hash(key) % 320)
  const n = rate * seconds
  const buf = new ArrayBuffer(44 + n * 2)
  const v = new DataView(buf)
  const ascii = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)) }
  ascii(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); ascii(8, 'WAVE')
  ascii(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  ascii(36, 'data'); v.setUint32(40, n * 2, true)
  for (let i = 0; i < n; i++) {
    const fade = Math.min(1, i / 400, (n - i) / 2000)
    v.setInt16(44 + i * 2, Math.sin((2 * Math.PI * freq * i) / rate) * 9000 * fade, true)
  }
  let s = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return `data:audio/wav;base64,${btoa(s)}`
}

const TEXT = {
  md: (key) => `---
title: ${key.split('/').pop().replace(/\.md$/, '')}
status: draft
---

# ${key.split('/').pop()}

Fixture content. This file is generated in the browser so the markdown path
renders a real document rather than a placeholder card.

- Folders here are real nodes, not key prefixes
- Every operation runs against the in-memory tree
- **Clear changes** puts it back

> The tree is fake. The bytes are not.
`,
  txt: (key) => `${key}\n\n${'-'.repeat(48)}\n\nPlain text fixture.\nThe file browser reads this over a data: URI — no network.\n`,
  json: () => JSON.stringify({
    generated: true, source: 'apps/media fixture', network: false,
    tree: { folders: 'real nodes', files: 'projected to keys' },
    operations: ['create', 'rename', 'move', 'delete', 'upload'],
  }, null, 2),
  yaml: () => `generated: true\nsource: apps/media fixture\nnetwork: false\noperations:\n  - create\n  - rename\n  - move\n  - delete\n  - upload\n`,
  css: () => `.kol-tooltip {\n  border: 1px solid var(--kol-oq-04);\n  border-radius: var(--kol-radius-sm);\n  padding: 4px 8px;\n}\n`,
  js: () => `export function listMedia(prefix = '') {\n  // the fixture never fetches\n  return store.list(bucket, prefix)\n}\n`,
}
TEXT.yml = TEXT.yaml
TEXT.markdown = TEXT.md
TEXT.jsx = TEXT.js
TEXT.ts = TEXT.js

const MIME = { md: 'text/markdown', markdown: 'text/markdown', txt: 'text/plain', json: 'application/json', yaml: 'text/yaml', yml: 'text/yaml', css: 'text/css', js: 'text/javascript', jsx: 'text/javascript', ts: 'text/typescript' }

/** A URL with real bytes behind it for `key`, or null if there is nothing to serve.
 *  Carried files win — video, PDF and the photographic stills are actual files
 *  on disk (see assets.js); the rest are generated here. */
export function contentUrl(key) {
  const real = assetUrl(key)
  if (real) return real

  const e = ext(key)
  if (/^(jpe?g|png|gif|webp|avif|svg)$/.test(e)) return image(key)
  if (/^(wav|mp3|m4a|flac|ogg)$/.test(e)) return wav(key)
  if (TEXT[e]) return `data:${MIME[e] ?? 'text/plain'};charset=utf-8;base64,${b64(TEXT[e](key))}`
  return null
}
