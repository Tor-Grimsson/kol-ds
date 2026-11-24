/* pnpm --filter @kolkrabbi/kol-tuner test — the engine's checks, carried from the Line Swell canvas.
 *
 *   node   check-system and check-comb on this package; with the reference engine at hand, the same checks on it beside,
 *          and the 50-set parity (every path string equal)
 *   chrome the four Tuner check pages (tuner-w5, w9, w10, w11) need a canvas and an SVG layout, so they run in the installed
 *          Chrome (Playwright, channel 'chrome'), on this package and on the reference, and their printed results are
 *          compared line for line. `--node` skips this half.
 *
 * The reference engine is kol-branding's copy (TUNER_REFERENCE, default ../kol-branding beside this repo); the three
 * reference marks ref-01, ref-05 and ref-12 come from TUNER_REFS (default ~/Downloads/ref-log). Without them the rows that
 * need them are skipped and say so; nothing here ships them. */
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import * as port from '../src/index.js'
import { checkSystem, checkComb } from './node-checks.mjs'
import { parity } from './parity.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
export const REFERENCE = resolve(process.env.TUNER_REFERENCE || join(HERE, '../../../../kol-branding/docs/documentation/05-logo-shapes/_files/canvas/project/line-swell.js'))
export const REFS = resolve(process.env.TUNER_REFS || join(homedir(), 'Downloads/ref-log'))

function loadReference() {
  if (!existsSync(REFERENCE)) return null
  global.window = {}; global.document = { createElement() { return { getContext() { return null } } } }
  createRequire(import.meta.url)(REFERENCE)
  const L = window.LineSwell
  delete global.window; delete global.document
  return L
}

let failed = 0
const say = (t) => console.log(t)
const verdict = (name, ok) => { if (!ok) failed++; say((ok ? 'PASS ' : 'FAIL ') + name) }

const ref = loadReference()
say(ref ? 'reference engine: ' + REFERENCE : 'reference engine not found (' + REFERENCE + '): parity and the reference columns are skipped')

for (const [name, check] of [['check-system', checkSystem], ['check-comb', checkComb]]) {
  const a = check(port), b = ref && check(ref)
  say('\n' + name + ' on kol-tuner'); a.out.forEach((l) => say('  ' + l))
  if (b) { say(name + ' on the reference'); b.out.forEach((l) => say('  ' + l)); verdict(name + ': same lines as the reference', a.out.join('\n') === b.out.join('\n')) }
  verdict(name, a.pass)
}

if (ref) {
  const r = parity(port, ref)
  say('\nparity: ' + r.same + ' of ' + r.sets + ' setting sets draw the same strings'); r.diffs.forEach((d) => say('  ' + d))
  verdict('parity, 50 sets', r.same === r.sets && r.sets === 50)
}

if (!process.argv.includes('--node')) {
  const { browserChecks } = await import('./browser.mjs')
  await browserChecks({ ref: !!ref, say, verdict, REFERENCE, REFS })
}

say('\n' + (failed ? failed + ' failed' : 'all passed'))
process.exit(failed ? 1 : 0)
