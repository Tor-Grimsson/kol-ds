// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=585-20442
// source=packages/component/src/molecules/DocsToc.jsx
// component=DocsToc
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "list": "list", "float": "float" })

export default {
  example: variant === 'float' ? figma.code`<DocsToc variant="float" toc={toc} />` : figma.code`<DocsToc variant="rail" toc={toc} />`,
  imports: ["import { DocsToc } from \"@kolkrabbi/kol-component\""],
  id: 'DocsToc',
}
