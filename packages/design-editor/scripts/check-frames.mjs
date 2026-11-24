// Frames as objects (plan-2026-11-19-kolbox-whats-left C1): the document model's self-check.
// `node scripts/check-frames.mjs` — exits 1 on the first broken rule.
import assert from 'node:assert/strict'
import { toFramesDoc, activeFrameOf, membersOf, frameAt, FRAME_MODEL, toPages, pagesSpec, everyFrameOf, placePaste, placeInList } from '../src/editor/compose/frame.js'

const stage = { id: 'f1', stageW: 1080, stageH: 1350, density: 1 }
const old = { canvasW: 1080, canvasH: 1350, canvasX: 40, canvasY: 0, canvas: { fill: '#112233', fillOpacity: 0.5, name: 'Cover' } }
const layers = [{ id: 'a', type: 'shape', x: 10, y: 20, w: 100, h: 100 }, { id: 'b', type: 'text', x: 0, y: 0, w: 600, h: 120 }]

// an old file opens as one frame holding every layer, its fill, opacity and name kept, the layers' coordinates untouched
const doc = toFramesDoc(old, layers, stage)
assert.equal(doc.length, 3)
assert.deepEqual(doc[0], { id: 'f1', type: 'frame', visible: true, opacity: 1, blend: 'normal', name: 'Cover', x: 0, y: 0, w: 1080, h: 1350, density: 1, color: '#112233', fillOpacity: 0.5 })
assert.deepEqual(doc.slice(1).map((l) => [l.id, l.frameId, l.x, l.y]), [['a', 'f1', 10, 20], ['b', 'f1', 0, 0]])

// a file without frame fields opens on the defaults: white, full opacity, no name
assert.equal(toFramesDoc({}, [], stage)[0].color, '#ffffff')

// converted once: a marked file, or one that already holds a frame, comes back as it is
assert.equal(toFramesDoc({ frameModel: FRAME_MODEL }, layers, stage), layers)
assert.equal(toFramesDoc(old, doc, stage), doc)
// a new file in the model is an empty page: no frame is made for it
assert.deepEqual(toFramesDoc({ frameModel: FRAME_MODEL }, [], stage), [])

// the active frame: the selected one, the selected layer's, else the first; none on an empty page
const two = [...doc, { id: 'f2', type: 'frame', x: 2000, y: 0, w: 300, h: 200 }, { id: 'c', type: 'shape', frameId: 'f2', x: 2010, y: 10, w: 10, h: 10 }]
assert.equal(activeFrameOf(two, 'f2').id, 'f2')
assert.equal(activeFrameOf(two, 'c').id, 'f2')
assert.equal(activeFrameOf(two, null).id, 'f1')
assert.equal(activeFrameOf([], null), null)
assert.deepEqual(membersOf(two, 'f2').map((l) => l.id), ['c'])
assert.equal(frameAt(two, 2100, 100).id, 'f2')
assert.equal(frameAt(two, 1500, 100), null)

// pages (C4.4): an old file is one page holding everything, its page color the file's backdrop
const one = toPages({ canvas: { infiniteFill: '#222222' } }, doc)
assert.equal(one.length, 1)
assert.equal(one[0].color, '#222222')
assert.equal(one[0].layers.length, 3)
// a model-2 file keeps its frames (no second frame is made) and opens as one page
assert.equal(toFramesDoc({ frameModel: 2 }, [], stage).length, 0)
// a file's pages round trip: every layer stamped with its page, each page back with its own
const ps = [{ id: 'p1', name: 'One', color: '#111111', layers: doc }, { id: 'p2', name: 'Two', color: '#eeeeee', layers: [] }]
const file = pagesSpec(ps, 'p2', [{ id: 'z', type: 'shape', x: 0, y: 0, w: 1, h: 1 }])
assert.deepEqual(file.pages, [{ id: 'p1', name: 'One', color: '#111111' }, { id: 'p2', name: 'Two', color: '#eeeeee' }])
const back = toPages(file, file.layers)
assert.deepEqual(back.map((p) => [p.id, p.layers.map((l) => l.id)]), [['p1', ['f1', 'a', 'b']], ['p2', ['z']]])
// every frame, on every page or on one
assert.deepEqual(everyFrameOf(ps, 'p2', [{ id: 'f9', type: 'frame', x: 0, y: 0, w: 9, h: 9 }]).map((e) => [e.pageId, e.frame.id]), [['p1', 'f1'], ['p2', 'f9']])
assert.deepEqual(everyFrameOf(ps, 'p2', [], 'p1').map((e) => e.frame.id), ['f1'])
// a paste lands in the frame under it, or on the page; a pasted frame keeps its layers; `at` moves the set
const pasted = placePaste([{ id: 'n', type: 'shape', frameId: 'gone', x: 2010, y: 10, w: 10, h: 10 }], two)
assert.equal(pasted[0].frameId, 'f2')
assert.equal(placePaste([{ id: 'n', type: 'shape', frameId: 'f2', x: 1500, y: 10, w: 10, h: 10 }], two)[0].frameId, undefined)
const withFrame = placePaste([{ id: 'F', type: 'frame', x: 0, y: 0, w: 50, h: 50 }, { id: 'm', type: 'shape', frameId: 'F', x: 5, y: 5, w: 5, h: 5 }], two, { x: 2000, y: 0 })
assert.deepEqual(withFrame.map((l) => [l.id, l.frameId, l.x]), [['F', undefined, 2000], ['m', 'F', 2005]])

// layers nest by drag (R5): into a frame, out to the page, reorder, a frame moving with its members; coordinates kept
const P = [{ id: 'F', type: 'frame', x: 0, y: 0, w: 100, h: 100 }, { id: 'm', type: 'shape', frameId: 'F', x: 5, y: 5, w: 5, h: 5 }, { id: 'r', type: 'shape', x: 300, y: 0, w: 10, h: 10 }]
const order = (ls) => ls.map((l) => `${l.id}${l.frameId ? ':' + l.frameId : ''}`).join(' ')
const into = placeInList(P, 'r', 'F', 'into')
assert.equal(order(into), 'F m:F r:F')
assert.equal(into.find((l) => l.id === 'r').x, 300)
assert.equal(order(placeInList(into, 'r', 'F', 'above')), 'F m:F r')
assert.equal(order(placeInList(into, 'r', 'm', 'below')), 'F r:F m:F')
assert.equal(order(placeInList(P, 'F', 'r', 'above')), 'r F m:F')
assert.equal(order(placeInList(P, 'm', 'F', 'below')), 'm F r')
assert.equal(placeInList(P, 'r', 'F', 'above'), P)

console.log('check-frames: ok')
