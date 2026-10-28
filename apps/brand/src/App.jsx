import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PageHero, SiteLayout } from '@kolkrabbi/kol-framework'
import { ContentCard, ContentCollection } from '@kolkrabbi/kol-component'
import { VOYAGER } from 'voyager-fixture'

/* THE BRAND HOME (BrandAppStructure, user ruling 2026-10-27) — the front door over the two brand apps:
 *
 *   Sections  apps/brand-sections   every building block a brand is made of, one route each (apps/brand until today)
 *   Lab       apps/brand-lab        where a brand is made — the color, type-scale and lockup builders over one draft
 *
 * A site, so kol-framework's `SiteLayout` and the site rail, with the sites' wash. Each app runs on its own port in dev
 * and under its own slug built, so a card and a rail row leave this app for that one. */

const APPS = [
  { id: 'sections', slug: 'brand-sections', port: 5207, label: 'Sections', icon: 'grid', eyebrow: 'apps/brand-sections',
    body: 'Every building block a brand is made of, one page each: color, type, logo, stationery, assets.', media: VOYAGER.assets.MOOD[0]?.url },
  { id: 'lab', slug: 'brand-lab', port: 5203, label: 'Lab', icon: 'layers', eyebrow: 'apps/brand-lab',
    body: 'Where a brand is made: the color builder, the type-scale generator and the lockup builder over one draft.', media: VOYAGER.assets.MOOD[1]?.url },
]
const href = (a) => (import.meta.env.DEV ? `${location.protocol}//${location.hostname}:${a.port}/` : `/apps/${a.slug}/`)

const NAV = [
  { id: 'home', label: 'Home', icon: 'home-01', to: '/' },
  ...APPS.map((a) => ({ id: a.id, label: a.label, icon: a.icon, to: `/${a.id}` })),
]

function Home() {
  return (
    <div className="kol-page flex flex-col gap-10">
      <PageHero label="Brand" title={VOYAGER.brand.meta.name} lede="The brand's building blocks, and the lab it is made in." />
      <ContentCollection min="280px">
        {APPS.map((a) => (
          <ContentCard key={a.id} variant="article" ratio="16 / 9" eyebrow={a.eyebrow} title={a.label} body={a.body}
            media={a.media && <img src={a.media} alt="" className="size-full object-cover" />}
            onClick={() => location.assign(href(a))} />
        ))}
      </ContentCollection>
    </div>
  )
}

/* a rail row for an app is a door: the route hands over to that app */
function Leave({ app }) {
  useEffect(() => { location.replace(href(app)) }, [app])
  return null
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<SiteLayout navTree={NAV} sideNav={{ footer: false }} pageWash="var(--kol-fg-02)" />}>
          <Route path="/" element={<Home />} />
          {APPS.map((a) => <Route key={a.id} path={`/${a.id}`} element={<Leave app={a} />} />)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
