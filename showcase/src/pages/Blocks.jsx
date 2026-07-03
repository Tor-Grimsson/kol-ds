import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Pill, ViewToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-loader'
import TopBar from '../lib/TopBar.jsx'
import BlockViewer from '../lib/BlockViewer.jsx'
import {
  BLOCKS, BLOCK_CATEGORIES, CATEGORY_LABELS, FEATURED_BLOCKS,
} from '../lib/blocks-registry.js'

/**
 * Blocks — the shadcn /blocks landing. Standalone TopBar, centred hero, a
 * featured category tab strip + "Browse all". Every tab — including Browse all
 * — renders blocks as STACKED, full-width BlockViewer stages (the shadcn
 * model); Browse all adds a list/grid ViewToggle, grid being the compact
 * alternate. Blocks are UI compositions (sidebar, panel, form, toolbar…);
 * full-apparatus compositions (chess, metrics) live on /sets.
 */

const TABS = [
  { key: 'featured', label: 'Featured' },
  ...BLOCK_CATEGORIES.map((c) => ({ key: c, label: CATEGORY_LABELS[c] ?? c })),
]

const featured = FEATURED_BLOCKS.length ? FEATURED_BLOCKS : BLOCKS

function shownFor(tab) {
  if (tab === 'all') return BLOCKS
  if (tab === 'featured') return featured
  return BLOCKS.filter((b) => b.category === tab)
}

/* The stacked stage list — one full BlockViewer per block, shadcn-style.
 * Titles link to the block's dedicated /blocks/:slug page. */
function StageList({ blocks }) {
  return (
    <div className="flex flex-col gap-14">
      {blocks.map((b) => (
        <div key={b.key} id={b.key} className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <Link to={`/blocks/${b.key}`} className="kol-sans-heading-03 text-emphasis hover:underline">
              {b.title}
            </Link>
            <span className="kol-helper-10 uppercase tracking-widest text-meta">
              {CATEGORY_LABELS[b.category] ?? b.category}
            </span>
          </div>
          <BlockViewer entry={b} />
        </div>
      ))}
    </div>
  )
}

/* Compact grid card — live thumbnail via the 200%-canvas/scale-50 trick (the
 * block renders at full logical size, clipped into the card), title linking to
 * its stage anchor, open-standalone on the right. Plain div preview: blocks
 * carry their own <button>s, so the thumbnail must not be one. */
function GalleryCard({ block }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary">
      <div className="relative h-48 overflow-hidden border-b border-fg-08 bg-fg-02">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="h-[200%] w-[200%] origin-top-left scale-50">
            <block.Component />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <Link to={`/blocks/${block.key}`} className="block truncate kol-sans-body-02 text-emphasis hover:underline">
            {block.title}
          </Link>
          <p className="kol-helper-10 uppercase tracking-widest text-meta">{CATEGORY_LABELS[block.category] ?? block.category}</p>
        </div>
        <Link
          to={`/blocks/preview/${block.key}`}
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

export default function Blocks() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('featured')
  const [view, setView] = useState('list')
  const shown = shownFor(tab)

  return (
    <>
      <TopBar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-5 pt-20 pb-14 text-center md:pt-28">
        <div className="mb-6 flex justify-center">
          <Pill variant="subtle">{BLOCKS.length} building blocks</Pill>
        </div>
        <h1 className="kol-prose-display">Building blocks for KOL tools.</h1>
        <div className="flex justify-center">
          <p className="kol-prose-lede max-w-[58ch]">
            Composed sections built from the published packages — bigger than a
            component, smaller than a page. Copy the source, keep the wiring.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" iconRight="arrow-right" onClick={() => setTab('all')}>
            Browse blocks
          </Button>
          <Button variant="outline" onClick={() => navigate('/components')}>
            View components
          </Button>
        </div>
      </section>

      {/* ── Category tab strip + Browse all ──────────────────── */}
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-fg-08 pb-4">
          <nav className="flex flex-wrap items-center gap-5 kol-sans-body-02">
            {TABS.map((t) => (
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
              Browse all blocks
            </Button>
          </div>
        </div>

        {/* ── Stages (list) or compact cards (grid, browse-all only) ── */}
        <section className="py-10 pb-24">
          {tab === 'all' && view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((b) => <GalleryCard key={b.key} block={b} />)}
            </div>
          ) : (
            <StageList blocks={shown} />
          )}
        </section>
      </div>
    </>
  )
}
