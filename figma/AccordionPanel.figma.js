// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1805-58427
// source=packages/component/src/molecules/Accordion.jsx
// component=AccordionPanel
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const open = instance.getEnum('open', { true: true, false: false })

export default {
  example: figma.code`<AccordionPanel title="${title}" defaultOpen={${open}}>…</AccordionPanel>`,
  imports: ["import { AccordionPanel } from \"@kolkrabbi/kol-component\""],
  id: 'AccordionPanel',
}
