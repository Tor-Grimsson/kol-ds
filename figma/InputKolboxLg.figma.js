// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12652
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

// the search modal's field (CommandOverlay kolbox): Input variant="kolbox" size="lg". (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<Input variant="kolbox" size="lg" iconLeft="search" value={query} onChange={setQuery} />`

export default {
  example,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'InputKolboxLg',
  metadata: { nestable: true },
}
