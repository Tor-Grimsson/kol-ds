// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19824
// source=packages/shell/src/Timecode.jsx
// component=Timecode
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<Timecode current="00:04:12" total="00:12:00" />`,
  imports: ["import { Timecode } from \"@kolkrabbi/kol-shell\""],
  id: 'Timecode',
}
