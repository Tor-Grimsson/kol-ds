// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1075-824
// source=packages/deck/src/DeckFile.jsx
// component=DeckFile
import figma from 'figma'

export default {
  example: figma.code`<DeckFile open={open} onClose={close} slug={slug} name={name} slides={slides} active={active} onSave={save} onImport={importDeck} />`,
  imports: ["import { DeckFile } from \"@kolkrabbi/kol-deck\""],
  id: 'DeckFile',
}
