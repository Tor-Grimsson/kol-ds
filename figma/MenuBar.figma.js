// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1032-26160
// source=packages/shell/src/MenuBar.jsx
// component=MenuBar
import figma from 'figma'

// state=open is the File menu open on its Export submenu; the menus are data
export default {
  example: figma.code`<MenuBar app="FXR" menus={menus} end={[{ label: 'Help', items: helpItems }]} />`,
  imports: ["import { MenuBar } from \"@kolkrabbi/kol-shell\""],
  id: 'MenuBar',
}
