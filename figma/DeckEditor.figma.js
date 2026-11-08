// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1079-27925
// source=packages/deck/src/DeckEditor.jsx
// component=DeckEditor
import figma from 'figma'

export default {
  example: figma.code`<DeckEditor deck={deck} onSave={save} />`,
  imports: ["import { DeckEditor } from \"@kolkrabbi/kol-deck\""],
  id: 'DeckEditor',
}
