// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1505-6928
// source=packages/shell/src/HubHome.jsx
// component=HubHome
import figma from 'figma'

const instance = figma.selectedInstance
const signedOut = instance.getEnum('signedOut', { "true": true, "false": false })
// `stage` (slot): the live stage behind a signed-out Home; signInForm open = HubHome's `signInForm.open` (AccountForm's props)

export default {
  example: signedOut
    ? figma.code`<HubHome app={app} files={[]} signedOut stage={stage} chromes={chromes} signInAction={signInAction} signInForm={{ open, onClose, ...form }} />`
    : figma.code`<HubHome app={app} files={files} onOpen={open} onDownload={download} onRename={rename} onDuplicate={duplicate} onRemove={remove} filterGroups={filterGroups} action={action} walkthrough={walkthrough} />`,
  imports: ["import { HubHome } from \"@kolkrabbi/kol-shell\""],
  id: 'HubHome',
}
