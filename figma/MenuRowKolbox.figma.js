// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12407
// source=packages/component/src/molecules/Menu.jsx
// component=Menu
import figma from 'figma'

// One row of Menu variant="kolbox": a row is an entry of a group, a label is the group's title, a divider is the line between groups. (F4, 2026-11-19)
const instance = figma.selectedInstance
const glyph = (prop) => {
  const s = instance.getInstanceSwap(prop)
  return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : undefined
}
const type = instance.getEnum('type', { row: 'row', label: 'label', divider: 'divider' })
const label = instance.getString('label')
const icon = instance.getBoolean('icon') ? glyph('icon glyph') : undefined
const disabled = instance.getEnum('state', { rest: false, hover: false, disabled: true })
const inset = instance.getEnum('inset', { true: true, false: false })
const tag = instance.getBoolean('tag') ? instance.getString('meta text') : undefined
const xs = (icon ? `, icon: '${icon}'` : '') + (instance.getBoolean('checked') ? ', check: true' : '') + (instance.getBoolean('shortcut') ? ", shortcut: '⌘K'" : '') + (tag ? `, tag: '${tag}'` : '') + (instance.getBoolean('submenu') ? ', submenu: true' : '') + (disabled ? ', disabled: true' : '') + (inset ? ', inset: true' : '')
const example = type === 'divider'
  ? figma.code`// the line between two groups: the next row starts a new group`
  : type === 'label'
  ? figma.code`{ title: '${label}', rows: [] }`
  : figma.code`{ label: '${label}'${xs} }`

export default {
  example,
  imports: ["import { Menu } from \"@kolkrabbi/kol-component\""],
  id: 'MenuRowKolbox',
  metadata: { nestable: true },
}
