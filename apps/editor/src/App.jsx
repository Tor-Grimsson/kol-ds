import { lazy, Suspense } from 'react'
import { fixtureClient } from 'media-fixture'

/* THE EDITOR, ALONE (deconstruction roadmap, 2026-09-27) — @kolkrabbi/design-editor from its
 * source, browsing the fixture bucket instead of the Kolkrabbi CDN, with its preferences in
 * the fake D1's `tool_settings` row for `editor`. A real D1 later replaces this one object.
 *
 * `/core` mounts the CORE entry instead — the editor with no layer packs (no generators,
 * effects or motion), which is what a consumer gets from `@kolkrabbi/design-editor/core`.
 * Each entry is its own lazy import, so on /core the packs are never loaded, never registered. */

const settingsStore = {
  load: () => fixtureClient.loadToolSettings('editor'),
  save: (s) => fixtureClient.saveToolSettings('editor', s),
}

const CORE = /\/core\/?$/.test(location.pathname)
const Editor = lazy(() =>
  (CORE ? import('@kolkrabbi/design-editor/core') : import('@kolkrabbi/design-editor'))
    .then((m) => ({ default: m.DesignEditor })))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Editor mediaClient={fixtureClient} settingsStore={settingsStore} />
    </Suspense>
  )
}
