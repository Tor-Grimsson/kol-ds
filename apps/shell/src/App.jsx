import { useEffect, useState } from 'react'
import { AppShell, PageShell } from '@kolkrabbi/kol-shell'
import { PageHeader } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'

/* THE SHELL'S REFERENCE APP (apps review 2026-09-29) — kol-shell's AppShell ALONE: the rail, the
 * layout root, the nav keys and, below 768, the phone bar. No Hub (that is apps/hub). Ten
 * placeholder pages on purpose — past five the bar shows four and More, and this app is where
 * that overflow is always on screen.
 *
 * Routing is the hash, so a reload lands where you were. */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const PAGES = [
  { icon: 'folder', path: '/one', label: 'One' },
  { icon: 'layers', path: '/two', label: 'Two' },
  { icon: 'edit', path: '/three', label: 'Three' },
  { icon: 'rectangle', path: '/four', label: 'Four' },
  { icon: 'book-open', path: '/five', label: 'Five' },
  { icon: 'grid', path: '/six', label: 'Six' },
  { icon: 'code', path: '/seven', label: 'Seven' },
  { icon: 'music-note', path: '/eight', label: 'Eight' },
  { icon: 'image', path: '/nine', label: 'Nine' },
  { icon: 'hash-01', path: '/ten', label: 'Ten' },
]
const SETTINGS = [{ icon: 'nav-settings', path: '/settings', label: 'Settings' }]

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const page = [...PAGES, ...SETTINGS].find((p) => p.path === path)

  return (
    <AppShell
      items={PAGES}
      bottomItems={SETTINGS}
      logomark={{ svgUrl: logomark, title: 'Shell' }}
      currentPath={path}
      onNavigate={navigate}
      railToggleKey={'\\'}
      settingsPath="/settings"
      settingsKey=","
      navKeys
      touch="bar"
    >
      <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
        <PageHeader title={(page?.label ?? 'Shell').toUpperCase()} />
        <div className="flex-1 min-h-0 rounded border border-dashed border-oq-12" />
      </PageShell>
    </AppShell>
  )
}
