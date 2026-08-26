import ActionButton from '../atoms/ActionButton.jsx'

/**
 * CopyButton — THE copy-to-clipboard control (2026-08-09 user ruling): the
 * 32×32 icon button — `copy` glyph flipping to `check` for 2s on copied,
 * no text label. This is the button CodeBlock carried privately since the
 * 2026-07-28 elder replication, promoted to the one shared atom; the old
 * Copy/Copied label chip (one-off SVGs outside the icon set) is retired.
 * Chrome comes from .kol-copy-btn (kol-theme); parents add their own
 * positioning class (e.g. .kol-frame-control).
 *
 * The flip itself moved to ActionButton (2026-08-15) — it was the only
 * confirm-feedback in the system and it was welded to the clipboard, so no
 * other in-frame control could acknowledge a click. This is now clipboard
 * behaviour plus that component; the public API is unchanged, and the swap
 * gained an animation it never had.
 *
 * Props:
 *   text      — string (or () => string) written to the clipboard
 *   className — extra classes (positioning etc.)
 */
export default function CopyButton({ text, className = '', ...props }) {
  return (
    <ActionButton
      icon="copy"
      confirmIcon="check"
      label="Copy to clipboard"
      confirmLabel="Copied"
      size="sm"
      className={className}
      onAction={async () => {
        try {
          await navigator.clipboard.writeText(typeof text === 'function' ? text() : String(text ?? ''))
        } catch {
          /* clipboard blocked — silent */
        }
      }}
      {...props}
    />
  )
}
