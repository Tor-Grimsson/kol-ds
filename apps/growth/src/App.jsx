import { useEffect, useState } from 'react'
import { AppHub } from '@kolkrabbi/kol-shell'
import { GrowthLineStage } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

/* THE GROWTH LAB (GrowthLineStage, kol-atlas 2026-10-30) — @kolkrabbi/kol-growth proved before a consumer switches:
 * kol-component's GrowthLineStage full-bleed, one page per shape. Orb is kol-fxr's signed-out stage; Path grows into a
 * bare SVG `d` (a hexagon) — a solid shape wants a wider minGap so it fills before the cap — the way kol-atlas grows its mark. Nothing on screen is drawn here. */

const HEX_D = 'M50 0L93.3 25V75L50 100L6.7 75V25Z'
const PAGES = {
  '/orb': { shape: 'orb' },
  '/path': { shape: HEX_D, params: { minGap: 8, maxGap: 32, contrast: 1.4, growth: 8 } },
}

const parse = () => { const p = decodeURIComponent(location.hash.slice(1)); return PAGES[p] ? p : '/orb' }

const APP = {
  name: 'Growth',
  subtitle: 'The growing line',
  logomark,
  defaultTheme: 'dark',
  about: 'One closed line that grows into a shape and never crosses itself, on @kolkrabbi/kol-growth. Move the pointer to push it, press to blast it.',
  links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }],
}

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return (
    <AppHub
      app={APP}
      items={[{ icon: 'circle', path: '/orb', label: 'Orb' }, { icon: 'polygon', path: '/path', label: 'Path' }]}
      currentPath={path}
      onNavigate={(p) => { location.hash = encodeURI(p) }}
      homePath="/orb"
      dev={{ tabs: [] }}
    >
      <div className="h-dvh min-h-0">
        <GrowthLineStage key={path} {...PAGES[path]} className="text-fg-48" />
      </div>
    </AppHub>
  )
}
