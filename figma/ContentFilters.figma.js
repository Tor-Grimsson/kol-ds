// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=580-20236
// source=packages/component/src/organisms/ContentFilters.jsx
// component=ContentFilters
import figma from 'figma'
const instance = figma.selectedInstance
// variant float (float-everything W4 row 56, 2026-11-04): the capsule chips with counts in a capsule track
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
export default {
  example: variant === 'float'
    ? figma.code`<ContentFilters variant="float" title="Tasks" items={items} filterGroups={groups} renderItem={render} />`
    : figma.code`<ContentFilters title="${figma.selectedInstance.getString('title')}" items={items} filterGroups={groups} renderItem={render} />`,
  imports: ["import { ContentFilters } from \"@kolkrabbi/kol-component\""],
  id: 'ContentFilters',
}
