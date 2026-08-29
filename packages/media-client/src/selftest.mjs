#!/usr/bin/env node
/**
 * selftest.mjs — the package's own check: `node src/selftest.mjs`.
 *
 * IT LIVES IN ITS OWN FILE, and that is the whole lesson (kol-mirror,
 * 2026-08-28). 0.3.0 and 0.3.1 carried this block at the bottom of `index.js`
 * behind `if (import.meta.url === `file://${process.argv[1]}`)`. A top-level
 * `if` EVALUATES on every import, `process` does not exist in a browser, and so
 * the module threw `ReferenceError: process is not defined` before a single
 * export was reachable — a white screen in any consumer that imported the
 * package at all. mirror's studio took it on adoption.
 *
 * A `typeof process !== 'undefined' &&` guard would have fixed that instance.
 * Moving the file removes the class: a browser-shipped module now has no
 * Node-only term in it anywhere, so the next person adding a check cannot
 * reintroduce this by writing a slightly different guard.
 *
 * The bug was also invisible to the check itself — `node index.js` is the one
 * environment where that line works, and it was the only one it ran in. Hence
 * the browser-shaped case at the end here.
 */
import { createMediaClient, KOL_BUCKETS, formatSize } from './index.js'

const eq = (got, want, what) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`${what}: ${JSON.stringify(got)} !== ${JSON.stringify(want)}`)
}

const a = createMediaClient({ buckets: true })
eq(a.buckets().map((b) => b.id), ['r2', 'b2', 'b2vault'], 'buckets: true is the table')
eq(a.proxied('https://r2.kolkrabbi.io/01.jpg'), '/media/01.jpg', 'proxy: true rewrites')
eq(a.proxied('https://b2.kolkrabbi.io/x.jpg'), 'https://b2.kolkrabbi.io/x.jpg', 'proxy: false passes through')
eq(a.proxied('https://other.io/x.jpg'), 'https://other.io/x.jpg', 'unknown host passes through')
/* adoption is a DELETION: the canonical three passed verbatim merge to themselves */
eq(createMediaClient({ buckets: KOL_BUCKETS }).buckets(), a.buckets(), 'verbatim merges to itself')
eq(createMediaClient({ buckets: { r2: { label: 'Media' } } }).buckets().map((b) => b.label),
   ['Media', 'B2 · website', 'B2 · vault'], 'an override overrides only')
const c = createMediaClient()
eq(c.buckets(), [], 'no table = no buckets')
eq(c.proxied('https://r2.kolkrabbi.io/01.jpg'), '/media/01.jpg', 'no table = the old rewrite')
eq([formatSize(null), formatSize(undefined), formatSize(NaN), formatSize(0)], ['', '', '', '0 B'],
   'a sizeless object formats to nothing, and 0 is still a size')

/* THE BROWSER CASE — the one that would have caught 0.3.0. Re-import the module
 * with `process` removed from the global scope, exactly as a browser has it. */
const savedProcess = globalThis.process
delete globalThis.process
try {
  const fresh = await import(`./index.js?browser=${savedProcess.hrtime.bigint()}`)
  if (typeof fresh.createMediaClient !== 'function') throw new Error('exports unreachable without `process`')
} finally {
  globalThis.process = savedProcess
}

console.log('kol-media-client: 10 checks passed (including a no-`process` import)')
