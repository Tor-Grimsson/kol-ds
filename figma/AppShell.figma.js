// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=61-240
// source=packages/shell/src/AppShell.jsx
// component=AppShell
import figma from 'figma'

export default {
  example: figma.code`<AppShell appName={appName} items={items} currentPath={pathname} onNavigate={navigate}>{page}</AppShell>`,
  imports: ["import { AppShell } from \"@kolkrabbi/kol-shell\""],
  id: 'AppShell',
}
