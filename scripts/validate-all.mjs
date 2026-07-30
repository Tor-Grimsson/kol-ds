#!/usr/bin/env node
/**
 * validate-all.mjs — every gate, one command, one number (pnpm validate).
 *
 * Runs all validators to completion rather than stopping at the first failure,
 * because the point is the scoreboard: which laws hold, which have drifted, and
 * by how much. Exits non-zero if any gate fails, so CI can use it too.
 *
 * `pnpm build` deliberately does NOT run this yet — width and rails currently
 * fail, and wiring a red gate into the deploy path would just break Vercel.
 * They join the build in phase 3 of the recovery plan, once the counts are 0.
 */
import { spawnSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

const GATES = [
  ['roster', 'validate-roster.mjs'],
  ['imports', 'validate-imports.mjs'],
  ['taxonomy', 'validate-taxonomy.mjs'],
  ['groups', 'validate-groups.mjs'],
  ['foundations', 'validate-foundations.mjs'],
  ['width', 'validate-width.mjs'],
  ['rails', 'validate-rails.mjs'],
]

const results = []
for (const [name, file] of GATES) {
  const r = spawnSync(process.execPath, [join(HERE, file)], { encoding: 'utf8' })
  const out = `${r.stdout || ''}${r.stderr || ''}`
  const count = Number(out.match(/:\s*(\d+)\s+violation/)?.[1] ?? 0)
  results.push({ name, ok: r.status === 0, count, out: out.trimEnd() })
}

for (const r of results) {
  if (r.ok) continue
  console.error(`\n── ${r.name} ${'─'.repeat(Math.max(0, 60 - r.name.length))}`)
  console.error(r.out)
}

const width = Math.max(...results.map((r) => r.name.length))
const failed = results.filter((r) => !r.ok)
const total = failed.reduce((n, r) => n + r.count, 0)

console.log('\n  gate' + ' '.repeat(width - 2) + 'result')
console.log('  ' + '─'.repeat(width + 14))
for (const r of results) {
  const pad = ' '.repeat(width - r.name.length + 2)
  console.log(`  ${r.name}${pad}${r.ok ? 'clean' : `${r.count} violation(s)`}`)
}

if (failed.length) {
  console.log(`\n  ${failed.length} of ${results.length} gates failing · ${total} violation(s) total\n`)
  process.exit(1)
}
console.log(`\n  all ${results.length} gates clean\n`)
