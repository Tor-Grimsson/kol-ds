import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import CatalogPage from './CatalogPage.jsx'

/* taxonomy-ok: organism — nests CatalogPage (relative) + kol-component's Button */

/**
 * HubHome — the Hub's Home: a Catalog under the app's masthead (the Hub, 2026-09-26).
 * monitor, mirror and fxr each wrote this page on `CatalogPage` with the same five
 * decisions — the mono masthead, RECENT · SAVED, a walkthrough opened by a button,
 * that button's Close label, a "Get started" last step — and the case of the view
 * labels had already drifted. They are made here once.
 *
 * THE WALKTHROUGH IS OPT-IN (user, 2026-09-26, on media-shell): it never opens by
 * itself. The Walkthrough button at the end of the action row opens it; the X inside
 * the card and the same button close it.
 *
 * @param {Object}   app          `{ name, subtitle }` — the masthead, when Home is the app's front door
 * @param {string}   title · subtitle  Home's own masthead instead — for a Home that is not the front
 *                                door (media-shell's Library at `/library`, 2026-09-26: it said "Media")
 * @param {Array|Function} items  the catalog's items, or `(view) => items` — RECENT
 *                                and SAVED are different sets in every app
 * @param {Array}    views        the view strip (default RECENT · SAVED); rename a set by
 *                                passing your own, e.g. `[…, { value: 'saved', label: 'FAVOURITES' }]`
 * @param {Array}    walkthrough  steps (WalkthroughPanel's); a step whose `actions` is a
 *                                FUNCTION gets `close` — the "Get started" step's buttons
 * @param {ReactNode} actions     the app's buttons; the Walkthrough button follows them
 * THE LIST IS THE FILE ROW, one per line (user, 2026-09-26, on apps/shell: CatalogPage's
 * 36px `catalog` row four across "both a bad hover state and using columns wrong"; brand's
 * library row is the reference) — `rowVariant="file"` + `listLayout="stack"`: the ruled
 * 48px thumb row, `date` · `size` · `actions` from `toCard`. Only the Hub's default —
 * CatalogPage's own default does not move, and either prop can be passed back.
 *
 * @param {...*}     rest         every other CatalogPage prop (`toCard`, `filterGroups`,
 *                                `filtersTitle`, `filtersProps`, …) — spread through
 */
const HUB_VIEWS = [
  { value: 'recent', label: 'RECENT' },
  { value: 'saved', label: 'SAVED' },
]

export default function HubHome({
  app = {},
  title,
  subtitle,
  items = [],
  views = HUB_VIEWS,
  defaultView,
  walkthrough,
  actions,
  iconComponent,
  ...rest
}) {
  const [view, setView] = useState(defaultView ?? views?.[0]?.value)
  const [touring, setTouring] = useState(false)
  const close = () => setTouring(false)
  const steps = (walkthrough ?? []).map((s) => (typeof s.actions === 'function' ? { ...s, actions: s.actions(close) } : s))

  return (
    <CatalogPage
      header={{ title: title ?? app.name, subtitle: subtitle ?? app.subtitle, size: 'sm', voice: 'mono' }}
      items={typeof items === 'function' ? items(view) : items}
      views={views}
      view={view}
      onViewChange={setView}
      iconComponent={iconComponent}
      rowVariant="file"
      listLayout="stack"
      walkthrough={steps.length ? { open: touring, steps, onClose: close, iconComponent } : undefined}
      actions={(actions || steps.length) ? (
        <>
          {actions}
          {steps.length > 0 && (
            <Button variant="grey" size="md" onClick={() => setTouring((t) => !t)}>
              {touring ? 'Close' : 'Walkthrough'}
            </Button>
          )}
        </>
      ) : undefined}
      {...rest}
    />
  )
}
