import { PageSection } from '@kolkrabbi/kol-framework'
import ExhibitLinkCard from './ExhibitLinkCard.jsx'
import useExhibitToc from './useExhibitToc.js'

/**
 * ExhibitOverview — an exhibit's landing page: what this section is, then every
 * child page as a card.
 *
 * The overview contract kol-website's DashboardOverview implements by hand —
 * concept in the intro (with room for a single external opt-in, the live
 * instance the exhibit documents), children as a grid below.
 *
 * ```jsx
 * <ExhibitOverview
 *   toc={{ links: DOC_LINKS }}
 *   label="Scope: Dashboard — Overview"
 *   title="Dashboard"
 *   body="Modular dashboards, charts and KPI components…"
 *   action={<Button variant="primary" href="https://kolkrabbi.io/metrics">Open metrics</Button>}
 *   cards={[{ id: 'setup', label: 'Setup', subtitle: '…', icon: 'book-open', href: '/workshop/dashboard/setup' }]}
 * />
 * ```
 *
 * @param {string} title · @param {string} label · @param {string} body  the intro section
 * @param {node}   [action]      one call-to-action under the intro
 * @param {Array}  cards         child pages: ExhibitLinkCard props, each with an `id`
 * @param {string} [cardsLabel='Pages'] · @param {string} [cardsTitle='Explore'] · @param {string} [cardsBody]
 * @param {object} [toc]         ExhibitSidebar props; omit to leave the rail alone
 * @param {string} [id='overview']  anchor id of the intro section
 */
export default function ExhibitOverview({
  id = 'overview',
  label,
  title,
  body,
  action,
  cards = [],
  cardsId = 'sections',
  cardsLabel = 'Pages',
  cardsTitle = 'Explore',
  cardsBody,
  toc,
}) {
  useExhibitToc(toc ?? {})

  return (
    <div>
      <PageSection id={id} label={label} title={title} body={body}>
        {action && <div className="mt-6">{action}</div>}
      </PageSection>

      {cards.length > 0 && (
        <PageSection id={cardsId} label={cardsLabel} title={cardsTitle} body={cardsBody}>
          {/* auto-fill from a 17.5rem minimum — the reference implementation's
            * grid, so an exhibit's landing reflows the same everywhere. */}
          <div className="mt-8 grid gap-6 grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))]">
            {cards.map((card) => (
              <ExhibitLinkCard
                key={card.id}
                {...card}
                description={card.description ?? `Open ${card.label} in the workshop`}
              />
            ))}
          </div>
        </PageSection>
      )}
    </div>
  )
}
