// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1074-3221
// source=packages/component/src/molecules/MediaTile.jsx
// component=MediaTile
import figma from 'figma'
// a framed image tile with its caption; coarse shows the RowMenuButton a touch screen gets (onMenu)
const instance = figma.selectedInstance
const coarse = instance.getBoolean('coarse')
export default {
  example: figma.code`<MediaTile item={item} onOpen={open}${coarse ? ' onMenu={openMenu}' : ''} />`,
  imports: ["import { MediaTile } from \"@kolkrabbi/kol-component\""],
  id: 'MediaTile',
}
