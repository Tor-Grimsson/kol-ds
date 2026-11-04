// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-200
// source=packages/component/src/atoms/ProgressBar.jsx
// component=ProgressBar
import figma from 'figma'

const instance = figma.selectedInstance
// variant (float-everything W2 row 31, 2026-11-04): float is the 4px capsule track
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const xv = variant === 'float' ? ' variant="float"' : ''
const tone = instance.getEnum('tone', { "default": "default", "success": "success", "warning": "warning", "error": "error", "info": "info" })

export default {
  example: tone === 'default'
    ? figma.code`<ProgressBar${xv} value={64} caption />`
    : figma.code`<ProgressBar${xv} value={64} caption tone="${tone}" />`,
  imports: ["import { ProgressBar } from \"@kolkrabbi/kol-component\""],
  id: 'ProgressBar',
}
