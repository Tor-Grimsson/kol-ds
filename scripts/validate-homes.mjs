#!/usr/bin/env node
/**
 * validate-homes.mjs — every level has a markdown home (pnpm validate:homes, 2026-09-30).
 *
 * The audit ruled "every level has a home, written as markdown with frontmatter"; the build added
 * them sometimes. This fails when a home a page asks for has no file in showcase/src/homes/:
 *   - every literal `<HomeDoc id="…">` / `home="…"` in showcase/src
 *   - every Function chapter (`function-<key>`), every used Block and Card category
 *     (`block-<cat>` · `card-<cat>`)
 * and when a home file has no frontmatter title.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(REPO, 'showcase/src')
const HOMES = join(SRC, 'homes')
const read = (p) => readFileSync(join(SRC, p), 'utf8')

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(dir, e.name)) : /\.jsx?$/.test(e.name) ? [join(dir, e.name)] : [])

const want = new Map()
for (const f of walk(SRC)) {
  const s = readFileSync(f, 'utf8')
  for (const m of s.matchAll(/<HomeDoc\s+(?:key=\{[^}]*\}\s+)?id="([^"]+)"/g)) want.set(m[1], f.replace(REPO + '/', ''))
  for (const m of s.matchAll(/\bhome="([^"]+)"/g)) want.set(m[1], f.replace(REPO + '/', ''))
}
const fnBlock = read('nav/registry.js').match(/export const FUNCTIONS = \{([\s\S]*?)\}/)[1]
for (const m of fnBlock.matchAll(/^\s*(\w+):/gm)) want.set(`function-${m[1]}`, 'nav/registry.js FUNCTIONS')
for (const [dir, pre] of [['blocks', 'block'], ['cards', 'card']]) {
  for (const f of readdirSync(join(SRC, dir)).filter((n) => n.endsWith('.jsx'))) {
    const m = read(`${dir}/${f}`).match(/category:\s*'([^']+)'/)
    if (m) want.set(`${pre}-${m[1]}`, `${dir}/${f}`)
  }
}

const bad = []
for (const [id, from] of want) {
  const file = join(HOMES, `${id}.md`)
  if (!existsSync(file)) bad.push(`  NO HOME     ${id}.md  (asked for by ${from})`)
  else if (!/^---\n[\s\S]*?\btitle:\s*\S/.test(readFileSync(file, 'utf8'))) bad.push(`  NO TITLE    ${id}.md`)
}
if (bad.length) {
  console.log(`homes: ${bad.length} violation(s)\n\n${bad.join('\n')}`)
  process.exit(1)
}
console.log(`homes: clean (${want.size} homes, every one a markdown file with frontmatter)`)
