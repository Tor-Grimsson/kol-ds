// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=589-20446
// source=packages/component/src/organisms/ReadingContents.jsx
// component=ReadingContents
import figma from 'figma'

export default {
  example: figma.code`<ReadingContents book="The Waves" author="Virginia Woolf" count="9 interludes" chapters={chapters} current={at} onSelect={go} progress={42} status="Reading position saved" />`,
  imports: ["import { ReadingContents } from \"@kolkrabbi/kol-component\""],
  id: 'ReadingContents',
}
