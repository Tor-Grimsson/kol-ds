#!/usr/bin/env node
/**
 * validate-rails.mjs — the one-rail lock (pnpm validate:rails).
 *
 * The law is already written, in docs/documentation/04-compositions/02-shells.md:
 *
 *     "the right TOC rail wears the LEFT tree's exact idiom — shell-nav-item
 *      kol-mono-14 rows — and EVERY rail section label is the kol-doc-eyebrow
 *      voice."
 *
 * It had no gate, so it drifted into three row idioms inside a single rail —
 * one of them directly beneath a comment that reads `ONE rail voice (user law)`.
 *
 * Two mechanical checks over the six files that render rail chrome:
 *
 *   R1  rows wear ONE type class      — kol-mono-14, nothing else
 *   R2  labels wear ONE voice         — kol-doc-eyebrow, nothing else
 *
 * Scope is the rail COMPONENTS, not the rail files. DocumentationReader.jsx
 * holds both the rail and the article-body renderer; scoping by file flagged
 * `kol-sans-heading-05` on an <h3> in the document itself, which is correct
 * there. So the walk tracks the enclosing component and only judges lines
 * inside one whose name reads as rail chrome (Sidebar / Toc / Rail / Nav).
 * A kol-helper-* class is right almost everywhere else in the repo; it is a
 * SECOND row ramp inside the rails that this gate exists to stop.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []

/* Every file that paints a rail row or a rail section label. */
const RAIL_FILES = [
  'packages/workshop/src/shell/ShellSidebar.jsx',
  'packages/workshop/src/docs/DocumentationReader.jsx',
  'packages/workshop/src/compositions/WorkshopSidebar.jsx',
  'packages/workshop/src/compositions/WorkshopDefaultSidebar.jsx',
  'packages/component/src/atoms/DocsToc.jsx',
  'showcase/src/lib/ShellChrome.jsx',
]

const ROW_CLASS = 'kol-mono-14'
const LABEL_CLASS = 'kol-doc-eyebrow'

/* Type classes that are legal in the repo at large but are a SECOND ramp when
 * they land on a rail row or a rail label. */
const FOREIGN_TYPE = /\b(kol-mono-(?!14\b)\d+|kol-helper-\d+|kol-sans-[\w-]+)\b/

/* Row/label idioms that compete with the sanctioned pair. `shell-sidebar-link`
 * and `shell-sidebar-action` are alternate row geometries — the law says the
 * rails have one. */
const FOREIGN_ROW = /\b(shell-sidebar-link|shell-sidebar-action)\b/

const isComment = (l) => {
  const t = l.trim()
  return t.startsWith('*') || t.startsWith('//') || t.startsWith('/*') || t.startsWith('{/*')
}

/* A component whose name reads as rail chrome. Everything else in these files
 * (article renderers, headers, error states) is out of scope. */
const RAIL_COMPONENT = /(Sidebar|Toc|Rail|Nav)/i
/* TOP-LEVEL declarations only — no leading indent. An inner helper arrow
 * (`const handleSectionClick = (id) => …`) is not a component and must not
 * take the scope away from the component it lives in. */
const DECLARES = /^(?:export\s+(?:default\s+)?)?(?:function\s+(\w+)|const\s+(\w+)\s*=)/

for (const relPath of RAIL_FILES) {
  const lines = readFileSync(join(REPO, relPath), 'utf8').split('\n')
  let scope = ''
  for (const [i, line] of lines.entries()) {
    const decl = line.match(DECLARES)
    if (decl) scope = decl[1] || decl[2] || ''
    if (isComment(line)) continue
    if (!RAIL_COMPONENT.test(scope)) continue
    /* only lines that actually carry classes */
    if (!/class(Name)?\s*=|`[^`]*\b(kol-|shell-)/.test(line)) continue

    const type = line.match(FOREIGN_TYPE)
    if (type) {
      errors.push(
        `${relPath}:${i + 1}  '${type[0]}' in rail chrome — rows are ` +
        `'${ROW_CLASS}', labels are '${LABEL_CLASS}'`
      )
    }
    const row = line.match(FOREIGN_ROW)
    if (row) {
      errors.push(
        `${relPath}:${i + 1}  '${row[0]}' is a second row geometry — ` +
        `the rails have one ('shell-nav-item')`
      )
    }
  }
}

if (errors.length) {
  console.error(`rails: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('rails: clean (one row idiom, one label voice)')
