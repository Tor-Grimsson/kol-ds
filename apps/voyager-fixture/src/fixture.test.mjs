/* voyager-fixture self-check (node src/fixture.test.mjs) — the business data keeps the client
 * sites' shape, and the carried files are all there. `brand.js` / `assets.js` are Vite-only
 * (import.meta.glob), so the files are counted on disk here. */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
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
/* the marks are inked with currentColor, never a fixed fill — they flip with the theme (LayoutsAppPages: black on black in dark) */
for (const f of readdirSync(join(HERE, 'assets/marks')).filter((n) => n.endsWith('.svg')))
  assert.ok(!/(fill|stroke)="(black|#000000|#000)"/.test(readFileSync(join(HERE, 'assets/marks', f), 'utf8')), `assets/marks/${f} draws a fixed black — use currentColor`)
/* the library parses as record's did: kinds, titles, dates, languages and each row's originals (kol-framework documentLibrary) */
const { default: documentLibrary } = await import('../../../packages/framework/src/documentLibrary.js')
const walk = (d) => readdirSync(join(HERE, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
const lib = walk('library')
const md = Object.fromEntries(lib.filter((f) => f.endsWith('.md')).map((f) => [`./${f}`, readFileSync(join(HERE, f), 'utf8')]))
const files = lib.filter((f) => !f.endsWith('.md')).map((f) => ({ key: f.replace('library/', ''), name: f.split('/').pop() }))
const L = documentLibrary(md, { base: 'library', root: './library/', files })
const row = (id) => L.rows.find((r) => r.id === id)
assert.deepEqual(L.folders.map((f) => f.id).sort(), ['artwork', 'letters', 'press'], 'INDEX.md is a note, not a row')
assert.deepEqual([row('press/press-2027-03-12-launch').kind, row('press/press-2027-03-12-launch').lang, row('press/press-2027-03-12-launch').files.length], ['Press', 'EN, IS', 2], 'a named original brings its language twin')
assert.deepEqual([row('letters/cover-letter-2026-11-02-en').kind, row('letters/cover-letter-2026-11-02-en').title, row('letters/cover-letter-2026-11-02-en').date], ['Cover letter', 'Cover letter', '2026-11-02'])
assert.deepEqual([row('letters/about-2026-10-01-short').title, row('letters/about-2026-10-01-short').lang], ['Short', 'EN, IS'], 'a file-name title is rebuilt; the language comes from the originals')
assert.deepEqual([row('artwork/poster-2027-field-season').kind, row('artwork/poster-2027-field-season').title, row('artwork/poster-2027-field-season').date], ['Poster', 'Field season 2027', '2027'])
console.log('voyager-fixture: ok')
