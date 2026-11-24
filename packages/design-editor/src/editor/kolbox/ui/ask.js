import { useEffect, useRef } from 'react'
import { useModal } from '@kolkrabbi/kol-component'

/* For code that is not a component (a menu row's action, the engine's useModal through ModalEngineProvider):
   `await askConfirm({ title, message, action, cancel })` resolves true or false (cancel null asks with the action alone),
   `await askPrompt({ title, value, placeholder, action, cancel })` the typed value or null. Both answer through
   kol-component's `ModalProvider variant="kolbox"` (W31.2 batch 4: kolbox's ModalConfirm and ModalPrompt are its kolbox
   look now), which App mounts with `ModalAskHost` inside it. A second ask while one is open cancels the first. */
let host = null
export const askConfirm = (ask) => new Promise((resolve) => (host ? host('confirm', ask, resolve) : resolve(false)))
export const askPrompt = (ask) => new Promise((resolve) => (host ? host('prompt', ask, resolve) : resolve(null)))

export function ModalAskHost() {
  const modal = useModal()
  const live = useRef(null)
  useEffect(() => {
    const show = (kind, a, resolve) => {
      const empty = kind === 'prompt' ? null : false
      live.current?.resolve(live.current.empty)
      const me = { resolve, empty }
      live.current = me
      const asked = kind === 'prompt'
        ? modal.prompt(a.title, a.value ?? '', { okLabel: a.action, cancelLabel: a.cancel, placeholder: a.placeholder })
        : a.cancel === null
          ? modal.alert(a.title, { okLabel: a.action, body: a.message }).then(() => true)
          : modal.confirm(a.title, { okLabel: a.action, cancelLabel: a.cancel, body: a.message })
      asked.then((v) => { if (live.current === me) { live.current = null; resolve(v) } })
    }
    host = show
    return () => { if (host === show) host = null }
  }, [modal])
  return null
}
