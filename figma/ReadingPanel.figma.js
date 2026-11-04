// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=590-20508
// source=packages/component/src/organisms/ReadingPanel.jsx
// component=ReadingPanel
import figma from 'figma'

export default {
  example: figma.code`<ReadingPanel tab={tab} onTab={setTab} onFold={fold}>{body}</ReadingPanel>`,
  imports: ["import { ReadingPanel } from \"@kolkrabbi/kol-component\""],
  id: 'ReadingPanel',
}
