#!/usr/bin/env node
/**
 * extract-origins — mines per-component IMPORT PROVENANCE from the lobby's
 * processed specs (wave-4 imported-from history, 2026-07-30).
 *
 * Every component that entered the DS through the lobby flow has a spec in
 * lobby/done/ whose frontmatter records where it came from and when:
 *
 *   component: ArticleCard
 *   source: kol-monorepo/apps/web/src/components/prose/cards/ArticleCard.jsx#L1-L53
 *   date: 2026-07-03
 *
 * Emits showcase/src/usage/component-origins.json:
 *   { ComponentName: { repo, source, date } }
 *
 * `repo` = the origin repo (first path/space segment of `source`); `source`
 * keeps the full authored string (some specs cite multiple files). Sibling of
 * component-sources.json (react-docgen pipeline) rather than a field inside
 * it — different source material, different cadence: this file only changes
 * when a lobby spec lands.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const DONE = join(REPO, 'lobby/done')
const OUT = join(REPO, 'showcase/src/usage/component-origins.json')

const fm = (raw, key) => {
  const m = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim() : null
}

const origins = {}
if (existsSync(DONE)) {
  for (const file of readdirSync(DONE).filter((f) => f.endsWith('.md')).sort()) {
    const raw = readFileSync(join(DONE, file), 'utf8')
    const component = fm(raw, 'component')
    const source = fm(raw, 'source')
    if (!component || !source) continue
    /* repo = first segment, split on path OR space ("kol-website apps/…") */
    const repo = source.split(/[/\s]/)[0]
    origins[component] = { repo, source, date: fm(raw, 'date') }
  }
}

writeFileSync(OUT, JSON.stringify(origins, null, 2) + '\n')
console.log(`extract-origins: ${Object.keys(origins).length} components → ${OUT.replace(REPO + '/', '')}`)
