// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=93-770
// source=packages/component/src/organisms/ContentFilters.jsx
// component=ContentFilters
import figma from 'figma'

export default {
  example: figma.code`<ContentFilters title="${figma.selectedInstance.getString('title')}" items={items} filterGroups={groups} renderItem={render} />`,
  imports: ["import { ContentFilters } from \"@kolkrabbi/kol-component\""],
  id: 'ContentFilters',
}
