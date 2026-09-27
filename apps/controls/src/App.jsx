import { useEffect, useState } from 'react'
import { PageHeader, SegmentedToggle } from '@kolkrabbi/kol-component'
import { PageShell } from '@kolkrabbi/kol-shell'
import Parametric from './pages/Parametric.jsx'
import AppControls from './pages/AppControls.jsx'
import Compositions from './pages/Compositions.jsx'

/* THE CONTROLS REFERENCE (deconstruction roadmap §2, 2026-09-27) — every value changer the DS
 * ships and the compositions consumers build from them. Not wired to anything: it is the
 * picture a consumer diffs against, and each specimen says where the same thing is still
 * hand-built. The page rides the hash (`#app`, `#compositions`) so a reload stays put.
 *
 * THE TOOL FRAME, AS A REFERENCE PAGE (app anatomy § Tool frame, 2026-09-27): PageShell bleed, the
 * title-only masthead with the page switch on its right — but it SCROLLS, because a specimen list
 * is a list, not a tool that must fit the window. */

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
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="CONTROLS" actions={<SegmentedToggle value={page} onChange={go} options={PAGES} size="sm" />} />
      <Page />
    </PageShell>
  )
}
