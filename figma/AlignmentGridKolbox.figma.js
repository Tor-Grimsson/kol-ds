// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12273
// source=packages/component/src/molecules/AlignmentGrid.jsx
// component=AlignmentGrid
import figma from 'figma'

// AlignmentGrid variant="kolbox" (kolbox's AlignmentRow). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<AlignmentGrid variant="kolbox" onAlign={onAlign} />`

export default {
  example,
  imports: ["import { AlignmentGrid } from \"@kolkrabbi/kol-component\""],
  id: 'AlignmentGridKolbox',
  metadata: { nestable: true },
}
