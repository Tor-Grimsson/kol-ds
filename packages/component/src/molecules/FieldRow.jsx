import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Input from '../atoms/Input'
import Tag from '../atoms/Tag'
import Button from '../atoms/Button'
import { usePopover, PopoverPanel } from '../atoms/Popover'
import { INDICATOR } from '../hooks/glyphLadders.js'
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

/* StatusChip — the interactive status control ("Live ▾" in the reference,
 * rebuilt to it 2026-08-09 after the user's screenshots: the chip carries a
 * TONE tint + a trailing caret at the INDICATOR rung, and the open panel is
 * the reference's grammar — current chip on top, hairline, then option rows
 * with a leading check column).
 * Chip taxonomy (Tag source, 2026-07-30): interactive → Tag, never Pill. The
 * menu is usePopover/PopoverPanel — the same primitive Dropdown builds on —
 * with click handled by the Tag itself (click: false here) so the chip stays
 * the only trigger. Shared by FieldRow and RecordManager's status column.
 *
 * Options: strings, or { value, label, tone } — tone ∈ success|warning|error|
 * info maps onto the --ui-* ladder (.kol-status-chip--* in kol-theme); the
 * chip wears the ACTIVE option's tone. No tone → the plain Tag look. */
export function StatusChip({ value, options = [], onChange, size = 'sm' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    click: false,
    role: 'listbox',
  })
  const norm = options.map((opt) => (typeof opt === 'object' ? opt : { value: opt, label: opt }))
  const activeOpt = norm.find((o) => o.value === value)
  const toneCls = activeOpt?.tone ? ` kol-status-chip--${activeOpt.tone}` : ''
  /* BUILT ON THE COVER-FOCUS SPECS (user ruling 2026-08-09: "same component
   * as cover focus"): the chip wears the Dropdown-sm trigger metrics — the
   * kol-btn-sm box (py-1 px-3) and mono-12 type — as a pill with the tone
   * tint. The caret is a direct child of the flex row, centred by
   * items-center; it cannot sit off the label's middle. */
  const chip = (interactive) => (
    <button
      type="button"
      disabled={!interactive || undefined}
      aria-expanded={interactive ? open : undefined}
      className={`kol-status-chip${toneCls} kol-mono-12 inline-flex items-center gap-1 rounded-full border-0 px-2 py-1 leading-none${interactive ? ' cursor-pointer' : ''}`}
      onClick={interactive ? () => setOpen((o) => !o) : undefined}
    >
      {activeOpt?.label ?? value}
      {interactive && (
        <span
          className={`inline-flex shrink-0 transition-transform duration-150${open ? ' rotate-180' : ''}`}
          aria-hidden="true"
        >
          <Icon name="chevron-down" size={INDICATOR.sm} />
        </span>
      )}
    </button>
  )
  return (
    <>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        {chip(true)}
      </span>
      <PopoverPanel popover={popover}>
        {/* the reference panel: current value as its chip, a hairline, then
          * the option rows — check column always reserved so labels align */}
        <div className="px-2 pt-2">{chip(false)}</div>
        <div className="mt-2 border-t border-fg-08" />
        <ul className="flex flex-col p-1 m-0 list-none">
          {norm.map(({ value: val, label }) => {
            return (
              <li key={val}>
                <button
                  type="button"
                  role="option"
                  aria-selected={val === value}
                  className={`kol-helper-12 w-full text-left pr-3 py-2 bg-transparent border-0 cursor-pointer rounded-sm hover:bg-fg-08 inline-flex items-center ${val === value ? 'text-emphasis' : 'text-body'}`}
                  onClick={() => {
                    onChange?.(val)
                    setOpen(false)
                  }}
                >
                  {/* check column always reserved — labels align whether or
                    * not a row carries the mark (reference grammar) */}
                  <span className="inline-flex w-7 shrink-0 justify-center" aria-hidden="true">
                    {val === value && <Icon name="check" size={12} />}
                  </span>
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

/* Media thumbnail — the reference panel's proportions (frame 39,
 * 2026-08-09): a generous rounded tile, remove × inset at its corner. */
const THUMB_CLS = 'h-16 w-28 rounded-lg object-cover bg-fg-04'

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
  /* Empty MEDIA is a framed + slot, empty FILE is a Choose-file control —
   * the reference panel's grammar (user frames 2026-08-09), not a bare icon
   * button and never a dash: the affordance renders with or without a
   * picker (disabled when no onPick), because the reference shows the slot
   * itself as the field's resting state. */
  const mediaEmpty = (
    <button
      type="button"
      aria-label={label}
      disabled={disabled || !onPick}
      onClick={onPick}
      className="flex h-16 w-28 items-center justify-center rounded-lg border border-fg-16 bg-fg-02 text-body transition-colors duration-150 enabled:cursor-pointer enabled:hover:text-emphasis disabled:opacity-60"
    >
      <Icon name="plus" size={16} />
    </button>
  )
  const fileEmpty = (
    <button
      type="button"
      aria-label={label}
      disabled={disabled || !onPick}
      onClick={onPick}
      className="kol-control kol-control--filled kol-control-sm kol-mono-12 w-full text-left text-meta enabled:cursor-pointer disabled:opacity-60"
    >
      Choose file…
    </button>
  )

  let control = null
  if (type === 'text') {
    control = (
      /* sm — record rows are compact chrome (the reference's density); md
       * read as a form field ("input is large? why?", 2026-08-09). */
      <Input
        size="sm"
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
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            onClick={() => onChange(null)}
          />
        )}
      </span>
    ) : mediaEmpty
  } else if (type === 'file') {
    control = value ? (
      /* kol-tag--data: a filename renders VERBATIM — the chip uppercase is
       * for label strings, and transforming data misquotes it (2026-08-09). */
      <Tag variant="secondary" size="sm" hash={false} className="kol-tag--data" onRemove={onChange ? () => onChange(null) : undefined}>
        {value.name ?? value}
      </Tag>
    ) : fileEmpty
  }

  return (
    <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-center gap-x-6 py-4 border-b border-fg-08">
      <div className="kol-mono-12 text-body">{label}</div>
      <div className="min-w-0">{control}</div>
      {hint != null && (
        <div className="col-start-2 kol-helper-10 text-meta pt-1 truncate">{hint}</div>
      )}
    </div>
  )
}
