import { useState } from 'react'

/**
 * CopyButton — copy-to-clipboard chip. Clipboard icon + Copy/Copied label
 * swap with a 1.8s reset; silent when the clipboard is blocked. Chrome
 * comes from .kol-copy-btn (kol-theme); parents add their own positioning
 * class (e.g. CodeBlock's .kol-codeblock-copy).
 *
 * Props:
 *   text      — string (or () => string) written to the clipboard
 *   label     — show the Copy/Copied text next to the icon (default true;
 *               false = icon-only for tight spots)
 *   className — extra classes (positioning etc.)
 */
export default function CopyButton({ text, label = true, className = '', ...props }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(typeof text === 'function' ? text() : String(text ?? ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
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
      {copied ? (
        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
          <path d="M5 10 L9 14 L15 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
          <rect x="6" y="3" width="10" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="4" y="6" width="10" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
      {label && <span>{copied ? 'Copied' : 'Copy'}</span>}
    </button>
  )
}
