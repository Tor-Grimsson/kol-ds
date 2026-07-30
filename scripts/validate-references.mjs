#!/usr/bin/env node
/**
 * validate-references.mjs — the deletion guard and the lineage trace.
 *
 *   node scripts/validate-references.mjs            guard: every canon node still exists
 *   node scripts/validate-references.mjs --trace X  lineage: who depends on X, and how badly
 *
 * THE GUARD. A node above the canon bar is load-bearing by measurement, not by
 * opinion. If one disappears from the tree while the index still records
 * dependents, this fails and names every one of them with its star rating — a
 * 5★ dependent is a near-copy and will break, a 1★ dependent loses one element.
 * That is the "it will leave a gap in the DS" warning, made mechanical.
 *
 * The bar is 3x the median weighted inbound, so it moves with the repo rather
 * than ageing into a made-up constant.
 *
 * Stale-index safety: the guard only fires when the index is NEWER than the
 * deletion would be. Re-run `pnpm extract:usage && pnpm extract:tokens` after
 * removing something deliberately — the index is the evidence, and a guard that
 * fires on stale evidence teaches people to ignore it.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEV = '/Users/biskup/dev/projects'
const argv = process.argv.slice(2)
const traceIdx = argv.indexOf('--trace')
const TRACE = traceIdx >= 0 ? argv[traceIdx + 1] : null

const readJson = (p) => {
  try { return JSON.parse(readFileSync(join(REPO, p), 'utf8')) } catch { return null }
}

const usage = readJson('showcase/src/usage/usage-index.json')
const tokens = readJson('showcase/src/usage/token-index.json')
if (!usage || !tokens) {
  console.error('validate-references: index missing — run `pnpm extract:usage && pnpm extract:tokens` first.')
  process.exit(1)
}

const nodes = [
  ...usage.map((e) => ({
    name: e.name, kind: 'component', where: e.pkg,
    weighted: (e.weighted || 0) + (e.internal || 0),
    edgeCount: e.edgeCount || 0, edges: e.edges || [],
    exists: true,   // a component's existence is already gated by validate-roster
  })),
  ...tokens.map((e) => ({
    name: e.name, kind: e.kind, where: e.definedIn,
    weighted: e.weighted || 0, edgeCount: e.edgeCount || 0, edges: e.edges || [],
    exists: existsSync(join(REPO, e.definedIn)),
  })),
].filter((n) => n.weighted > 0)

const weights = nodes.map((n) => n.weighted).sort((a, b) => a - b)
const median = weights.length ? weights[Math.floor(weights.length / 2)] : 0
const threshold = Math.max(median * 3, 2)

if (TRACE) {
  const node = nodes.find((n) => n.name === TRACE)
  if (!node) {
    console.log(`No inbound edges recorded for "${TRACE}".`)
    console.log('Nothing derives from it on this evidence — safe to remove, but the graph')
    console.log('sees usage, not intent: check for dynamic references before acting.')
    process.exit(0)
  }
  const byStar = node.edges.reduce((a, e) => ((a[e.stars] = (a[e.stars] || 0) + 1), a), {})
  console.log(`${node.name}  (${node.kind}, defined in ${node.where})`)
  console.log(`weighted inbound ${node.weighted}★ across ${node.edgeCount} edges`
    + (node.weighted >= threshold ? '  — ABOVE the canon bar' : ''))
  console.log(Object.keys(byStar).sort((a, b) => b - a).map((s) => `${byStar[s]}×${s}★`).join(' · '))
  console.log('')
  for (const e of node.edges) console.log(`  ${e.stars}★  ${String(e.uses).padStart(3)}×  ${e.file}`)
  if (node.edgeCount > node.edges.length) {
    console.log(`  … ${node.edgeCount - node.edges.length} more (the index caps the stored list)`)
  }
  console.log('\nA 5★ dependent is a near-copy and breaks if this changes shape.')
  console.log('A 1★ dependent loses one element. That difference is why edges are weighted.')
  process.exit(0)
}

const canon = nodes.filter((n) => n.weighted >= threshold)
const missing = canon.filter((n) => !n.exists)

console.log(`references: ${nodes.length} referenced nodes | median ${median}★ | canon bar ${threshold}★ | ${canon.length} at or above it`)

if (missing.length) {
  console.error(`\nvalidate-references: ${missing.length} CANON node(s) no longer exist:\n`)
  for (const n of missing) {
    console.error(`  ${n.name}  (${n.weighted}★, ${n.edgeCount} dependents) — expected in ${n.where}`)
    for (const e of n.edges.slice(0, 8)) console.error(`      ${e.stars}★  ${e.file}`)
    if (n.edgeCount > 8) console.error(`      … ${n.edgeCount - 8} more`)
  }
  console.error('\nRemoving a canon node leaves a gap in every file above. If the removal is')
  console.error('deliberate, re-run the extractors so the index stops claiming dependents.')
  process.exit(1)
}

console.log('references: OK — every canon node still exists.')
