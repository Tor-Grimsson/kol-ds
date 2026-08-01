#!/usr/bin/env node
/**
 * extract-styling.mjs — the STYLING CONTRACT, read off the source.
 *
 * THE GAP (user, 2026-08-01): every component page carried frontmatter, tags,
 * install, usage prose and a props table — and said nothing at all about the
 * thing a design system exists to define. No type class. No colour tokens. No
 * padding. No list of the classes the component actually emits. "Arguably much
 * more important information than much of the other."
 *
 * So this generates it. Per component:
 *
 *   classes  — every `kol-*` / component class the JSX emits
 *   type     — the type role it wears (kol-mono-*, kol-doc-*, kol-sans-*, …)
 *   tokens   — every `--kol-*` custom property its CSS rules read
 *
 * GENERATED, never authored (the extract-origins pattern). An authored styling
 * block is a second copy of the stylesheet that drifts the first time someone
 * edits CSS without opening the doc — which is precisely how the props table
 * came to advertise variants that had no hover.
 *
 * Emits showcase/src/usage/styling.json:
 *   { ComponentName: { classes: [...], type: [...], tokens: [...] } }
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(REPO, 'showcase/src/usage/styling.json')

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.jsx')) out.push(p)
  }
  return out
}

/* Every theme stylesheet as one string — which file defines a rule is not this
 * script's business, only what the rule reads. */
const themeDir = join(REPO, 'packages/theme')
const CSS = readdirSync(themeDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(themeDir, f), 'utf8'))
  .join('\n')

/* The tokens a class's own rules read. Walks each rule block that mentions the
 * class and collects its `var(--kol-*)` references — so the doc shows what the
 * component actually consumes rather than the whole palette. */
const tokensForClass = (cls) => {
  const found = new Set()
  const re = new RegExp(`\\.${cls}(?![\\w-])[^{]*\\{([^}]*)\\}`, 'g')
  let m
  while ((m = re.exec(CSS))) {
    for (const t of m[1].matchAll(/var\((--kol-[\w-]+)/g)) found.add(t[1])
  }
  return [...found]
}

const TYPE_RE = /\b(kol-(?:mono|helper|sans|doc)-[\w-]+)\b/g
const CLASS_RE = /\b((?:kol-|shell-|tag-|pill-|badge-|btn-|control-)[\w-]+)\b/g

const styling = {}
const SRC_DIRS = [
  'packages/component/src/atoms',
  'packages/component/src/molecules',
  'packages/component/src/organisms',
]

for (const dir of SRC_DIRS) {
  for (const file of walk(join(REPO, dir))) {
    const name = basename(file, '.jsx')
    const src = readFileSync(file, 'utf8')
    /* Comments stripped: a docstring naming another component's classes is
     * prose, not emitted markup. Same trap validate-chrome hit with Pill. */
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      /* Import specifiers are not markup — `@kolkrabbi/kol-icons` matched the
       * class pattern and every consumer listed `kol-icons` as a class. */
      .replace(/^\s*import[\s\S]*?from\s*'[^']*'/gm, '')

    const type = [...new Set([...code.matchAll(TYPE_RE)].map((m) => m[1]))].sort()
    const classes = [...new Set([...code.matchAll(CLASS_RE)].map((m) => m[1]))]
      .filter((c) => !type.includes(c))
      .sort()
    if (!classes.length && !type.length) continue

    /* Classes built from a template (`kol-tag--${size}`) cannot be read
     * literally. Recorded as a PREFIX so the doc says the family exists rather
     * than silently omitting it — an incomplete list that looks complete is
     * the failure this file is meant to end. */
    const dynamic = [...new Set(
      [...code.matchAll(/`((?:kol-|shell-|tag-|pill-)[\w-]*)\$\{/g)].map((m) => m[1] + '*')
    )].sort()

    const tokens = [...new Set(classes.flatMap(tokensForClass))].sort()
    styling[name] = { classes, dynamic, type, tokens }
  }
}

writeFileSync(OUT, JSON.stringify(styling, null, 2) + '\n')
const n = Object.keys(styling).length
const withTokens = Object.values(styling).filter((s) => s.tokens.length).length
console.log(`styling: ${n} components → showcase/src/usage/styling.json (${withTokens} with token references)`)
