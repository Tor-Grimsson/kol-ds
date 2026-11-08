import { lazy, Suspense } from 'react'

/* Labs in the float chrome (plan-2026-11-05-float-editor 3.2): the package's `FloatLabsView` — kol-shell's FloatLayout
 * over the labs engine; the Rail's own expanded · collapsed · hidden replace the old A · B switch. */
const Labs = lazy(() => import('@kolkrabbi/design-editor').then((m) => {
  m.setNavigator(() => { window.location.hash = '' })
  return { default: m.FloatLabsView }
}))

export const bare = true

export default function FloatLabs() {
  return (
    <div className="dark h-dvh w-full overflow-hidden bg-surface-primary">
      <Suspense fallback={null}>
        <Labs />
      </Suspense>
    </div>
  )
}
