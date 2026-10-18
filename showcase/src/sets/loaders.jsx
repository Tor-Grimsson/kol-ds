import { useState } from 'react'
import { Button, LoaderOverlay, Table } from '@kolkrabbi/kol-component'
import { LoaderIntro } from '@kolkrabbi/kol-foundry'
import { Icon } from '@kolkrabbi/kol-icons'

/* THE LOADERS SET (AppLoader, kol-monitor 2026-10-17 — user: "even if we remove them, its just nice to see what we
 * have"): every loader the estate runs, one convention — Loader<Job>. The KOL's three run here; the others live
 * in their own repos and are listed where they are. */
export const meta = {
  title: 'Loaders',
  description: 'Every loader in the estate',
  category: 'feedback',
  type: 'reference',
  status: 'active',
  updated: '2026-10-17',
  tags: ['domain/components', 'pattern/feedback'],
}
export const stage = 'full'

const PULSE = '@keyframes kol-loaders-pulse{50%{opacity:.35}} @media (prefers-reduced-motion: reduce){.kol-loaders-pulse{animation:none!important}}'

/* LoaderApp is static HTML written into index.html by `loaderApp()` — drawn here as index.html draws it */
function LoaderAppSpecimen() {
  return (
    <div className="flex items-center justify-center rounded" style={{ height: 220, background: '#121215', color: '#FFFFFF' }}>
      <style>{PULSE}</style>
      <span className="kol-loaders-pulse inline-flex" style={{ animation: 'kol-loaders-pulse 1.6s ease-in-out infinite' }}><Icon name="kol-ds" size={64} /></span>
    </div>
  )
}

const OTHERS = [
  { id: 'web', name: 'kolkrabbi.io intro', where: 'kol-website · apps/web/src/components/layout/IntroLoader.jsx', note: 'moves onto LoaderIntro' },
  { id: 'olina', name: 'olina entry loader', where: 'kol-olina · apps/web/src/components/Loader.jsx', note: 'stays — the client’s brand' },
  { id: 'acyr', name: 'acyr intro', where: 'kol-acyr-website · apps/website/src/components/site/IntroLoader.jsx', note: 'stays — the client’s brand' },
  { id: 'fxr', name: 'fxr · mirror app loaders', where: 'kol-fxr · kol-mirror index.html', note: 'replaced by LoaderApp' },
]

export default function LoadersSet() {
  const [overlay, setOverlay] = useState(false)
  const [intro, setIntro] = useState(false)
  return (
    <div className="flex w-full flex-col gap-10 p-8">
      <section className="flex flex-col gap-3">
        <span className="kol-helper-14 text-emphasis">LoaderApp</span>
        <span className="kol-mono-12 text-meta">While the bundle downloads — static HTML from `loaderApp({'{'} graphic {'}'})` (kol-framework/vite), gone after first paint via `hideLoaderApp()`.</span>
        <LoaderAppSpecimen />
      </section>
      <section className="flex flex-col gap-3">
        <span className="kol-helper-14 text-emphasis">LoaderIntro</span>
        <span className="kol-mono-12 text-meta">A site's first-visit intro (kol-foundry) — the wordmark, then the cue; click to enter.</span>
        <div className="relative overflow-hidden rounded" style={{ height: 320 }}>
          {intro ? <LoaderIntro dismissOnClick onComplete={() => setIntro(false)} /> : <div className="flex h-full items-center justify-center"><Button onClick={() => setIntro(true)}>Play LoaderIntro</Button></div>}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <span className="kol-helper-14 text-emphasis">LoaderOverlay</span>
        <span className="kol-mono-12 text-meta">The in-app wait: a slot over everything (kol-component).</span>
        <div><Button onClick={() => setOverlay(true)}>Play LoaderOverlay</Button></div>
        {overlay && <LoaderOverlay loader={<LoaderIntro dismissOnClick onComplete={() => setOverlay(false)} />} />}
      </section>
      <section className="flex flex-col gap-3">
        <span className="kol-helper-14 text-emphasis">Elsewhere</span>
        <Table width="column" caption="Loaders that live in other repos" columns={[{ accessor: 'name', header: 'Loader' }, { accessor: 'where', header: 'Where' }, { accessor: 'note', header: 'Decided' }]} rows={OTHERS} />
      </section>
    </div>
  )
}
