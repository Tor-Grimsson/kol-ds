import { useEffect, useState } from 'react'
import { AppHub } from '@kolkrabbi/kol-shell'
import { GrowthLineStage } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

/* THE GROWTH LAB (GrowthLineStage, kol-atlas 2026-10-30) — @kolkrabbi/kol-growth proved before a consumer switches:
 * kol-component's GrowthLineStage full-bleed, one page per shape. Orb is kol-fxr's signed-out stage; Path grows into a
 * bare SVG `d` (a hexagon) — a solid shape wants a wider minGap so it fills before the cap — the way kol-atlas grows its mark. Nothing on screen is drawn here. */

const HEX_D = 'M50 0L93.3 25V75L50 100L6.7 75V25Z'
/* Outline is kol-atlas's home (GrowthLineSeedOutline 2026-11-01): a solid hexagon at 0.4 of the short side, Atlas's
 * params, the line seeded on its edge so it fills inward (Atlas masks the stage to the hexagon; here it is unmasked) */
const HEX_24 = 'M12 1 L21.526 6.5 L21.526 17.5 L12 23 L2.474 17.5 L2.474 6.5 Z'
const HEX_SOLID = (w, h) => {
  const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h)
  const g = c.getContext('2d'), s = 0.4 * Math.min(w, h)
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
  g.translate((w - s) / 2, (h - s) / 2); g.scale(s / 24, s / 24)
  g.fillStyle = '#000'; g.fill(new Path2D(HEX_24))
  return c
}
const PAGES = {
  '/orb': { shape: 'orb' },
  '/path': { shape: HEX_D, params: { minGap: 8, maxGap: 32, contrast: 1.4, growth: 8 } },
  '/outline': { shape: HEX_SOLID, seed: 'outline', params: { minGap: 5, maxGap: 18, contrast: 1.2, growth: 10 } },
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
      items={[{ icon: 'circle', path: '/orb', label: 'Orb' }, { icon: 'polygon', path: '/path', label: 'Path' }, { icon: 'polygon', path: '/outline', label: 'Outline' }]}
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
