// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-323
// source=packages/component/src/molecules/MenuItem.jsx
// component=MenuRow
import figma from 'figma'

const instance = figma.selectedInstance
// the glyph lives in a nested IconLoader (2026-11-07): read its `glyph` swap
const glyphOf = (layer, fallback) => {
  const n = instance.findInstance(layer)
  const s = n && typeof n.getInstanceSwap === 'function' ? n.getInstanceSwap('glyph') : null
  return (s && typeof s.codeConnectId === 'function' && s.codeConnectId()) || fallback
}
const label = instance.getString('label')
// variant float (2026-11-04) is the panel's — Menu variant="float" draws every row float; tone=danger is the destructive row
const tone = instance.getEnum('tone', { "default": "default", "danger": "danger" })
// state + indicator in words (plan-2026-11-07-menu-system W2.1); variant select is Dropdown's row
const state = instance.getEnum('state', { "rest": "rest", "current": "current", "disabled": "disabled" })
const indicator = instance.getEnum('indicator', { "none": "none", "check": "check", "dot": "dot", "chevron": "chevron" })
const iconOn = instance.getBoolean('icon')
const icon = glyphOf('icon', 'layout')
const kbd = instance.getBoolean('kbd')
const trailOn = instance.getBoolean('trailing')
const trailing = glyphOf('trailing', 'download')
// a row is one entry of Menu's `items` (Menu builds the MenuRow)
const keys = [`label: '${label}'`]
if (iconOn) keys.push(`icon: '${icon}'`)
if (state === 'current') keys.push('current: true')
if (indicator !== 'none') keys.push(`indicator: '${indicator}'`)
if (kbd) keys.push("kbd: 'D'")
if (trailOn) keys.push(`trailing: '${trailing}'`)
if (state === 'disabled') keys.push('disabled: true')
if (tone === 'danger') keys.push("tone: 'danger'")

export default {
  example: figma.code`{ ${keys.join(', ')}, onClick }`,
  imports: ["import { Menu } from \"@kolkrabbi/kol-component\""],
  id: 'MenuRow',
}
