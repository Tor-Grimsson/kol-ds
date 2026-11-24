/**
 * LabeledControl — generic slot for label + interactive control body.
 *
 * Default layout: label on top (`flex-col`). Pass `horizontal` for the label
 * beside the control (label fixed-width, control flex-1).
 *
 * Compose with any control as children:
 *   <LabeledControl label="Columns · 4">
 *     <Slider ... />
 *   </LabeledControl>
 *   <LabeledControl horizontal label="Weight">
 *     <Input ... />
 *   </LabeledControl>
 *
 * Props:
 *   label  — any node: the label text, or an icon with text (a ToggleSwitch row's glyph). A string takes the
 *            variant's label style (kol-helper-10, tracked; float: the float hint at fg-64).
 *   hint   — optional secondary text after the label (lower-case, less
 *            weight). Useful for current-value displays, units, etc.
 *   horizontal — bool. true: the label beside the control (left); false (default): the label above it
 *            (plan-2026-11-12-float-rails-figma W7.1, the user: *"this is obviously horizontal and this vertical"*).
 *   inline — deprecated 2026-11-12, the old name of `horizontal`: the same bool (on the retirement ledger).
 *   labelWidth — px width for the label column when `horizontal`. Default 48.
 *            `'auto'` flips which cell yields: the label flexes and TRUNCATES,
 *            the control hugs its content (SettingsShortcutsComboOverflow,
 *            kol-monitor 2026-09-01 — in a narrow multi-column grid a fixed
 *            160 label left the control 4px, and a nowrap combo painted into
 *            the neighbour column; the 48px column gap had been hiding it).
 *   text   — bool, `horizontal` only. A row whose value is TEXT (a shortcut's combo, a reading): the label keeps
 *            the Settings label look (helper-10, tracked, meta ink) on a real 16px line, label and value share
 *            a baseline, and the value cell is a flex box so no inherited line-height strut makes the row taller
 *            than its text (SettingsRowMonoBaseline → SettingsRowTextKeepsLabel, kol-monitor 2026-10-18: a
 *            mono-12 fg-80 label read as the section's own header).
 *   variant — `'panel'` is the hardware panel label (was kol-hardware `PanelLabel`, merged
 *            2026-10-01): `kol-helper-8`, uppercase, hugging the control; it takes
 *            `labelPosition` (`top · bottom · left · right`, default bottom), `labelClass` and `gap`.
 *            `'float'` (float-everything W3 row 37, 2026-11-04): the label over a capsule — the float hint role
 *            (Inter 12) at fg-64, no uppercase, no tracking, `--kol-float-label-gap` from the control; `horizontal` keeps
 *            the same label in the `--kol-float-label-w` column (a `labelWidth` still wins), the row at least the float
 *            sm height. Every float row is this (plan-2026-11-12-float-system W2.1); the wrapper carries
 *            `data-labeled-control`.
 *            `'settings'` (plan-2026-11-12-float-rails-figma W13.1): the generator settings window's row (`Dialog
 *            variant="settings"`): the label in Inter 10 at oq-64, 6 over the control; `horizontal` puts it beside the
 *            control, 8 apart, the label hugging its text (a `labelWidth` still sets a column).
 *            `'kolbox'` (plan-2026-11-18-kolbox-system W31.2, 2026-11-18): kolbox's row carried class for class, the label
 *            Inter 12 / 16 medium in oq-64. `horizontal`: the label in a 76 column (a `labelWidth` sets another, 160 for a
 *            window's longer labels), 8 from the control, the row at least 28; stacked: the label 4 over a row of controls
 *            4 apart. `controlFirst`: the control at the left, inset 4, then 8 apart the label in Inter 11 / 15, the row as
 *            tall as its control. Chrome in kol-theme `.kol-labeled-control--kolbox`.
 *            `'folio'` (Folio batch C, 2026-11-22): Folio's Setting carried class for class. Stacked: the label (Folio's
 *            label, 10 semibold, tracked, capitals) 8 over the control; `horizontal`: the label (12 / 16 medium) in a 48
 *            column, 12 from the control. Both labels in Folio's muted ink. Chrome in kol-theme `.kol-labeled-control--folio`.
 *   controlFirst — bool, `kolbox` only: the control before its label (kolbox's Clip content row).
 *   labelClass — the label's type and ink, replacing the variant's (a row that keeps its own label look: Slider's
 *            kol-helper-12, a toggle's words in the settings ink). On `panel` it defaults to kol-helper-8.
 *   children — the control body.
 *   className — additional classes on the wrapper. A display class in it (`hidden`, `inline-flex`, `grid`…) replaces
 *            the wrapper's `flex`, so a caller's `hidden md:flex` holds; a `gap-*` replaces the variant's gap. Any other prop (`style`, `onClick`, `data-*`)
 *            lands on the wrapper.
 */
/* the settings window's label (Dialog variant="settings"): Inter 10 on a 12 line at oq-64 */
const SETTINGS_LABEL = 'text-[10px] leading-[12px] text-oq-64 font-(family-name:--kol-font-family-float)'
const DISPLAY = /(^|\s)(hidden|block|inline-block|flex|inline-flex|grid|inline-grid|contents)(?=\s|$)/

export default function LabeledControl({
  label,
  hint,
  horizontal,
  inline,
  labelWidth,
  children,
  className = '',
  text = false,
  variant,
  labelPosition = 'bottom',
  labelClass,
  gap = 0,
  controlFirst = false,
  ...rest
}) {
  if (variant === 'kolbox') {
    const mark = { 'data-labeled-control': '', ...rest }
    if (controlFirst) {
      return (
        <div {...mark} className={`kol-labeled-control--kolbox flex items-center gap-2 pl-1 ${className}`.trim()}>
          {children}
          <span className="kol-labeled-control-help min-w-0 flex-1 truncate">{label}</span>
        </div>
      )
    }
    if (!(horizontal ?? inline ?? false)) {
      return (
        <div {...mark} className={`kol-labeled-control--kolbox flex flex-col gap-1 ${className}`.trim()}>
          <span className="kol-labeled-control-label">{label}</span>
          <div className="flex min-w-0 items-center gap-1">{children}</div>
        </div>
      )
    }
    return (
      <div {...mark} className={`kol-labeled-control--kolbox flex min-h-(--kol-kolbox-ctl) items-center gap-2 ${className}`.trim()}>
        <span className={`kol-labeled-control-label ${labelWidth == null ? 'w-19 ' : ''}shrink-0 truncate`} style={labelWidth == null ? undefined : { width: labelWidth }}>{label}</span>
        <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      </div>
    )
  }
  if (variant === 'folio') {
    if (horizontal ?? inline ?? false) {
      return (
        <div {...rest} className={`kol-labeled-control--folio flex items-center gap-[12px] ${className}`.trim()}>
          <p className="kol-labeled-control-label w-[48px] shrink-0">{label}</p>
          <div className="flex min-w-0 flex-1 items-center">{children}</div>
        </div>
      )
    }
    return (
      <div {...rest} className={`kol-labeled-control--folio flex flex-col gap-[8px] ${className}`.trim()}>
        <p className="kol-labeled-control-title">{label}</p>
        {children}
      </div>
    )
  }
  if (variant === 'panel') {
    const isRow = labelPosition === 'left' || labelPosition === 'right'
    const labelEl = label && (
      <span className={`${labelClass ?? 'kol-helper-8'} text-fg-32`} style={{ textTransform: 'uppercase', lineHeight: 1 }}>
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
  const float = variant === 'float'
  const settings = variant === 'settings'
  const lw = labelWidth ?? (float ? 'var(--kol-float-label-w)' : settings ? 'fit-content' : 48)
  const gapClass = float ? 'gap-[var(--kol-float-label-gap)]' : settings ? (horizontal ?? inline ? 'gap-2' : 'gap-1.5') : null
  const mark = { 'data-labeled-control': '', ...rest }
  const labelType = labelClass ?? (float ? 'kol-float-hint text-fg-64' : settings ? SETTINGS_LABEL : 'kol-helper-10 tracking-widest text-meta')
  /* a display class from the caller replaces the wrapper's own (`hidden md:flex` must hold) */
  const display = DISPLAY.test(className) ? '' : 'flex'
  /* …and so does a gap class: the caller's spacing, not two utilities racing */
  const ownGap = /(^|\s)gap-/.test(className)
  const labelInner = (
    <>
      {label}
      {hint !== undefined && (
        <span className="ml-2 normal-case tracking-normal text-subtle">{hint}</span>
      )}
    </>
  )

  if (horizontal ?? inline ?? false) {
    /* `'auto'`: the label is the yielding cell — flex-1, truncating — and the
     * control hugs. The control still carries min-w-0 + overflow-hidden so a
     * combo wider than the whole column CLIPS at the column edge rather than
     * painting over the neighbour (the invariant: no cell outside its column).
     * BELOW `sm` IT STACKS (apps review, 2026-09-29): the yielding label yielded to
     * nothing on a phone — a sentence-long combo took the whole row and the label
     * showed as "C" or not at all. Label on its line, the value under it. */
    const labelAuto = lw === 'auto'
    return (
      <div {...mark} className={`${display} ${labelAuto ? `flex-col items-start gap-1 sm:flex-row ${text ? 'sm:items-baseline' : 'sm:items-center'} sm:gap-3` : `${text ? 'items-baseline' : 'items-center'} ${ownGap ? '' : gapClass ?? 'gap-3'}`}${float ? ' min-h-[var(--kol-float-h-sm)]' : ''} ${className}`}>
        {showLabel && (
          <span
            /* A LABEL NEVER WRAPS (review 2, § 6.2 — the helper law by construction, 01-foundations/03-typography.md:29):
             * `whitespace-nowrap truncate`, so a long one ends in an ellipsis instead of breaking onto a second line */
            className={`${labelType} whitespace-nowrap truncate${text ? ' leading-4' : ''} ${labelAuto ? 'max-w-full min-w-0 sm:flex-1' : 'shrink-0'}`}
            style={labelAuto ? undefined : { width: lw }}
          >
            {labelInner}
          </span>
        )}
        <div className={`${text ? 'flex ' : settings ? 'flex items-center ' : ''}${labelAuto ? 'min-w-0 max-w-full sm:overflow-hidden' : 'flex-1 min-w-0'}`}>{children}</div>
      </div>
    )
  }

  return (
    <div {...mark} className={`${display} flex-col ${ownGap ? '' : gapClass ?? 'gap-2'} ${className}`}>
      {showLabel && (
        <span className={labelType}>{labelInner}</span>
      )}
      {children}
    </div>
  )
}
