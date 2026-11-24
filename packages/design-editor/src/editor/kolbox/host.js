/* THE HOST'S MEDIA CLIENT AND SETTINGS ROWS, for the kolbox screens (plan-2026-11-19-kolbox-whats-left C3). The screens
 * moved in from apps/kolbox, where each page called `setMediaClient(fixtureClient)` and `setSettingsStore(row)` as its
 * module loaded; the engine knows no fixture, so a host hands both here BEFORE it imports a screen:
 *   setKolboxHost({ client, store: (tool) => ({ load, save }) })
 * `tool` is the row each screen names ('kolbox-editor', 'kolbox-labs'); a host may answer every name with one row. */
const host = { client: null, store: () => null, account: null }
export function setKolboxHost(next) {
  const was = host.account
  Object.assign(host, next)
  /* a screen that shows the account (Home's rail, the right pill, the menus) re-reads it on this */
  if ('account' in next && next.account !== was) queueMicrotask(() => window.dispatchEvent(new CustomEvent('kolbox:account')))
}
export const hostClient = () => host.client
export const hostStore = (tool) => host.store(tool)
/* THE ACCOUNT, the host's (plan-2026-11-20-kolbox-everything-left W4.1): `{ session, signIn, signOut }`, the editor's
 * `account` prop; null when the host passes none. */
export const hostAccount = () => host.account
