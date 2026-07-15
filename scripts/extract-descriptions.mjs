#!/usr/bin/env node
/**
 * extract-descriptions.mjs — derive each component's one-line description from
 * its OWN JSDoc header (2026-07-15 audit P1-5: hand-authored one-liners rot —
 * ThemeToggle's described behavior that changed the same day).
 *
 * Convention mined: component files open their JSDoc with `Name — sentence.`
 * We take the first sentence after the em-dash. No match → no entry; the
 * registry falls back to the authored DESCRIPTIONS map, so prose coverage
 * never regresses — it just self-heals wherever a JSDoc exists.
 *
 * Emits showcase/src/usage/descriptions.json. Runs in `pnpm build` before
 * vite, so the deployed site always carries source-fresh prose.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName } from './lib/parse-barrel.mjs'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const PKGS = join(REPO, 'packages')

/* first sentence of the JSDoc block that introduces `name` in `txt` */
function extractSentence(txt, name) {
  /* accept `ThemeToggle —`, `Theme toggle —`, `theme-toggle —` — authors
   * write the display form of the name, not always the export identifier */
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1[ -]?$2')
  for (const m of txt.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
    const body = m[1].split('\n').map((l) => l.replace(/^\s*\*? ?/, '')).join('\n').trim()
    const intro = body.match(new RegExp(`(?:^|\\n)${spaced}\\s+—\\s+([\\s\\S]*)`, 'i'))
    if (!intro) continue
    const flat = intro[1].replace(/\s*\n\s*/g, ' ')
    const sentence = (flat.match(/^.*?[.!?](?=\s|$)/) || [flat.split('\n')[0]])[0].trim()
    if (!sentence) continue
    return sentence.charAt(0).toUpperCase() + sentence.slice(1)
  }
  return null
}

const out = {}
for (const dir of readdirSync(PKGS)) {
  const src = join(PKGS, dir, 'src')
  if (!existsSync(join(src, 'index.js'))) continue
  const files = {}
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name)
      if (e.isDirectory() && e.name !== 'node_modules') walk(full)
      else if (e.name === 'index.js') files[relative(src, full)] = readFileSync(full, 'utf8')
    }
  }
  walk(src)
  for (const { name, src: ref } of parseBarrelExports(files)) {
    if (!isComponentName(name) || out[name]) continue
    const file = join(src, ref.replace(/^\.\//, ''))
    if (!existsSync(file)) continue
    const sentence = extractSentence(readFileSync(file, 'utf8'), name)
    if (sentence) out[name] = sentence
  }
}

const dest = join(REPO, 'showcase/src/usage/descriptions.json')
writeFileSync(dest, JSON.stringify(out, null, 2))
console.log(`descriptions: ${Object.keys(out).length} extracted from JSDoc → showcase/src/usage/descriptions.json`)
