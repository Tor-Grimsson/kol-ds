// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1079-27925
// source=packages/deck/src/DeckEditor.jsx
// component=DeckEditor/present
import figma from 'figma'
// present mode (P) — FullscreenOverlay with the slide and counter
export default {
  example: figma.code`<DeckEditor deck={deck} layouts={layouts} onSave={save} onClose={close} />`,
  imports: ["import { DeckEditor } from \"@kolkrabbi/kol-deck\""],
  id: 'DeckEditor/present',
}
