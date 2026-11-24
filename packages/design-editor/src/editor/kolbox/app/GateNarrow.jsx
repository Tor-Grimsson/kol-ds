import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { Button, useMediaQuery } from '@kolkrabbi/kol-component'

/* The editor's narrow-window gate (round 4, W15): the real editor's NarrowWindowNote (design-editor Editor.jsx) in
   kolbox's kit. Under 1024 (the real EDITOR_BELOW: two rails and a menu bar want it) the editor stands down and this
   card shows on the dim: "Editor", "Needs a window at least 1024 wide", "Labs and the randomiser work at this size.",
   then Labs, Randomiser (each its glyph at both ends) and "Open the editor anyway", which lets the editor through for
   this visit. Mounted by App round the editor route, so the editor itself is untouched. */
const EDITOR_BELOW = 1024
const go = (hash) => () => { window.location.hash = hash }

const Door = ({ icon, label, onClick }) => (
  <Button variant="kolbox" tone="primary" className="h-10 w-full justify-between!" iconLeft={icon} onClick={onClick}>
    {label}
    <Icon name={icon} />
  </Button>
)

export default function GateNarrow({ children }) {
  const narrow = useMediaQuery(`(max-width: ${EDITOR_BELOW - 1}px)`)
  const [anyway, setAnyway] = useState(false)
  if (!narrow || anyway) return children
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dim p-6" data-gate-narrow>
      <section role="dialog" aria-label="Editor" className="flex w-full max-w-sm flex-col gap-6 rounded-modal bg-panel p-8 kol-kolbox-surface">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-meta text-muted uppercase">Editor</span>
          <span className="font-mono text-title text-text">Needs a window at least {EDITOR_BELOW} wide</span>
          <span className="font-mono text-value text-muted">Labs and the randomiser work at this size.</span>
        </div>
        <div className="flex flex-col gap-2">
          <Door icon="globe" label="Labs" onClick={go('#/labs')} />
          <Door icon="refresh" label="Randomiser" onClick={go('#/randomiser')} />
          <Button variant="kolbox" tone="secondary" className="h-10 w-full" onClick={() => setAnyway(true)}>Open the editor anyway</Button>
        </div>
      </section>
    </div>
  )
}
