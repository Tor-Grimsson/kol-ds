import { Link } from 'react-router-dom'
import { DocSection } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import { admittedVaultTree } from '../nav/shell-nav.js'

/**
 * DocsIndex — the Docs space's root (showcase refinement 2026-09-28). `/documentation` used to
 * redirect to whichever vault doc sorted first, so the space's "landing" was a random page with
 * its frontmatter panel on top. The root is an index now, in the space's own layout: the guides,
 * the live specimens, then the vault's two categories chapter by chapter — the same order as the
 * rail beside it.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

function Rows({ items }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map(({ to, label, note }) => (
        <li key={to} className="kol-doc-body">
          <Link className={linkCls} to={to}>{label}</Link>
          {note && <span className="text-subtle"> — {note}</span>}
        </li>
      ))}
    </ul>
  )
}

const chapters = (category) => admittedVaultTree()
  .filter((g) => g.category === category)
  .map((g) => ({ to: g.path ?? g.children?.[0]?.path, label: g.label, note: `${g.children?.length ?? 0} page${g.children?.length === 1 ? '' : 's'}` }))
  .filter((r) => r.to)

export default function DocsIndex() {
  return (
    <div className="flex flex-col gap-10 pb-24">
      {/* THE HOME (2026-09-30): Docs is the vault — the guides and specimens moved to Styles */}
      <HomeDoc id="docs" />
      <DocSection id="documentation" title="Documentation"><Rows items={chapters('documentation')} /></DocSection>
      <DocSection id="operations" title="Operations"><Rows items={chapters('operations')} /></DocSection>
    </div>
  )
}
