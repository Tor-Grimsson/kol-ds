#!/usr/bin/env node
/**
 * validate-fences.mjs — every code fence declares a language (pnpm validate:fences).
 *
 * The law (user ruling 2026-08-01): *"lanugaage, then always declare a language"*.
 *
 * WHY IT EXISTS. A vault fence renders through `CodeBlock`, and `CodeBlock`
 * falls back to `language: 'text'` when none is given. A `'text'` block draws
 * **no chip** — `CodeBlock.jsx` hides the filename/language row when the
 * language is the fallback, because a chip reading "text" is worse than none.
 * The result is an unlabelled slab: no highlighting, no language, nothing
 * saying what the reader is looking at. That is what the user screenshotted,
 * and the block was not at fault — the fence was.
 *
 * 14 of the vault's fences were bare on the day this was written.
 *
 * The check is on the SOURCE, same reason as validate-headings and
 * validate-metadata: labelling in the renderer would guess, and a guess that
 * renders is indistinguishable from an author's choice.
 *
 * `text` IS a legal language. It says "this is not code" deliberately — a
 * token list, a tree diagram, a shape sketch. The rule is that the author
 * chooses; it is not that everything must be a programming language.
 *
 * Scope: the docs/ vault. `.kol/` is agent state and does not render.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = join(REPO, 'docs')

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === '_files' || name === '_assets') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const errors = []
let checked = 0

for (const file of walk(VAULT)) {
  const rel = relative(REPO, file)
  const lines = readFileSync(file, 'utf8').split('\n')
  let open = false

  for (const [i, line] of lines.entries()) {
    const m = line.match(/^\s*```(.*)$/)
    if (!m) continue

    if (!open) {
      /* An OPENING fence. Its info string is the language. */
      open = true
      checked++
      if (!m[1].trim()) {
        errors.push(`${rel}:${i + 1}  fence declares no language — it renders as an unlabelled slab with no highlighting. \`text\` is legal and means "not code".`)
      }
    } else {
      /* A CLOSING fence carries nothing; anything on it would be a nested
       * opener we cannot resolve, so it is left alone deliberately. */
      open = false
    }
  }

  if (open) errors.push(`${rel}  unclosed code fence`)
}

if (errors.length) {
  console.error(`fences: ${errors.length} violation(s) of ${checked} fences\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`fences: clean (${checked} fences, every one declares a language)`)
