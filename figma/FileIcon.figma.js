// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1234-22036
// source=packages/component/src/atoms/FileIcon.jsx
// component=FileIcon
import figma from 'figma'

// FileIcon: the page, its fold, the kind's glyph (a nested IconLoader at 40) and the extension under it.
const instance = figma.selectedInstance
const ext = instance.getEnum('ext', { "true": true, "false": false })
const glyphOn = instance.getBoolean('glyph')
const n = instance.findInstance('glyph')
const s = n && typeof n.getInstanceSwap === 'function' ? n.getInstanceSwap('glyph') : null
const glyph = (s && typeof s.codeConnectId === 'function' && s.codeConnectId()) || 'music-note'
const xe = ext ? ` ext="${instance.getString('label').toLowerCase()}"` : ''
const xg = glyphOn ? ` glyph="${glyph}"` : ''
export default {
  example: figma.code`<FileIcon${xe}${xg} />`,
  imports: ["import { FileIcon } from \"@kolkrabbi/kol-component\""],
  id: 'FileIcon',
}
