// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1746-15815
// source=packages/styleguide/src/DocumentLibrary.jsx
// component=DocumentFiles
// the files row above a document page's body: one nav sm Button per file; Quick Look opens through useFileQuickLook.
import figma from 'figma'

export default {
  example: figma.code`<DocumentFiles row={row} onOpen={open} assetsView="label" langMark={langMark} />`,
  imports: ["import { DocumentFiles, useFileQuickLook } from \"@kolkrabbi/kol-styleguide\""],
  id: 'DocumentFiles',
}
