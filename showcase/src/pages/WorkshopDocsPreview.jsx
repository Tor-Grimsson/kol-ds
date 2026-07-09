import { Routes, Route, Link } from 'react-router-dom'
import { ShellLayout, TagModeProvider, DocumentationReader } from '@kolkrabbi/kol-workshop'
import { buildInventory } from '@kolkrabbi/kol-workshop/engine'

/* Live dogfood of @kolkrabbi/kol-workshop — the real shell + docs viewer fed
 * showcase-local sample markdown via the content-injection seam. */
const modules = import.meta.glob('./workshop-sample/*.md', { eager: true, query: '?raw', import: 'default' })
const inventory = buildInventory(modules)

const basePath = '/workshop-docs'
const docHref = (id) => `${basePath}/${id}`

const NAV = [
  { label: 'Docs', path: inventory[0]?.id ?? '', icon: 'book-open' },
  { label: 'Components', path: '', icon: 'grid' },
]

const searchItems = inventory.map((d) => ({
  label: d.title,
  path: d.id,
  tags: d.metadata?.tags || [],
  headings: [],
  keywords: [],
}))

function DocsSidebar() {
  return (
    <nav className="space-y-0.5">
      {inventory.map((d) => (
        <Link key={d.id} to={docHref(d.id)} className="shell-nav-item block kol-mono-14 text-body hover:text-emphasis">
          <span className="shell-nav-item-title">{d.title}</span>
        </Link>
      ))}
    </nav>
  )
}

function DocsLanding() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-4">
      <h1 className="kol-mono-16 text-emphasis">Workshop docs — live dogfood</h1>
      <p className="text-body mt-3">
        Pick a doc on the left. This renders the real <code>@kolkrabbi/kol-workshop</code> shell and docs viewer.
      </p>
    </div>
  )
}

export default function WorkshopDocsPreview() {
  return (
    <TagModeProvider inventory={inventory} docHref={docHref}>
      <Routes>
        <Route
          element={
            <ShellLayout
              routes={NAV}
              basePath={basePath}
              brandLogoAlt="Workshop"
              renderSidebar={() => <DocsSidebar />}
              searchItems={searchItems}
            />
          }
        >
          <Route index element={<DocsLanding />} />
          <Route
            path=":docId"
            element={
              <DocumentationReader
                inventory={inventory}
                modules={modules}
                docHref={docHref}
                routes={{ docsIndex: basePath, components: '/components' }}
              />
            }
          />
        </Route>
      </Routes>
    </TagModeProvider>
  )
}
