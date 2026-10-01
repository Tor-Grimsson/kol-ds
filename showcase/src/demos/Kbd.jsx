import { Kbd } from '@kolkrabbi/kol-component'

export const stage = 'hug'

export const sizes = ['md', 'sm']

export default function KbdDemo({ size = 'md' }) {
  return (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 kol-helper-12 text-fg-48"><Kbd size={size} icon="corner-down-left" />Go to page</span>
      <span className="flex items-center gap-2"><Kbd size={size} icon="command">K</Kbd><Kbd size={size}>Esc</Kbd></span>
    </div>
  )
}
