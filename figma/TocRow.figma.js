// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=108-254
// source=packages/component/src/molecules/DocsToc.jsx
// component=DocsToc
import figma from 'figma'

// A rail row is one entry of DocsToc's `toc` prop: a section is `{ id, label }`, a child sits in its section's
// `children`, a graduation is drawn by DocsToc itself (`minors` between two sections). Active rows follow the scroll spy.
const instance = figma.selectedInstance
const kind = instance.getEnum('kind', { "section": "section", "child": "child", "graduation": "graduation" })
const label = kind === 'graduation' ? '' : instance.getString('label')

export default {
  example: kind === 'section'
    ? figma.code`<DocsToc variant="rail" toc={[{ id: '…', label: '${label}' }, …]} />`
    : kind === 'child'
      ? figma.code`<DocsToc variant="rail" toc={[{ id: '…', label: '…', children: [{ id: '…', label: '${label}' }] }, …]} />`
      : figma.code`<DocsToc variant="rail" toc={toc} minors={10} />`,
  imports: ["import { DocsToc } from \"@kolkrabbi/kol-component\""],
  id: 'TocRow',
}
