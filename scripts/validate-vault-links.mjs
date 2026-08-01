#!/usr/bin/env node
/**
 * validate-vault-links.mjs — the wikilink gate (pnpm validate:vault-links).
 *
 * The vault is APP CONTENT: showcase/src/nav/vault.js globs docs/**\/*.md and
 * renders it by PATH. Obsidian resolves a bare `[[02-color|color]]` by scanning
 * the whole vault for that filename; the app cannot — it has a path or it has a
 * dead route. So a link can look perfect in the editor and be broken on the
 * site, which is precisely how fifteen of them survived unnoticed.
 *
 * The framework already states the rule (.kol/docs-framework/01-conventions.md,
 * "Wikilinks use the explicit-with-display form"). It had no gate, and on this
 * repo's own evidence an ungated rule is one that has already drifted — the
 * first run of this script found 17 dead links.
 *
 * Checks every `[[target|display]]` in docs/ resolves to a real file, relative
 * to the linking document. `\|` inside a markdown table is an escaped pipe, not
 * a link separator — the pattern tolerates it rather than reporting the whole
 * table as broken.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(REPO, 'docs')

/* Supporting-file folders hold no prose and author no wikilinks. */
const SKIP_DIR = new Set(['_assets', '_files'])

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || SKIP_DIR.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const errors = []
let checked = 0

for (const file of walk(DOCS)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  for (const [i, raw] of lines.entries()) {
    /* Strip inline code spans first: `[[target|display]]` inside backticks is
     * documentation OF the syntax, not a link. Without this, the conventions
     * doc that describes the rule fails the gate that enforces it. */
    const line = raw.replace(/`[^`]*`/g, '')
    /* target stops at the first `|` OR `\` — the latter is a table's escaped
     * pipe, which would otherwise be swallowed into the path. */
    for (const m of line.matchAll(/\[\[([^\]|\\]+)[\\]?\|/g)) {
      const target = m[1].trim()
      checked++
      const abs = resolve(dirname(file), target)
      if (existsSync(`${abs}.md`) || existsSync(abs)) continue
      errors.push(
        `${relative(REPO, file)}:${i + 1}  [[${target}|…]] resolves to nothing — ` +
        `use the path from THIS file (Obsidian finds it by name; the app cannot)`
      )
    }
  }
}

if (errors.length) {
  console.error(`vault-links: ${errors.length} violation(s) of ${checked} links\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`vault-links: clean (${checked} resolve)`)
