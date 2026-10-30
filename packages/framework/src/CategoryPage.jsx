import { isValidElement } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ContentCard, ContentCollection, Table } from '@kolkrabbi/kol-component'
import PageHero from './PageHero.jsx'
import PageSection from './PageSection.jsx'

const isGroup = (p) => Array.isArray(p.children)
const ledeOf = (p) => p.lede ?? p.card?.body

/* the tree's rows, groups pruned to what passes */
const prune = (rows, keep) => rows.flatMap((p) => {
  if (!isGroup(p)) return keep(p) ? [p] : []
  const children = prune(p.children, keep)
  return children.length ? [{ ...p, children }] : []
})
const leaves = (rows, group) => rows.flatMap((p) => (isGroup(p) ? leaves(p.children, p.label) : [{ ...p, group }]))

function TocRows({ rows, depth = 0, renderItem }) {
  return (
    <ul className="flex flex-col">
      {rows.map((p, i) => {
        if (isGroup(p)) {
          const H = depth === 0 ? 'h2' : 'h3'
          return (
            <li key={`g-${p.label}-${i}`} className={depth === 0 ? 'mt-10 first:mt-0' : 'mt-6 pl-4'}>
              <H className="kol-prose-label">{p.label}</H>
              <TocRows rows={p.children} depth={depth + 1} renderItem={renderItem} />
            </li>
          )
        }
        const lede = ledeOf(p)
        const node = (
          <Link to={p.to} className="group flex items-baseline gap-6 py-3 no-underline">
            <span className="flex min-w-0 flex-col gap-1">
              <span className="kol-sans-heading-05 text-emphasis underline-offset-4 group-hover:underline">{p.label}</span>
              {lede && <span className="kol-sans-body-02 text-meta max-w-[64ch]">{lede}</span>}
            </span>
            {p.trailing != null && <span className="kol-mono-12 text-meta ml-auto shrink-0 tabular-nums">{p.trailing}</span>}
          </Link>
        )
        return <li key={p.to ?? i}>{renderItem ? renderItem(p, node) : node}</li>
      })}
    </ul>
  )
}

/**
 * CategoryPage — A category's overview, from the nav tree. the FOLDERNOTE: the page a rail category opens
 * on — its label and lede over its pages as cards — read from the same tree the rail reads, so nothing is
 * listed by hand and a page added to the rail is on the overview the same moment (site-hub W4, user
 * 2026-10-24: kol-branding's three categories each hand-wrote this page).
 *
 * The tree is `SideNav`'s: `{ id, label, icon, lede?, pages: [{ to, label, card? }] }`. A page with a `card`
 * is on the overview — `{ eyebrow, body, media, meta }`, the article card's fields (`media` a node or an
 * image src); a page without one (the overview's own row, a plain link) is not. The card opens its page.
 *
 * THE TOC AND THE HEAD ARE PROPS (OverviewTocAndLibraryIcons, kol-website 2026-10-29 — user: *"I think they should
 * just TOC the sub pages"* · *"the hero literally was designed to INTRO BRAND GUIDE, not to be a every goddamn page
 * standard"* · *"props are good. we use variants and presets to define how things ship, but props make things
 * flexible"*). The defaults are the overview as it was — cards under the hero — so a page passing nothing is unchanged.
 * `toc` lists EVERY page of the category in the rail's order, card or not: its label, its `lede` (or `card.body`) and
 * its `trailing` (a count, a node); a `{ label, children }` group is a sub-heading over its rows, as deep as the rail
 * goes. The overview's own row (the category's `to`, or the page you are on) is not listed. `list` is the same rows
 * as a `Table`, its columns DocumentLibrary's contract.
 *
 * @param {Array}  navTree   the sidenav's tree
 * @param {string} id        the category's id
 * @param {string} [min]     the collection's column minimum (ContentCollection `min`, default 280px)
 * @param {string} [ratio]   the card media's ratio (default 16 / 9)
 * @param {'cards'|'toc'|'list'} [view='cards']  how the pages show
 * @param {'hero'|'section'|'none'|ReactNode} [head='hero']  the page's head — `hero` PageHero as today · `section`
 *                           PageSection's chapter head (label · title · lede) as the page's h1 (`level="page"`) · `none` ·
 *                           any node
 * @param {Array}    [pages]      an explicit page list; wins over the tree's
 * @param {Function} [filter]     (page) => boolean — drop rows (groups keep the rows that pass, and go when none do)
 * @param {Function} [renderItem] (page, defaultNode) => node — a card or a TOC row of your own
 * @param {Array|Function} [columns] `list` only — keys (`title · group · body · trailing`) and/or Table column objects,
 *                           or `(defaults) => columns`
 */
export default function CategoryPage({ navTree = [], id, min = '280px', ratio = '16 / 9', view = 'cards', head = 'hero', pages: given, filter, renderItem, columns }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const cat = navTree.find((c) => c.id === id)
  if (!cat) return null
  const all = given ?? cat.pages ?? []
  const keep = (p) => (filter ? filter(p) : true)

  const heads = {
    /* the hero sits in `.kol-page`, which already pads the column — its own pad, auto margins (a flex item that shrinks and centres) and 72dvh would indent the header off
      * the cards' left edge and push them below the fold (LayoutsAppPages, 2026-10-29: "the title, the lede and the cards
      * share one left edge") */
    hero: () => <PageHero label={cat.eyebrow} title={cat.label} lede={cat.lede} className="mx-0 min-h-0 px-0 py-0" />,
    /* the brand-chapter head as the page's one h1; its own `.kol-page` pad is the outer page's already */
    section: () => <PageSection level="page" label={cat.eyebrow} title={cat.label} body={cat.lede} className="mx-0 max-w-none p-0" />,
    none: () => null,
  }
  const headNode = isValidElement(head) ? head : (heads[head] ?? heads.hero)()

  let body
  if (view === 'toc' || view === 'list') {
    const rows = prune(all, (p) => p.to !== pathname && p.to !== cat.to && keep(p))
    if (view === 'toc') body = <nav aria-label={`${cat.label} pages`}><TocRows rows={rows} renderItem={renderItem} /></nav>
    else {
      const flat = leaves(rows).map((p) => ({ ...p, id: p.to, body: ledeOf(p) }))
      const named = {
        title: { header: 'Page', accessor: 'label', wrap: true, sortable: true, render: (r) => <Link to={r.to} className="underline-offset-2 hover:underline">{r.label}</Link> },
        group: { header: 'Group', accessor: 'group', sortable: true },
        body: { header: 'About', accessor: 'body', wrap: true },
        trailing: { header: '', accessor: 'trailing', className: 'kol-table-cell-text text-right tabular-nums' },
      }
      const keys = ['title', ...(flat.some((r) => r.group) ? ['group'] : []), ...(flat.some((r) => r.body) ? ['body'] : []), ...(flat.some((r) => r.trailing != null) ? ['trailing'] : [])]
      const defaults = keys.map((k) => named[k])
      const resolve = (c) => (typeof c === 'string' ? named[c] : c)
      const cols = (typeof columns === 'function' ? columns(defaults) : columns ?? keys).map(resolve).filter(Boolean)
      body = <Table columns={cols} rows={flat} width="column" variant="simple" />
    }
  } else {
    const cards = all.filter((p) => p.card && keep(p))
    body = (
      <ContentCollection min={min}>
        {cards.map((p) => {
          const card = (
            <ContentCard
              key={p.to}
              variant="article"
              ratio={ratio}
              media={typeof p.card.media === 'string' ? <img src={p.card.media} alt="" className="size-full object-cover" /> : p.card.media}
              eyebrow={p.card.eyebrow}
              title={p.label}
              body={p.card.body}
              date={p.card.meta}
              onClick={() => navigate(p.to)}
            />
          )
          return renderItem ? <div key={p.to} className="contents">{renderItem(p, card)}</div> : card
        })}
      </ContentCollection>
    )
  }

  return (
    <div className="kol-page flex flex-col gap-10">
      {headNode}
      {body}
    </div>
  )
}
