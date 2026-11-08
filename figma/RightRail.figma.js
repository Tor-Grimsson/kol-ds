// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=370-10169
// source=packages/workshop/src/shell/RightRail.jsx
// component=RightRail
import figma from 'figma'
export default {
  example: figma.code`<RightRail toc={toc} activeId={activeId} actions={actions} related={related} tags={tags} tagsHref="/search/tags" icon={Icon} />`,
  imports: ["import { RightRail } from \"@kolkrabbi/kol-workshop\"", "import { Icon } from \"@kolkrabbi/kol-icons\""],
  id: 'RightRail',
}
