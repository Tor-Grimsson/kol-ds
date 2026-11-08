// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1625-8555
// source=packages/component/src/molecules/ModalHeader.jsx
// component=ModalHeader
import figma from 'figma'

// row=menu — the avatar/glyph row (lead = avatar · icon · none; `actions` is the trailing close Button)
// row=window — the window row folded in from QuickLookHeader (default: nav · title · meta · close; float: glyph · title · − ×)
const instance = figma.selectedInstance
const row = instance.getEnum('row', { "menu": "menu", "window": "window" })
const lead = instance.getEnum('lead', { "avatar": "avatar", "icon": "icon", "none": "none" })
const variant = instance.getEnum('variant', { "default": "", "float": ' variant="float"' })
const title = instance.getString('title')
const actions = instance.getBoolean('actions')
const meta = instance.getString('meta')
const xn = instance.getBoolean('nav') ? ' nav={{ index, total, onPrev, onNext }}' : ''
const xm = instance.getBoolean('minimise') ? ' onMinimise={minimise}' : ''
const xc = instance.getBoolean('close') ? ' onClose={close}' : ''
const l = lead === 'avatar' ? ' avatar="TG"' : lead === 'icon' ? ' icon="search"' : ''
const a = actions ? ' actions={<Button variant="float" size="sm" tone="ghost" iconOnly="x" aria-label="Close" />}' : ''

export default {
  example: row === 'window'
    ? (variant
      ? figma.code`<ModalHeader variant="float"${lead === 'icon' ? ' icon="share"' : ''} title="${title}"${xm}${xc} />`
      : figma.code`<ModalHeader title="${title}" meta="${meta}"${xn}${xc} />`)
    : figma.code`<ModalHeader${variant}${l} title="${title}"${a} />`,
  imports: ["import { ModalHeader, Button } from \"@kolkrabbi/kol-component\""],
  id: 'ModalHeader',
}
