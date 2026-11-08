// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1218-136
// source=packages/component/src/utilities/ProsePreview.jsx
// component=ProsePreview
import figma from 'figma'

const instance = figma.selectedInstance
const collection = instance.getEnum('collection', { "prose": "prose", "doc": "doc" })

export default {
  example: collection === 'doc'
    ? figma.code`<ProsePreview collection="doc" h1="Page title" paragraph={paragraph} code={code} pullout={pullout} />`
    : figma.code`<ProsePreview h1="Page title" paragraph={paragraph} code={code} pullout={pullout} />`,
  imports: ["import { ProsePreview } from \"@kolkrabbi/kol-component\""],
  id: 'ProsePreview',
}
