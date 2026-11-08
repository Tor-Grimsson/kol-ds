import { useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Input from '../atoms/Input.jsx'

/**
 * PasswordInput — A password field with its reveal. `•••••••••••• 👁` (float-everything W3 row 39, 2026-11-04 — the
 * exploration's password field). An `Input type="password"` with the eye at its trailing edge (`eye-on` masked,
 * `eye-off` revealed; 16, oq-64 to oq-96): a press flips the type, the field keeps focus. Every Input prop passes
 * through — `variant="float"` is the capsule, `error` the message under it.
 *
 * @param {boolean} [revealed]      controlled reveal; omit for internal state
 * @param {Function} [onRevealChange]  `(revealed) => void`
 * @param {string} [revealLabel]    the eye's aria-label (default `Show password` / `Hide password`)
 */
export default function PasswordInput({ revealed, onRevealChange, revealLabel, ...rest }) {
  const [own, setOwn] = useState(false)
  const shown = revealed ?? own
  const toggle = () => { if (revealed === undefined) setOwn(!shown); onRevealChange?.(!shown) }
  return (
    <Input
      type={shown ? 'text' : 'password'}
      autoComplete="current-password"
      {...rest}
      slotRight={
        <button
          type="button"
          aria-label={revealLabel ?? (shown ? 'Hide password' : 'Show password')}
          aria-pressed={shown}
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggle}
          className="inline-flex items-center justify-center shrink-0 cursor-pointer text-oq-64 hover:text-oq-96 transition-colors outline-none focus-visible:[box-shadow:var(--kol-float-focus)] rounded-full"
        >
          <IconLoader name={shown ? 'eye-off' : 'eye-on'} size={16} />
        </button>
      }
    />
  )
}
