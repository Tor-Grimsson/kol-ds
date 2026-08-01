#!/usr/bin/env node
/**
 * extract-manifest.mjs — emit the manifest tree as a readable document
 * (pnpm extract:manifest → docs/operations/04-content-pipeline/06-manifest-tree.md).
 *
 * The taxonomy doc describes the SHAPE (category → chapter → page). This emits
 * the actual TREE, with every row's source path and renderer, read from the
 * filesystem rather than typed — so it cannot become fiction. A hand-authored
 * copy of a 200-row tree is a second source of truth, and this repo has spent
 * two days paying for those.
 *
 * Why it may write into docs/ when the pipeline's own law says generators do
 * not: the law separates APP CONTENT from DOCUMENTATION, not generated from
 * authored. The 219 mined usage files are a database the app renders. This is
 * one document about the repo's own structure, marked generated in its parent
 * INDEX — the case .kol/docs-framework's "Generated folders" clause covers.
 *
 * Editorial input lives in CATEGORIES below and nowhere else: which categories
 * exist, in what order, and which non-vault routes belong to which chapter.
 * Everything under that is derived.
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName, folderOf } from './lib/parse-barrel.mjs'
/* The SAME editorial map the app reads (showcase/src/nav/chapter-pages.js) —
 * plain data, no Vite imports, so Node can load it directly. A second copy
 * here was the obvious shortcut and would drift the first time a route moved. */
import { CHAPTER_PAGES } from '../showcase/src/nav/chapter-pages.js'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(REPO, 'docs/operations/04-content-pipeline/06-manifest-tree.md')

/* ── EDITORIAL: the categories, their order, and the pages that are not files
 *    in the category's own root. Category order is a decision, not a rule —
 *    nothing derives it and nothing should. ─────────────────────────────── */
const CATEGORIES = [
  {
    key: 'documentation',
    label: 'DOCUMENTATION',
    kind: 'vault',
    root: 'docs/documentation',
    note: 'the design system, documented',
    /* React routes that belong INSIDE a vault chapter — the "a page is a slot"
     * ruling: same chapter, different renderer. Read from the shared map. */
    extraPages: CHAPTER_PAGES,
  },
  {
    key: 'components',
    label: 'COMPONENTS',
    kind: 'roster',
    root: 'packages/*/src/**/index.js',
    note: 'derived from the package barrels — chapters are tiers',
  },
  {
    key: 'operations',
    label: 'OPERATIONS',
    kind: 'vault',
    root: 'docs/operations',
    note: 'repo machinery',
    extraPages: {},
  },
  {
    key: 'tools',
    label: 'TOOLS',
    kind: 'surfaces',
    note: 'routes the app serves — not a body of material, so not a category in the strict sense; listed because they occupy rail space',
    pages: [
      { label: 'Blocks', path: '/blocks', source: 'showcase/src/blocks/', render: 'page' },
      { label: 'Sets', path: '/sets', source: 'showcase/src/sets/', render: 'page' },
      { label: 'References', path: '/references', source: 'showcase/src/usage/*.json', render: 'page' },
      { label: 'Quarantine', path: '/quarantine', source: 'showcase/src/pages/Quarantine.jsx', render: 'page' },
      { label: 'Shell & Layout', path: '/docs/shell-and-layout', source: 'showcase/src/docs/shell-and-layout.mdx', render: 'mdx' },
      { label: 'Menus', path: '/docs/menus', source: 'showcase/src/docs/menus.mdx', render: 'mdx' },
      { label: 'Loaders', path: '/docs/loaders', source: 'showcase/src/docs/loaders.mdx', render: 'mdx' },
      { label: 'Type roles', path: '/docs/type-roles', source: 'showcase/src/docs/type-roles.mdx', render: 'mdx' },
    ],
  },
]

/* Supporting-file folders are infrastructure, not pages. (The generated usage
 * catalog needed skipping here until 2026-07-31; it now lives in the machine
 * root, so the vault holds only authored docs and nothing is filtered.) */
const SKIP_DIR = new Set(['_assets', '_files'])

const titleOf = (file) => {
  const m = readFileSync(file, 'utf8').match(/^title:\s*(.+)$/m)
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
}
const humanise = (seg) => {
  const w = seg.replace(/^\d+-/, '').replace(/-/g, ' ')
  return w.charAt(0).toUpperCase() + w.slice(1)
}
/* ── vault ids — the SAME algorithm as the workshop engine's buildInventory
 *    (packages/workshop/src/engine/build-inventory.js). Ids are FILENAME
 *    based, not path based: `04-layout-breakpoints`, with `INDEX.md` taking
 *    its parent folder as a prefix and any surviving collision doing the same.
 *    A guessed id is a dead route, so this mirrors the engine rather than
 *    inventing a scheme that looks reasonable. ─────────────────────────── */
const walkMd = (dir, out = []) => {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') || SKIP_DIR.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walkMd(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const VAULT_IDS = (() => {
  const docsRoot = join(REPO, 'docs')
  const entries = walkMd(docsRoot).map((abs) => {
    const rel = relative(docsRoot, abs)
    const segs = rel.split('/')
    const base = segs[segs.length - 1].replace(/\.md$/, '')
    const parent = segs.length > 1 ? segs[segs.length - 2] : ''
    return { abs, parent, id: base.toLowerCase() === 'index' ? `${parent}-${base}` : base }
  })
  const counts = entries.reduce((m, e) => ((m[e.id] = (m[e.id] ?? 0) + 1), m), {})
  const byAbs = new Map()
  for (const e of entries) byAbs.set(e.abs, counts[e.id] > 1 ? `${e.parent}-${e.id}` : e.id)
  return byAbs
})()

const vaultHref = (abs) => `/documentation/${VAULT_IDS.get(abs) ?? '?'}`

const pageOf = (abs) => ({
  label: titleOf(abs) ?? humanise(abs.split('/').pop().replace(/\.md$/, '')),
  path: vaultHref(abs),
  source: relative(REPO, abs),
  render: 'vault',
})

/* ── vault categories: numbered folders are chapters, .md files are pages.
 *    A chapter's own subfolders (06-research/workflows/) are read RECURSIVELY
 *    into the chapter — the taxonomy has three levels, so a nested folder is
 *    an authoring convenience, not a fourth rung. ─────────────────────── */
function readVault(cat) {
  const root = join(REPO, cat.root)
  const chapters = []
  const loose = []
  for (const name of readdirSync(root).sort()) {
    if (name.startsWith('.') || SKIP_DIR.has(name)) continue
    const p = join(root, name)
    if (statSync(p).isDirectory()) {
      chapters.push({
        label: humanise(name),
        folder: name,
        pages: [...walkMd(p).map(pageOf), ...((cat.extraPages ?? {})[name] ?? [])],
      })
    } else if (name.endsWith('.md')) {
      loose.push(pageOf(p))
    }
  }
  return { chapters, loose }
}

/* ── the component roster: same enumeration as roster.js + validate:roster ── */
function readRoster() {
  const pkgsDir = join(REPO, 'packages')
  const byTier = new Map()
  for (const dir of readdirSync(pkgsDir).sort()) {
    const src = join(pkgsDir, dir, 'src')
    if (!existsSync(join(src, 'index.js'))) continue
    const files = {}
    const collect = (d) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const full = join(d, e.name)
        if (e.isDirectory() && e.name !== 'node_modules') collect(full)
        else if (e.name === 'index.js') files[relative(src, full)] = readFileSync(full, 'utf8')
      }
    }
    collect(src)
    for (const { name, src: from } of parseBarrelExports(files)) {
      if (!isComponentName(name)) continue
      const folder = folderOf(from)
      const tier = ['atoms', 'molecules', 'organisms', 'hooks'].includes(folder)
        ? folder
        : `pkg:${dir}`
      if (!byTier.has(tier)) byTier.set(tier, [])
      byTier.get(tier).push({ name, pkg: `@kolkrabbi/kol-${dir}` })
    }
  }
  return byTier
}

const slug = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const mdxFor = (name) =>
  existsSync(join(REPO, `showcase/src/docs/components/${name}.mdx`))
    ? { render: 'mdx', source: `showcase/src/docs/components/${name}.mdx` }
    : { render: 'page', source: 'showcase/src/pages/ComponentPage.jsx (generated)' }

/* ── emit ─────────────────────────────────────────────────────────────────── */
const cell = (s) => String(s).replace(/\|/g, '\\|')
const rows = (pages) =>
  pages
    .map((p) => `| ${cell(p.label)} | \`${p.path}\` | \`${p.source}\` | \`${p.render}\` |`)
    .join('\n')
const HEAD = `| Page | Path | Source | Render |\n|---|---|---|---|`

const out = []
let pageCount = 0

out.push(`---
title: The manifest tree
type: reference
status: active
updated: 2026-07-31
description: The declared sidebar, generated from the real sources — every category, chapter and page with its source path and renderer. Regenerate with pnpm extract:manifest.
aliases:
  - manifest-tree
tags:
  - domain/workflow
  - domain/design-system
related:
  - "[[INDEX|content pipeline]]"
  - "[[02-taxonomy|categories, chapters, pages]]"
  - "[[03-manifest|the nav manifest]]"
---

# The manifest tree

> **GENERATED — do not edit by hand.** \`pnpm extract:manifest\` rewrites this file from the filesystem. Editorial input (which categories exist, their order, and which non-vault routes sit inside a chapter) lives in \`scripts/extract-manifest.mjs\`; everything else is derived.

Row shape is [[03-manifest|the manifest's]]: label · path · source · render. Renderers are \`vault\` (DocumentationReader) · \`mdx\` (MdxDoc — markdown with live components) · \`page\` (a React route).`)

for (const cat of CATEGORIES) {
  out.push(`\n## ${cat.label}\n`)
  out.push(`${cat.note}. Source root: \`${cat.root ?? '—'}\``)

  if (cat.kind === 'vault') {
    const { chapters, loose } = readVault(cat)
    if (loose.length) {
      pageCount += loose.length
      out.push(`\n### Category root\n`)
      out.push(HEAD)
      out.push(rows(loose))
    }
    for (const ch of chapters) {
      pageCount += ch.pages.length
      out.push(`\n### ${ch.label} · \`${ch.folder}\`\n`)
      out.push(HEAD)
      out.push(rows(ch.pages))
    }
  }

  if (cat.kind === 'roster') {
    const byTier = readRoster()
    const order = ['atoms', 'molecules', 'organisms', 'hooks']
    const keys = [...byTier.keys()].sort((a, b) => {
      const ia = order.indexOf(a)
      const ib = order.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b)
    })
    for (const tier of keys) {
      const items = byTier.get(tier).sort((a, b) => a.name.localeCompare(b.name))
      pageCount += items.length
      out.push(`\n### ${humanise(tier.replace(/^pkg:/, ''))} · ${items.length}\n`)
      out.push(HEAD)
      out.push(
        items
          .map((c) => {
            const r = mdxFor(c.name)
            return `| ${c.name} | \`/components/${slug(c.name)}\` | \`${r.source}\` | \`${r.render}\` |`
          })
          .join('\n')
      )
    }
  }

  if (cat.kind === 'surfaces') {
    pageCount += cat.pages.length
    out.push(`\n${HEAD}`)
    out.push(rows(cat.pages))
  }
}

out.push(`\n## Totals\n`)
out.push(`| | |\n|---|---|`)
out.push(`| Categories | ${CATEGORIES.length} |`)
out.push(`| Pages | ${pageCount} |`)

writeFileSync(OUT, `${out.join('\n')}\n`)
console.log(`manifest: ${CATEGORIES.length} categories, ${pageCount} pages → ${relative(REPO, OUT)}`)
