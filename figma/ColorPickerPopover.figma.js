// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=730-40171
// source=packages/component/src/organisms/ColorPickerPopover.jsx
// component=ColorPickerPopover
import figma from 'figma'

const instance = figma.selectedInstance
const inline = instance.getEnum('inline', { "true": true, "false": false })
const title = instance.getString('title')
const modes = instance.getBoolean('modes')
const hexEnd = instance.getBoolean('hexEnd')
const alpha = instance.getBoolean('alpha')
const xm = modes ? ' modes' : ''
const xt = title !== 'Color' ? ` title="${title}"` : ''
const xa = alpha ? '' : ' alpha={false}'
const xh = hexEnd ? ' hexEnd={lockControl}' : ''

export default {
  example: inline
    ? figma.code`<ColorPickerPopover inline${xm}${xt} color={color}${xa}${xh} onChange={setColor} />`
    // the swatch and the 196 popover it opens (PANEL_W 180 + 16); `footer` carries the palette swatches / Theme · None
    : figma.code`<ColorPickerPopover size="sm" color={color}${xa} footer={footer} onChange={setColor} />`,
  imports: ["import { ColorPickerPopover } from \"@kolkrabbi/kol-component\""],
  id: 'ColorPickerPopover',
}
