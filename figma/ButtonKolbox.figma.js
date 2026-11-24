// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11133
// source=packages/component/src/atoms/Button.jsx
// component=Button
import figma from 'figma'

// Button kolbox: the same Button with variant="kolbox"; the role is `tone`, the lit look `pressed`. (F4, 2026-11-19)
const instance = figma.selectedInstance
const glyph = (prop) => {
  const s = instance.getInstanceSwap(prop)
  return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : undefined
}
const tone = instance.getEnum('tone', { primary: 'primary', secondary: 'secondary', ghost: 'ghost' })
const iconOnly = instance.getEnum('iconOnly', { false: false, true: true })
const icon = instance.getBoolean('icon') || iconOnly ? glyph('icon glyph') : undefined
const disabled = instance.getEnum('state', { default: false, hover: false, focus: false, disabled: true, pending: false })
const label = instance.getString('label')
const example = iconOnly
  ? figma.code`<Button variant="kolbox" tone="${tone}"${icon ? ` iconOnly="${icon}"` : ''}${disabled ? ' disabled' : ''} aria-label="${label}" />`
  : figma.code`<Button variant="kolbox" tone="${tone}"${icon ? ` iconLeft="${icon}"` : ''}${disabled ? ' disabled' : ''}>${label}</Button>`

export default {
  example,
  imports: ["import { Button } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonKolbox',
  metadata: { nestable: true },
}
