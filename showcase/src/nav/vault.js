import { buildInventory, fileLabel } from '@kolkrabbi/kol-workshop/engine'
import { CHAPTER_PAGES } from './chapter-pages.js'

/* The rail's label for a doc: its FILENAME (user ruling 2026-08-01). The tree
 * mirrors `docs/` on disk, so a row is named what the file is named — read
 * `fileLabel` in the engine for what reading the H1 instead cost us. */
const railTitle = (d) => fileLabel(d.file)

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

/* Sidebar tree — grouped by the CHAPTER the doc lives in. Folder-based, so
 * unnumbered docs can never silently vanish (the 07-29 numeric-grouping trap).
 *
 * Chapters resolve for EVERY docs/ root (2026-07-31), not only documentation/.
 * The old key hardcoded `segs[0] === 'documentation'` and collapsed every other
 * root into a single group — so operations' four chapters rendered as loose
 * siblings, and the code asserted that only one category can have chapters.
 * That assertion is exactly what let a chapter be mistaken for a category on
 * 2026-07-30. Rule: docs/<category>/<chapter>/… — see
 * docs/operations/04-content-pipeline/02-taxonomy.md. */
const relPath = (file) => file.replace(/^.*?docs\//, '')

/* Title-Case group labels (2026-07-30 — lowercase folder names read as raw
 * slugs next to the Components tree's Title-Case groups). Authored casing at
 * the data layer, no CSS transform. */
const label = (seg) => {
  const words = seg.replace(/^\d+-/, '').replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/* The OFF_TREE filter is GONE (2026-07-31). It hid the 219 generated usage
 * docs from the tree while they stayed bundled, searchable and routable — a
 * stopgap for a folder that should never have been in the vault. The
 * generators now emit to showcase/src/usage/components/ and docs/ is back to
 * its authored spine, so there is nothing left to filter. Filtering a symptom
 * is not the same as moving the cause; see
 * docs/operations/04-content-pipeline/01-sources.md. */
export const VAULT_TREE = (() => {
  const groups = new Map()
  for (const d of VAULT) {
    const segs = relPath(d.file).split('/')
    /* A chapter's own subfolders (06-research/workflows/) fold INTO the
     * chapter — the taxonomy has three levels, so a nested folder is an
     * authoring convenience, not a fourth rung. */
    const key = segs.length === 1
      ? '_root'
      : segs.length > 2
        ? `${segs[0]}/${segs[1]}`
        : segs[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(d)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, docs]) => {
      const segs = key.split('/')
      /* `chapter` is null for a category ROOT group (docs/documentation/*.md
       * or docs/*.md) — those are not chapters and must not be matched by a
       * chapter gate. Carried as a field rather than re-derived from the id:
       * parsing `vault-documentation` back into a chapter name yields garbage,
       * and a gate reading garbage fails open. */
      const chapter = segs.length > 1 ? segs[1] : null
      return {
        id: `vault-${key.replace(/\//g, '-')}`,
        category: key === '_root' ? null : segs[0],
        chapter,
        label: key === '_root' ? 'Root' : label(chapter ?? segs[0]),
        children: [
          ...docs
            .slice()
            .sort((a, b) => a.file.localeCompare(b.file))
            /* `railTitle`, not `d.title` — the rail row keeps the NAME and
             * drops the subtitle after the em dash (user ruling 2026-08-01).
             * SEARCH still reads the full `d.title` below, deliberately: a
             * reader hunting "the two families" must still find Type classes.
             * Shortening is a rail-label decision, not a rename. */
            .map((d) => ({ id: `vd-${d.id}`, label: railTitle(d), path: vaultDocHref(d.id) })),
          /* Slot-pages: React routes that belong to this chapter but are not
           * markdown in it — the "a page is a slot" ruling. They sort AFTER the
           * authored docs because the chapter's written spine is what a reader
           * follows; the live pages are instruments hung off it. */
          ...(CHAPTER_PAGES[chapter] ?? []).map((p) => ({
            id: p.id,
            label: p.label,
            path: p.path,
          })),
        ],
      }
    })
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
