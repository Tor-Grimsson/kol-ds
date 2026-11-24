// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12151
// source=packages/component/src/molecules/TreeRow.jsx
// component=TreeRow
import figma from 'figma'

// TreeRow variant="kolbox": the layer and list row (xs, md) and the search modal's result (lg). (F4, 2026-11-19)
const instance = figma.selectedInstance
const glyph = (prop) => {
  const s = instance.getInstanceSwap(prop)
  return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : undefined
}
const size = instance.getEnum('size', { xs: 'xs', md: 'md', lg: 'lg' })
const label = instance.getBoolean('show label') ? instance.getString('label') : ''
const icon = instance.getBoolean('show icon') ? glyph('icon glyph') : undefined
const active = instance.getEnum('state', { rest: false, hover: false, active: true })
const tree = instance.getEnum('tree', { false: false, true: true })
const open = tree ? (instance.getBoolean('open') ? ' expanded' : instance.getBoolean('closed') ? ' expanded={false}' : '') : ''
const trailing = instance.getBoolean('show trailing') ? instance.getSlot('trailing') : undefined
const example = figma.code`<TreeRow variant="kolbox"${size === 'xs' ? '' : ` size="${size}"`} label="${label}"${icon ? ` icon="${icon}"` : ''}${tree ? ' tree' : ''}${open}${active ? ' active' : ''}${trailing ? figma.code` trailing={${trailing}}` : ''} />`

export default {
  example,
  imports: ["import { TreeRow } from \"@kolkrabbi/kol-component\""],
  id: 'TreeRowKolbox',
  metadata: { nestable: true },
}
