// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=577-20001
// source=packages/component/src/atoms/ProgressBar.jsx
// component=ProgressBar
import figma from 'figma'

const instance = figma.selectedInstance
export default {
  example: figma.code`<ProgressBar variant="float" value={64} caption />`,
  imports: ["import { ProgressBar } from \"@kolkrabbi/kol-component\""],
  id: 'ProgressBarFloat',
}
