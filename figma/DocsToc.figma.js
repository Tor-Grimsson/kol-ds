// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=585-20442
// source=packages/component/src/molecules/DocsToc.jsx
// component=DocsToc
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "list": "list", "rail": "rail", "float": "float" })
export default {
  example: variant === 'list' ? figma.code`<DocsToc toc={toc} />` : figma.code`<DocsToc variant="${variant}" toc={toc} />`,
  imports: ["import { DocsToc } from \"@kolkrabbi/kol-component\""],
  id: 'DocsToc',
}
