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
}) {
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
     * painting over the neighbour (the invariant: no cell outside its column). */
    const labelAuto = labelWidth === 'auto'
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showLabel && (
          <span
            className={`kol-helper-10 tracking-widest text-meta ${labelAuto ? 'flex-1 min-w-0 truncate' : 'shrink-0'}`}
            style={labelAuto ? undefined : { width: labelWidth }}
          >
            {labelInner}
          </span>
        )}
        <div className={labelAuto ? 'min-w-0 overflow-hidden' : 'flex-1 min-w-0'}>{children}</div>
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
