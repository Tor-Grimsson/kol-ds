import { DocumentCapsule } from '@kolkrabbi/kol-shell'

/* the open document (the gap map's row 71): ← · the name with its ▾ menu · ✓ Saved, on each surface */
const MENU = [{ label: 'Rename', icon: 'pencil', onPress: () => {} }, { label: 'Duplicate', icon: 'layers', onPress: () => {} }, { label: 'Move to…', icon: 'folder', onPress: () => {} }]

export const variants = ['default', 'kolbox']

export default function DocumentCapsulePreview({ variant = 'default' }) {
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <DocumentCapsule variant="kolbox" name="Untitled" onMenu={() => {}} />
  )
  return (
    <div className="flex flex-wrap items-start gap-8">
      <DocumentCapsule name="Still in motion" status="✓ Saved" onBack={() => {}} menuItems={MENU} />
      <DocumentCapsule name="Still in motion" status="✓ Saved" onBack={() => {}} menuItems={MENU} surface="glass-dark" />
      <DocumentCapsule name="Still in motion" status="✓ Saved" onBack={() => {}} menuItems={MENU} surface="glass-light" />
    </div>
  )
}
