#!/usr/bin/env node
/**
 * validate-syntax — every package source file must TRANSFORM, and so must the showcase, the
 * workbench and the apps (2026-10-01).
 *
 * Born 2026-08-09, the day "18 gates clean" blessed a publish that could not
 * parse: kol-component 0.28.0 shipped a JSX comment at expression position in
 * RecordManager.jsx, and every consumer died at dev transform — the barrel
 * pulls each file into the graph whether or not it renders. No gate read the
 * source as CODE; this one does. It esbuild-transforms every .js/.jsx under
 * each package's src dir — the exact surface a publish ships (§4: raw
 * source) — and fails loud on the first file the bundler would refuse.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const require = createRequire(import.meta.url)
const { transformSync } = require('esbuild')

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (name === 'node_modules') continue
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(jsx|js)$/.test(name)) files.push(p)
  }
}
for (const pkg of readdirSync(join(ROOT, 'packages'))) {
  const src = join(ROOT, 'packages', pkg, 'src')
  try { statSync(src) } catch { continue }
  walk(src)
}
/* THE APPS TRANSFORM TOO (2026-10-01). A codemod rewrote a quoted `<Button variant='primary' />`
 * inside a showcase preview's string, the string stopped parsing, and the whole showcase went
 * blank behind a dev-server 500 — while this gate, reading packages only, said clean. Whatever
 * this repo runs is read here: the showcase, the workbench and every app. */
const packageCount = files.length
for (const dir of ['showcase/src', 'workbench/src', ...readdirSync(join(ROOT, 'apps')).map((a) => `apps/${a}/src`)]) {
  try { statSync(join(ROOT, dir)) } catch { continue }
  walk(join(ROOT, dir))
}

const violations = []
for (const f of files) {
  try {
    transformSync(readFileSync(f, 'utf8'), { loader: 'jsx' })
  } catch (e) {
    violations.push(`${relative(ROOT, f)} — ${e.errors?.[0]?.text ?? e.message}`)
  }
}

if (violations.length) {
  console.error(`syntax: ${violations.length} violation(s)\n`)
  for (const v of violations) console.error('  ✗ ' + v)
  process.exit(1)
}
console.log(`syntax: clean (${packageCount} package source files transform, ${files.length - packageCount} showcase · workbench · app files)`)
