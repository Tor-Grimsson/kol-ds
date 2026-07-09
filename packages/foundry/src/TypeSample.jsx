/**
 * TypeSample — a single labeled type-specimen block: an optional mono caption
 * over one paragraph whose typography is driven entirely by props via inline
 * style. The atomic unit of the type-specimen kit — stack several to show a
 * scale, a weight range, or a family; adjacent samples get a hairline
 * separator (`.kol-type-sample + .kol-type-sample`).
 *
 * Presentational — arbitrary px values are the point, so props map to inline
 * style rather than fixed kol-* size stops. Label and children render
 * verbatim as authored.
 *
 * @param {string}    family     font family name (wrapped as `"family", sans-serif`); defaults to the KOL sans token
 * @param {number}    weight     font-weight
 * @param {boolean}   italic     italic sample
 * @param {number}    size       font-size in px
 * @param {number}    lineHeight line-height in px; unitless 1.2 when unset
 * @param {string}    label      mono caption above the sample (omit to hide)
 * @param {ReactNode} children   the specimen text itself
 */
export default function TypeSample({
  family,
  weight = 400,
  italic = false,
  size = 32,
  lineHeight,
  label,
  children,
}) {
  return (
    <div className="kol-type-sample py-6">
      {label && (
        <p className="kol-helper-12 tracking-wider text-meta m-0 mb-3">
          {label}
        </p>
      )}
      <p
        className="kol-type-sample-body m-0 text-auto"
        style={{
          fontFamily: family ? `"${family}", sans-serif` : 'var(--kol-font-family-sans)',
          fontWeight: weight,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: `${size}px`,
          lineHeight: lineHeight ? `${lineHeight}px` : '1.2',
        }}
      >
        {children}
      </p>
    </div>
  )
}
