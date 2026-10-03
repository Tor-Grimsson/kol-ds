import { Link } from 'react-router-dom'
import HomeDoc from '../lib/HomeDoc.jsx'
import { DocSection } from '@kolkrabbi/kol-workshop'
import { LOOKUP_GROUPS, START } from '../nav/shell-nav.js'

/* a Library group whose pages are vault docs (2026-10-01): its markdown home, then every page */
function VaultGroupHome({ home, items }) {
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id={home} />
      <DocSection id="pages" title="Pages">
        <ul className="flex flex-col gap-2">
          {items.map((g) => (
            <li key={g.id} className="kol-doc-body">
              <Link className="underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64" to={g.path}>{g.label}</Link>
              <span className="text-subtle"> — {g.description}</span>
            </li>
          ))}
        </ul>
      </DocSection>
    </div>
  )
}

/** Lookup — the names and values you check while building: its three groups, each a page. */
export default function Lookup() {
  return <VaultGroupHome home="lookup" items={LOOKUP_GROUPS} />
}

const groupItems = (id) => LOOKUP_GROUPS.find((g) => g.id === id).items

/** Lookup › Foundations — every value, looked up. */
export function LookupFoundations() {
  return <VaultGroupHome home="lookup-foundations" items={groupItems('lookup-foundations')} />
}

/** Lookup › Taxonomy — the names, the tiers, the placement runbook. */
export function LookupTaxonomy() {
  return <VaultGroupHome home="lookup-taxonomy" items={groupItems('lookup-taxonomy')} />
}

/** Start — what KOL is and how to install it. */
export function Start() {
  return <VaultGroupHome home="start" items={START} />
}
