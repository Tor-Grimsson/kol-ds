import { useState } from 'react'
import { GalleryCarousel } from '@kolkrabbi/kol-component'
import {
  WorkCard, WorkListItem, WorkViewToggle, ParallaxShelf,
} from '@kolkrabbi/kol-content'

export const meta = {
  title: 'Work / portfolio',
  description: 'A studio work index — a WorkCard shelf/grid toggling to a WorkListItem list, a scroll-parallax "more work" shelf, and a project-detail GalleryCarousel',
  category: 'portfolio',
  featured: true,
}
export const stage = 'full'

/* Real project imagery from the KOL image library (served at /kol-images),
 * cycled through the gallery tiles. `cover()` keeps its signature; args ignored. */
const KOL_IMAGES = Array.from({ length: 7 }, (_, i) => `/kol-images/tt-0${i + 1}.jpg`)
let _phi = 0
function cover() {
  const img = KOL_IMAGES[_phi % KOL_IMAGES.length]
  _phi += 1
  return img
}

/* Flat project bag (no Sanity) — the identical shape drives both the WorkCard
 * grid and the WorkListItem list, so the toggle is a render swap. `href` is
 * baked in below so grid, list, and the parallax shelf all link the same way. */
const RAW_PROJECTS = [
  { id: 'bindery', title: 'Bindery Identity', client: 'Vellum & Vane', type: 'client', year: 2024, tags: ['Branding', 'Editorial'], description: 'A quiet identity for a bookbinding atelier.', thumbnail: cover(800, 1000, 'Bindery Identity', '#1b2a4a', '#0e1730') },
  { id: 'marble', title: 'Marble Index', type: 'collection', year: 2023, tags: ['Print', 'Series'], description: 'Twelve risograph plates on stochastic marbling.', thumbnail: cover(800, 1000, 'Marble Index', '#3a2a1b', '#1a120a') },
  { id: 'grotesk', title: 'Grotesk Mono', type: 'typeface', year: 2024, tags: ['Type', 'Variable'], description: 'A monospaced grotesque with programmable ligatures.', thumbnail: cover(800, 1000, 'Grotesk Mono', '#2a1b3a', '#140a20') },
  { id: 'forge', title: 'Palette Forge', type: 'tool', year: 2023, tags: ['Color', 'Web'], description: 'An in-browser palette engine for perceptual ramps.', thumbnail: cover(800, 1000, 'Palette Forge', '#1b3a2f', '#0a1a14') },
  { id: 'atlas', title: 'Atlas UI', type: 'system', year: 2022, tags: ['Design System', 'React'], description: 'A component atlas for cross-brand product teams.', thumbnail: cover(800, 1000, 'Atlas UI', '#3a1b2a', '#200a14') },
  { id: 'harbor', title: 'Harbor Wayfinding', client: 'Harbor & Co.', type: 'client', year: 2023, tags: ['Wayfinding', 'Signage'], description: 'Environmental graphics for a working waterfront.', thumbnail: cover(800, 1000, 'Harbor Wayfinding', '#1b3238', '#0a181c') },
  { id: 'nocturne', title: 'Nocturne Faces', type: 'typeface', year: 2022, tags: ['Type', 'Display'], description: 'A high-contrast display serif drawn for night.', thumbnail: cover(800, 1000, 'Nocturne Faces', '#332338', '#180c1c') },
  { id: 'meridian', title: 'Meridian Deck', type: 'tool', year: 2024, tags: ['Data', 'Charts'], description: 'A charting deck that reads its own tokens.', thumbnail: cover(800, 1000, 'Meridian Deck', '#38321b', '#1c180a') },
  { id: 'salt', title: 'Salt Press', type: 'collection', year: 2021, tags: ['Books', 'Craft'], description: 'A limited press run bound in salt-washed linen.', thumbnail: cover(800, 1000, 'Salt Press', '#2a2a1b', '#14140a') },
]

const PROJECTS = RAW_PROJECTS.map((p) => ({ ...p, href: `#/work/${p.id}` }))

/* The selected project drives the detail GalleryCarousel — normalized media
 * `{ url, kind, aspect, alt }`, mixed wide/portrait aspects. */
const FEATURED = {
  ...PROJECTS[0],
  media: [
    { url: cover(1200, 720, 'Plate 01 — Spine', '#1b2a4a', '#0e1730'), kind: 'image', aspect: 5 / 3, alt: 'Bindery spine study' },
    { url: cover(800, 1000, 'Plate 02 — Endpaper', '#22345a', '#101c3a'), kind: 'image', aspect: 0.8, alt: 'Endpaper pattern' },
    { url: cover(1200, 720, 'Plate 03 — Signage', '#1b3238', '#0a181c'), kind: 'image', aspect: 5 / 3, alt: 'Shop signage' },
    { url: cover(800, 1000, 'Plate 04 — Stamp', '#3a2a1b', '#1a120a'), kind: 'image', aspect: 0.8, alt: 'Foil stamp detail' },
    { url: cover(1200, 720, 'Plate 05 — Grid', '#2a1b3a', '#140a20'), kind: 'image', aspect: 5 / 3, alt: 'Editorial grid' },
    { url: cover(800, 1000, 'Plate 06 — Colophon', '#1b3a2f', '#0a1a14'), kind: 'image', aspect: 0.8, alt: 'Colophon page' },
  ],
}

function matches(p, q) {
  return (
    p.title?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.client?.toLowerCase().includes(q) ||
    p.type?.toLowerCase().includes(q) ||
    p.tags?.some((t) => t.toLowerCase().includes(q))
  )
}

export default function WorkPortfolioSet() {
  const [view, setView] = useState('shelf')
  const [query, setQuery] = useState('')
  const [activeRow, setActiveRow] = useState(null)

  const q = query.trim().toLowerCase()
  const filtered = q ? PROJECTS.filter((p) => matches(p, q)) : PROJECTS

  // Showcase seam: keep clicks on-page (no router) — every card/list link is inert.
  const stay = (href, e) => e.preventDefault()

  return (
    <div className="bg-surface-primary min-h-screen p-6 md:p-10 flex flex-col gap-16 md:gap-24">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[520px]">
          <p className="kol-mono-12 text-fg-48 tracking-widest mb-2">Use cases</p>
          <h1 className="kol-sans-display-01 text-auto">Featured client work, collections, tools and UI systems</h1>
        </div>
        <WorkViewToggle view={view} onView={setView} query={query} onQuery={setQuery} placeholder="Search projects" />
      </header>

      {view === 'shelf' ? (
        <div className="flex flex-wrap gap-6 md:gap-8 items-end">
          {filtered.map((p, i) => (
            <WorkCard key={p.id} {...p} index={i} onNavigate={stay} />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((p, i) => (
            <WorkListItem
              key={p.id}
              {...p}
              active={activeRow === i}
              onMouseEnter={() => setActiveRow(i)}
              onNavigate={stay}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="kol-mono-14 text-fg-48">No projects match “{query}”.</p>
      )}

      <section>
        <p className="kol-helper-12 text-fg-48 mb-4 md:mb-6">More work</p>
        <ParallaxShelf type={{ label: 'Client Work' }} items={PROJECTS} onNavigate={stay} />
      </section>

      <section className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <p className="kol-mono-12 text-fg-48 tracking-widest mb-2">Selected project</p>
          <h2 className="kol-sans-heading-02 text-auto">{FEATURED.title}</h2>
          <p className="kol-mono-14 text-fg-64 mt-1">{[FEATURED.client, FEATURED.year].filter(Boolean).join(' · ')}</p>
        </div>
        <GalleryCarousel media={FEATURED.media} title={FEATURED.title} />
      </section>
    </div>
  )
}
