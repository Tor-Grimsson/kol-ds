#!/usr/bin/env node
/**
 * validate-chrome.mjs — the variant/state lock (pnpm validate:chrome).
 *
 * THE LAW (user ruling 2026-08-01): **a declared variant must have a state.**
 *
 * Tag declared four variants and carried exactly ONE `:hover` rule between
 * them. Three of its four paths rendered dead, and nothing said so — the
 * component's own prop docs advertised looks that had no interaction. Worse,
 * `color` was a second axis that swapped the base class out from under
 * `variant`, so passing a colour silently cost the chip its hover. None of
 * that is visible from the JSX, and none of it is visible from the CSS: it
 * only exists in the JOIN between them, which is why no reviewer caught it
 * across three sessions.
 *
 * So the gate reads both sides and joins them:
 *
 *   C1  every class a component's variant map emits must EXIST in the theme
 *   C2  on an INTERACTIVE component, every one of those classes must carry a
 *       `:hover` rule
 *   C3  no ARBITRARY chrome values at a call site — radius, shadow, scrim and
 *       blur come from the scale, not from square brackets
 *
 * C3 was added 2026-08-01 after the search overlay shipped
 * `rounded-[var(--kol-radius-2xl)] shadow-[0_20px_60px_rgba(0,0,0,0.4)]
 * bg-black/60 backdrop-blur-[1px]` — four values, none referenced anywhere
 * else, and a 20px radius that appears NOWHERE in this repo's chrome (which
 * counts `sm` and `full`). It read as a foreign product because it was one.
 * The rule is the same one the width family already states: if no rung fits,
 * say so and add the token — do not improvise it at the call site.
 *
 * C2 is scoped to interactive components on purpose. Pill is STATIC by
 * contract — "a label, category, or status word. Not clickable." — and a
 * static chip with no hover is correct, not broken. Requiring a state there
 * would be the gate inventing a law nobody wrote; interactivity is read from
 * the source (an onClick/onRemove prop or a rendered <button>), not guessed.
 *
 * Scope is the components whose variant map is a plain literal — the ones a
 * regex can read honestly. A component whose variants are computed is skipped
 * rather than guessed at, and `log`ged so the exemption is visible instead of
 * silent. This gate is deliberately narrow and TRUE over broad and hopeful.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const skipped = []

/* Every theme stylesheet, concatenated — a class may be defined in any of
 * them, and which file is not the gate's business. */
const themeDir = join(REPO, 'packages/theme')
const CSS = readdirSync(themeDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(themeDir, f), 'utf8'))
  .join('\n')

const definesClass = (cls) => new RegExp(`\\.${cls}(?![\\w-])`).test(CSS)
const hasHover = (cls) => new RegExp(`\\.${cls}(?![\\w-])[^{,]*:hover`).test(CSS)

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.jsx')) out.push(p)
  }
  return out
}

/* A variant map: `const VARIANTS = { primary: 'kol-tag--primary', … }` or the
 * `variantClasses` spelling. Only object literals of string values. */
const MAP_RE = /const\s+(VARIANTS|variantClasses)\s*=\s*\{([^}]*)\}/s
const ENTRY_RE = /(\w+)\s*:\s*'([^']+)'/g

const componentDirs = [
  'packages/component/src/atoms',
  'packages/component/src/molecules',
]

let checkedComponents = 0
let checkedClasses = 0

for (const dir of componentDirs) {
  for (const file of walk(join(REPO, dir))) {
    const rel = relative(REPO, file)
    const src = readFileSync(file, 'utf8')
    if (!/variant\s*=/.test(src)) continue

    /* Interactive = it can be clicked. A static component's variants are
     * looks, not states, and demanding :hover of them is a false positive.
     *
     * Read from CODE, never from prose: Pill's own docstring explains Tag's
     * `onClick`/`onRemove`, so testing the raw source marked the one component
     * that is static by contract as interactive. Comments are stripped first. */
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    const isInteractive = /\bonClick\b|\bonRemove\b|'button'/.test(code)

    const map = code.match(MAP_RE)
    if (!map) {
      /* Declares a `variant` prop but its class map is not a plain literal —
       * computed, inlined in the className, or absent. Named out loud rather
       * than passed silently: a skip nobody can see is a false green. */
      skipped.push(rel)
      continue
    }
    checkedComponents++

    const seen = new Set()
    for (const [, name, cls] of map[2].matchAll(ENTRY_RE)) {
      if (seen.has(cls)) continue
      seen.add(cls)
      checkedClasses++

      if (!definesClass(cls)) {
        errors.push(
          `${rel}  variant '${name}' emits '.${cls}' — no such class in the theme`
        )
        continue
      }
      if (isInteractive && !hasHover(cls)) {
        errors.push(
          `${rel}  variant '${name}' ('.${cls}') has NO :hover rule — ` +
          `a declared variant must carry its state, or it renders dead`
        )
      }
    }
  }
}

/* ── C3 · arbitrary chrome values ──────────────────────────────────────────
 * Square-bracket Tailwind for radius/shadow, plus the scrim pair. Scoped to
 * PACKAGE source: the showcase is a consumer and may prototype. */
const ARBITRARY = [
  [/\brounded-\[[^\]]+\]/g, 'radius', 'use --kol-radius-* via a chrome class'],
  [/\bshadow-\[[^\]]+\]/g, 'shadow', 'use --kol-shadow-* via a chrome class'],
  [/\bbg-black\/\d+/g, 'scrim', 'use .kol-overlay-scrim'],
  [/\bbackdrop-blur-\[[^\]]+\]/g, 'blur', 'use .kol-overlay-scrim'],
]

for (const pkgDir of ['packages/component/src', 'packages/framework/src', 'packages/workshop/src']) {
  for (const file of walk(join(REPO, pkgDir))) {
    const rel = relative(REPO, file)
    const lines = readFileSync(file, 'utf8').split('\n')
    let fence = false
    for (const [i, line] of lines.entries()) {
      const t = line.trim()
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*') || t.startsWith('{/*')) continue
      for (const [re, kind, fix] of ARBITRARY) {
        re.lastIndex = 0
        const m = re.exec(line)
        if (!m) continue
        /* A bracket that REFERENCES the scale is the scale — `rounded-[var(
         * --kol-radius-sm)]` is compliant, just verbose. `inherit` is not a
         * value either: it defers to the parent's radius, which is exactly
         * what a nested overlay layer should do. */
        if (/var\(--kol-/.test(m[0]) || /\[inherit\]/.test(m[0])) continue
        errors.push(`${rel}:${i + 1}  arbitrary ${kind} '${m[0]}' — ${fix}`)
      }
    }
  }
}

if (skipped.length) {
  console.log(`chrome: ${skipped.length} component(s) skipped (variant map not a literal):`)
  for (const s of skipped) console.log('    ' + s)
}

if (errors.length) {
  console.error(`chrome: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`chrome: clean (${checkedClasses} variant classes across ${checkedComponents} components; interactive ones all carry :hover; no arbitrary chrome values)`)
