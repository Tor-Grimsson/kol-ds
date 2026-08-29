import { useRef, useState } from 'react'
import { Button, QuadrantSync } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * QuadrantSync names an element and emits one sync line both sides restate,
 * so a UI conversation stops being about different nodes. The chrome is
 * viewport-fixed on purpose — in real use it floats over the app you are
 * already working in — so it mounts on demand rather than hijacking this page.
 *
 * Click a card to name it, then click cells on its grid. The grid always lands
 * on what YOU named; the owner is reported, never substituted.
 */
export default function QuadrantSyncDemo() {
  const [mounted, setMounted] = useState(false)
  const [line, setLine] = useState('')
  const rootRef = useRef(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setMounted((v) => !v)}>
          {mounted ? 'Unmount overlay' : 'Mount overlay'}
        </Button>
        {line ? <span className="kol-mono-12 text-fg-64">{line}</span> : null}
      </div>
      <span className="kol-helper-12 text-fg-48">
        Dev-only chrome — it renders nothing when NODE_ENV is production.
      </span>

      {/* the specimen: nodes carry data-handle on divs that already exist */}
      <div
        ref={rootRef}
        data-handle="DemoStage"
        data-source="local"
        className="w-full rounded border border-fg-16 bg-fg-04 p-4"
      >
        <div data-handle="DemoCardRow" data-source="local" className="flex gap-3">
          {['Intake', 'Assign', 'Ship'].map((name) => (
            <div
              key={name}
              data-handle={`DemoCard.${name.toLowerCase()}`}
              data-source="@kolkrabbi/kol-component"
              className="flex min-h-[120px] flex-1 flex-col gap-2 rounded border border-fg-16 bg-surface-primary p-3"
            >
              <span className="kol-helper-12 text-fg-96">{name}</span>
              <div className="bg-fg-16 h-2 w-4/5 rounded-sm" />
              <div className="bg-fg-16 h-2 w-3/5 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {mounted && (
        <QuadrantSync
          root={rootRef.current}
          initialHandle="DemoCardRow"
          onSyncLine={setLine}
          enabled
        />
      )}
    </div>
  )
}
