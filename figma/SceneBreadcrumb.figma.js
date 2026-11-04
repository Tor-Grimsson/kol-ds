// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19842
// source=packages/shell/src/CanvasReadouts.jsx
// component=SceneBreadcrumb
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<SceneBreadcrumb name="Scene 01" meta="1920 × 1080 · 30 fps · 12 s" />`,
  imports: ["import { SceneBreadcrumb } from \"@kolkrabbi/kol-shell\""],
  id: 'SceneBreadcrumb',
}
