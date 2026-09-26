/* ponytail: one runnable check, no framework. `node src/fixture.test.mjs` (or `pnpm test` here).
 * It covers the logic that is easy to get quietly wrong — recursive folder
 * rename, delete-through, the empty folder surviving as a node, and reset
 * actually restoring. */

import assert from 'node:assert/strict'
import * as store from './bucket.js'
import * as d1 from './d1.js'
import * as library from './library.js'

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

// ── the fake D1 (plan v2, 2026-09-26): rows keyed by file id survive moves; folder rows follow paths ──
store.reset(); d1.reset({ idOf: store.idOf })
const id = (k) => store.idOf('r2', k)
assert.deepEqual(d1.tagsOfFile(id('img/02-products/tt-07.jpg')), ['product', 'hero'], 'seed tags missing')
assert.ok(d1.isFavourite(id('docs/01-tier-rules.md')), 'seed favourite missing')
assert.deepEqual(d1.setFileTags(id('README.md'), [' Intro ', 'intro', 'docs']), ['intro', 'docs'], 'tags not normalised')
const readmeId = id('README.md')
store.rename('r2', 'README.md', 'docs/README.md')
assert.equal(id('docs/README.md'), readmeId, 'a move must keep the file id')
assert.deepEqual(d1.tagsOfFile(readmeId), ['intro', 'docs'], 'tags lost on move')
store.copy('r2', 'docs/README.md', 'docs/README-copy.md')
assert.notEqual(id('docs/README-copy.md'), readmeId, 'a copy is a new file')
d1.setFolderTags('r2', 'img/01-shoots/', ['shoot', 'archive'])
store.rename('r2', 'img/01-shoots/', 'img/04-archive/')
d1.movePath('r2', 'img/01-shoots/', 'img/04-archive/')
assert.deepEqual(d1.folderInfo('r2')['img/04-archive/'].tags, ['shoot', 'archive'], 'folder tags did not follow the move')
assert.ok(d1.folderInfo('r2')['img/04-archive/'].favourite, 'folder favourite did not follow the move')
d1.logEvent('r2', 'opened', { fileId: readmeId })
assert.equal(d1.recent('r2')[0].fileId, readmeId, 'recent is newest first')
assert.equal(new Set(d1.recent('r2').map((e) => e.fileId ?? e.path)).size, d1.recent('r2').length, 'recent repeats a file')
assert.equal(typeof d1.smartFolders, 'undefined', 'smart folders are gone (user, 2026-09-26)')
store.writeText('r2', 'docs/README.md', 'héllo')
assert.equal(store.list('r2').find((f) => f.key === 'docs/README.md').size, 6, 'size is the UTF-8 byte length')
assert.equal(store.textOf('r2', 'docs/README.md'), 'héllo')
const t = store.remove('r2', 'docs/README.md')
const purged = store.purge(t.trashId)
d1.dropFiles(purged.fileIds)
assert.deepEqual(d1.tagsOfFile(readmeId), [], 'a purge must drop the D1 rows')
d1.saveSettings('r2', { view: 'rows' })
assert.deepEqual(d1.loadSettings('r2'), { view: 'rows' })
d1.saveSettings('r2', null)
assert.equal(d1.loadSettings('r2'), null, 'null resets settings')
console.log('fake D1: ok')

// NOTES + DECKS (library.js): an upsert that leaves a field out keeps it, rows go out as copies, reset restores.
library.saveNote({ slug: 'x', title: 'X', body: '# X' })
library.saveNote({ slug: 'x', favourite: true })
assert.ok(library.loadNote('x').body === '# X' && library.loadNote('x').favourite, 'a favourite toggle lost the body')
assert.ok(!('body' in library.listNotes()[0]), 'the list ships bodies')
const deck = library.loadDeck('pitch-draft')
deck.slides[0].doc.layers = []
assert.ok(library.loadDeck('pitch-draft').slides[0].doc.layers.length, 'a loaded deck mutated the table')
library.saveDeck({ slug: 'pitch-draft', favourite: true })
assert.equal(library.loadDeck('pitch-draft').slides.length, 3, 'a favourite toggle dropped the slides')
assert.throws(() => library.saveDeck({ slug: 'bad', slides: [{}] }), /malformed/)
library.reset()
assert.ok(!library.listNotes().some((n) => n.slug === 'x') && !library.loadDeck('pitch-draft').favourite, 'reset did not restore')
console.log('notes + decks: ok')
