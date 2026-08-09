import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Input from '../atoms/Input'
import { usePopover, PopoverPanel } from '../utilities/Popover'
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
 * TONE tint + a trailing chevron, and the open panel is
 * the reference's grammar — current chip on top, hairline, then option rows
 * with a leading check column).
 * Chip taxonomy (Tag source, 2026-07-30): interactive → Tag, never Pill. The
 * menu is usePopover/PopoverPanel — the same primitive Dropdown builds on —
 * with click handled by the Tag itself (click: false here) so the chip stays
 * the only trigger. Shared by FieldRow and RecordManager's status column.
 *
 * Options: strings, or { value, label, tone } — tone ∈ success|warning|error|
 * info maps onto the --ui-* ladder (.kol-status-chip--* in kol-theme); the
 * chip wears the ACTIVE option's tone. No tone → the plain Tag look.
 *
 * variant="primary" — the toneless pill wears the Dropdown-primary fill
 * instead of the neutral mix (RecordManager's select columns, user frame
 * 2026-08-09: "use status pill, but same look as dropdown primary"). An
 * option's tone always outranks the variant. */
export function StatusChip({ value, options = [], onChange, variant = 'neutral', size = 'sm' }) {
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
  const toneCls = activeOpt?.tone
    ? ` kol-status-chip--${activeOpt.tone}`
    : variant === 'primary' ? ' kol-status-chip--primary' : ''
  /* CHIP BOX: px-2 is the user's exact value (2026-08-09: "x padding 2
   * (8px)"). py-0.5 — the same-day py-0 collapsed the pill to the bare line
   * box, and the reference chip ("why cant you make the chip look like
   * this?") carries visible air; 2px is the minimum that restores it.
   * mono-12 at its own 16px leading. The chevron is a direct child of the flex
   * row, centred by items-center; it cannot sit off the label's middle. */
  const chip = (interactive) => (
    <button
      type="button"
      disabled={!interactive || undefined}
      aria-expanded={interactive ? open : undefined}
      className={`kol-status-chip${toneCls} kol-mono-12 inline-flex items-center gap-2 rounded-full border-0 px-2 py-0.5${interactive ? ' cursor-pointer' : ''}`}
      onClick={interactive ? () => setOpen((o) => !o) : undefined}
    >
      {activeOpt?.label ?? value}
      {interactive && (
        <span
          className={`inline-flex shrink-0 transition-transform duration-150${open ? ' rotate-180' : ''}`}
          aria-hidden="true"
        >
          <Icon name="chevron-down" size={10} />
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

/* Media thumbnail — measured off the reference panel (2026-08-09): 136×72,
 * remove × riding the corner. Radius is the system's 4px — the repo ships
 * 4px or full, nothing between. */
const THUMB_CLS = 'h-18 w-34 rounded object-cover bg-fg-04'

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
      /* reference empty tile: FILLED, no border — a plain grey slab with the
       * + centred (frame 2026-08-09) */
      className="flex h-18 w-34 items-center justify-center rounded border-0 bg-fg-04 text-body transition-colors duration-150 enabled:cursor-pointer enabled:hover:text-emphasis disabled:opacity-60"
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
      Choose File...
    </button>
  )

  let control = null
  if (type === 'text') {
    control = (
      /* sm — the repo's control rung, no special box for this component
       * (user ruling 2026-08-09: "why would this component be different
       * than every other rule in the repo"). */
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
    /* full-width — the reference's focus selects span the control column,
     * caret at the far edge (panel frame 2026-08-09) */
    control = <Dropdown options={options} value={value} onChange={onChange} className="w-full" />
  } else if (type === 'media') {
    control = value ? (
      <span className="relative inline-flex">
        <img src={value.thumb ?? value.url} alt={value.name ?? ''} className={THUMB_CLS} />
        {onChange && (
          /* the reference badge: ALWAYS visible, a small dark disc riding the
           * tile's corner — scrim ink is theme-invariant over imagery (panel
           * frame 2026-08-09; hover-reveal repealed) */
          <button
            type="button"
            aria-label={label}
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-0 kol-overlay-scrim text-white"
          >
            <Icon name="x" size={10} />
          </button>
        )}
      </span>
    ) : mediaEmpty
  } else if (type === 'file') {
    control = value ? (
      /* the reference's file value is a FULL-WIDTH filled row — filename at
       * the leading edge (verbatim, data is never case-transformed), × at the
       * far end (panel frame 2026-08-09; the kol-tag--data chip repealed) */
      <span className="kol-control kol-control--filled kol-control-sm kol-mono-12 flex w-full items-center gap-2">
        <span className="min-w-0 flex-1 truncate">{value.name ?? value}</span>
        {onChange && (
          <button
            type="button"
            aria-label={label}
            onClick={() => onChange(null)}
            className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 text-body hover:text-emphasis"
          >
            <Icon name="x" size={12} />
          </button>
        )}
      </span>
    ) : fileEmpty
  }

  return (
    /* reference rhythm (2026-08-09): roomy rows on hairlines, narrow label
     * column, labels white; media rows top-align their label to the tile.
     * Controls stay on the repo's sm rung — no special box here. */
    /* .kol-field-row carries the grid anatomy in kol-theme (package chrome
     * never rides arbitrary utilities — they can miss generation) */
    <div className="kol-field-row items-center gap-x-6 py-3 border-b border-fg-08">
      <div className={`kol-mono-12 text-emphasis${type === 'media' ? ' self-start pt-1' : ''}`}>{label}</div>
      <div className="min-w-0">{control}</div>
      {hint != null && (
        <div className="col-start-2 kol-helper-12 text-meta pt-2 truncate">{hint}</div>
      )}
    </div>
  )
}
