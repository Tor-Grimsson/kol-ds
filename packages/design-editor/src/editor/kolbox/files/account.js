/* THE ACCOUNT (plan-2026-11-20-kolbox-everything-left W4.1; his ruling 2026-11-20: "sign in will resolve in fxr so we
 * just need to account for it, but it will be connected there"): the host app's, handed to the editor as its `account`
 * prop and kept by host.js. The Sign in window, the account menu and the account chips call these and nothing else:
 *   session  { name, email, picture } or null (signed out);
 *   signIn() and signOut(), the host's own.
 * With no account passed, nobody is signed in and Sign in… says what is missing (app/WindowSignIn.jsx). The editor's
 * docs page (docs/documentation/04-compositions/14-design-editor-system.md) writes the prop up for the host. */
import { hostAccount } from '../host.js'

export const connected = () => !!hostAccount()
export const sessionUser = () => hostAccount()?.session ?? null
export const signInHost = () => hostAccount()?.signIn?.()
export const signOut = () => hostAccount()?.signOut?.()
