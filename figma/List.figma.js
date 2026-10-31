// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=91-248
// source=packages/theme/kol-typography.css
// component=List
import figma from 'figma'

const kind = figma.selectedInstance.getEnum('kind', { "disc": "ul", "number": "ol" })

export default {
  example: kind === 'ol'
    ? figma.code`<div className="kol-prose"><ol><li>…</li></ol></div>`
    : figma.code`<div className="kol-prose"><ul><li>…</li></ul></div>`,
  imports: [],
  id: 'List',
}
