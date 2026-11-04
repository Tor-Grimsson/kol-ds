// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=591-20574
// source=packages/component/src/organisms/ReadingOverview.jsx
// component=ReadingOverview
import figma from 'figma'

export default {
  example: figma.code`<ReadingOverview onBack={back} cover={cover} title="The Waves" author="Virginia Woolf" meta={['Fiction', 'EPUB', 'Reading']} place={place} onResume={resume} onCollect={collect} />`,
  imports: ["import { ReadingOverview } from \"@kolkrabbi/kol-component\""],
  id: 'ReadingOverview',
}
