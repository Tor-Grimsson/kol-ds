/* document-fixture self-check (node src/fixture.test.mjs): every tab row has its file, every file parses, every
 * embed it names is carried (by stem), the reviews are all there. */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDocsMarkdown, splitFrontmatter } from '@kolkrabbi/kol-markdown'
import { TABS } from './tabs.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const stems = (dir) => new Set(existsSync(dir) ? readdirSync(dir).map((f) => f.replace(/\.[a-z0-9]+$/i, '')) : [])
/* embeds kol-atlas names but does not carry either (08-research, 2026-10-28) */
const KNOWN_MISSING = new Set(['bh-branded-house', 'bh-graphics', 'bh-logo-system-0', 'bh-logo-system-1', 'bh-logo-system-2', 'logo-canalix-summary'])

let blocks = 0, embeds = 0
for (const t of TABS) {
  const p = join(HERE, 'docs', t.file)
  assert.ok(existsSync(p), `${t.id}: ${t.file}`)
  const raw = readFileSync(p, 'utf8')
  const { body } = splitFrontmatter(raw)
  const parsed = parseDocsMarkdown(body)
  blocks += parsed.introBlocks.length + parsed.sections.reduce((n, s) => n + s.blocks.length, 0)
  const section = t.file.split('/')[0]
  const have = new Set([...stems(join(HERE, 'docs', section, '_assets')), ...stems(join(HERE, 'docs', '_assets'))])
  for (const m of raw.matchAll(/!\[\[([^\]|#]+)/g)) {
    const s = m[1].trim().replace(/\.[a-z0-9]+$/i, '')
    embeds++
    assert.ok(have.has(s) || KNOWN_MISSING.has(s), `${t.id} embeds ${m[1]} — not carried`)
  }
}
const reviews = ['reviews', 'branding/reviews', 'guides/reviews'].flatMap((d) => readdirSync(join(HERE, 'research', d)).filter((f) => f.endsWith('.md')))
assert.ok(reviews.length >= 29, 'the reviews')
for (const d of ['reviews', 'branding/reviews', 'guides/reviews']) for (const f of readdirSync(join(HERE, 'research', d))) if (f.endsWith('.md')) parseDocsMarkdown(splitFrontmatter(readFileSync(join(HERE, 'research', d, f), 'utf8')).body)
let bytes = 0
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); const s = statSync(p); s.isDirectory() ? walk(p) : (bytes += s.size) } }
walk(join(HERE, 'docs'))
console.log(`document-fixture: ok — ${TABS.length} documents, ${blocks} blocks, ${embeds} embeds, ${reviews.length} reviews, ${(bytes / 1e6).toFixed(1)} MB on disk`)
