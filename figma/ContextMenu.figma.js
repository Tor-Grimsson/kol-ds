// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=659-20698
// source=packages/component/src/molecules/ContextMenu.jsx
// component=ContextMenu
import figma from 'figma'

// variant float (2026-11-04): the float list at the pointer — MenuRow / MenuFlyout rows inside
export default {
  example: figma.code`const menu = useContextMenu()
<li onContextMenu={(e) => menu.openAt(e, row)}>…</li>
<ContextMenu menu={menu} variant="float">
  <MenuRow onClick={duplicate}>Duplicate</MenuRow>
  <MenuFlyout flyout label="Move to">…</MenuFlyout>
  <MenuRow tone="danger" iconLeft={<Icon name="trash" />} onClick={remove}>Delete</MenuRow>
</ContextMenu>`,
  imports: ["import { ContextMenu, MenuFlyout, MenuRow, useContextMenu } from \"@kolkrabbi/kol-component\""],
  id: 'ContextMenu',
}
