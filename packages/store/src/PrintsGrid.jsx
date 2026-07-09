import { useMemo, useState } from 'react'
import { ContentFilters } from '@kolkrabbi/kol-component'
import PrintGridCard from './PrintGridCard.jsx'

/**
 * PrintsGrid — the filterable storefront grid organism: a ContentFilters shell
 * (category / year facets + search + view toggle) wrapping a responsive grid of
 * {@link PrintGridCard}. Cards shuffle once on mount so the wall reorders on
 * each load. Clicking a card reports its rect + slug via `onCardClick` for a
 * FLIP-into-detail transition; `activeSlug` flips the matching card face.
 *
 * Page-severed and data-injected: the monorepo route's SEO head and hardcoded
 * `prints`/`filterData` import are dropped — the catalog enters through
 * `prints`. The "Custom Commissions" FoundryCTA (DS chrome, not commerce) is
 * removed; pass an optional `ctaSlot` to render your own footer CTA. Filter
 * facets default to distinct category + year values derived from `prints`;
 * override with `filterGroups`.
 *
 * @param {Object[]}  prints        product catalog ({ id, slug, name, category, year, image, detailImages? })
 * @param {Array}     filterGroups  ContentFilters groups ([{label,key,values}]); default derived from `prints`
 * @param {string}    title         section title (default 'All Prints')
 * @param {Function}  onCardClick   (rect, slug) => void — forwarded to each card
 * @param {string}    activeSlug    slug of the flipped/active card
 * @param {ReactNode} ctaSlot       optional footer CTA node (replaces the app's FoundryCTA)
 * @param {boolean}   shuffle       one-time shuffle of `prints` on mount (default true)
 * @param {string}    className     extra classes on the wrapping <main>
 */
export default function PrintsGrid({
  prints = [],
  filterGroups,
  title = 'All Prints',
  onCardClick,
  activeSlug,
  ctaSlot,
  shuffle = true,
  className = '',
}) {
  // Shuffle once on mount so order is random on each page load/reload.
  const [items] = useState(() => (shuffle ? [...prints].sort(() => Math.random() - 0.5) : prints))

  // Derive filter groups from the injected catalog when none are supplied.
  const resolvedGroups = useMemo(() => {
    if (filterGroups) return filterGroups
    const categories = [...new Set(prints.map((p) => p.category).filter(Boolean))].sort()
    const years = [...new Set(prints.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a)
    const groups = []
    if (categories.length) groups.push({ label: 'Category', key: 'category', values: categories })
    if (years.length) groups.push({ label: 'Year', key: 'year', values: years })
    return groups
  }, [filterGroups, prints])

  const renderPrints = (filteredItems) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredItems.map((print, index) => (
        <div
          key={print.id}
          className="reveal"
          style={{ '--reveal-delay': `${Math.min(index * 0.08, 0.5)}s` }}
        >
          <PrintGridCard print={print} onCardClick={onCardClick} isFlipped={print.slug === activeSlug} />
        </div>
      ))}
    </div>
  )

  return (
    <main className={`min-h-screen w-full overflow-x-hidden bg-surface-primary pb-24 ${className}`}>
      <section aria-label="Print catalog" className="max-w-[1400px] mx-auto px-6 md:px-8 pt-24">
        <ContentFilters
          items={items}
          title={title}
          totalCount={prints.length}
          filterGroups={resolvedGroups}
          renderItem={renderPrints}
        />
      </section>

      {ctaSlot}
    </main>
  )
}
