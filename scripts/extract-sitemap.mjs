#!/usr/bin/env node
/**
 * extract-sitemap.mjs — write public/sitemap.xml from the showcase rail's own
 * paths (showcase/src/nav/shell-nav.js), so the sitemap follows the nav.
 * The same pages robots.txt disallows are left out. Runs in `pnpm build`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://ui.kolkrabbi.io'
const SKIP = /^\/(quarantine|development|search\/results)/

const nav = readFileSync(join(REPO, 'showcase/src/nav/shell-nav.js'), 'utf8')
const paths = [...new Set(['/', ...[...nav.matchAll(/path: '(\/[^']*)'/g)].map((m) => m[1])])]
  .filter((p) => !SKIP.test(p))
  .sort()

// ponytail: rail paths only — /components/:slug etc. are not listed; read the registries if indexing them matters
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${ORIGIN}${p}</loc></url>`).join('\n')}
</urlset>
`
writeFileSync(join(REPO, 'public/sitemap.xml'), xml)
console.log(`sitemap: ${paths.length} urls → public/sitemap.xml`)
