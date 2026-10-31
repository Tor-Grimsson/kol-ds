import { useState } from 'react'
import { Button, Input, floatSurfaceClass } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — Inputs + a Button */

/**
 * AccountForm — Sign in, sign up, request an invite, drawn from data. (FloatingStyleAndSignInDemos, kol-fxr 2026-10-30,
 * canvas Round 3 — fxr's FrameC form, carried: *"fxr can pass data (its rows, its sign-in page) with no local styling"*.)
 * The order is the frames': the eyebrow, the fields, the line linking the other page, then the button.
 *
 * Two looks, one form:
 * - `column` (default) — style A, 360 wide: the desk's sign-in column over Home (HubHome) and the phone column.
 * - `box` — the floating style, the user's phone sign-in box (round 3, W16 2026-10-31): 340 wide, 28 round, 20 in, 8 between
 *   rows, on its `surface`; it passes `variant="float"` to its fields and button (capsules at the float height), so the
 *   consumer never does.
 *
 * @param {string}   title     the eyebrow ("Sign in", "Create account", "Request an invite")
 * @param {Array}    fields    `[{ id, placeholder, type?, autoComplete? }]` — the placeholder is the field's name
 * @param {string}   okLabel   the button
 * @param {Object}   footer    `{ text, link, href?, onPress? }` — "Don't have an account? Sign up"
 * @param {Function} onSubmit  `(values) => Promise` — a throw shows its `message` under the fields
 * @param {Function} check     `(values) => string | null` — a message stops the submit
 * @param {string}   done      a line shown after success (Request sent.); the button disables
 * @param {'column'|'box'} variant
 * @param {'solid'|'glass-dark'|'glass-light'} surface  `box` only: what the box is made of (default `solid`, surface-secondary
 *                             with the float shadow); glass-dark puts dark-theme ink on the form in either theme
 * @param {string}   className
 */
export default function AccountForm({ title, fields = [], okLabel, footer, onSubmit, check, done, variant = 'column', surface = 'solid', className = '' }) {
  const [vals, setVals] = useState(() => Object.fromEntries(fields.map((f) => [f.id, ''])))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const box = variant === 'box'
  const submit = async (e) => {
    e.preventDefault()
    const bad = check?.(vals)
    if (bad) { setError(bad); return }
    setBusy(true); setError('')
    try { await onSubmit?.(vals) } catch (err) { setError(err?.message ?? String(err)) } finally { setBusy(false) }
  }
  const body = (
    <>
      <span className={`kol-eyebrow text-body${box ? ' mx-1 mt-0.5 mb-1' : ''}`}>{title}</span>
      {fields.map((f, i) => (
        <Input
          key={f.id}
          type={f.type ?? 'text'}
          autoComplete={f.autoComplete}
          autoFocus={i === 0}
          placeholder={f.placeholder}
          aria-label={f.placeholder}
          size="md"
          variant={box ? 'float' : undefined}
          value={vals[f.id]}
          onChange={(e) => setVals((v) => ({ ...v, [f.id]: e.target.value }))}
          className="w-full"
        />
      ))}
      {error && <p className={`kol-mono-12 text-ui-error${box ? ' m-1' : ''}`}>{error}</p>}
      {done && <p className={`kol-mono-12 text-emphasis${box ? ' m-1' : ''}`}>{done}</p>}
      {footer && (
        <p className={`kol-mono-12 text-meta ${box ? 'm-1' : 'mt-2'}`}>
          {footer.text} <a href={footer.href ?? '#'} onClick={(e) => { if (footer.onPress) { e.preventDefault(); footer.onPress() } }} className="text-emphasis underline">{footer.link}</a>
        </p>
      )}
      <Button type="submit" variant={box ? 'float' : undefined} tone="inverted" size="md" className={`self-start${box ? '' : ' mt-4'}`} disabled={busy || !!done}>{okLabel}</Button>
    </>
  )
  return box
    ? <form onSubmit={submit} aria-label={title} className={`flex flex-col gap-2 p-5 rounded-[28px] w-[340px] max-w-full ${floatSurfaceClass(surface, true)} ${className}`.trim()}>{body}</form>
    : <form onSubmit={submit} aria-label={title} className={`flex flex-col gap-2 w-[360px] max-w-full ${className}`.trim()}>{body}</form>
}
