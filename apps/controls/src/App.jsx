import { useEffect, useState } from 'react'
import { PageHeader, SegmentedToggle } from '@kolkrabbi/kol-component'
import Parametric from './pages/Parametric.jsx'
import AppControls from './pages/AppControls.jsx'
import Compositions from './pages/Compositions.jsx'

/* THE CONTROLS REFERENCE (deconstruction roadmap §2, 2026-09-27) — every value changer the DS
 * ships and the compositions consumers build from them. Not wired to anything: it is the
 * picture a consumer diffs against, and each specimen says where the same thing is still
 * hand-built. The page rides the hash (`#app`, `#compositions`) so a reload stays put. */

const PAGES = [
  { value: 'parametric', label: 'Parametric', Page: Parametric },
  { value: 'app', label: 'App controls', Page: AppControls },
  { value: 'compositions', label: 'Compositions', Page: Compositions },
]
const parse = () => PAGES.find((p) => `#${p.value}` === location.hash)?.value ?? 'parametric'

export default function App() {
  const [page, setPage] = useState(parse)
  useEffect(() => {
    const on = () => setPage(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (v) => { location.hash = v === 'parametric' ? '' : v; setPage(v) }
  const { Page } = PAGES.find((p) => p.value === page)

  return (
    <div className="mx-auto w-full max-w-[var(--kol-content-shell)] px-4 py-8 md:px-8">
      <PageHeader
        eyebrow="Apps tier"
        title="Controls"
        subtitle="Every value changer the design system ships, and the panels consumers build from them. A reference to diff against — nothing here is wired."
      />
      <SegmentedToggle value={page} onChange={go} options={PAGES} size="sm" />
      <Page />
    </div>
  )
}
