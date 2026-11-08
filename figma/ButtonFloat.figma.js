// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1143-1260
// source=packages/component/src/atoms/Button.jsx
// component=Button
import figma from 'figma'

// Button float: the same Button with variant="float" (the capsule) — size · content · state + count (TabsRow's badge).
// Color is NOT a property: it is the instance's `tone` variable mode (in code `tone="…"` or a `kol-tone-*` wrapper).
const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const content = instance.getEnum('content', { "text": "text", "icon": "icon" })
const state = instance.getEnum('state', { "rest": "rest", "pressed": "pressed", "disabled": "disabled" })
// the glyph lives in a nested IconLoader (2026-11-07): read its `glyph` swap; a layer name never follows a swap
const glyphOf = (layer, fallback) => {
  const n = instance.findInstance(layer)
  const s = n && typeof n.getInstanceSwap === 'function' ? n.getInstanceSwap('glyph') : null
  return (s && typeof s.codeConnectId === 'function' && s.codeConnectId()) || fallback
}
const icon = glyphOf('icon', 'search')
const iconLeftOn = instance.getBoolean('iconLeft')
const left = glyphOf('iconLeft', 'search')
const iconRightOn = instance.getBoolean('iconRight')
const right = glyphOf('iconRight', 'chevron-down')
const countOn = instance.getBoolean('count')
const count = countOn ? `<span className="kol-float-ruler ml-0.5 tabular-nums text-fg-64">${instance.getString('countValue')}</span>` : ''
const xs = (state === 'pressed' ? ' pressed' : '') + (state === 'disabled' ? ' disabled' : '')
const xl = (iconLeftOn ? ` iconLeft="${left}"` : '') + (iconRightOn ? ` iconRight="${right}"` : '')
export default {
  example: content === 'icon'
    ? figma.code`<Button variant="float" size="${size}" iconOnly="${icon}" aria-label="${icon}"${xs} />`
    : figma.code`<Button variant="float" size="${size}"${xl}${xs}>${instance.getString('label')}${count}</Button>`,
  imports: ["import { Button } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonFloat',
}
