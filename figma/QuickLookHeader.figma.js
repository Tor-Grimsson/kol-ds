// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=115-424
// source=packages/component/src/molecules/ModalHeader.jsx
// component=ModalHeader
// QuickLookHeader is a deprecated alias of ModalHeader (kol-component 0.357.0); its master (_QuickLookHeader, on _trash)
// was folded into ModalHeader's row=window variants — the live mapping is figma/ModalHeader.figma.js.
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const name = instance.getString('name')
const meta = instance.getString('meta')
const xn = instance.getBoolean('nav') ? ' nav={{ index, total, onPrev, onNext }}' : ''
const xc = instance.getBoolean('close') ? ' onClose={close}' : ''
export default {
  example: variant === 'float'
    ? figma.code`<ModalHeader variant="float" icon="share" title="${name}" onMinimise={minimise} onClose={close} />`
    : figma.code`<ModalHeader title="${name}" meta="${meta}"${xn}${xc} />`,
  imports: ["import { ModalHeader } from \"@kolkrabbi/kol-component\""],
  id: 'QuickLookHeader',
}
