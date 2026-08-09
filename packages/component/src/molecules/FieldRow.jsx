import { useState } from 'react'
import Input from '../atoms/Input'
import Tag from '../atoms/Tag'
import Button from '../atoms/Button'
import { usePopover, PopoverPanel } from '../atoms/Popover'
import Dropdown from './Dropdown'

/**
 * FieldRow — one labeled field row in a record surface (lobby: RecordManager).
 * Label column left, control right; `type` picks the control:
 *
 *   text   → Input, with an optional hint line under it (the slug's derived URL)
 *   status → StatusChip — interactive Tag opening a listbox in place
 *   select → Dropdown
 *   media  → thumbnail + hover-reveal remove ×; empty state offers onPick
 *   file   → filename as a removable Tag (chip taxonomy: interactive → Tag);
 *            empty state offers onPick
 *
 * All labels, option strings and values are authored at the call site — this
 * component bakes no copy and transforms no casing. Media/file `value` is
 * whatever object the consumer's picker returns; FieldRow reads only
 * `.thumb`/`.url` for the image and `.name` for the token, and hands the whole
 * object back through onChange untouched.
 */

/* StatusChip — the interactive status control ("Live ▾" in the reference).
 * Chip taxonomy (Tag source, 2026-07-30): interactive → Tag, never Pill. The
 * menu is usePopover/PopoverPanel — the same primitive Dropdown builds on —
 * with click handled by the Tag itself (click: false here) so the chip stays
 * the only trigger. Shared by FieldRow and RecordManager's status column. */
export function StatusChip({ value, options = [], onChange, size = 'sm' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    click: false,
    role: 'listbox',
  })
  return (
    <>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Tag variant="primary" size={size} hash={false} active={open} onClick={() => setOpen((o) => !o)}>
          {value}
        </Tag>
      </span>
      <PopoverPanel popover={popover}>
        <ul className="flex flex-col p-1 m-0 list-none">
          {options.map((opt) => {
            const label = typeof opt === 'object' ? opt.label : opt
            const val = typeof opt === 'object' ? opt.value : opt
            return (
              <li key={val}>
                <button
                  type="button"
                  role="option"
                  aria-selected={val === value}
                  className={`kol-helper-12 w-full text-left px-3 py-2 bg-transparent border-0 cursor-pointer rounded-sm hover:bg-fg-08 ${val === value ? 'text-emphasis' : 'text-body'}`}
                  onClick={() => {
                    onChange?.(val)
                    setOpen(false)
                  }}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </PopoverPanel>
    </>
  )
}

/* Media/file thumbnail — same small fixed-aspect rounded treatment as
 * MediaRow's thumb cell. */
const THUMB_CLS = 'h-10 w-14 rounded object-cover bg-fg-04'

export default function FieldRow({
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  hint,
  onPick,
  placeholder,
  disabled = false,
}) {
  const empty = onPick ? (
    <Button variant="nav" size="sm" iconOnly="plus" iconSize={12} onClick={onPick} aria-label={label} disabled={disabled} />
  ) : (
    <span className="kol-helper-10 text-meta">—</span>
  )

  let control = null
  if (type === 'text') {
    control = (
      <Input
        value={value ?? ''}
        onChange={(e) => onChange?.(e?.target ? e.target.value : e)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
    )
  } else if (type === 'status') {
    control = <StatusChip value={value} options={options} onChange={onChange} />
  } else if (type === 'select') {
    control = <Dropdown options={options} value={value} onChange={onChange} />
  } else if (type === 'media') {
    control = value ? (
      <span className="group relative inline-flex">
        <img src={value.thumb ?? value.url} alt={value.name ?? ''} className={THUMB_CLS} />
        {onChange && (
          <Button
            variant="nav"
            size="sm"
            iconOnly="x"
            iconSize={10}
            aria-label={label}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            onClick={() => onChange(null)}
          />
        )}
      </span>
    ) : empty
  } else if (type === 'file') {
    control = value ? (
      <Tag variant="secondary" size="sm" hash={false} onRemove={onChange ? () => onChange(null) : undefined}>
        {value.name ?? value}
      </Tag>
    ) : empty
  }

  return (
    <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-center gap-x-6 py-3 border-b border-fg-08">
      <div className="kol-mono-12 text-body">{label}</div>
      <div className="min-w-0">{control}</div>
      {hint != null && (
        <div className="col-start-2 kol-helper-10 text-meta pt-1 truncate">{hint}</div>
      )}
    </div>
  )
}
