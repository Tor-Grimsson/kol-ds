// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20189
// source=packages/component/src/molecules/AccountMenu.jsx
// component=AccountMenu
import figma from 'figma'
export default {
  example: figma.code`<AccountMenu initial="A" name="Alex" items={[{ label: 'Profile', icon: 'user', onClick }, { label: 'Settings', icon: 'nav-settings', kbd: '⌘,', onClick }, { divider: true }, { label: 'Sign out', tone: 'danger', onClick }]} />`,
  imports: ["import { AccountMenu } from \"@kolkrabbi/kol-component\""],
  id: 'AccountMenu',
}
