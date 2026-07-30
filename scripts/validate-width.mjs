#!/usr/bin/env node
/**
 * validate-width.mjs — the content-width lock (pnpm validate:width).
 *
 * The law is already written, in the theme itself (packages/theme/kol-theme.css,
 * "Content widths"): ONE frame, three inner caps. shell 1800 · panel 960 ·
 * column 768 · measure 65ch. It names its own failure mode verbatim:
 *
 *     "a hardcoded max-w-[Npx] at a call site means this scale failed;
 *      file it, don't improvise it."
 *
 * It had no gate, so it drifted — the shell's own main wrapper carries no cap
 * at all, and every page inherits the viewport. Three mechanical checks:
 *
 *   W1  the shell frame caps        — the file that owns the main column must
 *                                     cap it with a --kol-content-* token
 *   W2  no hardcoded px max-widths  — the law's own named failure
 *   W3  panel-bound content is capped — a page rendering a Table/CodeBlock must
 *                                     reference the panel token somewhere
 *
 * W3 is file-scoped, not element-scoped: it proves the page KNOWS about the cap,
 * not that every element wears it. A tighter check needs an AST pass; this one
 * cannot false-positive on a page that already caps correctly.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx?|css)$/.test(name)) out.push(p)
  }
  return out
}

const rel = (p) => relative(REPO, p)
/* `{/*` too — a JSX comment naming the value it replaced is documentation,
 * not a call site, and must not be flagged as one. */
const isComment = (l) => {
  const t = l.trim()
  return t.startsWith('*') || t.startsWith('//') || t.startsWith('/*') || t.startsWith('{/*')
}

/* ── W1 · the shell frame ──────────────────────────────────────────────────
 * ShellLayout owns the main column for every consumer. If it does not cap,
 * nothing downstream can — a page cap inside an uncapped frame just moves the
 * ragged edge inward. */
const SHELL = join(REPO, 'packages/workshop/src/shell/ShellLayout.jsx')
const shell = readFileSync(SHELL, 'utf8')
if (!/max-w-\[var\(--kol-content-/.test(shell)) {
  errors.push(
    `${rel(SHELL)}  the shell's main column carries no --kol-content-* cap — ` +
    `every page inherits the viewport`
  )
}

/* ── W2 · hardcoded pixel max-widths ───────────────────────────────────────
 * Scoped to chrome and pages. `demos/`, `blocks/` and `sets/` are component
 * SPECIMENS — a 420px glass panel or a 520px card is that component's own
 * size, not a content frame, and forcing those onto the content scale would
 * be the improvisation this gate exists to stop, pointed the other way. */
const SKIP = /showcase\/src\/(demos|blocks|sets)\//
const SCOPES = ['showcase/src', 'packages/workshop/src', 'packages/framework/src']
for (const scope of SCOPES) {
  for (const file of walk(join(REPO, scope))) {
    if (SKIP.test(rel(file).replace(/\\/g, '/'))) continue
    const lines = readFileSync(file, 'utf8').split('\n')
    for (const [i, line] of lines.entries()) {
      if (isComment(line)) continue
      const m = line.match(/max-w-\[(\d+)px\]|max-width:\s*(\d+)px/)
      if (m) {
        errors.push(
          `${rel(file)}:${i + 1}  hardcoded max-width ${m[1] || m[2]}px — ` +
          `use a --kol-content-* token, or file the gap`
        )
      }
    }
  }
}

/* ── W3 · panel-bound content on uncapped pages ──────────────────────────── */
const PANEL_BOUND = /<(Table|CodeBlock)\b/
const PAGES = join(REPO, 'showcase/src/pages')
for (const file of walk(PAGES)) {
  const src = readFileSync(file, 'utf8')
  const body = src.split('\n').filter((l) => !isComment(l)).join('\n')
  if (!PANEL_BOUND.test(body)) continue
  if (/--kol-content-panel/.test(body)) continue
  const hit = src.split('\n').findIndex((l) => !isComment(l) && PANEL_BOUND.test(l))
  errors.push(
    `${rel(file)}:${hit + 1}  renders a Table/CodeBlock and never references ` +
    `--kol-content-panel — panel caps tables, code and framed panels`
  )
}

if (errors.length) {
  console.error(`width: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('width: clean (one frame, three caps)')
