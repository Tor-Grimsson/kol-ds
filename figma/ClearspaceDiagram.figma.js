// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1290-8880
// source=packages/styleguide/src/ClearspaceDiagram.jsx
// component=ClearspaceDiagram
import figma from 'figma'

const instance = figma.selectedInstance
const framework = instance.getBoolean('framework')
export default {
  example: figma.code`<ClearspaceDiagram logo={logo} grid={grid} keyline={keyline}${framework ? ' framework' : ''} />`,
  imports: ["import { ClearspaceDiagram } from \"@kolkrabbi/kol-styleguide\""],
  id: 'ClearspaceDiagram',
}
