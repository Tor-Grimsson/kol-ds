// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11448
// source=packages/component/src/organisms/SpectrumControls.jsx
// component=SBSquare
import figma from 'figma'

// SBSquare variant="kolbox" (kolbox's ColorField). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<SBSquare variant="kolbox" />`

export default {
  example,
  imports: ["import { SBSquare } from \"@kolkrabbi/kol-component\""],
  id: 'SBSquareKolbox',
  metadata: { nestable: true },
}
