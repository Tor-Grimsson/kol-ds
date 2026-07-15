import { useState } from 'react'
import { PrintsGrid } from '@kolkrabbi/kol-store'

export const stage = 'full'

/* Consumer-built catalog — PrintsGrid derives its Category / Year filter
 * facets from these records. `shuffle` is off so the demo order is stable;
 * clicking a card flips it via `activeSlug` (the FLIP-into-detail hook). */
const PRINTS = [
  { id: 1, slug: 'hverfjall-i', name: 'Hverfjall I', category: 'Volcanic', year: 2026, image: '/kol-images/tt-01.jpg' },
  { id: 2, slug: 'basalt-field', name: 'Basalt Field', category: 'Volcanic', year: 2025, image: '/kol-images/tt-02.jpg' },
  { id: 3, slug: 'black-sand', name: 'Black Sand', category: 'Coastal', year: 2025, image: '/kol-images/tt-03.jpg' },
  { id: 4, slug: 'rift-valley', name: 'Rift Valley', category: 'Glacial', year: 2024, image: '/kol-images/tt-04.jpg' },
  { id: 5, slug: 'caldera', name: 'Caldera', category: 'Volcanic', year: 2026, image: '/kol-images/tt-05.jpg' },
  { id: 6, slug: 'moss-lava', name: 'Moss Lava', category: 'Glacial', year: 2025, image: '/kol-images/tt-06.jpg' },
  { id: 7, slug: 'ash-plume', name: 'Ash Plume', category: 'Coastal', year: 2024, image: '/kol-images/tt-07.jpg' },
]

export default function PrintsGridDemo() {
  const [activeSlug, setActiveSlug] = useState(null)
  return (
    <PrintsGrid
      prints={PRINTS}
      title="All Prints"
      shuffle={false}
      activeSlug={activeSlug}
      onCardClick={(rect, slug) => setActiveSlug(slug === activeSlug ? null : slug)}
    />
  )
}
