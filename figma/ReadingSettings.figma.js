// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=590-20462
// source=packages/component/src/molecules/ReadingSettings.jsx
// component=ReadingSettings
import figma from 'figma'

export default {
  example: figma.code`<ReadingSettings themes={tiles} font={font} fonts={fonts} onFont={setFont} size={size} onSize={setSize} flow={flow} onFlow={setFlow} onReset={reset} />`,
  imports: ["import { ReadingSettings } from \"@kolkrabbi/kol-component\""],
  id: 'ReadingSettings',
}
