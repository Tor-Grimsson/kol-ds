import { PanelsRestore } from '@kolkrabbi/kol-shell'

/* Panels ▾ with its rows (the gap map's row 79), one per surface */
const PANELS = [{ label: 'Side panel', icon: 'panel-right', onPress: () => {} }, { label: 'Task index', icon: 'list-bullet', onPress: () => {} }]

export default function PanelsRestorePreview() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <PanelsRestore items={PANELS} />
      <PanelsRestore items={PANELS} surface="glass-dark" />
      <PanelsRestore items={PANELS} surface="glass-light" />
    </div>
  )
}
