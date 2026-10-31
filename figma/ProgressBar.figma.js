// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-200
// source=packages/component/src/atoms/ProgressBar.jsx
// component=ProgressBar
import figma from 'figma'

const instance = figma.selectedInstance
const tone = instance.getEnum('tone', { "default": "default", "success": "success", "warning": "warning", "error": "error", "info": "info" })

export default {
  example: tone === 'default'
    ? figma.code`<ProgressBar value={64} caption />`
    : figma.code`<ProgressBar value={64} caption tone="${tone}" />`,
  imports: ["import { ProgressBar } from \"@kolkrabbi/kol-component\""],
  id: 'ProgressBar',
}
