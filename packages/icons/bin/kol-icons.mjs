#!/usr/bin/env node
/**
 * kol-icons CLI — `npx kol-icons audit`
 *
 * Scans the current repo's `<Icon name>` / `iconLeft` / `icon:` usage and classifies
 * each name against the shipped sets: in kol-icon-set-v1 (curated ✓), legacy-only
 * (breaks when legacy is dropped — migrate or registerIcons), or not-in-package
 * (a locally-registered icon, or a typo). Dependency-free.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

if (process.argv[2] !== 'audit') {
  console.log('kol-icons — usage:\n  npx kol-icons audit    scan this repo for icon usage vs kol-icon-set-v1\n')
  process.exit(0)
}

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..') // packages/icons (or the installed pkg)

// icon names shipped by the package, per set
const svgNames = (rel) => {
  const out = new Set()
  const walk = (d) => {
    let ents
    try { ents = readdirSync(d, { withFileTypes: true }) } catch { return }
    for (const e of ents) {
      if (e.isDirectory()) walk(join(d, e.name))
      else if (e.name.endsWith('.svg')) out.add(e.name.replace(/\.svg$/, ''))
    }
  }
  walk(join(PKG, 'src', rel))
  return out
}
const v1 = svgNames('kol-icon-set-v1')
const legacy = new Set([...svgNames('stroke'), ...svgNames('solid'), ...svgNames('svg'), ...svgNames('svg-web')])

// scan the consumer repo (cwd) for icon usage
const SKIP = new Set(['node_modules', 'dist', 'build', 'out', 'coverage', '.git', '.next'])
const CODE = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs'])
const PATTERNS = [
  /<Icon\b[^>]*\bname=["']([^"']+)["']/g,
  /\bicon(?:Left|Right)?=["']([^"']+)["']/g,
  /\bicon:\s*["']([^"']+)["']/g,
]
const usage = new Map()
const scan = (d) => {
  let ents
  try { ents = readdirSync(d, { withFileTypes: true }) } catch { return }
  for (const e of ents) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue
    const p = join(d, e.name)
    if (e.isDirectory()) { scan(p); continue }
    if (!CODE.has(extname(e.name))) continue
    let txt
    try { txt = readFileSync(p, 'utf8') } catch { continue }
    for (const re of PATTERNS) {
      re.lastIndex = 0
      let m
      while ((m = re.exec(txt))) usage.set(m[1], (usage.get(m[1]) || 0) + 1)
    }
  }
}
const cwd = process.cwd()
scan(cwd)

// classify
const inV1 = [], legacyOnly = [], unknown = []
for (const entry of [...usage].sort((a, b) => b[1] - a[1])) {
  const name = entry[0]
  if (v1.has(name)) inV1.push(entry)
  else if (legacy.has(name)) legacyOnly.push(entry)
  else unknown.push(entry)
}
const uses = (list) => list.reduce((s, [, c]) => s + c, 0)
const print = (list) => list.forEach(([n, c]) => console.log(`    ${n.padEnd(26)} ${c}×`))

console.log(`\nkol-icons audit — ${cwd}`)
console.log(`  package: ${v1.size} v1 names · ${legacy.size} legacy names\n`)
console.log(`  in v1 ✓          ${String(inV1.length).padStart(3)} distinct  (${uses(inV1)} uses)`)
console.log(`  legacy-only ⚠    ${String(legacyOnly.length).padStart(3)} distinct  (${uses(legacyOnly)} uses) — break when legacy is dropped`)
console.log(`  not in package   ${String(unknown.length).padStart(3)} distinct  (${uses(unknown)} uses) — locally registered, or typos\n`)

if (legacyOnly.length) { console.log('  LEGACY-ONLY (migrate to a v1 name, or registerIcons locally):'); print(legacyOnly); console.log('') }
if (unknown.length) { console.log('  NOT IN PACKAGE (registered locally, or check for typos):'); print(unknown); console.log('') }

console.log(legacyOnly.length === 0
  ? '  → slim-ready ✓ — no legacy-only icons in this repo\n'
  : `  → ${legacyOnly.length} legacy-only icon(s) to resolve before this repo is slim-ready\n`)
