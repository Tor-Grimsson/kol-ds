#!/usr/bin/env node
/**
 * validate-icon-ink.mjs — an icon is inked on the OPAQUE ladder (pnpm validate:icon-ink).
 *
 * The law (user, repeated; 2026-09-23: *"you cant use fg on the icons, thats illegal, ruling, law!
 * … you see how the strokes overlap? … dont use fg use oq for icons."*). `fg-*` is ink at an ALPHA:
 * where two strokes of one glyph cross, the alpha stacks and the joint paints brighter than the
 * line. `oq-*` is the same tone, opaque, so a joint is invisible.
 *
 * WHY A GATE. The loader is not the cause — `Icon` paints `currentColor`, so the ink comes from
 * whatever class the call site puts on it or its wrapper, and every new call site is a new chance
 * to reach for `text-fg-48` out of habit. It was swept on 2026-09-23 and a bucket glyph came back
 * on `fg` the same day. A rule that has to be remembered is not a rule.
 *
 * THE RULES
 *
 *   I1  No `text-fg-NN` or fg ink ROLE (`text-meta`, `text-subtle`, `text-body`, `text-default`,
 *       `text-strong`, `text-lede`, `text-shout`, `text-scream`) in the className of an `<Icon>`,
 *       `<IconFrame>` or `<FileIcon>` tag. Use `text-oq-NN`. (`text-emphasis` is full ink — opaque
 *       already — and passes.)
 *   I2  No theme rule whose selector names an icon (`icon`, `svg`, `glyph`, `chevron`, `caret`) sets
 *       `color` from `--kol-fg-NN` or an fg role. Use `--kol-oq-NN`.
 *
 * A wrapper that holds ONLY an icon and carries the ink is the one shape this cannot see without a
 * parser; the sweep that minted this gate fixed the ones that existed. Put the ink on the icon.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FG_CLASS = /\btext-(fg-\d+|meta|subtle|body|default|strong|lede|shout|scream)\b/
const FG_VAR = /(?<!background-)color:\s*var\(--kol-fg-(\d+|meta|subtle|body|default|strong|lede|shout|scream)\)/
const ICON_SEL = /icon|svg|glyph|chevron|caret/i

function walk(dir, ext, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, ext, out)
    else if (e.endsWith(ext)) out.push(p)
  }
  return out
}

const errors = []
const jsx = [
  ...walk(join(ROOT, 'packages'), '.jsx'),
  ...walk(join(ROOT, 'apps'), '.jsx'),
  ...walk(join(ROOT, 'showcase', 'src'), '.jsx'),
]
let tags = 0
for (const f of jsx) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/<(Icon|IconFrame|FileIcon)\b[^>]*?\/>/gs)) {
    tags++
    const hit = m[0].match(FG_CLASS)
    if (hit) {
      const line = src.slice(0, m.index).split('\n').length
      errors.push(`${relative(ROOT, f)}:${line}  <${m[1]}> inked \`${hit[0]}\` — use \`text-oq-*\` (I1)`)
    }
  }
}

const css = walk(join(ROOT, 'packages'), '.css')
let rules = 0
for (const f of css) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].split('*/').pop().trim()
    if (!ICON_SEL.test(sel)) continue
    rules++
    const hit = m[2].match(FG_VAR)
    if (hit) {
      const line = src.slice(0, m.index + m[1].length).split('\n').length
      errors.push(`${relative(ROOT, f)}:${line}  \`${sel.slice(0, 60)}\` sets \`${hit[0]}\` — use \`--kol-oq-*\` (I2)`)
    }
  }
}

if (errors.length) {
  console.error(`icon-ink: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`icon-ink: clean (${tags} icon tags, ${rules} icon rules — all on the opaque ladder)`)
