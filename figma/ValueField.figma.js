// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=576-20013
// source=packages/component/src/atoms/ValueField.jsx
// component=ValueField
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const value = instance.getString('value')
const iconOn = instance.getBoolean('icon')
// the glyph lives in a nested IconLoader (2026-11-07): read its `glyph` swap; a layer name never follows a swap
const glyphOf = (layer, fallback) => {
  const n = instance.findInstance(layer)
  const s = n && typeof n.getInstanceSwap === 'function' ? n.getInstanceSwap('glyph') : null
  return (s && typeof s.codeConnectId === 'function' && s.codeConnectId()) || fallback
}
const icon = glyphOf('icon', 'circle')
// trailing: the children's right-hand note (ml-auto, kol-float-timecode fg-64), e.g. the size letter
const tr = instance.getBoolean('showTrailing') ? `<span className="kol-float-timecode text-fg-64 ml-auto">${instance.getString('trailing')}</span>` : ''
const xs = size === 'md' ? '' : ` size="${size}"`
export default {
  example: iconOn
    ? figma.code`<ValueField${xs} icon="${icon}">${value}${tr}</ValueField>`
    : figma.code`<ValueField${xs}>${value}${tr}</ValueField>`,
  imports: ["import { ValueField } from \"@kolkrabbi/kol-component\""],
  id: 'ValueField',
}
