import { useEffect, useRef, useState } from 'react'

const HEX = /^[0-9a-f]{6}$/i

/* A color field: the swatch (a button opening the platform's own picker), the label, `#` and the hex. A value that is not a
   plain hex (a palette reference, a theme variable) shows `resolved` on the swatch and its own text in the field. */
/* `hideLabel`: the field shows only the swatch and the hex (the label still names the swatch) */
export default function InputColor({ label, value, resolved, onChange, hideLabel = false }) {
  const hex = HEX.test(String(value ?? '').replace('#', '')) ? String(value).replace('#', '').toUpperCase() : null
  const swatch = resolved ?? (hex ? `#${hex}` : '#ffffff')
  const [draft, setDraft] = useState(hex ?? '')
  const pickRef = useRef(null)
  useEffect(() => { setDraft(hex ?? '') }, [hex])
  const commit = () => {
    const d = draft.trim().replace('#', '')
    if (HEX.test(d)) onChange(`#${d.toLowerCase()}`)
    else setDraft(hex ?? '')
  }
  return (
    <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-field bg-field pr-2 pl-1 hover:bg-field-hover focus-within:outline-1 focus-within:outline-fg">
      <button
        type="button"
        aria-label={`${label}: ${swatch.toUpperCase()}`}
        className="relative size-5 shrink-0 rounded-inner border border-line-strong outline-none focus-visible:outline-1 focus-visible:outline-fg"
        style={{ background: swatch }}
        onClick={() => { try { pickRef.current.showPicker() } catch { pickRef.current.click() } }}
      >
        <input ref={pickRef} type="color" tabIndex={-1} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" value={/^#[0-9a-f]{6}$/i.test(swatch) ? swatch : '#ffffff'} onChange={(e) => onChange(e.target.value)} />
      </button>
      {hideLabel ? <span className="flex-1" /> : <span className="min-w-0 flex-1 truncate text-label text-muted">{label}</span>}
      <span className="font-mono text-label text-faint">#</span>
      <input
        className="w-[7ch] bg-transparent font-mono text-label text-fg uppercase outline-none"
        aria-label={`${label} hex`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
      />
    </div>
  )
}
