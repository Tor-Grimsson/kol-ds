// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=584-20350
// source=packages/component/src/organisms/MediaLibrary.jsx
// component=MediaLibrary
import figma from 'figma'

export default {
  example: figma.code`<MediaLibrary variant="float" open={open} client={client} title="Scene assets" onClose={close} onSelect={pick} onImport={importImage} importLabel="Import image" />`,
  imports: ["import { MediaLibrary } from \"@kolkrabbi/kol-component\""],
  id: 'MediaLibrary',
}
