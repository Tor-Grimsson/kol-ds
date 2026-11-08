// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1079-27892
// source=packages/deck/src/DeckEditor.jsx
// component=DeckEditor/layout-tile
import figma from 'figma'
// one tile of the layout picker DeckEditor opens from Add slide
export default {
  example: figma.code`<DeckEditor deck={deck} layouts={layouts} onSave={save} onClose={close} />`,
  imports: ["import { DeckEditor } from \"@kolkrabbi/kol-deck\""],
  id: 'DeckEditor/layout-tile',
}
