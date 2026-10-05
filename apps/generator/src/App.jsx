import { lazy, Suspense } from 'react'
import { fixtureClient } from 'media-fixture'

/* THE GENERATOR, ALONE (2026-10-05). `MobileView` from @kolkrabbi/design-editor's source — the
 * randomiser, its two tools Generate and Effects — with no shell and no rail around it: the tool is
 * the page. Media is the fixture bucket; preferences sit in the fake D1's `tool_settings` row for
 * `generator`.
 *
 * `apps/editor` mounts the same chrome beside the others, and `apps/editor-hub` inside kol-fxr's
 * shell. This one is where the generator's own frame is worked on.
 *
 * ITS DOORS LEAVE THE APP. On a touch device the entry card offers Labs (and Editor on a tablet);
 * the package routes those through its navigator, and here each is another app. */

const APPS = import.meta.env.DEV
  ? { '/labs': 'http://localhost:5199/', '/editor': 'http://localhost:5180/editor' }
  : { '/labs': '/apps/labs/', '/editor': '/apps/editor/editor' }

const settingsStore = {
  load: () => fixtureClient.loadToolSettings('generator'),
  save: (s) => fixtureClient.saveToolSettings('generator', s),
}

const Generator = lazy(() => import('@kolkrabbi/design-editor').then((m) => {
  m.setMediaClient(fixtureClient)
  m.setSettingsStore(settingsStore)
  m.setNavigator((p) => { if (APPS[p]) window.location.assign(APPS[p]) })
  return { default: m.MobileView }
}))

export default function App() {
  return <Suspense fallback={null}><Generator /></Suspense>
}
