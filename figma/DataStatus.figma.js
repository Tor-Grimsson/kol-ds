// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19876
// source=packages/shell/src/WorkspaceStrips.jsx
// component=DataStatus
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<DataStatus badge="Demo data" updated="UPDATED 14:32 UTC" />`,
  imports: ["import { DataStatus } from \"@kolkrabbi/kol-shell\""],
  id: 'DataStatus',
}
