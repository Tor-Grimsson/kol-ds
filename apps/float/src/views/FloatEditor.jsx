import { lazy, Suspense } from 'react'

/* The float editor — his Section 5 (20:12208), working (plan-2026-11-05-float-editor W2): the package's
 * `FloatDesignEditor` — FloatEditorShell over the editor's own engine and state. The layout-only W1 view is in
 * `_tmp/2026-11-05-float-editor-layout/`. Loaded on demand: the engine is the heavy part of this app. The editor's
 * in-package hops (Home, the chromes, Library, Settings) land on this app's home — apps/float has no such routes. */
const Editor = lazy(() => import('@kolkrabbi/design-editor').then((m) => {
  m.setNavigator(() => { window.location.hash = '' })
  return { default: m.FloatDesignEditor }
}))

export const bare = true

export default function FloatEditor() {
  return (
    <div className="dark h-dvh w-full overflow-hidden bg-surface-primary">
      <Suspense fallback={null}>
        <Editor />
      </Suspense>
    </div>
  )
}
