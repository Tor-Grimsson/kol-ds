// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=370-10338
// source=packages/framework/src/ShellHeader.jsx
// component=ShellHeader
import figma from 'figma'

export default {
  example: figma.code`<ShellHeader brand={brand} nav={navItems} isActive={isActive} onNavigate={handleNavigate} actions={actions} onNavToggle={toggleNav} onTocToggle={toggleToc} />`,
  imports: ["import { ShellHeader } from \"@kolkrabbi/kol-framework\""],
  id: 'ShellHeader',
}
