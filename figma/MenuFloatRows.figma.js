// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2017-14268
// source=packages/component/src/molecules/MenuFloat.jsx
// component=MenuFloatRows
import figma from 'figma'

// The float menu's rows: the account row (ModalHeader float) then one Button float lg pill per action (float/row 40,
// 12 in, the 18 glyph 10 off the label).
export default {
  example: figma.code`<MenuFloatRows variant="float" actions={[{ label: 'Account', avatar: avatarUrl, onPress: openAccount }, { label: 'Library', icon: 'nav-library', onPress: openLibrary }]} items={items} active={path} onPick={close} />`,
  imports: ["import { MenuFloatRows } from \"@kolkrabbi/kol-component\""],
  id: 'MenuFloatRows',
}
