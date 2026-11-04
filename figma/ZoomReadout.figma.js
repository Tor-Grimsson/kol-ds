// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19834
// source=packages/shell/src/CanvasReadouts.jsx
// component=ZoomReadout
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<ZoomReadout value="58.3%" onMenu={openZoomMenu} onFit={fit} />`,
  imports: ["import { ZoomReadout } from \"@kolkrabbi/kol-shell\""],
  id: 'ZoomReadout',
}
