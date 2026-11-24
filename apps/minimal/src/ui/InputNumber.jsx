import { useEffect, useState } from 'react'

/* The editable number box beside a slider (and the loop length): what is typed is a draft, Enter or blur commits it,
   Escape restores. `onCommit` gets the trimmed text; the caller decides what a number or an expression means. */
export default function InputNumber({ value, onCommit, chars = 4, lead, unit, className = '', ...rest }) {
  const shown = String(value)
  const [draft, setDraft] = useState(shown)
  const [editing, setEditing] = useState(false)
  useEffect(() => { if (!editing) setDraft(shown) }, [shown, editing])
  const commit = () => {
    setEditing(false)
    if (draft.trim() === '' || draft.trim() === shown) { setDraft(shown); return }
    onCommit(draft.trim())
  }
  return (
    <label className={`flex h-7 shrink-0 items-center justify-center gap-1 rounded-field border border-transparent bg-field px-2 hover:bg-field-hover focus-within:border-fg ${className}`}>
      {lead && <span className="font-mono text-label text-faint whitespace-nowrap">{lead}</span>}
      <input
        type="text"
        inputMode="decimal"
        className="min-w-0 bg-transparent text-center font-mono text-label text-fg outline-none"
        style={{ width: `${chars}ch` }}
        value={draft}
        onFocus={(e) => { setEditing(true); e.target.select() }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') { setDraft(shown); setEditing(false); e.currentTarget.blur() }
        }}
        {...rest}
      />
      {unit && <span className="font-mono text-label text-faint">{unit}</span>}
    </label>
  )
}
