#!/usr/bin/env node
/**
 * import-figma-icons.mjs: write the flat icons exported from the iconset Figma file into packages/icons.
 *
 * Input: a text file, one icon per line, `name=<svg body>`, as the export step in
 * docs/operations/10-figma/ produces it (the body is Figma's own SVG export of the built icon, with the
 * repeated attribute runs shortened to ~A ~B ~D ~P ~C ~R ~F).
 *
 *   node scripts/import-figma-icons.mjs <export.txt> [--dry] [--skip a,b,c]
 *
 * Every file it replaces is copied first to before/ next to the export file. --set editor limits it to one set. A name with no file in
 * the interface or signal set is reported and skipped, unless --new name=folder places it.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'packages/icons/src')
const args = process.argv.slice(2)
const input = args.find((a) => !a.startsWith('--'))
const dry = args.includes('--dry')
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : '' }
const skip = new Set(flag('--skip').split(',').filter(Boolean))
const only = flag('--set')
const fresh = Object.fromEntries(flag('--new').split(',').filter(Boolean).map((p) => p.split('=')))
if (!input) { console.error('usage: import-figma-icons.mjs <export.txt> [--dry] [--skip a,b] [--new name=set/folder]'); process.exit(1) }

const walk = (dir, out = []) => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p, out); else if (f.endsWith('.svg')) out.push(p) } return out }
const files = new Map()
for (const set of ['kol-icon-set-interface', 'kol-icon-set-editor', 'kol-icon-set-signal'].filter((x) => !only || x === 'kol-icon-set-' + only)) for (const p of walk(join(SRC, set))) { const n = p.split('/').pop().replace('.svg', ''); if (!files.has(n)) files.set(n, []); files.get(n).push(p) }

const expand = (body) => body
  .split('~A').join(' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke="#FBFAF4"/>\n')
  .split('~B').join(' stroke-width="1.5" stroke-linejoin="round" stroke="#FBFAF4"/>\n')
  .split('~D').join(' stroke-width="1.5" stroke="#FBFAF4"/>\n')
  .split('~P').join('<path d="').split('~C').join('<circle cx="').split('~R').join('<rect x="')
  .split('~F').join(' fill="#FBFAF4"/>\n')
  .replace(/\/>(?!\n)/g, '/>\n').replace(/<\/mask>/g, '</mask>\n').replace(/(<g [^>]*>)/g, '$1\n').replace(/<\/g>/g, '</g>\n')
  .replace(/#FBFAF4/gi, 'currentColor')
const svg = (body) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${expand(body).trim()}\n</svg>\n`

const before = join(dirname(input), 'before')
const done = [], missing = [], same = [], skipped = []
for (const line of readFileSync(input, 'utf8').split('\n')) {
  const i = line.indexOf('='); if (i < 0) continue
  const name = line.slice(0, i), out = svg(line.slice(i + 1))
  if (skip.has(name)) { skipped.push(name); continue }
  let targets = files.get(name)
  if (!targets && fresh[name]) targets = [join(SRC, 'kol-icon-set-' + fresh[name], name + '.svg')]
  if (!targets) { missing.push(name); continue }
  for (const t of targets) {
    if (existsSync(t) && readFileSync(t, 'utf8') === out) { same.push(name); continue }
    if (!dry) { if (existsSync(t)) { const b = join(before, relative(SRC, t)); mkdirSync(dirname(b), { recursive: true }); if (!existsSync(b)) copyFileSync(t, b) } mkdirSync(dirname(t), { recursive: true }); writeFileSync(t, out) }
    done.push(name)
  }
}
console.log(`${dry ? 'would write' : 'wrote'} ${done.length} file(s); unchanged ${same.length}; skipped ${skipped.length}; no file for: ${missing.join(', ') || 'none'}`)
