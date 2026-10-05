import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AppShell } from '@kolkrabbi/kol-shell'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import { fixtureClient } from 'media-fixture'

/* LABS, ALONE (2026-10-05 — the user: "we can develop it better like this"). `LabsView` from
 * @kolkrabbi/design-editor's source and nothing around it: no Home, no Library, no other chrome.
 * The rail is labs' own — its catalog rows, published into the package's railExtras store — so on a
 * phone the hamburger opens exactly that. Media is the fixture bucket; preferences sit in the fake
 * D1's `tool_settings` row for `labs`.
 *
 * `apps/editor` mounts the same chrome beside the others, and `apps/editor-hub` inside kol-fxr's
 * shell. This one is where labs' own frame is worked on. A pick is the URL (`?preset=<id>`),
 * written by labs itself. */

const settingsStore = {
  load: () => fixtureClient.loadToolSettings('labs'),
  save: (s) => fixtureClient.saveToolSettings('labs', s),
}

/* LabsView never passes through DesignEditor's props, so the host configures the package once, as
 * the entry loads (apps/editor's note) */
const full = import('@kolkrabbi/design-editor').then((m) => {
  m.setMediaClient(fixtureClient)
  m.setSettingsStore(settingsStore)
  return m
})
const Labs = lazy(() => full.then((m) => ({ default: m.LabsView })))

export default function App() {
  const [api, setApi] = useState(null)
  const [extras, setExtras] = useState({ items: [] })

  useEffect(() => {
    let live = true
    full.then((m) => { if (live) setApi(m) })
    return () => { live = false }
  }, [])

  /* ONE element: labs republishes its rail rows on every render, and those rows re-render this
   * component — a fresh page each time is a loop (apps/editor carries the same note) */
  const page = useMemo(() => <Labs />, [])

  return (
    <AppShell
      items={extras.items}
      logomark={{ svgUrl: logomark, title: 'KOL labs' }}
      currentPath=""
      onNavigate={(p) => {
        /* every row is a labs pick; it swaps the layer without a route change, and the drawer
         * closes only on `currentPath`, so press its own scrim (kol-fxr's AppLayout does the same) */
        if (api && p?.startsWith(api.RAIL_EXTRA_PREFIX) && extras.dispatch?.(p)) document.querySelector('.kol-shell-drawer-scrim')?.click()
      }}
      railToggleKey={'\\'}
      touch="drawer"
      pageWash="var(--kol-fg-02)"
    >
      {api && <ExtrasBridge useRailExtras={api.useRailExtras} onChange={setExtras} />}
      <Suspense fallback={null}>{page}</Suspense>
    </AppShell>
  )
}

/* reads the package's railExtras hook and lifts it into App's state — a hook from a lazily loaded
 * module can only be called from a component that mounts after the module is in */
function ExtrasBridge({ useRailExtras, onChange }) {
  const extras = useRailExtras()
  useEffect(() => { onChange(extras) }, [extras, onChange])
  return null
}
