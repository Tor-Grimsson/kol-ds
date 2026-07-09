import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { ProductDetailLayout, DiagonalMarqueeRiver } from '@kolkrabbi/kol-store'

export const meta = {
  title: 'Prints / store',
  description: 'An art-print storefront — a diagonal marquee river of editions above a full product-detail layout for the selected print',
  category: 'store',
  featured: false,
}
export const stage = 'full'

/* Self-contained print shop. A DiagonalMarqueeRiver deals the fixture editions
 * into tilted auto-scrolling columns (click a card to load it below); a
 * ProductDetailLayout then renders the selected print — internal media gallery,
 * PriceDisplay, SpecList, a TabsRow of description / details / shipping, a size
 * Dropdown, a QuantityInput, and an "Add to cart" Button slot. No network: the
 * art is inline SVG, priced and editioned in believable round numbers. The
 * ScrollDriftGallery member ships alongside but this page uses the river hero,
 * whose IntersectionObserver engine survives the showcase's nested scroller. */

/* ---- inline SVG art (five abstract "print" kinds, palette-driven) ------- */
function PrintArt({ kind, palette, viewBox = '0 0 300 400' }) {
  const [bg, a, b, c] = palette
  const common = { width: '100%', height: '100%', viewBox, preserveAspectRatio: 'xMidYMid slice', role: 'img' }
  if (kind === 'arcs') {
    return (
      <svg {...common}>
        <rect width="300" height="400" fill={bg} />
        {[220, 170, 120, 70].map((r, i) => (
          <path key={r} d={`M0 ${400 - r} A ${r} ${r} 0 0 1 ${r} 400`} fill="none" stroke={[a, b, c, a][i]} strokeWidth="26" />
        ))}
        <circle cx="212" cy="96" r="46" fill={c} />
      </svg>
    )
  }
  if (kind === 'grid') {
    return (
      <svg {...common}>
        <rect width="300" height="400" fill={bg} />
        {Array.from({ length: 40 }).map((_, i) => {
          const col = i % 5
          const row = Math.floor(i / 5)
          const fill = (col + row) % 3 === 0 ? a : (col + row) % 3 === 1 ? b : c
          return <rect key={i} x={20 + col * 52} y={20 + row * 46} width="40" height="34" rx="4" fill={fill} opacity={0.35 + ((i * 7) % 6) / 9} />
        })}
      </svg>
    )
  }
  if (kind === 'strata') {
    return (
      <svg {...common}>
        <rect width="300" height="400" fill={bg} />
        {[a, b, c, a, b].map((f, i) => (
          <rect key={i} x="34" y={40 + i * 66} width="232" height={54} fill={f} opacity={0.9 - i * 0.12} />
        ))}
      </svg>
    )
  }
  if (kind === 'wave') {
    return (
      <svg {...common}>
        <rect width="300" height="400" fill={bg} />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M0 ${120 + i * 70} C 75 ${80 + i * 70}, 150 ${170 + i * 70}, 300 ${110 + i * 70}`}
            fill="none"
            stroke={[a, b, c, a][i]}
            strokeWidth="22"
            strokeLinecap="round"
          />
        ))}
      </svg>
    )
  }
  // orbit
  return (
    <svg {...common}>
      <rect width="300" height="400" fill={bg} />
      <circle cx="150" cy="200" r="110" fill="none" stroke={a} strokeWidth="10" />
      <circle cx="150" cy="200" r="64" fill={b} />
      <line x1="0" y1="200" x2="300" y2="200" stroke={c} strokeWidth="6" />
      <line x1="150" y1="0" x2="150" y2="400" stroke={c} strokeWidth="6" />
      <circle cx="150" cy="90" r="16" fill={c} />
    </svg>
  )
}

/* ---- fixture editions ---------------------------------------------------- */
const PRINTS = [
  { id: 'meridian-drift', name: 'Meridian Drift', year: '2024', edition: 'Limited edition of 30', category: 'Geometric', sizes: ['A3', 'A2', 'A1'], price: 220, priceISK: '31,900 ISK', tags: ['arcs', 'teal', 'archival'], kind: 'arcs', palette: ['#0e1c1e', '#1f6f6b', '#5fd1c4', '#f2e9d8'], desc: 'Nested quarter-arcs sweep from a single origin, each band a shade cooler than the last — a study in how a curve accelerates as it leaves the corner.' },
  { id: 'concrete-bloom', name: 'Concrete Bloom', year: '2023', edition: 'Open edition', category: 'Abstract', sizes: ['A3', 'A2'], price: 140, priceISK: '20,300 ISK', tags: ['grid', 'warm'], kind: 'grid', palette: ['#1a1510', '#c46b3d', '#e6a15a', '#f4ead7'], desc: 'A brick lattice of hand-weighted opacities. Read up close it is noise; step back and the field blooms into a soft diagonal gradient.' },
  { id: 'null-horizon', name: 'Null Horizon', year: '2024', edition: 'Limited edition of 25', category: 'Minimal', sizes: ['A3', 'A2', 'A1'], price: 260, priceISK: '37,700 ISK', tags: ['strata', 'dusk'], kind: 'strata', palette: ['#111015', '#3b3450', '#7a6f9c', '#d9c9a3'], desc: 'Five horizontal strata stacked like a printed dusk. Each band drops one step in opacity so the eye keeps sinking toward a horizon that never arrives.' },
  { id: 'ferrous-tide', name: 'Ferrous Tide', year: '2022', edition: 'Limited edition of 40', category: 'Abstract', sizes: ['A3', 'A2'], price: 190, priceISK: '27,500 ISK', tags: ['wave', 'rust'], kind: 'wave', palette: ['#141110', '#8a3b1e', '#c9662f', '#e8b070'], desc: 'Four oxidised waves rolling out of phase — the tide as a rust process, drawn in pigment rated to outlast the paper it sits on.' },
  { id: 'static-garden', name: 'Static Garden', year: '2025', edition: 'Open edition', category: 'Pattern', sizes: ['A3'], price: 120, priceISK: '17,400 ISK', tags: ['orbit', 'acid'], kind: 'orbit', palette: ['#0c0d08', '#c8ff00', '#e8df00', '#f5f0e8'], desc: 'A single acid orbit pinned by a cross-hair. The most reductive piece in the run and, printed, the loudest on any wall.' },
  { id: 'pale-circuit', name: 'Pale Circuit', year: '2023', edition: 'Limited edition of 30', category: 'Geometric', sizes: ['A3', 'A2', 'A1'], price: 240, priceISK: '34,800 ISK', tags: ['grid', 'cool'], kind: 'grid', palette: ['#0f1418', '#2b6f8f', '#63a7c4', '#e4eef2'], desc: 'The Concrete Bloom lattice re-plated in cold blues — a circuit board photographed at the exact moment before it powers on.' },
  { id: 'umbra-field', name: 'Umbra Field', year: '2024', edition: 'Limited edition of 20', category: 'Minimal', sizes: ['A3', 'A2'], price: 300, priceISK: '43,500 ISK', tags: ['strata', 'mono'], kind: 'strata', palette: ['#0b0b0b', '#2a2a2a', '#565656', '#c9c9c9'], desc: 'Greyscale strata with nowhere to hide. The smallest edition in the catalogue and the one that most rewards a considered light.' },
  { id: 'halcyon-break', name: 'Halcyon Break', year: '2025', edition: 'Open edition', category: 'Abstract', sizes: ['A3', 'A2'], price: 160, priceISK: '23,200 ISK', tags: ['arcs', 'sunrise'], kind: 'arcs', palette: ['#161019', '#b5476a', '#e9925a', '#f6d97a'], desc: 'Sunrise re-cut as concentric arcs — a warm front breaking over the corner of the sheet in three deliberate temperatures.' },
]

const SHIPPING = 'Worldwide shipping available. Prints ship flat in protective packaging within 5–10 business days, signed and numbered with a certificate of authenticity.'

/* ---- river card ---------------------------------------------------------- */
function PrintCard({ print, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left"
      aria-label={`View ${print.name}`}
    >
      <div className="aspect-[3/4] overflow-hidden rounded border border-fg-08 bg-surface-secondary transition-transform duration-500 group-hover:scale-[1.02]">
        <PrintArt kind={print.kind} palette={print.palette} />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className="kol-mono-12 truncate">{print.name}</p>
        <p className="kol-mono-12 text-fg-32 flex-shrink-0">{print.year}</p>
      </div>
    </button>
  )
}

/* ---- PDP media frames (art / detail crop / framed mockup) ---------------- */
function mediaFrames(print) {
  return [
    <div key="art" className="aspect-[3/4] w-[min(70vh,420px)] max-w-full overflow-hidden rounded shadow-lg">
      <PrintArt kind={print.kind} palette={print.palette} />
    </div>,
    <div key="detail" className="aspect-[3/4] w-[min(70vh,420px)] max-w-full overflow-hidden rounded shadow-lg">
      <PrintArt kind={print.kind} palette={print.palette} viewBox="60 80 150 200" />
    </div>,
    <div key="mockup" className="aspect-[3/4] w-[min(70vh,420px)] max-w-full overflow-hidden rounded bg-surface-primary p-8 shadow-lg">
      <div className="size-full overflow-hidden rounded-sm border border-fg-12">
        <PrintArt kind={print.kind} palette={print.palette} />
      </div>
    </div>,
  ]
}

export default function PrintsStore() {
  const [selected, setSelected] = useState(PRINTS[0])

  const specs = [
    { label: 'Edition', value: selected.edition },
    { label: 'Year', value: selected.year },
    { label: 'Category', value: selected.category },
    { label: 'Sizes', value: selected.sizes.join(', ') },
  ]

  const tabs = [
    { id: 'description', label: 'Description', content: <p>{selected.desc}</p> },
    {
      id: 'details',
      label: 'Details',
      content: (
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="kol-helper-uc-xs text-fg-48 mb-1">Edition</dt>
            <dd className="kol-mono-12">{selected.edition}</dd>
          </div>
          <div>
            <dt className="kol-helper-uc-xs text-fg-48 mb-1">Year</dt>
            <dd className="kol-mono-12">{selected.year}</dd>
          </div>
          <div>
            <dt className="kol-helper-uc-xs text-fg-48 mb-1">Sizes</dt>
            <dd className="kol-mono-12">{selected.sizes.join(', ')}</dd>
          </div>
        </dl>
      ),
    },
    {
      id: 'shipping',
      label: 'Shipping',
      content: (
        <div className="space-y-4">
          <p>Prints are carefully packaged flat in rigid protective mailers.</p>
          <p>International delivery typically takes 5–10 business days.</p>
          <p>Tracking is provided as soon as your order ships.</p>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full bg-surface-primary">
      {/* Hero — diagonal marquee river of editions */}
      <div id="prints-hero" className="relative">
        <DiagonalMarqueeRiver items={PRINTS} renderItem={(print) => <PrintCard print={print} onClick={() => setSelected(print)} />} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-4 px-6 pt-24 text-center mix-blend-difference" style={{ color: '#ffffff' }}>
          <p className="kol-helper-uc-xs tracking-[6px]">Kolkrabbi</p>
          <h1 className="kol-display-lg">Prints</h1>
          <p className="kol-mono-xs opacity-60">Archival editions — click a print to open it below</p>
        </div>
      </div>

      {/* Product detail for the selected print */}
      <ProductDetailLayout
        key={selected.id}
        mediaItems={mediaFrames(selected)}
        eyebrow={selected.category}
        title={selected.name}
        tags={selected.tags}
        specs={specs}
        tabs={tabs}
        price={{ amount: selected.price, currency: 'EUR', secondary: `(${selected.priceISK})` }}
        sizeOptions={selected.sizes}
        actions={
          <Button variant="primary" size="lg" className="w-full justify-center">
            Add to cart
          </Button>
        }
        shippingNote={SHIPPING}
        backLink={
          <a href="#prints-hero" className="kol-mono-12 text-fg-48 hover:text-auto">
            ← Back to all prints
          </a>
        }
      />
    </div>
  )
}
