// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=115-424
// source=packages/component/src/molecules/QuickLookHeader.jsx
// component=QuickLookHeader
import figma from 'figma'
// variant default (nav · title · meta · actions · CloseButton) · float (glyph · title · − ×); eyebrow retired 2026-11-07
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const name = instance.getString('name')
const meta = instance.getString('meta')
const xn = instance.getBoolean('nav') ? ' nav={{ index, total, onPrev, onNext }}' : ''
const xc = instance.getBoolean('close') ? ' onClose={close}' : ''
export default {
  example: variant === 'float'
    ? figma.code`<QuickLookHeader variant="float" icon="user" title="${name}" onMinimise={minimise} onClose={close} />`
    : figma.code`<QuickLookHeader title="${name}" meta="${meta}"${xn}${xc} />`,
  imports: ["import { QuickLookHeader } from \"@kolkrabbi/kol-component\""],
  id: 'QuickLookHeader',
}
