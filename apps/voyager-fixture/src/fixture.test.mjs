/* voyager-fixture self-check (node src/fixture.test.mjs) — the business data keeps the client
 * sites' shape, and the carried files are all there. `brand.js` / `assets.js` are Vite-only
 * (import.meta.glob), so the files are counted on disk here. */
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as b from './business.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const count = (d) => readdirSync(join(HERE, 'assets', d)).filter((f) => !f.startsWith('.')).length

for (const k of ['BRAND_INFO', 'BIO', 'TIMELINE', 'TIMELINE_KINDS', 'PRESS', 'AWARDS', 'FILMS', 'PROFILES', 'COMPANIES', 'COLLABORATIONS', 'SOCIAL', 'VENDORS', 'STACK', 'LIVE_SITE_MAP', 'MARKETING_PLAYBOOK', 'OPEN_QUESTIONS']) assert.ok(b[k], `business.${k}`)
assert.ok(['identity', 'contact', 'studio', 'legal', 'labels'].every((k) => b.BRAND_INFO[k]), 'BRAND_INFO sections')
const kinds = new Set(b.TIMELINE_KINDS.map((k) => k.key))
assert.ok(b.TIMELINE.every((t) => kinds.has(t.kind)), 'every timeline row has a known kind')
assert.ok([...b.SOCIAL, ...b.VENDORS, ...b.TIMELINE].every((r) => !(r.url ?? r.href) || /\.example(\/|$)/.test(new URL(r.url ?? r.href).hostname + '/')), 'every link is on .example — invented, never real')

const want = { marks: 7, stationery: 7, deck: 7, diagrams: 10, mood: 4, fonts: 2, 'graphics/abstract': 6, 'graphics/patterns': 20, 'graphics/web': 6, 'graphics/devices': 9 }
for (const [d, n] of Object.entries(want)) assert.equal(count(d), n, `assets/${d}`)
console.log('voyager-fixture: ok')
