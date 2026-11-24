// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11860
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

// kolbox's search field: Input variant="kolbox" size="md" with the search glyph. (F4, 2026-11-19)
const instance = figma.selectedInstance
const placeholder = instance.getString('placeholder')
const example = figma.code`<Input variant="kolbox" size="md" iconLeft="search" placeholder="${placeholder}" />`

export default {
  example,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'InputKolboxMd',
  metadata: { nestable: true },
}
