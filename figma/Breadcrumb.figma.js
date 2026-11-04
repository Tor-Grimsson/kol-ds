// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19867
// source=packages/shell/src/WorkspaceStrips.jsx
// component=Breadcrumb
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<Breadcrumb items={['Workspace', 'Analytics', 'Overview']} />`,
  imports: ["import { Breadcrumb } from \"@kolkrabbi/kol-shell\""],
  id: 'Breadcrumb',
}
