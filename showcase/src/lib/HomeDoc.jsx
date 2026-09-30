import { DocumentationReader, usePageMeta } from '@kolkrabbi/kol-workshop'
import { buildInventory } from '@kolkrabbi/kol-markdown'
import { vaultDocHref } from '../nav/vault.js'
import { useFrontmatter } from './frontmatter.jsx'

/**
 * HomeDoc — a space's or a chapter's HOME, written as markdown (2026-09-30, the names audit:
 * *"every level has a home … so we can tag the top level … and they can be favorited"*).
 *
 * The homes live in `src/homes/*.md` with the kol-docs frontmatter, and render through the same
 * reader as the vault — so a home has tags, a TOC and a frontmatter panel like any doc. The panel
 * starts hidden on a home and `F` shows it (`lib/frontmatter.jsx`). A page renders its home at the
 * top and its live content (the grid, the tables) below.
 */
export const HOME_MODULES = import.meta.glob('../homes/*.md', { eager: true, query: '?raw', import: 'default' })
export const HOMES = buildInventory(HOME_MODULES)

export default function HomeDoc({ id }) {
  const show = useFrontmatter('home')
  /* the page's rail lists the page's headings; the home hands it its frontmatter tags */
  usePageMeta({ tags: HOMES.find((d) => d.id === id)?.metadata?.tags ?? [], related: [] })
  return (
    <DocumentationReader
      inventory={HOMES}
      modules={HOME_MODULES}
      docId={id}
      showFrontmatter={show}
      rail={false}
      docHref={vaultDocHref}
      routes={{ docsIndex: '/docs', components: '/components', docFilePath: (d) => `showcase/src/homes/${d}.md` }}
    />
  )
}
