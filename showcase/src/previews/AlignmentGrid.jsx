import { AlignmentGrid } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* onAlign is the seam a consumer wires to "align these" — a no-op here. */
export const sizes = ['sm', 'xs', 'md', 'lg']
/* kolbox (W31.2 batch 3): the two strips as kolbox icon groups side by side; one size */
export const variants = ['default', 'kolbox']

const KOLBOX_ITEMS = [
  { axis: 'h', mode: 'start', icon: 'align-horizontal-left', title: 'Align left' },
  { axis: 'h', mode: 'center', icon: 'align-horizontal-center', title: 'Align horizontal centers' },
  { axis: 'h', mode: 'end', icon: 'align-horizontal-right', title: 'Align right' },
  { axis: 'v', mode: 'start', icon: 'align-vertical-top', title: 'Align top' },
  { axis: 'v', mode: 'center', icon: 'align-vertical-center', title: 'Align vertical centers' },
  { axis: 'v', mode: 'end', icon: 'align-vertical-bottom', title: 'Align bottom' },
]

export default function AlignmentGridPreview({ size = 'sm', variant = 'default' }) {
  if (variant === 'kolbox') return <div className="w-52"><AlignmentGrid variant="kolbox" items={KOLBOX_ITEMS} onAlign={() => {}} /></div>
  return (
    <div className="rounded border border-fg-16 bg-surface-primary p-3">
      <AlignmentGrid size={size} onAlign={() => {}} />
    </div>
  )
}
