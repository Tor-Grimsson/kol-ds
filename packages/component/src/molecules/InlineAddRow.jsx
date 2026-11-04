import { useState } from 'react'
import Input from '../atoms/Input.jsx'
import Kbd from '../atoms/Kbd.jsx'

/**
 * InlineAddRow — Add a row where the next row would be. `+ New brief · ↵` (float-everything W3 row 41, 2026-11-04 —
 * the exploration's inline add). A full-width `Input` led by the plus and trailed by the return cap: type, press
 * Enter, `onAdd(text)` fires and the field clears; Escape clears it. Nothing opens, nothing moves — the row is the
 * form. `variant="float"` is the capsule on the well; the default is the filled shell.
 *
 * @param {string}   label       the placeholder — what the row adds (`New brief`)
 * @param {Function} onAdd       `(text) => void` on Enter with a non-empty, trimmed value
 * @param {boolean}  [kbd]       the ↵ cap at the end (default true)
 * @param {'float'|'filled'|'outline'} [variant]
 * @param {'sm'|'md'|'lg'} [size]
 * @param {string}   [className]
 */
export default function InlineAddRow({ label = 'Add', onAdd, kbd = true, variant, size, className = '', ...rest }) {
  const [text, setText] = useState('')
  return (
    <Input
      variant={variant}
      size={size}
      width="100%"
      iconLeft="plus"
      placeholder={label}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && text.trim()) { onAdd?.(text.trim()); setText('') }
        if (e.key === 'Escape') setText('')
      }}
      slotRight={kbd ? <Kbd size="sm" icon="corner-down-left" /> : undefined}
      className={className}
      {...rest}
    />
  )
}
