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
 * Four mechanical checks over the six files that render rail chrome:
 *
 *   R1  rows wear ONE type class      — kol-mono-14, nothing else
 *   R2  labels wear ONE voice         — kol-doc-eyebrow, nothing else
 *   R3  eyebrows wear ONE box         — shell-sidebar-toggle, and no second
 *                                       spacing owner stacked on top of it
 *   R4  headers come from RailSection — no hand-written rung class, no
 *                                       hand-placed count, order is the law
 *
 * R4 was added 2026-08-01 for the same reason R3 was, one level up. R3 made
 * the eyebrow's BOX have one owner; the user then pointed at the COUNT — (7)
 * on the right rail's L1, (8) on the left rail's L2, two rails printing the
 * same affordance on different rows. The classes were never the problem: the
 * three rungs already had a class each. What was missing is that nothing
 * declared them a LADDER, and every affordance hanging off a rung — count,
 * collapse, chevron — was hand-typed at each call site.
 *
 * So the fix is a component, not a class: `RailSection` owns the rung and
 * therefore owns where the count goes. R4 asserts nobody bypasses it. The
 * proof this works was already in the repo — L3 is the one rung a component
 * (`DocsToc`) already owned, and the one rung that never drifted.
 *
 * R3 was added 2026-08-01 after the user measured the two rails against each
 * other: the left eyebrow carried `shell-sidebar-toggle shell-sidebar-label`
 * on the wrapper AND `shell-sidebar-label` again on the inner label plus an
 * inline height, the right borrowed `shell-nav-group-header` + one
 * `shell-sidebar-label`. Same row, two boxes. R1 and R2 both passed the whole
 * time — they lock the VOICE, and nothing locked the BOX. The failure mode is
 * not a wrong value, it is spacing owned in more than one place at once, so
 * the gate counts owners rather than measuring pixels.
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
  'packages/component/src/molecules/DocsToc.jsx',
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

/* R3 — the eyebrow's box has exactly ONE owner.
 *
 * Two box classes are legal, by role, and they share one CSS definition:
 *   `shell-sidebar-toggle`  the eyebrow that collapses its section
 *   `shell-sidebar-label`   the eyebrow that is just a label
 * Either alone is correct. The fault is COUNT, not identity — two of them on
 * one element, or one of them beside the nav row's box, or y-spacing set
 * inline where the CSS cannot see it. Each is silent: nothing renders broken,
 * the two rails just stop agreeing. */
const EYEBROW_BOXES = ['shell-sidebar-toggle', 'shell-sidebar-label', 'shell-nav-group-header']
/* An eyebrow is any element wearing the label voice. */
const IS_EYEBROW = new RegExp(`\\b${LABEL_CLASS}\\b`)
/* y-spacing set inline is another owner — invisible from the stylesheet. */
const INLINE_Y = /\b(padding|paddingTop|paddingBottom|paddingBlock|margin|marginTop|marginBottom|marginBlock|height)\s*:\s*['"]?[\d.]/

/* R4 — the rungs come from RailSection.
 *
 * RailSection.jsx is the ONE file allowed to name a rung class or write a
 * count span; that is the whole point of it. Everywhere else, a rung class in
 * a className means a header was hand-built, and a `({...})` span means a
 * count was hand-placed — which is how (7) landed on L1 and (8) on L2. */
const LADDER_OWNER = 'packages/workshop/src/shell/RailSection.jsx'
/* L3's owner. `.shell-nav-item` was a shared NAME and nothing else: nine
 * hand-written utility stacks across five files wore it, and their containers
 * disagreed too (space-y-0 against space-y-4 for one list). RailRow emits the
 * string; the class owns the look. */
const ROW_OWNERS = [
  'packages/workshop/src/shell/RailRow.jsx',
  /* DocsToc is the OTHER row owner and cannot be folded into RailRow: it lives
   * in kol-component, and importing from kol-workshop would be a reverse
   * dependency (ARCHITECTURE §3). Two owners, both components — the fault this
   * rule stops is a hand-written row at a CALL SITE, not a second component
   * that owns the idiom in a lower package. Named here rather than passed
   * silently. */
  'packages/component/src/molecules/DocsToc.jsx',
]
const ROW_CLASS_RE = /\bshell-nav-item\b/
const RUNG_CLASSES = /\b(shell-sidebar-toggle|shell-nav-group-header)\b/
/* Anchored to JSX-TEXT position — `>({expr})<` — not a bare `({…})`, which
 * also matches a destructuring arrow param like `({ isActive }) =>`. The count
 * is the only thing that renders as parens-around-an-expression between tags. */
const HAND_COUNT = />\(\{[^}]*\}\)</

/* The left rail's section order. Re-ruled by the user 2026-08-09
 * ("components, sets, blocks etc. should be before Documentation"):
 * `02-shells.md:138` now states Components · Tools · Documentation ·
 * Operations. The vault eyebrows render dynamically (labelFromSlug), so the
 * literal check covers the showcase sections and VAULT_MARKER anchors the
 * vault block's position after them. */
const SECTION_ORDER = ['Components', 'Tools']
const VAULT_MARKER = 'vaultCategories.map'
const ORDER_FILE = 'showcase/src/lib/ShellChrome.jsx'

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

    /* R3 — one box owner per eyebrow. */
    if (IS_EYEBROW.test(line)) {
      const owners = EYEBROW_BOXES.filter((c) => new RegExp(`\\b${c}\\b`).test(line))
      if (owners.length > 1) {
        errors.push(
          `${relPath}:${i + 1}  ${owners.length} box owners on one eyebrow ` +
          `(${owners.join(' + ')}) — padding and margin belong to exactly one`
        )
      }
      if (owners.includes('shell-nav-group-header')) {
        errors.push(
          `${relPath}:${i + 1}  an eyebrow wearing 'shell-nav-group-header' — ` +
          `that is the NAV row's box; eyebrows use 'shell-sidebar-toggle' or 'shell-sidebar-label'`
        )
      }
    }
    if (INLINE_Y.test(line) && EYEBROW_BOXES.some((c) => new RegExp(`\\b${c}\\b`).test(line))) {
      errors.push(
        `${relPath}:${i + 1}  y-spacing set inline on a rail row — ` +
        `it belongs in the shared box rule, where both rails can read it`
      )
    }

    /* R4 — the rung is RailSection's to name, the row is RailRow's, and the
     * count is theirs to place. */
    if (!ROW_OWNERS.includes(relPath) && ROW_CLASS_RE.test(line) && /class(Name)?\s*=/.test(line)) {
      errors.push(
        `${relPath}:${i + 1}  'shell-nav-item' written by hand — rail rows come ` +
        `from <RailRow>, which owns the one row string`
      )
    }
    if (relPath !== LADDER_OWNER) {
      const rung = line.match(RUNG_CLASSES)
      if (rung && /class(Name)?\s*=/.test(line)) {
        errors.push(
          `${relPath}:${i + 1}  '${rung[0]}' written by hand — rail headers come ` +
          `from <RailSection level={1|2}>, which owns the rung's class AND its count`
        )
      }
      if (HAND_COUNT.test(line)) {
        errors.push(
          `${relPath}:${i + 1}  a count span placed by hand — pass \`count\` to ` +
          `RailSection so both rails put it on the same rung`
        )
      }
    }
  }
}

/* R4b — section order. Read outside the per-line walk: it is a property of the
 * file's whole sequence, not of any one row. */
{
  const src = readFileSync(join(REPO, ORDER_FILE), 'utf8')
  const seen = SECTION_ORDER
    .map((label) => ({ label, at: src.indexOf(`label="${label}"`) }))
    .filter((s) => s.at !== -1)
  const actual = [...seen].sort((a, b) => a.at - b.at).map((s) => s.label)
  const expected = SECTION_ORDER.filter((l) => actual.includes(l))
  if (actual.join(' > ') !== expected.join(' > ')) {
    errors.push(
      `${ORDER_FILE}  rail sections render '${actual.join(' > ')}' but ` +
      `02-shells.md:138 states '${expected.join(' > ')}' — the showcase ` +
      `sections outrank the written record (user ruling 2026-08-09)`
    )
  }
  /* The vault block (dynamic labels) must sit BELOW the last literal section —
   * the JSX return renders top-to-bottom, so file position is render position. */
  const vaultAt = src.indexOf(VAULT_MARKER, src.indexOf('shell-rail-stack'))
  const lastLiteral = Math.max(...seen.map((s) => s.at))
  if (vaultAt !== -1 && seen.length && vaultAt < lastLiteral) {
    errors.push(
      `${ORDER_FILE}  the vault eyebrows render above the showcase sections — ` +
      `02-shells.md:138 puts Documentation/Operations last (user ruling 2026-08-09)`
    )
  }
}

if (errors.length) {
  console.error(`rails: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('rails: clean (one row idiom, one label voice, one eyebrow box, one ladder)')
