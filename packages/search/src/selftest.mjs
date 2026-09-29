/**
 * Runnable self-check.  `pnpm --filter @kolkrabbi/kol-search test`
 */
import assert from 'node:assert'
import { createIndex, search, parseQuery, highlightRanges, singular, matchSearchItems, tagGraph } from './index.js'

const items = [
  { id: 'button', title: 'Button', kind: 'component', space: 'components', category: 'Atoms', tags: ['pattern/action'], description: 'The one button.' },
  { id: 'color-anatomy', title: 'ColorAnatomy', kind: 'component', space: 'components', category: 'Styleguide', description: 'How a colour is built.' },
  { id: 'app-hub', title: 'AppHub', kind: 'component', space: 'components', category: 'Organisms', description: 'Shell + Hub; the atom of an app.' },
  { id: 'input', title: 'Input', kind: 'component', space: 'components', category: 'Atoms', tags: ['pattern/input'] },
  { id: 'sizes', title: 'Sizes', kind: 'doc', space: 'docs', category: 'Foundations', tags: ['domain/layout'], headings: ['One height per size'], date: '2026-09-01', body: 'every button family hits it' },
  { id: 'release', title: 'Release pipeline', kind: 'doc', space: 'docs', category: 'Operations', tags: ['domain/release'], date: '2026-08-14' },
]
const index = createIndex(items)

// --- text ---
assert.equal(singular('atoms'), 'atom')
assert.equal(singular('categories'), 'category')
assert.equal(singular('class'), 'class')
assert.deepEqual(highlightRanges('ColorAnatomy', ['atom']), [[7, 11]])

// --- parse: prefixes, aliases, negation, phrases, dates, smart terms ---
const p = parseQuery('tag:domain/layout in:docs -legacy "atom" after:2026-09-01 #x http://a', index)
assert.deepEqual(p.filters, { tags: ['domain/layout', 'x'], space: ['docs'] })
assert.deepEqual(p.terms.map((t) => [t.value, t.negate, t.phrase]), [['legacy', true, false], ['atom', false, true], ['http://a', false, false]])
assert.deepEqual(p.date, { after: '2026-09-01' })
const smart = parseQuery('atom button', index)
assert.deepEqual(smart.filters, { category: ['Atoms'] }, 'atom names the Atoms category')
assert.deepEqual(smart.terms.map((t) => t.value), ['button'])
assert.equal(smart.tokens[0].via, 'smart')

// --- ranking: a title hit outranks a description hit; reasons say why ---
const r1 = search(index, 'button')
assert.deepEqual(r1.results.map((r) => r.item.id), ['button', 'sizes'])
assert.equal(r1.results[0].reasons[0].rung, 'titleExact')
assert.equal(r1.results[1].reasons[0].field, 'body')

// --- smart term filters; a quoted one searches the text instead ---
assert.deepEqual(search(index, 'atom').results.map((r) => r.item.id), ['button', 'input'])
assert.deepEqual(search(index, '"atom"').results.map((r) => r.item.id), ['color-anatomy', 'app-hub'], 'a title hit beats a description hit')

// --- facets are disjunctive: picking a space still counts the other spaces ---
const f = search(index, '', { filters: { space: ['docs'] } })
assert.equal(f.total, 2)
assert.deepEqual(f.facets.space, [{ value: 'components', count: 4, selected: false }, { value: 'docs', count: 2, selected: true }])
assert.deepEqual(f.facets.kind, [{ value: 'doc', count: 2, selected: false }])

// --- scope, exclusion, dates, negation ---
assert.deepEqual(search(index, '', { scope: { space: 'docs' } }).results.map((r) => r.item.id), ['release', 'sizes'])
assert.deepEqual(search(index, 'in:docs -tag:domain/release').results.map((r) => r.item.id), ['sizes'])
assert.deepEqual(search(index, 'in:docs before:2026-08-31').results.map((r) => r.item.id), ['release'])
assert.deepEqual(search(index, 'button -family').results.map((r) => r.item.id), ['button'])

// --- the legacy predicate is unchanged ---
assert.deepEqual(matchSearchItems([{ label: 'Button', keywords: ['press'] }], 'pre').map((i) => i.matchedKeyword), ['press'])


// --- tagGraph: a node per tag, an edge per shared item ---
const g = tagGraph([{ id: 'a', tags: ['X', 'y'] }, { id: 'b', tags: ['x', 'z'] }, { id: 'c', tags: ['x', 'y'] }])
assert.deepEqual(g.nodes.map((n) => [n.id, n.count]), [['x', 3], ['y', 2], ['z', 1]])
assert.deepEqual(g.edges.map((e) => [e.source, e.target, e.weight]).sort(), [['x', 'y', 2], ['x', 'z', 1]])
console.log('kol-search self-check: OK')
