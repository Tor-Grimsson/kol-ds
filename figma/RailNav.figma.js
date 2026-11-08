// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1486-13778
// source=packages/component/src/organisms/RailKit.jsx
// component=RailNav
import figma from 'figma'
export default {
  example: figma.code`<Rail role="bottom" nav={<RailNav items={views} value={view} onChange={setView} />} header={<RailHeader title={title} />}>{children}</Rail>`,
  imports: ["import { Rail, RailHeader, RailNav } from \"@kolkrabbi/kol-component\""],
  id: 'RailNav',
}
