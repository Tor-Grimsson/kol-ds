// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19860
// source=packages/shell/src/WorkspaceStrips.jsx
// component=StatusStrip
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<StatusStrip label="ALL SYSTEMS OBSERVING" />`,
  imports: ["import { StatusStrip } from \"@kolkrabbi/kol-shell\""],
  id: 'StatusStrip',
}
