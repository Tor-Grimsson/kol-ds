// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1075-940
// source=packages/deck/src/DeckSettings.jsx
// component=DeckSettings
import figma from 'figma'

export default {
  example: figma.code`<DeckSettings open={open} onClose={close} slides={slides} greys={greys} onApply={apply} />`,
  imports: ["import { DeckSettings } from \"@kolkrabbi/kol-deck\""],
  id: 'DeckSettings',
}
