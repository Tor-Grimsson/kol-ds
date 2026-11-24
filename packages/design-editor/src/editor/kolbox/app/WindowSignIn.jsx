import { Button, ModalDialog } from '@kolkrabbi/kol-component'

/* SIGN IN WITH NO ACCOUNT CONNECTED (plan-2026-11-20 W4.1): the host app passed no `account` to the editor, so Sign in…
   says what is missing instead of failing in silence. No form: signing in is the host's (files/account.js). */
export default function WindowSignIn({ onClose }) {
  return (
    <ModalDialog variant="kolbox"
      open
      movable="sign-in"
      onClose={onClose}
      title="Sign in"
      footer={(
        <>
          <span className="flex-1" />
          <Button variant="kolbox" tone="primary" onClick={onClose}>OK</Button>
        </>
      )}
    >
      <div className="flex flex-col gap-3 px-4 pb-4" data-window="sign-in">
        <p className="text-label text-text">No account is connected.</p>
        <p className="text-help text-muted">The app that hosts the editor connects one by passing its account: the session and its sign-in and sign-out. Until then your files, folders, media, palettes and themes are kept in this browser, on this device.</p>
      </div>
    </ModalDialog>
  )
}
