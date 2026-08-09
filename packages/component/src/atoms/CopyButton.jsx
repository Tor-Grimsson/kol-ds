import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

/**
 * CopyButton — THE copy-to-clipboard control (2026-08-09 user ruling): the
 * 32×32 icon button — `copy` glyph flipping to `check` for 2s on copied,
 * no text label. This is the button CodeBlock carried privately since the
 * 2026-07-28 elder replication, promoted to the one shared atom; the old
 * Copy/Copied label chip (one-off SVGs outside the icon set) is retired.
 * Chrome comes from .kol-copy-btn (kol-theme); parents add their own
 * positioning class (e.g. CodeBlock's .kol-codeblock-copy).
 *
 * Props:
 *   text      — string (or () => string) written to the clipboard
 *   className — extra classes (positioning etc.)
 */
export default function CopyButton({ text, className = '', ...props }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(typeof text === 'function' ? text() : String(text ?? ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <button
      type="button"
      className={`kol-copy-btn ${className}`.trim()}
      onClick={onCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      title={copied ? 'Copied' : 'Copy'}
      {...props}
    >
      <Icon name={copied ? 'check' : 'copy'} size={16} />
    </button>
  )
}
