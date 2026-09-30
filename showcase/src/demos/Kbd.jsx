import { Kbd } from '@kolkrabbi/kol-component'

export const stage = 'hug'

export default function KbdDemo() {
  return (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 kol-helper-12 text-fg-48"><Kbd icon="corner-down-left" />Go to page</span>
      <span className="flex items-center gap-2"><Kbd size="sm" icon="command">K</Kbd><Kbd size="sm">Esc</Kbd></span>
    </div>
  )
}
