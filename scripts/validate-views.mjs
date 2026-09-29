#!/usr/bin/env node
/**
 * validate-views.mjs — nothing hidden (pnpm validate:views).
 *
 * Every top-level VIEW a package exports is mounted somewhere a person can open it: an app under
 * apps/ or a showcase page. Born 2026-09-29 (apps review §6c-2): design-editor had exported
 * `LabsView` and `MobileView` since 0.4.0 and nothing in this repo mounted either — the only way to
 * see them was kol-fxr — so the bug that emptied their media picker had no page to show up on.
 *
 *   V1  a view export is mounted — a file under apps/<app>/src or showcase/src that imports the
 *       package (any subpath, or a dynamic import) renders it (`<Name` or `m.Name`), or renders a
 *       component whose own source renders it (NoteEditor through Notes, BrandBook through Brand)
 *
 * A VIEW is named for what it is: an export ending in View · Page · Screen · Layout · Editor ·
 * Library · Explorer · Dashboard · Book · Hub · Shell · Studio. The suffix is the contract — a
 * whole-screen component named anything else is invisible to this gate, so name it like one.
 *
 * Usage: node scripts/validate-views.mjs
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VIEW = /^[A-Z][A-Za-z0-9]*(View|Page|Screen|Layout|Editor|Library|Explorer|Dashboard|Book|Hub|Shell|Studio)$/

/* the names an entry file exports */
function exportsOf(file) {
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  const names = new Set()
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name) names.add(name)
    }
  }
  for (const m of src.matchAll(/export\s+(?:default\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)/g)) names.add(m[1])
  return [...names].filter((n) => VIEW.test(n))
}

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx?|mjs)$/.test(e)) out.push(p)
  }
  return out
}

/* every file a person can reach: each app's src, and the showcase */
const appDirs = readdirSync(join(REPO, 'apps')).map((a) => join(REPO, 'apps', a, 'src'))
const files = [...appDirs, join(REPO, 'showcase', 'src')].flatMap((d) => walk(d)).map((f) => ({ f, src: readFileSync(f, 'utf8') }))

/* REACHED = rendered where a person can open it, directly or through a parent. The seeds are every
 * capitalised name an app or showcase file renders (`<Name` or `m.Name`); then, to a fixpoint, a
 * package file whose component is reached (its basename) reaches everything IT renders — NoteEditor
 * is opened by Notes, BrandBook by Brand. */
/* `<Name`, `m.Name`, and a component SWAP — `const Page = view === 'assets' ? BrandAssets : BrandBook` */
const rendered = (src) => new Set([...src.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>.]|\.([A-Z][A-Za-z0-9]*)\b|[?:]\s*([A-Z][A-Za-z0-9]*)\b(?!\s*[:(])/g)].map((m) => m[1] ?? m[2] ?? m[3]))
const pkgFiles = readdirSync(join(REPO, 'packages')).flatMap((d) => walk(join(REPO, 'packages', d, 'src')))
  .map((f) => ({ name: f.split('/').pop().replace(/\.(jsx?|mjs)$/, ''), renders: rendered(readFileSync(f, 'utf8')) }))

const errors = []
let checked = 0
for (const dir of readdirSync(join(REPO, 'packages'))) {
  const pkgFile = join(REPO, 'packages', dir, 'package.json')
  if (!existsSync(pkgFile)) continue
  const { name: pkg } = JSON.parse(readFileSync(pkgFile, 'utf8'))
  const entries = ['index.js', 'index.jsx', 'core.jsx'].map((e) => join(REPO, 'packages', dir, 'src', e)).filter(existsSync)
  const views = [...new Set(entries.flatMap(exportsOf))]
  if (!views.length) continue
  const esc = pkg.replace(/[/.]/g, '\\$&')
  const importsPkg = new RegExp(`['"]${esc}(/[^'"]*)?['"]`)
  /* seeds: what files importing THIS package render */
  const reached = new Set(files.filter(({ src }) => importsPkg.test(src)).flatMap(({ src }) => [...rendered(src)]))
  const own = pkgFiles.filter((f) => f.name) // all package files; a parent may sit in another package
  for (let grew = true; grew;) {
    grew = false
    for (const f of own) {
      if (!reached.has(f.name)) continue
      for (const n of f.renders) if (!reached.has(n)) { reached.add(n); grew = true }
    }
  }
  for (const view of views) {
    checked++
    if (!reached.has(view)) errors.push(`${pkg}  ${view} — exported, mounted nowhere (no app or showcase page renders it, nor anything they render)`)
  }
}

if (errors.length) {
  console.error(`views: ${errors.length} violation(s) — a view nobody can open is a view nobody checks\n`)
  for (const e of errors) console.error('  V1  ' + e)
  process.exit(1)
}
console.log(`views: clean (${checked} view exports, every one mounted)`)
