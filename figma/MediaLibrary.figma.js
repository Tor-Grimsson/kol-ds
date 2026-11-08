// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1337-18468
// source=packages/component/src/organisms/MediaLibrary.jsx
// component=MediaLibrary
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "float": "float", "modal": "modal", "page": "page" })

export default {
  example: variant === 'float'
    ? figma.code`<MediaLibrary variant="float" open={open} client={client} title="Scene assets" onClose={close} onSelect={pick} onImport={importImage} importLabel="Import image" />`
    : variant === 'modal'
    ? figma.code`<MediaLibrary variant="modal" open={open} client={client} onClose={close} onSelect={pick} />`
    : figma.code`<MediaLibrary {...media.props} defaultView="grid" />`,
  imports: ["import { MediaLibrary } from \"@kolkrabbi/kol-component\""],
  id: 'MediaLibrary',
}
