import { Kbd, KbdKeys } from '@kolkrabbi/kol-component'

export const stage = 'hug'

export const sizes = ['md', 'sm']
export const variants = ['default', 'kolbox']

export default function KbdPreview({ size = 'md', variant = 'default' }) {
  /* kolbox (W31.2): one cap per key (KbdKeys), kolbox's mono steps; on a lit accent row the on-accent ink */
  if (variant === 'kolbox') {
    return (
      <div className="flex items-center gap-6">
        <KbdKeys variant="kolbox" size={size} keys="⌘⇧S" />
        <KbdKeys variant="kolbox" size={size} keys="⌘K" />
        <span className="flex items-center rounded-[var(--kol-radius-4)] bg-[var(--kol-accent-primary)] px-2 py-1"><KbdKeys variant="kolbox" size={size} keys="⌘D" onAccent /></span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 kol-helper-12 text-fg-48"><Kbd size={size} icon="corner-down-left" />Go to page</span>
      <span className="flex items-center gap-2"><Kbd size={size} icon="command">K</Kbd><Kbd size={size}>Esc</Kbd></span>
    </div>
  )
}
