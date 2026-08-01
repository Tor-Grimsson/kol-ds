/**
 * roster.js — the component roster, derived FROM THE PACKAGE BARRELS at
 * build time. Truthful by construction: an export appears here because it
 * exists in a package src barrel right now — there is no generated
 * JSON to go stale (usage-index.json is enrichment, joined in registry.js).
 *
 * Tier resolution:
 *   - kol-component: from the src folder (atoms/molecules/organisms/hooks).
 *   - kol-framework: 'framework' (split fw-chrome/structure/behavior in registry).
 *   - flat packages: from classification.js TIERS (validated for completeness
 *     by `pnpm validate:roster`). Unresolvable → 'misc' — the visible bug
 *     bucket (00-taxonomy: misc must stay empty) — and a red CI build.
 */
import { parseBarrelExports, isComponentName, folderOf } from '../../../scripts/lib/parse-barrel.mjs'
import { TIERS, EXEMPT } from './classification.js'
import { isComponentAdmitted } from './admitted.js'

const barrelTxts = import.meta.glob('../../../packages/*/src/**/index.js', {
  eager: true, query: '?raw', import: 'default',
})
const pkgJsons = import.meta.glob('../../../packages/*/package.json', {
  eager: true, import: 'default',
})

const TIER_FOLDERS = new Set(['atoms', 'molecules', 'organisms', 'hooks'])

/* group the raw glob into per-package { 'index.js': txt, 'shell/index.js': txt } */
const byPackage = {}
for (const [path, txt] of Object.entries(barrelTxts)) {
  const m = path.match(/packages\/([^/]+)\/src\/(.*)$/)
  if (!m) continue
  ;(byPackage[m[1]] ||= {})[m[2]] = txt
}

export const ROSTER = []
for (const [dir, files] of Object.entries(byPackage)) {
  if (!files['index.js']) continue
  const pkgJson = Object.entries(pkgJsons).find(([p]) => p.includes(`packages/${dir}/package.json`))?.[1]
  const pkg = pkgJson?.name || `@kolkrabbi/kol-${dir}`
  for (const { name, src } of parseBarrelExports(files)) {
    if (!isComponentName(name) && !/^use[A-Z]/.test(name)) continue
    /* re-export exemptions only suppress the non-owning copy — the owner's
     * row survives via first-owner dedup below */
    if (EXEMPT[name] && !EXEMPT[name].startsWith('re-export')) continue
    const folder = folderOf(src)
    /* Tier = PACKAGE for the flat packages (user ruling 2026-07-30): a
     * workshop shell piece is not an "atom", a dashboard card is not a
     * "molecule" — the atomic tiers belong to kol-component only. The old
     * hand-mapped TIERS put ShellSidebar in Atoms and DashTableCard in
     * Molecules; classification by ownership can't lie. */
    const tier =
      dir === 'component' ? (TIER_FOLDERS.has(folder) ? folder : 'misc')
      : dir === 'framework' ? 'framework'
      : dir
    // hooks by name convention land in the hooks tier regardless of folder
    const rowTier = /^use[A-Z]/.test(name) ? 'hooks' : tier
    /* Admission (quarantine plan, phase 1): a row is derived truthfully either
     * way — `admitted` decides whether the SIDEBAR shows it, never whether it
     * exists. The gate is hand-authored in admitted.js. */
    ROSTER.push({ name, pkg, src, tier: rowTier, admitted: isComponentAdmitted(rowTier) })
  }
}

/* one row per name — first-owner package wins (re-exports lose) */
const seen = new Set()
export const ROSTER_BY_NAME = {}
for (const row of ROSTER) {
  if (seen.has(row.name)) continue
  seen.add(row.name)
  ROSTER_BY_NAME[row.name] = row
}
