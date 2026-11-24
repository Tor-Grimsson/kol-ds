// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-200
// source=packages/component/src/atoms/ProgressBar.jsx
// component=ProgressBar
import figma from 'figma'

const instance = figma.selectedInstance
const float = instance.getEnum('float', { "false": false, "true": true })
const tone = instance.getEnum('tone', { "default": "default", "success": "success", "warning": "warning", "error": "error", "info": "info" })

export default {
  example: figma.code`<ProgressBar value={64} caption${float ? ' variant="float"' : ''}${tone === 'default' ? '' : ` tone="${tone}"`} />`,
  imports: ["import { ProgressBar } from \"@kolkrabbi/kol-component\""],
  id: 'ProgressBar',
}
