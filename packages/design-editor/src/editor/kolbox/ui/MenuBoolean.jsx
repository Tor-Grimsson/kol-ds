import { Menu } from '@kolkrabbi/kol-component'

/* W13 state 6: dropped from the selection header's boolean chevron; icon and label per row, the current one
   checked. The rows are the engine's four operations under the real editor's names (round 2, 3.1: the actionbar's
   Boolean split, the Vector menu); the engine binds no shortcut to them, so none is drawn. value and onChange carry the
   engine's op ('unite' …); disabled: the selection cannot be combined (fewer than two eligible layers). */
export const BOOLEAN_OPS = [
  { value: 'unite', label: 'Unite', icon: 'boolean-unite' },
  { value: 'subtract', label: 'Subtract', icon: 'boolean-subtract' },
  { value: 'intersect', label: 'Intersect', icon: 'boolean-intersect' },
  { value: 'exclude', label: 'Exclude', icon: 'boolean-exclude' },
]

export default function MenuBoolean({ anchor, open, onClose, value = 'unite', onChange, disabled = false }) {
  return (
    <Menu variant="kolbox"
      aria-label="Boolean"
      anchor={anchor}
      open={open}
      onClose={onClose}
      onSelect={(row) => onChange?.(row.value)}
      groups={[BOOLEAN_OPS.map((op) => ({ ...op, disabled, check: op.value === value, highlighted: op.value === value }))]}
    />
  )
}
