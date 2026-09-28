import { Link } from 'react-router-dom'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
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

/* `code` in the ledger's prose renders as the inline chip, never as literal backticks */
const withCode = (text = '') => text.split(/(`[^`]+`)/g).map((part, i) =>
  part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part)

/* THE LEDGER IS THE TABLE COMPONENT (showcase refinement 2026-09-28 — user: "someone just has
 * to have inlined a illegal table, and text styles"). It was a bare <table class="kol-table">
 * with no wrapper, so the seams never applied, and every cell typed itself with kol-mono / kol-helper
 * utilities; the rule text printed its backticks. `Table` owns the chrome and the cell type now. */
const columns = (openLabel, ruleLabel, whyLabel) => [
  { accessor: 'label', header: 'Category', render: (c) => <>{c.label}<span className="block text-subtle">{c.key}</span></> },
  { accessor: 'opens', header: openLabel, render: (c) => {
    const surfaces = surfaceRoutes(c.surfaces)
    const n = componentsIn(c.categories).length
    return (
      <span className="flex flex-col gap-1">
        {surfaces.map((r) => <Link key={r.id} to={r.path}>{r.path}</Link>)}
        {n > 0 && <span className="text-subtle">{n} component{n === 1 ? '' : 's'}</span>}
      </span>
    )
  } },
  { accessor: 'awaits', header: ruleLabel, className: 'kol-table-cell-meta-strong', render: (c) => {
    const doc = ruleDoc(c.rule)
    return (
      <span className="flex flex-col gap-1">
        <span>{withCode(c.awaits)}</span>
        {doc ? <Link to={doc.href}>{doc.title}</Link> : c.rule ? <span className="text-subtle">{c.rule}</span> : null}
      </span>
    )
  } },
  { accessor: 'why', header: whyLabel, className: 'kol-table-cell-meta', render: (c) => withCode(c.why) },
]

export default function Quarantine() {
  usePageMeta({ tags: [], related: [] })
  const held = CATEGORIES.filter((c) => !ADMITTED.has(c.key))
  const admitted = CATEGORIES.filter((c) => ADMITTED.has(c.key))
  const heldComponents = componentsIn(held.flatMap((c) => c.categories)).length

  return (
    <>
      <DocHeader
        eyebrow="Development · Quarantine"
        title="Held until its rule is written."
        lede={`${held.length} of ${CATEGORIES.length} categories are out of the sidebar — ${heldComponents} components and ${held.flatMap((c) => c.surfaces).length} surfaces. Nothing here is deleted or broken: every route below still resolves and still answers ⌘K by name. It is held out of the tree until the rule it waits on is written, and then read against it.`}
      />

      <DocSection id="admitted" title={`Admitted — ${admitted.length}`}>
        <Table width="column" columns={columns('Opens', 'On the rule', 'Why first')} rows={admitted.map((c) => ({ ...c, id: c.key }))} />
      </DocSection>

      {held.length > 0 && (
        <DocSection id="held" title={`Held — ${held.length}`}>
          <Table width="column" columns={columns('Holding', 'Awaits', 'Note')} rows={held.map((c) => ({ ...c, id: c.key }))} />
        </DocSection>
      )}

      <DocSection id="how" title="How a category comes back">
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
