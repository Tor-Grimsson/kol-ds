/**
 * SpecimenSample — One caption and one sample. The library master `SpecimenSample` (Styleguide page, Samples section;
 * type-ramp plan 6.7), the atomic unit of the Specimen kit: an optional mono caption and one paragraph whose typography
 * is driven entirely by props via inline style. Stack several in a `SpecimenSampleGroup` to show a scale, a weight range
 * or a family; adjacent samples get a hairline (`.kol-type-sample + .kol-type-sample`).
 *
 * `horizontal` false (default): the caption above the sample, mono 12 at fg-48. True: the caption beside the sample,
 * left, in the sample's own type (the font sheet's weight rows), the two ends apart and no hairline (the Figma sheet
 * spaces its weight rows by gap alone).
 *
 * Moved from kol-foundry's `TypeSample` (2026-11-14, plan 7.5); `TypeSample` is the alias on the retirement ledger.
 * Presentational: arbitrary px values are the point, so props map to inline style. Label and children render verbatim.
 *
 * @param {string}    family     font family name (wrapped as `"family", sans-serif`); defaults to the KOL sans token
 * @param {number}    weight     font-weight
 * @param {boolean}   italic     italic sample
 * @param {number}    size       font-size in px
 * @param {number}    lineHeight line-height in px; unitless 1.2 when unset
 * @param {string}    label      the caption (omit to hide; Figma `show caption`)
 * @param {boolean}   horizontal caption beside the sample instead of above it
 * @param {ReactNode} children   the specimen text itself
 */
export default function SpecimenSample({
  family,
  weight = 400,
  italic = false,
  size = 32,
  lineHeight,
  label,
  horizontal = false,
  children,
}) {
  const type = {
    fontFamily: family ? `"${family}", sans-serif` : 'var(--kol-font-family-sans)',
    fontWeight: weight,
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: `${size}px`,
    lineHeight: lineHeight ? `${lineHeight}px` : '1.2',
  }

  if (horizontal) {
    return (
      <div className="flex items-start justify-between gap-8">
        {label && <p className="m-0 shrink-0 text-auto" style={type}>{label}</p>}
        <p className="kol-type-sample-body m-0 min-w-0 whitespace-pre-line text-auto" style={type}>{children}</p>
      </div>
    )
  }

  return (
    <div className="kol-type-sample py-6">
      {label && (
        <p className="kol-helper-12 tracking-wider text-meta m-0 mb-3">
          {label}
        </p>
      )}
      <p className="kol-type-sample-body m-0 text-auto" style={type}>
        {children}
      </p>
    </div>
  )
}
