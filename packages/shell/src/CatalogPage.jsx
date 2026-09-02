import { ContentCard, ContentFilters, ContentRow } from '@kolkrabbi/kol-component'
import PageShell from './PageShell.jsx'
import PageHeader from './PageHeader.jsx'
import WalkthroughPanel from './WalkthroughPanel.jsx'

/* taxonomy-ok: organism — nests PageShell / PageHeader / WalkthroughPanel (relative) + kol-component's ContentFilters + ContentCard / ContentRow */

/**
 * CatalogPage — the app tier's Home / Library page, shipped once (ShellHomeSystem,
 * kol-fxr 2026-08-27 — fxr's HomePage / LibraryPage and monitor's HomePage were
 * the same page written three times): `PageHeader` → `ContentFilters` (title ·
 * filter · search, the view strip in the header, LIST / GRID below the divider)
 * → the catalog grid — cards `repeat(6, 1fr)` gap 24, rows `repeat(4, 1fr)` gap
 * 8, `ContentCard` / `ContentRow variant="catalog"` — → the bottom action row
 * (`marginTop: 48`, `alignSelf: flex-start`, gap 12). The walkthrough panel
 * sits over the catalog while `walkthrough.open`; the strip hides and the grid
 * yields, as both apps do.
 *
 * Semantics are the consumer's: what RECENT / SAVED mean, what an item is,
 * what a click does. `toCard(item, { view, layout })` → `{ key, title, detail,
 * media, actions, onClick, href, onNavigate, expanded, expandedContent, fit }` is
 * the whole contract — `expanded` / `expandedContent` reach `ContentCard catalog`'s
 * 2×2 cell (ShellHomeSystemMonitorGaps, kol-monitor 2026-08-27) — and the page
 * HIDES the cell's three neighbours itself (CatalogPageMonitorParity: the
 * consumer never sees the filtered row order, so it cannot; monitor's
 * `computeHiddenSet` for the 6-column grid, verbatim — the grid stays still
 * instead of reflowing around the expanded card); `fit` (`cover` default | `natural` | `compact`) is the
 * card's media fit, PER CARD because one catalog mixes photographs (cover) and
 * diagrams (natural) — CatalogPageCardFit, kol-monitor: a rack preview wider
 * than the card lost its left rail to `cover`. Anything `ContentFilters` takes that the page has no
 * prop for goes through `filtersProps` — `mutuallyExclusiveFilters` was the gap.
 *
 * @param {Object}   header        PageHeader props — `{ title, subtitle, size, voice, eyebrow }`
 * @param {Array}    items         the objects `ContentFilters` filters and searches
 * @param {Function} toCard        (item, { view, layout }) => card props (see above)
 * @param {string}   filtersTitle  ContentFilters' title (e.g. "All Chromes")
 * @param {Array}    filterGroups  ContentFilters' `[{ label, key, values }]`
 * @param {string[]} searchKeys    fields the search reads (default `['title', 'name']`)
 * @param {Array}    views         the header strip `[{ value, label }]` (RECENT / SAVED); omit for none
 * @param {string}   view · onViewChange   controlled view; or `defaultView`
 * @param {Array}    layouts       LIST / GRID (default both)
 * @param {string}   defaultLayout 'grid' (default) | 'list'
 * @param {{steps: Array, open: boolean, iconComponent?: ElementType}} walkthrough  the panel over the catalog
 * @param {ReactNode} actions      the bottom row's buttons
 * @param {ElementType} iconComponent  icon renderer seam for ContentFilters
 * @param {boolean}  showCountOnlyWhenFiltering  (default true)
 * @param {Object}   filtersProps  spread onto ContentFilters last — e.g. `{ mutuallyExclusiveFilters: ['category', 'u_label'] }`
 */
const LAYOUTS = [
  { value: 'list', label: 'LIST' },
  { value: 'grid', label: 'GRID' },
]

/* The 2×2 expanded card's three neighbours — the cell to the right, the two
 * beneath — skipped so the grid stays still (monitor's computeHiddenSet, verbatim). */
function computeHiddenSet(items, expandedIdx) {
  if (expandedIdx < 0) return new Set()
  const hiddenSet = new Set()
  const blockCol = Math.floor((expandedIdx % 6) / 2)
  const blockRow = Math.floor(Math.floor(expandedIdx / 6) / 2)
  const base = blockRow * 12 + blockCol * 2
  ;[base, base + 1, base + 6, base + 7].forEach(i => {
    if (i !== expandedIdx && i < items.length) hiddenSet.add(i)
  })
  return hiddenSet
}

export default function CatalogPage({
  header,
  items = [],
  toCard,
  filtersTitle,
  filterGroups,
  searchKeys = ['title', 'name'],
  views,
  view,
  onViewChange,
  defaultView,
  layouts = LAYOUTS,
  defaultLayout = 'grid',
  walkthrough,
  actions,
  iconComponent,
  showCountOnlyWhenFiltering = true,
  filtersProps,
  children,
  className = '',
  style,
}) {
  const open = walkthrough?.open === true
  return (
    <PageShell className={className} style={{ overflow: 'hidden', ...style }}>
      {header && <PageHeader {...header} />}
      <div style={{ flex: 1, position: 'relative' }}>
        {open && <WalkthroughPanel steps={walkthrough.steps} iconComponent={walkthrough.iconComponent} />}
        <ContentFilters
          items={items}
          title={filtersTitle}
          totalCount={items.length}
          filterGroups={filterGroups}
          searchKeys={searchKeys}
          showCountOnlyWhenFiltering={showCountOnlyWhenFiltering}
          iconComponent={iconComponent}
          viewModeOptions={views}
          viewMode={view}
          onViewModeChange={onViewChange}
          defaultViewMode={defaultView}
          layoutOptions={open ? undefined : layouts}
          defaultLayout={defaultLayout}
          renderItem={(rows, viewMode, layout) => {
            if (open) return null
            const cards = rows.map((item) => toCard ? toCard(item, { view: viewMode, layout }) : { title: item.title ?? item.name, detail: item.detail })
            const hidden = layout === 'list' ? new Set() : computeHiddenSet(rows, cards.findIndex((c) => c.expanded))
            /* COLS IS A CEILING, NOT A COMMAND (CatalogPageMobileColumns,
              * kol-monitor 2026-09-01) — the third home of the defect
              * ContentCollectionMinColumnWidth and ContentGridMinColumnWidth
              * closed, unreachable by either because this grid is drawn inline.
              * `repeat(6, 1fr)` computed six 29px slivers at 390. Same idiom as
              * ContentCollection:144 — up to 6 (grid) / 4 (list) columns, and a
              * track may not go under the floor (160 grid / 240 list) nor demand
              * more than the container. At monitor's desktop widths the sixth-
              * share clears the floor, so nothing moves there. NB the 2×2
              * expanded-card neighbour math (computeHiddenSet) stays a
              * six-column ruling — below the ceiling the hide-set is
              * desktop-only geometry. */
            return (
            <div style={{ display: 'grid', gridTemplateColumns: layout === 'list' ? 'repeat(auto-fill, minmax(min(100%, max(240px, calc((100% - 3 * 8px) / 4))), 1fr))' : 'repeat(auto-fill, minmax(min(100%, max(160px, calc((100% - 5 * 24px) / 6))), 1fr))', gap: layout === 'list' ? 8 : 24 }}>
              {rows.map((item, i) => {
                if (hidden.has(i)) return null
                const c = cards[i]
                const key = c.key ?? item.key ?? item.id ?? item.name ?? i
                return layout === 'list'
                  ? <ContentRow key={key} variant="catalog" title={c.title} detail={c.detail} actions={c.actions} onClick={c.onClick} href={c.href} onNavigate={c.onNavigate} />
                  : <ContentCard key={key} variant="catalog" fit={c.fit ?? 'cover'} title={c.title} detail={c.detail} media={c.media} actions={c.actions} onClick={c.onClick} href={c.href} onNavigate={c.onNavigate} expanded={c.expanded} expandedContent={c.expandedContent} />
              })}
            </div>
            )
          }}
          {...filtersProps}
        />
      </div>
      {children}
      {actions && <div style={{ display: 'flex', gap: 12, marginTop: 48, alignSelf: 'flex-start' }}>{actions}</div>}
    </PageShell>
  )
}
