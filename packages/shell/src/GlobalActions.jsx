import { Avatar, Button } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — a row of float Buttons and an Avatar */

/**
 * GlobalActions — The app's top-right actions (float-everything W5 row 72, 2026-11-04): undo · redo as float glyphs at
 * full ink (oq-96 — his frame 19:6069, plan-2026-11-05-float-editor W1.3; were the ghost's oq-48), the primary action as the inverted float capsule (Export), and the account as a round grey slot — the
 * avatar when there is one, the user glyph when not. No box: it sits on the canvas, 12 between. The exploration's
 * `Global actions` (kol-float--style 9:8988).
 *
 * @param {Function} onUndo · {Function} onRedo   the history pair; unset, the glyph is left out
 * @param {string}   actionLabel  the primary action's label (default "Export")
 * @param {Function} onAction     the primary action's press
 * @param {Object}   account      `{ src?, initial?, label? }` — the account slot's picture or initial; unset, the user glyph
 * @param {Function} onAccount    the account slot's press
 * @param {string}   className
 */
export default function GlobalActions({ onUndo, onRedo, actionLabel = 'Export', onAction, account, onAccount, className = '' }) {
  return (
    <div className={`kol-global-actions kol-float-chrome inline-flex items-center gap-3 ${className}`.trim()}>
      {onUndo && <Button variant="float" tone="ghost" size="sm" iconOnly="undo" aria-label="Undo" onClick={onUndo} className="[--kol-tone-fg:var(--kol-oq-96)]" />}
      {onRedo && <Button variant="float" tone="ghost" size="sm" iconOnly="redo" aria-label="Redo" onClick={onRedo} className="[--kol-tone-fg:var(--kol-oq-96)]" />}
      {onAction && <Button variant="float" tone="inverted" size="md" onClick={onAction}>{actionLabel}</Button>}
      {account?.src || account?.initial ? (
        <button type="button" aria-label={account.label ?? 'Account'} onClick={onAccount} className="inline-flex rounded-full bg-transparent border-0 p-0 cursor-pointer">
          <Avatar src={account.src} initial={account.initial} alt="" size="md" />
        </button>
      ) : (
        <Button variant="float" tone="grey" size="md" iconOnly="user" aria-label={account?.label ?? 'Account'} onClick={onAccount} />
      )}
    </div>
  )
}
