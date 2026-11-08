// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1264-5161
// source=packages/component/src/molecules/ContentMedia.jsx
// component=ContentMedia
import figma from 'figma'
// media empty = no children → AssetPlaceholder; image = children is the media (the slot)
const instance = figma.selectedInstance
const media = instance.getEnum('media', { "image": "image", "empty": "empty" })
const children = instance.getSlot('children')
export default {
  example: media === 'empty'
    ? figma.code`<ContentMedia ratio="16 / 9" />`
    : figma.code`<ContentMedia ratio="16 / 9">${children}</ContentMedia>`,
  imports: ["import { ContentMedia } from \"@kolkrabbi/kol-component\""],
  id: 'ContentMedia',
}
