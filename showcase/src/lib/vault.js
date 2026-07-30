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

/* ── THE TAG INVENTORY ─────────────────────────────────────────────────────
 * What the tag overlay and the node graph read. It used to be VAULT alone, so
 * the graph could only ever draw the 46 markdown docs — every component page
 * was invisible to it no matter how well tagged, which made the graph a map of
 * a fraction of the system.
 *
 * The 66 component MDX pages join it here. They live in a different URL space,
 * so each entry carries its own `href` (the overlay prefers `d.href` over
 * `docHref(d.id)`); everything else matches the inventory shape buildInventory
 * emits, because the co-occurrence math only ever reads `id` + `metadata.tags`.
 *
 * The edges this produces are real: a component tagged `domain/typography`
 * shares a leaf with the typography reference, so they connect — which is the
 * whole point of tagging pages relative to their content rather than stamping
 * every one of them with the same pair.
 */
const MDX_DOC_MODULES = import.meta.glob('../docs/components/*.mdx', { eager: true })

export const MDX_DOCS = Object.entries(MDX_DOC_MODULES).map(([path, mod]) => {
  const name = (path.split('/').pop() || '').replace('.mdx', '')
  const meta = mod.meta ?? {}
  return {
    id: `component-${meta.slug ?? name.toLowerCase()}`,
    title: meta.title ?? name,
    file: path,
    href: `/components/${meta.slug ?? name.toLowerCase()}`,
    metadata: meta,
    headings: [],
  }
})

export const TAG_INVENTORY = [...VAULT, ...MDX_DOCS]
