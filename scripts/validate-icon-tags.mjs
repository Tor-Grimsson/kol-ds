#!/usr/bin/env node
/**
 * validate-icon-tags.mjs — every glyph has search tags (pnpm validate:icon-tags · gate `icon-tags`).
 *
 * packages/icons/src/tags.json maps name → lowercase tags; ⌘K and the gallery search read it. A new SVG in any of the
 * four sets (identity: every file in its folders) with no entry fails here, so a glyph cannot ship unfindable.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'icons', 'src')
const walk = (dir) => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e)
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.svg') ? [p.split('/').pop().replace('.svg', '')] : []
})
const names = new Set(['interface', 'signal', 'identity', 'external'].flatMap((s) => walk(join(SRC, `kol-icon-set-${s}`))))
const TAGS = JSON.parse(readFileSync(join(SRC, 'tags.json'), 'utf8'))

const missing = [...names].filter((n) => !TAGS[n]?.length)
assert.deepEqual(missing, [], `icon-tags: ${missing.length} glyph(s) without tags in packages/icons/src/tags.json: ${missing.join(', ')}`)
const stale = Object.keys(TAGS).filter((n) => !names.has(n))
assert.deepEqual(stale, [], `icon-tags: tags.json names glyphs that no longer exist: ${stale.join(', ')}`)
for (const [n, t] of Object.entries(TAGS)) assert.ok(t.every((x) => x === x.toLowerCase()), `icon-tags: ${n} has an uppercase tag`)
console.log(`icon-tags ✓ ${names.size} glyphs tagged`)
