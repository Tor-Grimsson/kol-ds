// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=731-22965
// source=packages/component/src/organisms/ColumnBrowser.jsx
// component=ResizeHandle
import figma from 'figma'

export default {
  example: figma.code`<ResizeHandle axis="y" onDrag={onDrag} onEnd={onEnd} />`,
  imports: ["import { ResizeHandle } from \"@kolkrabbi/kol-component\""],
  id: 'ResizeHandle',
}
