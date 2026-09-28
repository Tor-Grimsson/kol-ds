/* `pnpm --filter workshop-fixture test` — the corpus builds, and both engines read it. */
import assert from 'node:assert'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createIndex, search } from '@kolkrabbi/kol-search'
import { buildCorpus } from './corpus.js'

const here = dirname(fileURLToPath(import.meta.url))
const modules = {}
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full)
    else if (name.endsWith('.md')) modules[`./${full.slice(here.length + 1)}`] = readFileSync(full, 'utf8')
  }
}
walk(join(here, 'docs'))

const { inventory, tree, componentTree, searchItems } = buildCorpus(modules)
assert.equal(inventory.length, 19, 'every fixture doc is in the inventory')
assert.equal(new Set(inventory.map((d) => d.id)).size, inventory.length, 'ids are unique')
assert.ok(inventory.every((d) => d.metadata.title && d.metadata.tags?.length), 'every doc carries a title and tags')
assert.deepEqual([...new Set(tree.map((g) => g.category))], ['development', 'documentation', 'operations'])
assert.equal(componentTree.reduce((n, t) => n + t.children.length, 0), 24)

const index = createIndex(searchItems)
assert.deepEqual(search(index, 'atom tag:pattern/action').results.map((r) => r.item.title), ['Button', 'IconButton'])
assert.equal(search(index, 'in:development').total, 6, 'four docs and two generated pages')
assert.ok(searchItems.filter((i) => i.space === 'development' && i.kind !== 'page').every((i) => i.href.startsWith('/development/')))
assert.equal(search(index, 'publish').results[0].item.title, 'Publish')

console.log(`workshop-fixture: OK — ${inventory.length} docs, ${searchItems.length} search items`)
