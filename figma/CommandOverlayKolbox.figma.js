// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-14099
// source=packages/component/src/organisms/CommandOverlay.jsx
// component=CommandOverlay
import figma from 'figma'

// CommandOverlay variant="kolbox" (kolbox's search modal); its header, body and footer are built from groups. (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<CommandOverlay variant="kolbox" open onClose={onClose} query={query} onQueryChange={onQuery} groups={groups} />`

export default {
  example,
  imports: ["import { CommandOverlay } from \"@kolkrabbi/kol-component\""],
  id: 'CommandOverlayKolbox',
  metadata: { nestable: true },
}
