import { useEffect, useState } from 'react'
import { Brand } from '@kolkrabbi/kol-styleguide'
import { useBrandTool } from 'media-fixture/wiring'

/* THE BRAND TOOL, ALONE (brand as a tool, 2026-09-27) — kol-styleguide's `Brand` over the fixture
 * brand. The wiring is media-fixture's `useBrandTool`, shared with media-shell's Brand tab, so both
 * render the same book; this app keeps only its routing — the page in the hash (`#assets`), so a
 * reload lands on the page you were reading. */

const parse = () => (location.hash === '#assets' ? 'assets' : 'brand')

export default function App() {
  const [view, setView] = useState(parse)
  useEffect(() => {
    const on = () => setView(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const onViewChange = (v) => { location.hash = v === 'assets' ? 'assets' : ''; setView(v); window.scrollTo(0, 0) }
  const brand = useBrandTool()

  return <Brand {...brand.props} view={view} onViewChange={onViewChange} />
}
