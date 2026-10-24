/**
 * LabeledControl — generic slot for label + interactive control body.
 *
 * Default layout: label on top (`flex-col`). Pass `inline` for a horizontal
 * label-left / control-right layout (label fixed-width, control flex-1).
 *
 * Compose with any control as children:
 *   <LabeledControl label="Columns · 4">
 *     <Slider ... />
 *   </LabeledControl>
 *   <LabeledControl inline label="Weight">
 *     <Input ... />
 *   </LabeledControl>
 *
 * Props:
 *   label  — small label text (uppercase, kol-helper-10).
 *   hint   — optional secondary text after the label (lower-case, less
 *            weight). Useful for current-value displays, units, etc.
 *   inline — bool. When true, renders horizontally with label on the left.
 *   labelWidth — px width for the label column when `inline`. Default 48.
 *            `'auto'` flips which cell yields: the label flexes and TRUNCATES,
 *            the control hugs its content (SettingsShortcutsComboOverflow,
 *            kol-monitor 2026-09-01 — in a narrow multi-column grid a fixed
 *            160 label left the control 4px, and a nowrap combo painted into
 *            the neighbour column; the 48px column gap had been hiding it).
 *   text   — bool, `inline` only. A row whose value is TEXT (a shortcut's combo, a reading): the label keeps
 *            the Settings label look (helper-10, tracked, meta ink) on a real 16px line, label and value share
 *            a baseline, and the value cell is a flex box so no inherited line-height strut makes the row taller
 *            than its text (SettingsRowMonoBaseline → SettingsRowTextKeepsLabel, kol-monitor 2026-10-18: a
 *            mono-12 fg-80 label read as the section's own header).
 *   variant — `'panel'` is the hardware panel label (was kol-hardware `PanelLabel`, merged
 *            2026-10-01): `kol-helper-8`, uppercase, hugging the control; it takes
 *            `labelPosition` (`top · bottom · left · right`, default bottom), `labelClass` and `gap`.
 *   children — the control body.
 *   className — additional classes on the wrapper.
 */
export default function LabeledControl({
  label,
  hint,
  inline = false,
  labelWidth = 48,
  children,
  className = '',
  text = false,
  variant,
  labelPosition = 'bottom',
  labelClass = 'kol-helper-8',
  gap = 0,
}) {
  if (variant === 'panel') {
    const isRow = labelPosition === 'left' || labelPosition === 'right'
    const labelEl = label && (
      <span className={`${labelClass} text-fg-32`} style={{ textTransform: 'uppercase', lineHeight: 1 }}>
        {label}
      </span>
    )
    return (
      <div style={{ display: 'inline-flex', flexDirection: isRow ? 'row' : 'column', alignItems: 'center', gap }}>
        {(labelPosition === 'top' || labelPosition === 'left') && labelEl}
        {children}
        {(labelPosition === 'bottom' || labelPosition === 'right') && labelEl}
      </div>
    )
  }
  const showLabel  = !!label
  const labelInner = (
    <>
      {label}
      {hint !== undefined && (
        <span className="ml-2 normal-case tracking-normal text-subtle">{hint}</span>
      )}
    </>
  )

  if (inline) {
    /* `'auto'`: the label is the yielding cell — flex-1, truncating — and the
     * control hugs. The control still carries min-w-0 + overflow-hidden so a
     * combo wider than the whole column CLIPS at the column edge rather than
     * painting over the neighbour (the invariant: no cell outside its column).
     * BELOW `sm` IT STACKS (apps review, 2026-09-29): the yielding label yielded to
     * nothing on a phone — a sentence-long combo took the whole row and the label
     * showed as "C" or not at all. Label on its line, the value under it. */
    const labelAuto = labelWidth === 'auto'
    return (
      <div className={`flex ${labelAuto ? `flex-col items-start gap-1 sm:flex-row ${text ? 'sm:items-baseline' : 'sm:items-center'} sm:gap-3` : `${text ? 'items-baseline' : 'items-center'} gap-3`} ${className}`}>
        {showLabel && (
          <span
            /* A LABEL NEVER WRAPS (review 2, § 6.2 — the helper law by construction, 01-foundations/03-typography.md:29):
             * `whitespace-nowrap truncate`, so a long one ends in an ellipsis instead of breaking onto a second line */
            className={`kol-helper-10 tracking-widest text-meta whitespace-nowrap truncate${text ? ' leading-4' : ''} ${labelAuto ? 'max-w-full min-w-0 sm:flex-1' : 'shrink-0'}`}
            style={labelAuto ? undefined : { width: labelWidth }}
          >
            {labelInner}
          </span>
        )}
        <div className={`${text ? 'flex ' : ''}${labelAuto ? 'min-w-0 max-w-full sm:overflow-hidden' : 'flex-1 min-w-0'}`}>{children}</div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showLabel && (
        <span className="kol-helper-10 tracking-widest text-meta">{labelInner}</span>
      )}
      {children}
    </div>
  )
}
