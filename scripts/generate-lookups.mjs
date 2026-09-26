#!/usr/bin/env node
/**
 * generate-lookups.mjs — the lookup pages, read out of the CSS.
 *
 * WHY THIS IS GENERATED. kol-website carries three hand-written cheat sheets
 * (`02-colors-cheat-sheet.md` et al). They were last touched 2025-11-08 and are
 * still tagged `project/kol-monorepo` — they describe a design system from
 * before this repo existed, and the user reads them as current. A hand-written
 * table of 200 values has exactly one failure mode and it is guaranteed.
 *
 * So the VALUES here are never typed. Every table is parsed out of the theme
 * CSS at build time; the prose around them is hand-written and lives in the
 * PREAMBLE map below. Re-run after any token change:  pnpm lookups
 *
 * A parse that finds nothing throws rather than emitting an empty table — a
 * silently short lookup is worse than none.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const theme = (f) => readFileSync(join(root, 'packages/theme', f), 'utf8')
const out = (f, s) => writeFileSync(join(root, 'docs/documentation/01-foundations', f), s)

const need = (arr, what) => {
  if (!arr.length) throw new Error(`generate-lookups: parsed 0 ${what} — the CSS shape changed`)
  return arr
}

/* ── parsers ──────────────────────────────────────────────────────────────── */

/** every `--name: value;` inside the first block matching `selector` */
const blockVars = (css, selector) => {
  const i = css.indexOf(selector)
  if (i === -1) return {}
  const open = css.indexOf('{', i)
  let depth = 0, end = open
  for (let k = open; k < css.length; k++) {
    if (css[k] === '{') depth++
    else if (css[k] === '}' && --depth === 0) { end = k; break }
  }
  const vars = {}
  for (const m of css.slice(open, end).matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
    vars[m[1]] = m[2].trim()
  }
  return vars
}

/** `.class { … }` → { class: {prop: value} } for classes matching `re` */
const classRules = (css, re) => {
  const rules = {}
  for (const m of css.matchAll(/^(\.[\w\\:.-]+)\s*\{([^}]*)\}/gm)) {
    const sel = m[1].replace(/\\/g, '')
    if (!re.test(sel)) continue
    const props = {}
    for (const d of m[2].matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) props[d[1]] = d[2].trim()
    rules[sel] = props
  }
  return rules
}

const t = (rows) => rows.map((r) => `| ${r.join(' | ')} |`).join('\n')
const head = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`
const table = (cols, rows) => `${head(cols)}\n${t(rows)}`

const fm = (title, desc, aliases, related, sources, date = '2026-09-03') => `---
title: ${title}
type: reference
status: canonical
created: ${date}
updated: ${date}
verified: ${date}
description: ${desc}
aliases:
${aliases.map((a) => `  - ${a}`).join('\n')}
sources:
${sources.map((s) => `  - ${s}`).join('\n')}
tags:
  - domain/tokens
  - audience/consumer
related:
${related.map((r) => `  - "${r}"`).join('\n')}
---

> **Generated** by \`pnpm lookups\` from the theme CSS — every value below is
> parsed, never typed. Edit the token, re-run, do not hand-edit this file.
`

/* ── colour ───────────────────────────────────────────────────────────────── */

const base = theme('kol-base-tokens.css')
const color = theme('kol-color.css')
const brand = readFileSync(join(root, 'packages/framework/kol-brand-color.css'), 'utf8')

const light = blockVars(base, ':root,\n:is([data-theme="light"], .light)')
const dark = blockVars(base, ':is([data-theme="dark"], .dark)')
const surfaces = need(
  Object.keys(light).filter((k) => k.startsWith('--kol-surface-')),
  'surface tokens',
).map((k) => [`\`${k}\``, `\`${dark[k] ?? light[k]}\``, `\`${light[k]}\``])

const ab = need(
  Object.entries(light).filter(([k]) => k.startsWith('--kol-color-ab-')),
  'absolute colours',
).map(([k, v]) => [`\`${k}\``, `\`${v}\``, 'theme-invariant'])

const uiRoot = blockVars(color, ':root {')
const uiDark = blockVars(base, ':root[data-theme="dark"],\n:root.dark,\n.dark')
const uiState = need(
  Object.keys(uiRoot).filter((k) => k.startsWith('--ui-')),
  'ui-state tokens',
).map((k) => [`\`${k}\``, `\`${uiDark[k] ?? '—'}\``, `\`${uiRoot[k]}\``])

const ramps = {}
for (const m of brand.matchAll(/--kol-color-(\w+)-(\d00):\s*(#[0-9A-Fa-f]{6})/g)) {
  ;(ramps[m[1]] ??= {})[m[2]] = m[3]
}
const rampNames = need(Object.keys(ramps), 'brand ramps')
const rampRows = ['100', '200', '300', '400', '500'].map((stop) => [
  stop, ...rampNames.map((n) => (ramps[n][stop] ? `\`${ramps[n][stop]}\`` : '—')),
])

const accents = need(
  Object.entries(blockVars(brand, ':root {\n  --kol-accent-primary')).filter(([k]) => k.startsWith('--kol-accent-')),
  'accent tokens',
).map(([k, v]) => [`\`${k}\``, `\`${v}\``])

out('11-color-lookup.md', fm(
  'Color lookup', 'Every surface, accent, state and ramp value',
  ['color-lookup', 'colors-lookup', 'color-values'],
  ['[[02-color|color]]', '[[10-opacity|opacity]]', '[[01-tokens|tokens]]'],
  ['packages/theme/kol-base-tokens.css', 'packages/theme/kol-color.css', 'packages/framework/kol-brand-color.css'],
) + `
# Color lookup

Hue and surface values. **Ink weight is not here** — the \`fg-*\` / \`oq-*\`
ladders and the eight ink roles live in [[10-opacity|opacity]], because they are
neutral ink at a strength rather than colour.

## Surfaces

${table(['Token', 'Dark', 'Light'], surfaces)}

## Absolutes

Theme-invariant poles. \`ab\` is pure; \`--kol-color-white/black\` are the
theme's own near-white and near-black.

${table(['Token', 'Value', 'Flips?'], ab)}

## Accents

Bound by \`kol-brand-color.css\`. Without it the DS is brand-neutral and the
accent falls back to surface ink.

${table(['Token', 'Resolves to'], accents)}

## State

${table(['Token', 'Dark', 'Light'], uiState)}

## Ramps

${table(['Stop', ...rampNames.map((n) => n[0].toUpperCase() + n.slice(1))], rampRows)}
`)

/* ── typography ───────────────────────────────────────────────────────────── */

const typo = theme('kol-typography.css')
const monoCls = theme('kol-type-mono-classes.css')
const roles = theme('kol-type-roles.css')

const typeRow = (sel, p) => [
  `\`${sel}\``,
  `\`${(p['font-family'] || 'inherit').replace(/var\(--kol-font-family-([\w-]+)\)/, '$1')}\``,
  p['font-size'] ? `\`${p['font-size'].replace(/var\(--kol-text-([\w-]+)\)/, '$1')}\`` : '—',
  p['line-height'] ?? '—',
  p['font-weight'] ?? '—',
  p['letter-spacing'] ?? '—',
  p['text-transform'] ?? '—',
]
const cols = ['Class', 'Family', 'Size', 'Line height', 'Weight', 'Tracking', 'Transform']

const mono = classRules(monoCls, /^\.kol-mono-\d+$/)
const helper = classRules(monoCls, /^\.kol-helper-\d+$/)
const monoRole = classRules(monoCls, /^\.kol-mono-(heading|display)-/)
const sans = classRules(typo, /^\.kol-sans-/)
const roleCls = classRules(roles, /^\.kol-(doc|card|eyebrow)/)

const bySize = (o) => Object.entries(o).sort((a, b) =>
  (parseInt(a[0].match(/\d+/)?.[0] ?? 0) - parseInt(b[0].match(/\d+/)?.[0] ?? 0)))

const scaleTok = {}
for (const m of typo.matchAll(/^\s*(--kol-text-[\w-]+):\s*(\d+px);/gm)) scaleTok[m[1]] = m[2]

out('12-typography-lookup.md', fm(
  'Typography lookup', 'Every type class, with its real values',
  ['typography-lookup', 'type-lookup', 'type-values'],
  ['[[03-typography|type classes]]', '[[09-sizes|sizes]]'],
  ['packages/theme/kol-typography.css', 'packages/theme/kol-type-mono-classes.css', 'packages/theme/kol-type-roles.css'],
) + `
# Typography lookup

The fault line decides which family you want: **\`kol-helper-*\` is
\`line-height: 1\`** and takes single-line chrome only; everything else carries
leading and takes anything that can wrap. See [[03-typography|type classes]].

## Mono

${table(cols, need(bySize(mono), 'mono classes').map(([s, p]) => typeRow(s, p)))}

## Helper

Single-line chrome. Weight 500, no leading, letter-spaced.

${table(cols, need(bySize(helper), 'helper classes').map(([s, p]) => typeRow(s, p)))}

## Mono roles

${table(cols, need(Object.entries(monoRole), 'mono role classes').map(([s, p]) => typeRow(s, p)))}

## Sans

${table(cols, need(Object.entries(sans), 'sans classes').map(([s, p]) => typeRow(s, p)))}

## Roles

${table(cols, need(Object.entries(roleCls), 'role classes').map(([s, p]) => typeRow(s, p)))}

## Size tokens

Mobile values. Display and \`heading-01\` step up at 768 and 1280 — see
\`kol-typography.css\`.

${table(['Token', 'Mobile'], need(Object.entries(scaleTok), 'type tokens').map(([k, v]) => [`\`${k}\``, `\`${v}\``]))}
`)

console.log('lookups: 11-color-lookup.md · 12-typography-lookup.md')

/* ── opacity ──────────────────────────────────────────────────────────────── */

const opacity = theme('kol-opacity.css')
const opaque = theme('kol-opaque.css')

/* the ink roles — each is an alias onto one numeric stop */
const roleRows = need(
  [...opacity.matchAll(/^\s*(--kol-fg-(?:subtle|meta|body|lede|strong|shout|scream|emphasis|default)):\s*var\((--[\w-]+)\);/gm)],
  'ink roles',
).map((m) => [`\`${m[1]}\``, `\`${m[2]}\``])

/* every ladder family and its stops, counted from the declarations */
const famStops = {}
for (const css of [opacity, opaque]) {
  for (const m of css.matchAll(/^\s*(--kol-(?:fg|oq)[a-z-]*?)-(\d{2,3})\s*:/gm)) {
    ;(famStops[m[1]] ??= new Set()).add(Number(m[2]))
  }
}
const FLIP = {
  '--kol-fg': 'ink', '--kol-fg-inverse': 'ink', '--kol-oq': 'ink', '--kol-oq-inverse': 'ground',
  '--kol-fg-ab': 'ground', '--kol-oq-ab': 'ground', '--kol-fg-ab-inverse': 'ink', '--kol-oq-ab-inverse': 'ink',
  '--kol-fg-absolute': 'frozen', '--kol-oq-absolute': 'frozen',
  '--kol-fg-absolute-inverse': 'frozen', '--kol-oq-absolute-inverse': 'frozen',
}
const famRows = need(Object.keys(famStops).sort(), 'ladder families').map((f) => {
  const st = [...famStops[f]].sort((a, b) => a - b)
  return [`\`${f}-*\``, st.length, FLIP[f] ?? '—', f.startsWith('--kol-oq') ? 'opaque' : 'translucent',
          `\`${String(st[0]).padStart(2, '0')}\`…\`${st.at(-1)}\``]
})

const utilFams = need(
  [...new Set([...opacity.matchAll(/^\.(bg|text|border)-((?:fg|oq)[a-z-]*?)-\d{2,3}\s*\{/gm),
               ...opaque.matchAll(/^\.(bg|text|border)-((?:fg|oq)[a-z-]*?)-\d{2,3}\s*\{/gm)]
    .map((m) => m[2]))].sort(),
  'utility families',
)

out('10-opacity-lookup.md', fm(
  'Opacity lookup', 'Every ink ladder, role and stop',
  ['opacity-lookup', 'opacity', 'ladders', 'ink-lookup'],
  ['[[01-tokens|tokens]]', '[[11-color-lookup|color lookup]]', '[[09-size-lookup|size lookup]]'],
  ['packages/theme/kol-opacity.css', 'packages/theme/kol-opaque.css'],
) + `
# Opacity lookup

**Colour is hue; this is ink weight.** [[11-color-lookup|Color]] holds the
surfaces and ramps. Everything here is the theme's own ink at a strength, over
something.

## Ink roles

Eight names, each an alias onto one numeric stop. A role is a position on the
ladder, never a colour.

${table(['Role', 'Stop'], roleRows)}

## Ladders

\`fg\` mixes ink into **transparent**; \`oq\` mixes it into the **surface**, so
\`oq\` is opaque and safe over media. \`ab\` mixes between pure \`#000\`/\`#fff\`,
\`absolute\` between the theme's own near-black and near-white.

${table(['Family', 'Stops', 'Flips toward', 'Kind', 'Range'], famRows)}

## Utilities

\`bg-\` · \`text-\` · \`border-\` on every family and stop, plus \`hover:\`
variants on the standard and inverse tiers:

${utilFams.map((f) => `\`${f}-*\``).join(' · ')}
`)

/* ── sizes ────────────────────────────────────────────────────────────────── */

const atoms = theme('kol-components-atoms.css')
const mols = theme('kol-components-molecules.css')
const SIZES = ['xs', 'sm', 'md', 'lg']
const MONO = { xs: 8, sm: 12, md: 14, lg: 16 }

const px = (s) => Number(String(s).replace('px', ''))
const padOf = (css, re) => Object.fromEntries(SIZES.map((s) => {
  const m = css.match(new RegExp(`^\\.${re}-${s} \\{ padding: (\\d+)px (\\d+)px`, 'm'))
  return [s, m ? Number(m[1]) : null]
}))
const pinOf = (css, re, prop = 'height') => Object.fromEntries(SIZES.map((s) => {
  const m = css.match(new RegExp(`${re.replace('{s}', s)}[^}]*${prop}: (\\d+)px`, 'm'))
  return [s, m ? Number(m[1]) : null]
}))

const lh = Object.fromEntries(SIZES.map((s) => {
  const m = monoCls.match(new RegExp(`\\.kol-mono-${MONO[s]} \\{[^}]*line-height: (\\d+)px`, 'm'))
  return [s, Number(m[1])]
}))
const ctlPad = padOf(atoms, 'kol-control')
const derived = Object.fromEntries(SIZES.map((s) => [s, ctlPad[s] * 2 + lh[s] + 2]))
const iconBtn = pinOf(atoms, '\\.kol-btn-icon\\.kol-btn-{s} \\{')
const iconFrame = pinOf(atoms, '\\.kol-icon-frame-{s} \\{')
const ddTrig = pinOf(mols, '\\.kol-dd-trigger\\.kol-btn-{s} \\{')
const segH = Object.fromEntries(SIZES.map((s) => {
  if (s === 'md') return [s, px(mols.match(/\.kol-seg \{[^}]*height: (\d+)px/m)[1])]
  const m = mols.match(new RegExp(`\\.kol-seg--${s} \\{ height: (\\d+)px`, 'm'))
  return [s, m ? Number(m[1]) : null]
}))

const row = (name, o) => [name, ...SIZES.map((s) => (o[s] == null ? '—' : `**${o[s]}**`))]
const ladders = readFileSync(join(root, 'packages/component/src/hooks/glyphLadders.js'), 'utf8')
const glyph = (n) => {
  const m = ladders.match(new RegExp(`export const ${n} = \\{([^}]*)\\}`))
  const o = Object.fromEntries([...m[1].matchAll(/(\w+):\s*(\d+)/g)].map((x) => [x[1], x[2]]))
  return [n, ...SIZES.map((s) => o[s] ?? '—')]
}

const mismatched = SIZES.filter((s) =>
  new Set([derived[s], iconBtn[s], iconFrame[s], ddTrig[s], segH[s]].filter((v) => v != null)).size > 1)

out('09-size-lookup.md', fm(
  'Size lookup', 'One height per size, every family',
  ['size-lookup', 'sizes', 'size-ladder', 'control-sizes'],
  ['[[../03-components/05-control-chrome|control chrome law]]', '[[12-typography-lookup|type lookup]]'],
  ['packages/theme/kol-components-atoms.css', 'packages/theme/kol-components-molecules.css', 'packages/component/src/hooks/glyphLadders.js'],
) + `
# Size lookup

**A size is a HEIGHT**, and every control family hits the same number at the
same size — so a Button, a Dropdown and an Input in one row are one box (user
ruling 2026-09-03: *"xs sm md and lg all have height in pixels that has to
match"*).

## Heights

${table(['Family', ...SIZES], [
  row('`.kol-control` (Input, Textarea, Search…)', derived),
  row('Button, text', derived),
  row('Button `iconOnly`', iconBtn),
  row('IconFrame', iconFrame),
  row('Dropdown trigger', ddTrig),
  row('SegmentedToggle', segH),
])}

${mismatched.length
  ? `> ⚠️ **MISMATCH at ${mismatched.join(', ')}** — the families disagree. One height per size is the law; see the control chrome page.`
  : '> ✅ All families agree at all four sizes.'}

## Derivation

Padding-driven families derive it; pinned boxes copy the derived number because
they have no line box of their own.

${table(['Size', 'Padding', 'Type', 'Line height', '+ ring', '= height'],
  SIZES.map((s) => [s, `\`${ctlPad[s]}px\``, `\`kol-mono-${MONO[s]}\``, `${lh[s]}px`, '2px', `**${derived[s]}**`]))}

## Glyphs

Glyphs are their own scale and never follow the box. \`iconSize\` overrides
either ladder and is almost always a mistake — change the size, not the glyph.

${table(['Ladder', ...SIZES], [glyph('SOLO'), glyph('ADJACENT'), glyph('INDICATOR')])}
`)

/* ── tones ────────────────────────────────────────────────────────────────── */

const molecules = theme('kol-components-molecules.css')
/* the RULE for `.kol-tone-<name>` — anchored at a line start and followed by `,` or `{`, so the
 * comments that NAME the class never match */
const toneVars = (name) => {
  const m = new RegExp(`^\\.kol-tone-${name}\\s*[,{]`, 'm').exec(molecules)
  if (!m) return {}
  return blockVars(molecules.slice(m.index), `.kol-tone-${name}`)
}
/* ORDER IS DEPTH (user, 2026-09-26): how far the fill sits from the page — sunken below it,
 * secondary the page itself, then up to the ink. Dark theme reads darkest → brightest, light the
 * other way; the list is the same because sunken is below the page in both. Outline and ghost
 * paint no fill and sit apart. */
const FILLED = ['sunken', 'secondary', 'primary', 'grey', 'inverted']
const UNFILLED = ['outline', 'ghost']
const resolve = (v, map) => {
  const tok = /^var\((--kol-surface-[\w-]+)\)$/.exec(v)?.[1]
  return tok && map[tok] ? `\`${map[tok]}\`` : '—'
}
const toneRow = (name) => {
  const v = toneVars(name)
  if (!v['--kol-tone-bg']) throw new Error(`generate-lookups: no --kol-tone-bg for .kol-tone-${name}`)
  const bg = v['--kol-tone-bg']
  return [`\`kol-tone-${name}\``, `\`${bg}\``, resolve(bg, dark), resolve(bg, light), `\`${v['--kol-tone-fg'] ?? '—'}\``]
}
const TONE_COLS = ['Tone', 'Fill', 'Dark', 'Light', 'Ink']

out('13-tone-lookup.md', fm(
  'Tone lookup', 'The seven control tones, ordered by depth',
  ['tone-lookup', 'tones-lookup', 'tone-values'],
  ['[[../03-components/05-control-chrome|control chrome]]', '[[11-color-lookup|color lookup]]', '[[10-opacity-lookup|opacity lookup]]'],
  ['packages/theme/kol-components-molecules.css', 'packages/theme/kol-base-tokens.css'],
  '2026-09-26',
) + `
# Tone lookup

A tone is the ground a control sits on — one \`kol-tone-*\` class on a wrapper tones
every control inside it that passes no tone of its own. The rules are in
[[../03-components/05-control-chrome|control chrome]] § Tone; the live visualiser is
the showcase's \`/foundations/tones\`.

## Filled

Ordered by how far the fill sits from the page: **sunken** is below it,
**secondary** is the page itself, then up to **inverted**, the text colour as fill.
In the dark theme that reads darkest → brightest; in the light theme the same list
runs the other way. **The names cross:** tone \`primary\` paints \`surface-secondary\`,
tone \`secondary\` paints \`surface-primary\`.

${table(TONE_COLS, FILLED.map(toneRow))}

## Unfilled

No fill of their own — the control shows the ground through it.

${table(TONE_COLS, UNFILLED.map(toneRow))}
`)

console.log('lookups: 09-size-lookup.md · 10-opacity-lookup.md · 13-tone-lookup.md')
