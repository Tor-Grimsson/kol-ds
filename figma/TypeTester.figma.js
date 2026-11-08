// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1807-9219
// source=packages/component/src/molecules/TypeTester.jsx
// component=TypeTester
import figma from 'figma'

/* breakpoint is the viewport, not a prop; the size ladder and the face are the caller's */
const instance = figma.selectedInstance
const text = instance.getString('text')

export default {
  example: figma.code`<TypeTester fontFamily="…" text="${text}" styles={styles} initialSize={64} />`,
  imports: ["import { TypeTester } from \"@kolkrabbi/kol-component\""],
  id: 'TypeTester',
}
