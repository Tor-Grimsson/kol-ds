import { Link } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { CATEGORIES, ADMITTED } from '../nav/admitted.js'
import { ALL_ROUTES } from '../nav/shell-nav.js'
import { TOP_LEVEL } from '../nav/registry.js'
import { VAULT, vaultDocHref } from '../nav/vault.js'

/**
 * Quarantine — the holding page.
 *
 * The sidebar is derived, so nothing here is a list someone maintains: every
 * row is a category from admitted.js that is NOT in the admitted set, with the
 * rule it waits on and a live link to what is being held. A held surface still
 * resolves and still answers ⌘K — quarantine is a gate on the TREE, not a
 * deletion, and the links below are the proof of that.
 *
 * The plan's one non-negotiable: no surface is restyled before its rule is
 * written and approved. This page is where that shows.
 */

/* Resolve a rule's repo path to its vault route. Suffix-matched against the
 * inventory rather than hardcoded — a doc that moves degrades to plain text
 * instead of a dead link. */
const ruleDoc = (path) => {
  if (!path) return null
  const doc = VAULT.find((d) => d.file.endsWith(path.replace(/^docs\//, '')))
  return doc ? { href: vaultDocHref(doc.id), title: doc.title } : null
}

const surfaceRoutes = (ids) => ALL_ROUTES.filter((r) => ids.includes(r.id))
const componentsIn = (keys) => TOP_LEVEL.filter((c) => keys.includes(c.category))

function HeldRow({ category }) {
  const surfaces = surfaceRoutes(category.surfaces)
  const components = componentsIn(category.categories)
  const doc = ruleDoc(category.rule)

  return (
    <tr>
      <td className="align-top">
        <span className="kol-mono-14 text-emphasis">{category.label}</span>
        <span className="kol-helper-12 block text-subtle">{category.key}</span>
      </td>
      <td className="align-top">
        <div className="flex flex-col gap-1">
          {surfaces.map((r) => (
            <Link key={r.id} to={r.path} className="kol-mono-12">{r.path}</Link>
          ))}
          {components.length > 0 && (
            <span className="kol-helper-12 text-subtle">
              {components.length} component{components.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </td>
      <td className="align-top">
        <span className="kol-helper-12">{category.awaits}</span>
        {doc && (
          <Link to={doc.href} className="kol-mono-12 mt-1 block">{doc.title}</Link>
        )}
        {!doc && category.rule && <span className="kol-mono-12 mt-1 block text-subtle">{category.rule}</span>}
      </td>
      <td className="align-top kol-helper-12">{category.why}</td>
    </tr>
  )
}

export default function Quarantine() {
  const held = CATEGORIES.filter((c) => !ADMITTED.has(c.key))
  const admitted = CATEGORIES.filter((c) => ADMITTED.has(c.key))
  const heldComponents = componentsIn(held.flatMap((c) => c.categories)).length

  return (
    <>
      <DocHeader
        eyebrow="Quarantine"
        title="Held until its rule is written."
        lede={`${held.length} of ${CATEGORIES.length} categories are out of the sidebar — ${heldComponents} components and ${held.flatMap((c) => c.surfaces).length} surfaces. Nothing here is deleted or broken: every route below still resolves and still answers ⌘K by name. It is held out of the tree until the rule it waits on is written, and then read against it.`}
      />

      <DocSection title={`Admitted — ${admitted.length}`}>
        <div className="overflow-x-auto">
          <table className="kol-table w-full">
            <thead>
              <tr><th>category</th><th>opens</th><th>on the rule</th><th>why first</th></tr>
            </thead>
            <tbody>
              {admitted.map((c) => <HeldRow key={c.key} category={c} />)}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title={`Held — ${held.length}`}>
        <div className="overflow-x-auto">
          <table className="kol-table w-full">
            <thead>
              <tr><th>category</th><th>holding</th><th>awaits</th><th>note</th></tr>
            </thead>
            <tbody>
              {held.map((c) => <HeldRow key={c.key} category={c} />)}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="How a category comes back">
        <p>
          One line in <code>showcase/src/nav/admitted.js</code> — its key into <code>ADMITTED</code>.
          Sending it back out is the same line, removed. Nothing else moves, because the sidebar is
          derived from the package barrels and the surface list rather than hand-written.
        </p>
        <p>
          The order is the plan&rsquo;s: Foundations first because everything downstream cites it,
          then Icons, Documentation, the component tiers, and Blocks + Sets last. Each one is a
          separate stop — it is looked at, and only then does the next start. A category that is
          rejected returns here <strong>with its reason recorded</strong>; it is not quietly patched
          and re-shown.
        </p>
      </DocSection>
    </>
  )
}
