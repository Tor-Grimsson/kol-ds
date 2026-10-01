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
 *   E1  every ALL_ROUTES entry contributes a search row (parent, not just children)
 *   E1b every rail page list (DOCS_GUIDES · DOCS_SPECIMENS · DEV_TOOLS) is searched, and every
 *       path in it has a Route
 *   E2  tags reach search — items carry them, and a tag in a rail opens the search page on it
 *   E3  the tag overlay's graph control is not gated behind having filters
 *   E4  every icon named in SHELL_ROUTES exists in the icon set
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(REPO, p), 'utf8')
const errors = []

/* ── E1 · every route is a search row ──
 * Two failures now, not one. The original: mapping `r.children` only, so a
 * childless tab contributed nothing. The second arrived with the quarantine
 * gate — `SHELL_ROUTES` is the ADMITTED subset, so searching it instead of the
 * full `ALL_ROUTES` would make every held surface unfindable by name. That is
 * the same defect this file exists to stop, reintroduced by a gate that is
 * supposed to be reversible. Search reads the complete list; the tree is what
 * gets filtered. */
const navSrc = read('showcase/src/nav/shell-nav.js')
const buildFn = navSrc.slice(navSrc.indexOf('buildShellSearchItems'))
if (!/ALL_ROUTES\.flatMap\(\(r\)\s*=>\s*\[/.test(buildFn)) {
  errors.push(
    'showcase/src/nav/shell-nav.js  buildShellSearchItems must flatMap ALL_ROUTES ' +
    'with the parent row included — mapping children only, or mapping the ' +
    'admitted SHELL_ROUTES, leaves surfaces unreachable by name'
  )
}

/* ── E1b · the rail's page lists are search rows too ──
 * Rewritten 2026-09-28. It guarded CHAPTER_PAGES — the live pages (Foundations, Icons) filed
 * inside vault chapters — until that map was emptied on 2026-08-01 and the pages became orphans:
 * a route, no rail row, findable by URL and ⌘K only. The Docs and Development spaces list them in
 * their own rail sections now (DOCS_GUIDES · DOCS_SPECIMENS · DEV_TOOLS), so the gate guards those
 * lists: each is searched, and each path has a Route — no row that leads nowhere. */
for (const list of ['DOCS_GUIDES', 'DOCS_SPECIMENS', 'DEV_TOOLS']) {
  if (!new RegExp(`${list}\\.map\\(`).test(buildFn)) {
    errors.push(`showcase/src/nav/shell-nav.js  buildShellSearchItems ignores ${list} — a page in a rail must be findable by name`)
  }
  const block = navSrc.slice(navSrc.indexOf(`export const ${list} = [`), navSrc.indexOf(']', navSrc.indexOf(`export const ${list} = [`)))
  const appSrc = read('showcase/src/App.jsx')
  for (const [, p] of block.matchAll(/path:\s*'([^']+)'/g)) {
    const route = p === '/icons' ? '/icons/:set?' : p
    if (!appSrc.includes(`path="${route}"`)) {
      errors.push(`showcase/src/nav/shell-nav.js  ${list} row ${p} has no matching Route in App.jsx — the rail would offer a row that leads nowhere`)
    }
  }
}

/* ── E2 · tags reach search ──
 * Rewritten 2026-09-28. Tags were palette rows with an `action` that opened the in-place tag
 * browser — the "weird nested overlay" the user asked to retire. A tag is a filter of THE search
 * now: items carry their tags (a `#tag` token or the Tags facet finds them), and a tag clicked in
 * a rail opens the search page on it. Either half missing and tags are unreachable again. */
const chromeSrc = read('showcase/src/lib/ShellChrome.jsx')
if (!/tags:/.test(buildFn) || !/searchHref\(`#\$\{tag\}`\)/.test(chromeSrc)) {
  errors.push(
    'showcase/src/lib/ShellChrome.jsx  tags do not reach search — items must carry `tags` and a ' +
    'rail tag must open the search page on `#tag`'
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
const iconDir = join(REPO, 'packages/icons/src/kol-icon-set-interface')
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
      `showcase/src/nav/shell-nav.js  icon '${m[1]}' is not in kol-icon-set-interface — ` +
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
