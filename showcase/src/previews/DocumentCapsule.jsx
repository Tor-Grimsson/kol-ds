import { DocumentCapsule } from '@kolkrabbi/kol-shell'

/* the open document (the gap map's row 71): ← · the name with its ▾ menu · ✓ Saved, on each surface */
const MENU = [{ label: 'Rename', icon: 'pencil', onPress: () => {} }, { label: 'Duplicate', icon: 'layers', onPress: () => {} }, { label: 'Move to…', icon: 'folder', onPress: () => {} }]

export default function DocumentCapsulePreview() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <DocumentCapsule name="Still in motion" status="✓ Saved" onBack={() => {}} menuItems={MENU} />
      <DocumentCapsule name="Still in motion" status="✓ Saved" onBack={() => {}} menuItems={MENU} surface="glass-dark" />
      <DocumentCapsule name="Still in motion" status="✓ Saved" onBack={() => {}} menuItems={MENU} surface="glass-light" />
    </div>
  )
}
