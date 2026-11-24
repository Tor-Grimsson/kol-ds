import { useState } from 'react'
import { Button, RailHeader } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* RailHeader — float (title, an action, the 12 fold chevron — open and folded), then the default (the rail kit's title line) */
export const variants = ['default', 'kolbox']

export default function RailHeaderPreview({ variant = 'default' }) {
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <div className="flex w-60 flex-col">
      <RailHeader variant="kolbox" title="Flow" subtitle="obstacles" actions={<Button variant="kolbox" iconOnly="x" aria-label="Close" />} />
      <RailHeader variant="kolbox" size="sm" title="Untitled" actions={<Button variant="kolbox" iconOnly="panel-left" aria-label="Collapse" />} />
    </div>
  )
  const [folded, setFolded] = useState(false)
  return (
    <div className="dark flex w-[264px] flex-col gap-4 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
      <RailHeader variant="float" title="Properties" folded={folded} onFold={() => setFolded((f) => !f)}
        actions={<Button variant="float" tone="ghost" size="sm" iconOnly="panel-right" aria-label="Collapse" />} />
      <RailHeader variant="float" title="Contents" folded onFold={() => {}} />
      <RailHeader title="Inspector" />
    </div>
  )
}
