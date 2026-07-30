import { buildInventory } from '@kolkrabbi/kol-workshop/engine'

/**
 * THE VAULT — the repo's own docs/ library, loaded into the main shell
 * (user order, delivered 2026-07-30): every markdown doc under docs/,
 * inventoried by the workshop engine and rendered by DocumentationReader
 * with the real frontmatter panel — the kolkrabbi.io/workshop model, fed
 * this repo's content through the package's content-injection seam.
 */
export const VAULT_MODULES = import.meta.glob('../../../docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const VAULT = buildInventory(VAULT_MODULES)

/* Own URL space — Documentation is a SYSTEM (user ruling 2026-07-30), a
 * top-level area beside Components, never a child page under Docs. */
export const vaultDocHref = (id) => `/documentation/${id}`

/* Sidebar tree — grouped by the folder the doc lives in: docs/documentation's
 * numbered folders become their own groups (the vault's real spine); every
 * other docs/ root (operations, usage, …) is one group. Folder-based, so
 * unnumbered docs can never silently vanish (the 07-29 numeric-grouping trap). */
const relPath = (file) => file.replace(/^.*?docs\//, '')

/* Title-Case group labels (2026-07-30 — lowercase folder names read as raw
 * slugs next to the Components tree's Title-Case groups). Authored casing at
 * the data layer, no CSS transform. */
const label = (seg) => {
  const words = seg.replace(/^\d+-/, '').replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export const VAULT_TREE = (() => {
  const groups = new Map()
  for (const d of VAULT) {
    const segs = relPath(d.file).split('/')
    const key = segs.length === 1
      ? '_root'
      : segs[0] === 'documentation'
        ? (segs.length > 2 ? `documentation/${segs[1]}` : 'documentation')
        : segs[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(d)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, docs]) => ({
      id: `vault-${key.replace(/\//g, '-')}`,
      label: key === '_root' ? 'Root' : label(key.split('/').pop()),
      children: docs
        .slice()
        .sort((a, b) => a.file.localeCompare(b.file))
        .map((d) => ({ id: `vd-${d.id}`, label: d.title, path: vaultDocHref(d.id) })),
    }))
})()

export const VAULT_SEARCH_ITEMS = VAULT.map((d) => ({
  label: d.title,
  path: vaultDocHref(d.id),
  tags: d.metadata?.tags || [],
  /* extracted by buildInventory (workshop ≥0.3.5) — search matches doc
   * CONTENT, not just title/tags (wave-4 parity). */
  headings: d.headings || [],
  keywords: [],
}))
