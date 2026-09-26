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

// A fresh load carries real files in the trash, and a trashed folder restores whole.
const seeded = store.trashList('r2')
assert.equal(seeded.length, 3, 'seed trash missing')
const drafts = seeded.find((t) => t.path === 'drafts/')
store.restore(drafts.id)
assert.ok(keys().includes('drafts/notes.md') && folders().includes('drafts/'), 'trashed folder did not restore')
store.reset()

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

// Delete goes to the trash, and restore puts every file back where it was.
const beforeTrash = keys().length
store.remove('r2', 'audio/')
assert.ok(!keys().some((k) => k.startsWith('audio/')), 'delete left files behind')
const [entry] = store.trashList('r2')
assert.equal(entry.path, 'audio/')
assert.ok(entry.count > 0 && entry.isFolder)
store.restore(entry.id)
assert.equal(keys().length, beforeTrash, 'restore lost files')
assert.ok(folders().includes('audio/'), 'restore lost the folder')
assert.ok(!store.trashList('r2').some((t) => t.id === entry.id), 'restored entry still in the trash')

// Create, then upload into it — an uploaded file's ancestors must exist.
store.createFolder('r2', 'img/05-new/')
assert.ok(folders().includes('img/05-new/'))
store.put('r2', 'img/05-new/deep/one.png', { size: 10 })
assert.ok(folders().includes('img/05-new/deep/'), 'upload did not create its parent')
assert.throws(() => store.createFolder('r2', 'img/05-new/'), /already exists/)

// Copy makes a second file and leaves the first; a taken key is refused.
const src = keys().find((k) => !k.endsWith('/'))
store.copy('r2', src, `${src}.copy`)
assert.ok(keys().includes(src) && keys().includes(`${src}.copy`), 'copy lost a file')
assert.throws(() => store.copy('r2', src, `${src}.copy`), /already exists/)

// An uploaded file's own bytes ride its record through a move.
store.put('r2', 'drop/a.jpg', { size: 1, contentType: 'image/jpeg', url: 'blob:x' })
store.rename('r2', 'drop/a.jpg', 'drop/b.jpg')
assert.equal(store.urlOf('r2', 'drop/b.jpg'), 'blob:x')

// The read-only bucket refuses every write.
assert.throws(() => store.remove('b2', 'website/favicon.svg'), /read-only/)
assert.throws(() => store.createFolder('b2', 'website/nope/'), /read-only/)

// Reset restores the seed exactly — a destructive verb must be repeatable.
store.reset()
assert.deepEqual(keys(), seedKeys, 'reset did not restore files')
assert.deepEqual(folders(), seedFolders, 'reset did not restore folders')

console.log(`fixture store: ok (${seedKeys.length} files, ${seedFolders.length} folders)`)

// ── D1 fields (2026-09-25): tags, drafts, text writes ride the record and reset with the tree ──
store.reset()
assert.deepEqual(store.list('r2').find((f) => f.key === 'img/02-products/tt-07.jpg').tags, ['product', 'hero'], 'seed tags missing')
store.setTags('r2', 'README.md', [' Intro ', 'intro', 'docs'])
assert.deepEqual(store.list('r2').find((f) => f.key === 'README.md').tags, ['intro', 'docs'], 'tags not normalised')
store.rename('r2', 'README.md', 'docs/README.md')
assert.deepEqual(store.list('r2').find((f) => f.key === 'docs/README.md').tags, ['intro', 'docs'], 'tags lost on move')
assert.throws(() => store.setTags('b2', 'x', ['a']), /read-only/)
store.saveDraft('r2', 'docs/README.md', '# draft')
const listed = store.list('r2').find((f) => f.key === 'docs/README.md')
assert.ok(listed.hasDraft && !('draft' in listed), 'the list must flag a draft, never carry it')
assert.equal(store.textOf('r2', 'docs/README.md').draft, '# draft')
store.copy('r2', 'docs/README.md', 'docs/README-copy.md')
assert.ok(!store.list('r2').find((f) => f.key === 'docs/README-copy.md').hasDraft, 'a copy must not carry the draft')
store.writeText('r2', 'docs/README.md', 'héllo')
const written = store.list('r2').find((f) => f.key === 'docs/README.md')
assert.equal(written.size, 6, 'size is the UTF-8 byte length')
assert.ok(!written.hasDraft && written.url.startsWith('data:'), 'save clears the draft and rebuilds the URL')
assert.equal(store.textOf('r2', 'docs/README.md').text, 'héllo')
store.reset()
assert.ok(!store.list('r2').some((f) => f.hasDraft) && store.list('r2').find((f) => f.key === 'README.md').tags.length === 0, 'reset did not clear D1 fields')
console.log('fixture D1 fields: ok')
