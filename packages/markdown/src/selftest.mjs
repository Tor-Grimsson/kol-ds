/**
 * Runnable self-check.  `pnpm --filter @kolkrabbi/kol-markdown test`
 * Asserts the parser, frontmatter (read + round-trip), inventory seam, tags and helpers hold.
 */
import assert from 'node:assert'
import {
  parseDocsMarkdown,
  parseFrontmatter,
  buildInventory,
  buildInventoryCounts,
  getTagColor,
  extractDocNumber,
  splitFrontmatter,
  joinFrontmatter,
  buildTagCounts,
  buildTagCooccurrence,
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

// --- frontmatter round-trip: keys keep case and order, a list stays a list, the body is untouched ---
const doc = '---\nTitle: "A: B"\ntags: [x, y]\n---\nBody\n'
const split = splitFrontmatter(doc)
assert.equal(split.has, true)
assert.deepEqual(split.fields, [['Title', 'A: B'], ['tags', ['x', 'y']]])
assert.equal(split.body, 'Body\n')
assert.equal(joinFrontmatter(split.fields, split.body), doc, 'split → join is lossless')
assert.equal(joinFrontmatter([], 'plain'), 'plain', 'no fields → body alone')

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

// --- tags ---
assert.deepEqual(buildTagCounts(inv), [{ tag: 'ui', count: 1 }])
const graph = buildTagCooccurrence([{ id: 'a', metadata: { tags: ['X', 'y'] } }, { id: 'b', metadata: { tags: ['x'] } }])
assert.deepEqual(graph.nodes.map((n) => [n.id, n.count]), [['x', 2], ['y', 1]])
assert.deepEqual(graph.edges, [{ source: 'x', target: 'y', weight: 1 }])

// --- helpers ---
assert.equal(extractDocNumber('0.0.1-writing'), '0.0.1')
assert.equal(extractDocNumber('04-pages-index'), '4.0.0')
assert.ok(['blue', 'teal', 'green', 'yellow', 'red', 'orange', 'purple', 'dark'].includes(getTagColor('ui')))
assert.equal(getTagColor('ui'), getTagColor('ui'), 'deterministic')

// --- the document additions (plan-2026-10-28-document W2; the forms are apps/document-fixture's) ---
{
  const doc = parseDocsMarkdown(`# Project Atlas
%% thumb: x.png
Dates: 26 Oct 2026 – 5 Feb 2027
Client: Atlas Cloud ehf.

Intro with a note[^tm] and a date 18\\. nóv.

[^tm]: Atlas is registered.
## M1 Foundation {#m1}

Dates: 26 Oct – 16 Dec

### 1.1 Kickoff ✋ to confirm {#kickoff}

Acceptance: both sides confirm.

#### 📍 Sync: Kickoff session
#### Competitor audit
[+avoid]: Avoid list
- one
![[a.svg|A]] ![[b.jpg]]
![[c.png]]
![[d.png|[Cloudflare](https://www.cloudflare.com/): the 2018 billboard]]
@quote-total
::toc a b
:::tabs
::tab One
![[t.png]]
:::
> It didn't start out as a rebrand. — Lisa Smith
| Item | Amount |
|---|---:|
| M1 | 1 |

| | |
|---|---|
| Owner | Name |
## Sources
- a
`)
  const blocks = [...doc.introBlocks, ...doc.sections.flatMap((s) => s.blocks)]
  const kinds = blocks.map((b) => b.type)
  assert.deepEqual(doc.toc[0], { id: 'm1', label: 'Foundation', level: 2, num: 'M1' }, 'anchor + number on an H2')
  assert.equal(doc.sections[0].num, 'M1', 'the section carries its number')
  const phase = blocks.find((b) => b.type === 'heading3')
  assert.deepEqual([phase.id, phase.num, phase.content, phase.marks], ['kickoff', '1.1', 'Kickoff', [{ kind: 'hand', reason: 'to confirm' }]], 'phase: anchor, number, title, hand mark with reason')
  const items = blocks.filter((b) => b.type === 'heading4')
  assert.deepEqual(items.map((b) => [b.num, b.content, b.marks[0]?.kind]), [['1.1.1', 'Sync: Kickoff session', 'pin'], ['1.1.2', 'Competitor audit', undefined]], 'items numbered under their phase, a leading mark named')
  assert.deepEqual(blocks.filter((b) => b.type === 'meta').map((b) => b.rows.map((r) => r.key)), [['Dates', 'Client'], ['Dates'], ['Acceptance']], 'meta lines at the top of the page, the section and the phase')
  const intro = doc.introBlocks.find((b) => b.type === 'paragraph')
  assert.ok(intro.tokens.some((t) => t.type === 'footnote' && t.key === 'tm'), 'inline footnote token')
  assert.ok(intro.tokens.some((t) => t.type === 'text' && t.content.includes('18. nóv')), 'backslash escape read as the character')
  assert.equal(blocks.find((b) => b.type === 'footnote-def').key, 'tm', 'footnote definition')
  assert.equal(blocks.find((b) => b.type === 'popout-def').title, 'Avoid list', 'pop-out definition')
  assert.deepEqual(blocks.find((b) => b.type === 'media').items.map((m) => [m.file, m.caption]), [['a.svg', 'A'], ['b.jpg', ''], ['c.png', ''], ['d.png', '[Cloudflare](https://www.cloudflare.com/): the 2018 billboard'], ['t.png', 'One']], 'embeds on one line and the next are one media block; a caption may hold a link; a :::tabs filmstrip joins it, the tab label its caption')
  assert.equal(blocks.find((b) => b.type === 'media').items[3].captionTokens[0].type, 'link', 'a caption with a link carries its tokens')
  assert.ok(!kinds.includes('paragraph') || !blocks.some((b) => b.type === 'paragraph' && /^(@|::|%%)/.test(b.content)), 'comments and generated lines never reach a block')
  const quote = blocks.find((b) => b.type === 'blockquote')
  assert.deepEqual([quote.content, quote.cite], ["It didn't start out as a rebrand.", 'Lisa Smith'], 'pull quote with its cite')
  const tables = blocks.filter((b) => b.type === 'table')
  assert.deepEqual([tables[0].align, tables[0].kv, tables[1].kv], [['left', 'right'], false, true], 'table alignment, and an empty header row is a key–value table')
  assert.equal(doc.sections[1].sources, true, 'a Sources section is flagged')
}

{
  const n = parseDocsMarkdown('## Implementation\n\n### 1 Search basics\n\n#### Page metadata\n\ntext\n\n#### ✅ Open Graph\n', { numbered: true })
  const [h3, h4, , h4b] = n.sections[0].blocks
  assert.deepEqual([h3.num, h3.content, h4.num, h4b.num, h4b.marks[0].kind], ['1', 'Search basics', '1.1', '1.2', 'done'], 'numbered: a bare-integer ### and its auto-numbered items, ✅ as done')
  assert.equal(parseDocsMarkdown('### 1 Search basics\n').introBlocks[0].num, undefined, 'without numbered a bare integer stays in the title')
}

{
  const [em] = parseDocsMarkdown('*The path is in [Implementation](#x) below.*\n').introBlocks[0].tokens
  assert.deepEqual([em.type, em.tokens?.[1]?.type, em.tokens?.[1]?.url], ['italic', 'link', '#x'], 'a link inside italics is a nested token')
}

console.log('kol-markdown self-check: OK')
