// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2403-21270
// source=packages/component/src/molecules/RailHeader.jsx
// component=RailHeader
import figma from 'figma'

// RailHeader variant="kolbox"; document=true is size="sm", the document header. (F4, 2026-11-19)
const instance = figma.selectedInstance
const doc = instance.getEnum('document', { false: false, true: true })
const title = instance.getBoolean('show title') ? instance.getString('title') : undefined
const subtitle = instance.getBoolean('showSubtitle') ? instance.getString('subtitle') : undefined
const leading = instance.getBoolean('show leading') ? instance.getSlot('leading') : undefined
const actions = instance.getSlot('actions')
const example = figma.code`<RailHeader variant="kolbox"${doc ? ' size="sm"' : ''}${leading ? figma.code` leading={${leading}}` : ''}${title ? ` title="${title}"` : ''}${subtitle ? ` subtitle="${subtitle}"` : ''}${actions ? figma.code` actions={${actions}}` : ''} />`

export default {
  example,
  imports: ["import { RailHeader } from \"@kolkrabbi/kol-component\""],
  id: 'RailHeaderKolbox',
  metadata: { nestable: true },
}
