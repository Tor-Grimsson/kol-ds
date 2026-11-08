// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1234-22012
// source=packages/icons/src/IconLoader.jsx
// component=IconLoader
import figma from 'figma'

// IconLoader = the code's icon loader, <IconLoader name size variant> (2026-11-07). size = the px the code passes;
// variant outline · solid; glyph = the instance swap from Icon masters, whose own Code Connect id is its code name.
const instance = figma.selectedInstance
const size = instance.getEnum('size', { "10": "10", "12": "12", "14": "14", "16": "16", "18": "18", "20": "20", "24": "24", "40": "40", "48": "48" })
const variant = instance.getEnum('variant', { "outline": "outline", "solid": "solid" })
const swap = instance.getInstanceSwap('glyph')
const name = (swap && typeof swap.codeConnectId === 'function' && swap.codeConnectId()) || 'search'
const xs = size === '16' ? '' : ` size={${size}}`
const xv = variant === 'solid' ? ' variant="solid"' : ''
export default {
  example: figma.code`<IconLoader name="${name}"${xs}${xv} />`,
  imports: ["import { IconLoader } from \"@kolkrabbi/kol-icons\""],
  id: 'IconLoader',
}
