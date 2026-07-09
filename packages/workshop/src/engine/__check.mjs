/**
 * Runnable self-check for the pure engine.  `node src/engine/__check.mjs`
 * Asserts the parser, frontmatter, inventory seam, and helpers hold.
 */
import assert from 'node:assert'
import {
  parseDocsMarkdown,
  parseFrontmatter,
  buildInventory,
  buildInventoryCounts,
  getTagColor,
  extractDocNumber,
} from './index.js'

const md = `---
title: Demo
status: draft
tags: [alpha, beta]
---
# Title
Intro paragraph with a #gamma tag.
## Section One
- item one
- item two
## Section Two
| A | B |
|---|---|
| 1 | 2 |
`

// --- parser ---
const parsed = parseDocsMarkdown(md)
assert.equal(parsed.toc.length, 2, 'two H2 sections in toc')
assert.equal(parsed.toc[0].id, 'section-one')
assert.ok(parsed.inlineTags.includes('gamma'), 'harvests inline #gamma')
assert.equal(parsed.introBlocks[0].type, 'heading1')
const s1 = parsed.sections[0]
assert.equal(s1.blocks[0].type, 'list')
assert.equal(s1.blocks[0].items.length, 2)
const s2 = parsed.sections[1]
assert.equal(s2.blocks[0].type, 'table')
assert.deepEqual(s2.blocks[0].headers, ['A', 'B'])
assert.equal(s2.blocks[0].rows.length, 1)

// --- frontmatter ---
const fm = parseFrontmatter(md)
assert.deepEqual(fm.tags, ['alpha', 'beta'], 'inline array tags')
assert.equal(fm.title, 'Demo')
assert.equal(fm.status, 'draft')

// --- inventory seam (module map, no Vite glob) ---
const inv = buildInventory({
  '/x/docs/documentation/03-components/3.0.1-button.md': '---\ntags: [ui]\nstatus: stable\n---\n# Button\n',
  '/x/docs/documentation/00-docs/index.md': '---\nstatus: stable\n---\n# Intro\n',
})
assert.equal(inv.length, 2)
const btn = inv.find((d) => d.id === '3.0.1-button')
assert.ok(btn, 'button doc discovered')
assert.equal(btn.title, 'Button')
assert.deepEqual(btn.metadata.tags, ['ui'])
assert.equal(inv.find((d) => d.file.endsWith('00-docs/index.md')).id, '00-docs-index', 'index.md id gets folder prefix')
const counts = buildInventoryCounts(inv)
assert.equal(counts.total, 2)
assert.equal(counts.statuses.stable, 2)

// --- helpers ---
assert.equal(extractDocNumber('0.0.1-writing'), '0.0.1')
assert.equal(extractDocNumber('04-pages-index'), '4.0.0')
assert.ok(['blue', 'teal', 'green', 'yellow', 'red', 'orange', 'purple', 'dark'].includes(getTagColor('ui')))
assert.equal(getTagColor('ui'), getTagColor('ui'), 'deterministic')

console.log('kol-workshop engine self-check: OK')
