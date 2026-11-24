import { Menu } from '@kolkrabbi/kol-component'

/* W13 state 3: dropped from the Appearance title's blend button; a check on the current mode. The modes are the host's
   (the editor passes the engine's own list, one group as the real Blend dropdown has it, round 2, 3.1); these are the
   specimen's. modes: [{ value, label }]; value: the current mode's value; onChange(value). */
export const BLEND_SPECIMEN = [{ value: 'normal', label: 'Normal' }, { value: 'multiply', label: 'Multiply' }, { value: 'screen', label: 'Screen' }]

export default function MenuBlendMode({ anchor, open, onClose, modes = BLEND_SPECIMEN, value = 'normal', onChange }) {
  return (
    <Menu variant="kolbox"
      aria-label="Blend mode"
      anchor={anchor}
      open={open}
      onClose={onClose}
      onSelect={(row) => onChange?.(row.value)}
      groups={[modes.map((m) => ({ label: m.label, value: m.value, check: m.value === value, highlighted: m.value === value }))]}
    />
  )
}
