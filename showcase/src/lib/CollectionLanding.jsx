import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Pill, ViewToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import TopBar from './TopBar.jsx'
import BlockViewer from './BlockViewer.jsx'
import DemoStage from './DemoStage.jsx'
import COMPOSITION from '../usage/composition.json'

/* Provenance at browse level (2026-07-15 audit P1-2): what a set/block is
 * actually made of — KOL components vs local scaffolding vs external deps —
 * derived from the transitive composition manifest, shown on every card and
 * stage header instead of buried on the detail page. */
function ProvenanceBadge({ itemKey, basePath }) {
  const m = COMPOSITION[basePath.replace('/', '')]?.[itemKey]
  if (!m) return null
  const local = Object.keys(m.local || {}).length
  const parts = [
    `${m.kol.length} KOL`,
    local ? `${local} local` : null,
    m.external?.length ? m.external.join(' · ') : null,
  ].filter(Boolean)
  return (
    <span className="kol-helper-10 text-subtle whitespace-nowrap">{parts.join(' · ')}</span>
  )
}

/**
 * CollectionLanding — the shadcn /blocks landing, generalized so Blocks and
 * Sets are the same machine with different data. Standalone TopBar, centred
 * hero, featured category tab strip + "Browse all" (stacked stages by default,
 * grid of compact cards as the alternate view). Items follow the one-file
 * model and the never-self-frame contract; each links to `<basePath>/:slug`
 * (dedicated page) and `<previewBase>/:slug` (full-bleed product view).
 */

/* Compact grid card — live thumbnail via the 200%-canvas/scale-50 trick.
 * Plain div preview (items carry their own <button>s); title links to the
 * item's page, the icon opens the standalone view. */
function GalleryCard({ item, labels, basePath, previewBase }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary">
      <div className="relative h-48 overflow-hidden border-b border-fg-08 bg-fg-02">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="h-[200%] w-[200%] origin-top-left scale-50">
            {item.stage === 'hug'
              ? <div className="flex h-full w-full items-center justify-center p-8"><DemoStage entry={item} /></div>
              : <item.Component />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <Link to={`${basePath}/${item.key}`} className="block truncate kol-sans-body-02 text-emphasis hover:underline">
            {item.title}
          </Link>
          <p className="kol-helper-10 uppercase tracking-widest text-meta">
            {labels[item.category] ?? item.category}
            {' '}
            <ProvenanceBadge itemKey={item.key} basePath={basePath} />
          </p>
        </div>
        <Link
          to={`${previewBase}/${item.key}`}
          target="_blank"
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--kol-radius-sm)] text-meta transition-colors hover:bg-fg-04 hover:text-emphasis"
          title="Open standalone view"
        >
          <Icon name="maximize" size={15} />
        </Link>
      </div>
    </div>
  )
}

/* The stacked stage list — one full viewer per item, titles link to pages. */
function StageList({ items, labels, basePath, previewBase, srcDir }) {
  return (
    <div className="flex flex-col gap-14">
      {items.map((b) => (
        <div key={b.key} id={b.key} className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            {/* Visible link affordance — the title routes to the item's page. */}
            <Link
              to={`${basePath}/${b.key}`}
              className="group inline-flex items-center gap-2 kol-sans-heading-03 text-emphasis underline decoration-fg-24 underline-offset-4 hover:decoration-current"
            >
              {b.title}
              <Icon name="arrow-up-right" size={16} className="text-meta transition-colors group-hover:text-emphasis" />
            </Link>
            <span className="kol-helper-10 uppercase tracking-widest text-meta">
              {labels[b.category] ?? b.category}
            </span>
            <ProvenanceBadge itemKey={b.key} basePath={basePath} />
          </div>
          <BlockViewer entry={b} previewBase={previewBase} srcDir={srcDir} />
        </div>
      ))}
    </div>
  )
}

export default function CollectionLanding({
  items,
  categories,
  labels,
  featured,
  basePath,
  previewBase,
  srcDir,
  hero, // { pill, title, lede, browseLabel, secondary: { label, to } }
}) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('featured')
  const [view, setView] = useState('list')

  const featuredItems = featured.length ? featured : items
  const shown = tab === 'all' ? items : tab === 'featured' ? featuredItems : items.filter((b) => b.category === tab)
  const tabs = [{ key: 'featured', label: 'Featured' }, ...categories.map((c) => ({ key: c, label: labels[c] ?? c }))]

  return (
    <>
      <TopBar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-5 pt-20 pb-14 text-center md:pt-28">
        <div className="mb-6 flex justify-center">
          <Pill variant="subtle">{hero.pill}</Pill>
        </div>
        <h1 className="kol-prose-display">{hero.title}</h1>
        <div className="flex justify-center">
          <p className="kol-prose-lede max-w-[65ch]">{hero.lede}</p>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" iconRight="arrow-right" onClick={() => setTab('all')}>
            {hero.browseLabel}
          </Button>
          <Button variant="primary" onClick={() => navigate(hero.secondary.to)}>
            {hero.secondary.label}
          </Button>
        </div>
      </section>

      {/* ── Category tab strip + Browse all ──────────────────── */}
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-fg-08 pb-4">
          <nav className="flex flex-wrap items-center gap-5 kol-sans-body-02">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`transition-colors ${tab === t.key ? 'text-emphasis' : 'text-meta hover:text-emphasis'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            {tab === 'all' && (
              <ViewToggle
                viewMode={view}
                onViewChange={setView}
                variant="icon"
                iconVariant="solid"
                options={[
                  { value: 'grid', label: 'Grid view', icon: 'grid' },
                  { value: 'list', label: 'List view', icon: 'list-01' },
                ]}
              />
            )}
            <Button variant="primary" size="sm" selected={tab === 'all'} onClick={() => setTab('all')}>
              {hero.browseLabel}
            </Button>
          </div>
        </div>

        {/* ── Stages (list) or compact cards (grid, browse-all only) ── */}
        <section className="py-10 pb-24">
          {tab === 'all' && view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((b) => (
                <GalleryCard key={b.key} item={b} labels={labels} basePath={basePath} previewBase={previewBase} />
              ))}
            </div>
          ) : (
            <StageList items={shown} labels={labels} basePath={basePath} previewBase={previewBase} srcDir={srcDir} />
          )}
        </section>
      </div>
    </>
  )
}
