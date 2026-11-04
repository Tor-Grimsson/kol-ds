// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=385-22475
// source=packages/shell/src/AppStudio.jsx
// component=AppStudio
import figma from 'figma'

/* the regions are the Studio's own (rail, masthead, page, floatNav, the settings scrim + HubSettingsRail);
 * an app passes its pages and settings, nothing about how they sit. `settings` on = the Rail open over the page. */
const instance = figma.selectedInstance
const settings = instance.getBoolean('settings')
const open = settings ? '\n  /* Settings open: the rail over a scrim, above the floating nav */' : ''

export default {
  example: figma.code`<AppStudio
  app={app}
  currentPath={pathname}
  onNavigate={navigate}
  home={home}
  library={library}
  create={create}
  use={use}
  settings={settings}${open}
/>`,
  imports: ["import { AppStudio } from \"@kolkrabbi/kol-shell\""],
  id: 'AppStudio',
}
