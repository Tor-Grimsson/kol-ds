// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=8-32
// source=packages/component/src/atoms/Button.jsx
// component=Button
import figma from 'figma'

// axes = what the code uses (2026-11-06): role · size · content · state · shape. Color is NOT a property: it is the
// instance's `tone` variable mode (in code `tone="…"` or a `kol-tone-*` wrapper), which Code Connect cannot read.
const instance = figma.selectedInstance
const role = instance.getEnum('role', { "default": "default", "nav": "nav", "tab-filled": "tab-filled" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })
const content = instance.getEnum('content', { "text": "text", "icon": "icon" })
const state = instance.getEnum('state', { "rest": "rest", "quiet": "quiet", "pressed": "pressed", "disabled": "disabled", "hover": "rest" })
const shape = instance.getEnum('shape', { "square": "square", "round": "round" })
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
const v = role === 'nav' ? 'variant="nav" ' : role === 'tab-filled' ? 'variant="tab-filled" ' : ''
const r = shape === 'round' ? ' radius="full"' : ''
const xs = (state === 'pressed' ? ' pressed' : '') + (state === 'disabled' ? ' disabled' : '') + (state === 'quiet' ? ' quiet' : '')
const xl = (iconLeftOn ? ` iconLeft="${left}"` : '') + (iconRightOn ? ` iconRight="${right}"` : '')
export default {
  example: content === 'icon'
    ? figma.code`<Button ${v}size="${size}" iconOnly="${icon}" aria-label="${icon}"${r}${xs} />`
    : figma.code`<Button ${v}size="${size}"${xl}${xs}>${instance.getString('label')}</Button>`,
  imports: ["import { Button } from \"@kolkrabbi/kol-component\""],
  id: 'Button',
}
