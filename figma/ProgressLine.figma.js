// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1288-8692
// source=packages/dashboards/src/cards/_shared/ProgressLine.jsx
// component=ProgressLine
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const thick = instance.getEnum('thick', { "true": " thick", "false": "" })
const light = instance.getEnum('light', { "true": " light", "false": "" })
const note = instance.getBoolean('showNote') ? ` note="${instance.getString('note')}"` : ''
export default {
  example: figma.code`<ProgressLine label="${label}" pct={pct}${note}${thick}${light} />`,
  // internal to kol-dashboards (cards/_shared): the cards render it, it is not exported
  imports: [],
  id: 'ProgressLine',
}
