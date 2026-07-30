#!/usr/bin/env node
/**
 * validate-reachable.mjs — the reachability lock (pnpm validate:reachable).
 *
 * A surface that exists but cannot be found does not exist. Three ways that
 * happened here, all of them invisible until someone went looking:
 *
 *   1. `buildShellSearchItems` built rows from `r.children` only, so a top-level
 *      tab with no children contributed NOTHING. `/icons`, `/references` and
 *      `/documentation` could not be found by typing their own names.
 *   2. The node graph existed in the package, mounted, and was reachable only by
 *      clicking a tag inside one route — its only control hidden behind a state
 *      you had to already be in.
 *   3. Tags had their own separate search box, so "search" meant two different
 *      things depending on which one you happened to open.
 *
 * The checks are static because the failures were static — a missing branch, a
 * gate on a boolean, a route the gate didn't wrap. Anything requiring a rendered
 * page is verified in a browser per category instead of faked here.
 *
 *   E1  every SHELL_ROUTES entry contributes a search row (parent, not just children)
 *   E2  tag rows reach the palette
 *   E3  the tag overlay's graph control is not gated behind having filters
 *   E4  every icon named in SHELL_ROUTES exists in the icon set
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(REPO, p), 'utf8')
const errors = []

/* ── E1 · every route is a search row ── */
const navSrc = read('showcase/src/lib/shell-nav.js')
const buildFn = navSrc.slice(navSrc.indexOf('buildShellSearchItems'))
if (!/SHELL_ROUTES\.flatMap\(\(r\)\s*=>\s*\[/.test(buildFn)) {
  errors.push(
    'showcase/src/lib/shell-nav.js  buildShellSearchItems maps children only — ' +
    'a childless tab contributes no search row and is unreachable by name'
  )
}

/* ── E2 · tags reach the palette ── */
const chromeSrc = read('showcase/src/lib/ShellChrome.jsx')
if (!/buildTagCounts\(/.test(chromeSrc) || !/action:\s*\(\)\s*=>\s*openTagMode\(/.test(chromeSrc)) {
  errors.push(
    'showcase/src/lib/ShellChrome.jsx  tag rows missing from searchItems — ' +
    'tags need an `action` row in THE palette, not a second search box'
  )
}

/* ── E3 · the graph control is not hidden until you already have filters ── */
const overlaySrc = read('packages/workshop/src/tags/TagModeOverlay.jsx')
if (/\{hasFilters && \(\s*<Tooltip label=\{viewMode/.test(overlaySrc)) {
  errors.push(
    'packages/workshop/src/tags/TagModeOverlay.jsx  the graph toggle is gated on ' +
    'hasFilters — the control does not exist until a tag is active, so the graph ' +
    'can only be found by accident'
  )
}
if (/\{hasFilters && viewMode === 'graph' \?/.test(overlaySrc)) {
  errors.push(
    "packages/workshop/src/tags/TagModeOverlay.jsx  the graph BODY is gated on " +
    'hasFilters — the button can be clicked with nothing happening'
  )
}

/* ── E5 · the palette's row projection is not lossy ──
 * ShellLayout reshapes engine results into the overlay's row shape. That map
 * rebuilt every row as a fixed set of fields, so a consumer's `action` closure
 * was dropped between the engine and `onSelect` — the row rendered, matched,
 * highlighted and clicked, and then did nothing at all. Silent, and invisible
 * to every other check here because the row LOOKED right. */
const shellSrc = read('packages/workshop/src/shell/ShellLayout.jsx')
const projection = shellSrc.slice(
  shellSrc.indexOf('const searchResults'),
  shellSrc.indexOf('}))', shellSrc.indexOf('const searchResults')),
)
if (!/action:\s*item\.action/.test(projection)) {
  errors.push(
    'packages/workshop/src/shell/ShellLayout.jsx  searchResults drops `action` — ' +
    'a row with an action closure will render and click and do nothing'
  )
}

/* ── E4 · every nav icon resolves ── */
const iconDir = join(REPO, 'packages/icons/src/kol-icon-set-v1')
const iconNames = new Set()
if (existsSync(iconDir)) {
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.name.endsWith('.svg')) iconNames.add(e.name.replace('.svg', ''))
    }
  }
  walk(iconDir)
}
for (const m of navSrc.matchAll(/icon:\s*'([^']+)'/g)) {
  if (iconNames.size && !iconNames.has(m[1])) {
    errors.push(
      `showcase/src/lib/shell-nav.js  icon '${m[1]}' is not in kol-icon-set-v1 — ` +
      'Icon warns and renders null, so the tab ships label-only'
    )
  }
}

if (errors.length) {
  console.error(`reachable: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('reachable: clean (every surface is findable)')
