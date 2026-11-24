import { Menu } from '@kolkrabbi/kol-component'

/* MenuEffects (Figma 220:21653): dropped from the Effects plus; icon and label per row, separators. The rows are the
   engine's (round 2, 3.1): the Layer Effects window's ten in its order, then "Shader effects…", which opens the picker
   (PopoverEffects) of the filter chain's stages, then the Vector effects group (W11.2): its heading and the seven,
   inset to the glyph column, as the file draws them. The host passes the rows; these are the specimen's. */
export const VECTOR_EFFECTS = [
  { key: 'offsetOn', label: 'Offset path' },
  { key: 'smoothOn', label: 'Smooth' },
  { key: 'puckerOn', label: 'Pucker & bloat' },
  { key: 'twistOn', label: 'Twist' },
  { key: 'warpOn', label: 'Warp' },
  { key: 'zigzagOn', label: 'Zigzag', icon: 'wave-tri' },
  { key: 'distressOn', label: 'Distress' },
]
export const vectorEffectsGroup = (rows = VECTOR_EFFECTS.map((e) => ({ label: e.label, icon: e.icon, value: `vfx:${e.key}` }))) => (
  { title: 'Vector effects', rows: rows.map((r) => ({ ...r, inset: true })) }
)
export const EFFECT_GROUPS = [
  { title: 'Layer Effects', rows: [{ label: 'Outer Shadow', icon: 'drop-circle' }, { label: 'Gaussian Blur', icon: 'transparency' }] },
  [{ label: 'Shader effects…', icon: 'sparkles' }],
  vectorEffectsGroup(),
]

export default function MenuEffects({ anchor, open, onClose, onSelect, groups = EFFECT_GROUPS }) {
  /* 202 wide, the file's MenuEffects (W9 9.1); no KOL size sits at 202 */
  return <Menu variant="kolbox" aria-label="Add effect" anchor={anchor} open={open} onClose={onClose} onSelect={(row) => onSelect?.(row)} groups={groups} panelClassName="w-[202px]" />
}
