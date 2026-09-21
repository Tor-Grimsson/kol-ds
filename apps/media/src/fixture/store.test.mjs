/* ponytail: one runnable check, no framework. `node src/fixture/store.test.mjs`.
 * It covers the logic that is easy to get quietly wrong — recursive folder
 * rename, delete-through, the empty folder surviving as a node, and reset
 * actually restoring. */

import assert from 'node:assert/strict'
import * as store from './store.js'

const keys = (b = 'r2') => store.list(b).map((f) => f.key).sort()
const folders = (b = 'r2') => store.folderTree()[b].folders

store.reset()
const seedKeys = keys()
const seedFolders = folders()

// An EMPTY folder is a real node — the whole reason the tree is not derived.
assert.ok(seedFolders.includes('img/03-scratch/'), 'empty seed folder missing')
assert.ok(!seedKeys.some((k) => k.startsWith('img/03-scratch/')), 'scratch should hold no files')
assert.equal(store.folderTree().r2.counts['img/03-scratch/'].files, 0)

// A folder tally counts everything BELOW it, not just direct children.
assert.equal(
  store.folderTree().r2.counts['img/'].files,
  seedKeys.filter((k) => k.startsWith('img/')).length,
)

// Rename a folder: every descendant moves, nothing is orphaned or duplicated.
store.rename('r2', 'img/01-shoots/', 'img/04-archive/')
assert.equal(keys().length, seedKeys.length, 'rename changed the file count')
assert.ok(!keys().some((k) => k.startsWith('img/01-shoots/')), 'old prefix survived')
assert.ok(folders().includes('img/04-archive/reykjavik/'), 'nested folder did not move')
assert.equal(
  keys().filter((k) => k.startsWith('img/04-archive/')).length,
  seedKeys.filter((k) => k.startsWith('img/01-shoots/')).length,
)

// Moving a folder into itself is refused rather than silently looping.
assert.throws(() => store.rename('r2', 'img/', 'img/nested/'), /into itself/)

// Delete takes the subtree with it.
const before = keys().length
const { deleted } = store.remove('r2', 'img/04-archive/')
assert.equal(keys().length, before - deleted)
assert.ok(!folders().includes('img/04-archive/reykjavik/'), 'child folder outlived its parent')

// Create, then upload into it — an uploaded file's ancestors must exist.
store.createFolder('r2', 'img/05-new/')
assert.ok(folders().includes('img/05-new/'))
store.put('r2', 'img/05-new/deep/one.png', { size: 10 })
assert.ok(folders().includes('img/05-new/deep/'), 'upload did not create its parent')
assert.throws(() => store.createFolder('r2', 'img/05-new/'), /already exists/)

// The read-only bucket refuses every write.
assert.throws(() => store.remove('b2', 'website/favicon.svg'), /read-only/)
assert.throws(() => store.createFolder('b2', 'website/nope/'), /read-only/)

// Reset restores the seed exactly — a destructive verb must be repeatable.
store.reset()
assert.deepEqual(keys(), seedKeys, 'reset did not restore files')
assert.deepEqual(folders(), seedFolders, 'reset did not restore folders')

console.log(`fixture store: ok (${seedKeys.length} files, ${seedFolders.length} folders)`)
