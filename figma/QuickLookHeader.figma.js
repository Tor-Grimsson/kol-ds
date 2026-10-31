// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=115-424
// source=packages/component/src/molecules/QuickLookFrame.jsx
// component=QuickLookFrame
import figma from 'figma'

// The header has no component of its own in the code: it is QuickLookFrame's title · meta · actions · nav · onClose.
const instance = figma.selectedInstance
const name = instance.getString('name')
const meta = instance.getString('meta')
const eyebrow = instance.getEnum('title', { "mono": false, "eyebrow": true })
const actions = instance.getSlot('actions')
const xn = instance.getBoolean('nav') ? ' nav={{ index, total, onPrev, onNext }}' : ''
const xc = instance.getBoolean('close') ? ' onClose={close}' : ''
const title = eyebrow ? figma.code`title={<span className="kol-eyebrow">${name}</span>}` : figma.code`title="${name}" meta="${meta}"`
const xa = actions && actions.length ? figma.code` actions={<>${actions}</>}` : ''

export default {
  example: figma.code`<QuickLookFrame ${title}${xa}${xn}${xc}>
  {body}
</QuickLookFrame>`,
  imports: ["import { QuickLookFrame } from \"@kolkrabbi/kol-component\""],
  id: 'QuickLookHeader',
}
