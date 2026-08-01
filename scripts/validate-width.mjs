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
 *   W4  capped content is LEFT-ANCHORED — no mx-auto on a --kol-content-*
 *                                     column; the frame centres, content does not
 *
 * W4 added 2026-08-01. The same law sentence W1 quotes also says "content
 * LEFT-ANCHORED inside", and `ShellLayout`'s main column carried `mx-auto` —
 * so above the canvas width the content drifted off the rail it lines up with.
 * The exemption is the FRAME itself (ShellChrome's outer shell wrapper): that
 * one centres in the viewport by design, which is exactly what makes the
 * content inside it centring twice.
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
 * ragged edge inward.
 *
 * TWO halves, because a file-wide regex passed BOTH failures (2026-07-31): the
 * cap must be ON MainColumn's content and OFF everything else in the file. Put
 * it on the wrapper that holds the grid and all three columns centre together,
 * dragging the rails inward off the viewport edge — the rails are chrome, and
 * the theme's law is written about a page. An uncapped main and a capped frame
 * are opposite defects that read identically to `test(shell)`. */
const SHELL = join(REPO, 'packages/workshop/src/shell/ShellLayout.jsx')
const shell = readFileSync(SHELL, 'utf8')
/* CANVAS specifically, not any --kol-content-* (2026-07-31). `shell` here was
 * real code that could never fire: the middle grid track is the viewport minus
 * both rails, both gutters and the chrome inset, so it never reaches the frame
 * value and every page inherited the raw window. The rung that binds the main
 * column is canvas. */
const CAP = /max-w-\[var\(--kol-content-canvas\)\]/
const ANY_CONTENT_CAP = /max-w-\[var\(--kol-content-/

/* Slice MainColumn's own block: from its declaration to the next top-level
 * `const`. Comments are stripped so a comment NAMING the token can neither
 * satisfy W1a nor trip W1b. */
const stripComments = (s) =>
  s.split('\n').filter((l) => !isComment(l)).join('\n')
const mcStart = shell.indexOf('const MainColumn')
const mcEnd = mcStart === -1 ? -1 : shell.indexOf('\nconst ', mcStart + 1)
const mainColumn = mcStart === -1 ? '' : stripComments(shell.slice(mcStart, mcEnd === -1 ? undefined : mcEnd))
const outsideMain = mcStart === -1
  ? stripComments(shell)
  : stripComments(shell.slice(0, mcStart) + (mcEnd === -1 ? '' : shell.slice(mcEnd)))

if (!CAP.test(mainColumn)) {
  errors.push(
    `${rel(SHELL)}  MainColumn's content is not capped at --kol-content-canvas — ` +
    `every page inherits the main track's raw width`
  )
}
if (ANY_CONTENT_CAP.test(outsideMain)) {
  errors.push(
    `${rel(SHELL)}  a --kol-content-* cap sits outside MainColumn — capping the ` +
    `chrome frame centres the rails inward; the cap belongs on the content`
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

/* ── W3 · panel-bound content on uncapped pages ────────────────────────────
 * Scoped BACK to panel-bound content 2026-07-31, after a day spent widening it
 * the wrong way. The reasoning matters, because the wide version looked more
 * rigorous and was worse:
 *
 * The page body is capped ONCE, by W1, at the main column — so requiring every
 * page to carry its own cap flagged 14 files that were already correct and
 * pushed the same number into 14 call sites, which is the improvisation the
 * width law exists to stop. A page needs its own token only when its content
 * is NARROWER than the body: a table, a code block, a reading column.
 *
 * TABLES LEFT THIS RULE 2026-08-01. `Table` now declares its own width
 * (`width="panel"` default | `"column"`) and applies the cap itself, so every
 * Table is correct by construction and there is nothing for a page-level grep
 * to find. The rule that replaced it: a Table may not be hand-wrapped in a cap
 * div, because that is the improvisation the prop exists to retire — and the
 * `width-ok:` comment exemption is DELETED rather than kept, so it never
 * becomes precedent. CodeBlock keeps the original rule; it has no width prop.
 */
const PANEL_BOUND = /<CodeBlock\b/
const PAGES = join(REPO, 'showcase/src/pages')
for (const file of walk(PAGES)) {
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  const body = lines.filter((l) => !isComment(l)).join('\n')

  /* a Table wrapped in a hand-written panel cap — the prop is the seam now */
  lines.forEach((l, i) => {
    if (isComment(l)) return
    if (!/--kol-content-panel/.test(l)) return
    const near = lines.slice(i, i + 4).join('\n')
    if (/<Table\b/.test(near)) {
      errors.push(
        `${rel(file)}:${i + 1}  wraps a Table in a hand-written panel cap — ` +
        `pass width="panel" | "column" to Table instead`
      )
    }
  })

  if (!PANEL_BOUND.test(body)) continue
  if (/--kol-content-panel/.test(body)) continue
  const hit = lines.findIndex((l) => !isComment(l) && PANEL_BOUND.test(l))
  errors.push(
    `${rel(file)}:${hit + 1}  renders a CodeBlock and never references ` +
    `--kol-content-panel — panel caps code and framed panels`
  )
}

/* ── W4 · capped content is left-anchored ──────────────────────────────────
 * "One frame, content LEFT-ANCHORED inside" (kol-theme.css, "Content widths";
 * docs/documentation/01-foundations/05-layout-systems.md). A `mx-auto` on the
 * same element as a `--kol-content-*` cap centres that content inside its
 * track — which is only correct for the FRAME.
 *
 * The exemption is the TOKEN, not a file or a magic comment, because the law
 * already draws the line in its own vocabulary. kol-theme.css calls `shell`
 * "the frame token" and spells the sanctioned pattern out verbatim:
 *
 *     "Every page: mx-auto max-w-shell + the one padding rhythm,
 *      content LEFT-ANCHORED inside."
 *
 * So `mx-auto` on `--kol-content-shell` IS the law — that is the frame
 * centring in the viewport. Every other cap (canvas · panel · column ·
 * measure) is content living inside that frame, and content does not centre. */
const FRAME_TOKEN = '--kol-content-shell'

for (const file of walk(join(REPO, 'packages')).concat(walk(join(REPO, 'showcase/src')))) {
  const lines = readFileSync(file, 'utf8').split('\n')
  for (const [i, line] of lines.entries()) {
    if (isComment(line)) continue
    if (!/\bmx-auto\b/.test(line)) continue
    const cap = line.match(/--kol-content-[a-z]+/)
    if (!cap || cap[0] === FRAME_TOKEN) continue
    errors.push(
      `${rel(file)}:${i + 1}  'mx-auto' on a ${cap[0]} column — ${FRAME_TOKEN} is ` +
      `the frame and centres; content inside it is LEFT-ANCHORED`
    )
  }
}

if (errors.length) {
  console.error(`width: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('width: clean (one frame, three caps, content left-anchored)')
