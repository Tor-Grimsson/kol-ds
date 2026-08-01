/**
 * Pill — the STATIC chip: a label, category, or status word. Not clickable.
 *
 * The chip family, so the right one gets reached for (documented at source,
 * 2026-07-30):
 *   Pill  — static label. No states, no handlers. THIS component.
 *   Tag   — interactive/filterable. Its active/onClick/onRemove states are the
 *           whole point; a Tag with no handler is a Pill wearing the wrong name.
 *   Badge — system status or a count.
 *
 * Defaults follow the standing laws: `primary` (the grey fill; nothing defaults
 * to outline — outline needs a stated reason) and `sm` (chip law).
 *
 * Variant vocabulary joined Button's (user ruling 2026-07-30): `primary` is the
 * grey/filled chip (was `subtle`), `secondary` is the outlined chip (was
 * `outline`). The old names remain as deprecated aliases — same classes, no
 * visual change at any call site.
 *
 * @param {Object} props
 * @param {string} props.children - Text content of the pill
 * @param {string} props.variant - Visual variant: 'primary' | 'secondary' | 'inverse' (deprecated aliases: 'subtle' → primary, 'outline' → secondary) (default: 'primary')
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' (default: 'sm')
 * @param {string} props.className - Additional classes for customization
 */
const Pill = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const variantClasses = {
    primary: 'pill-subtle',
    secondary: 'pill-outline',
    inverse: 'pill-inverse',
    /* deprecated aliases (pre-2026-07-30 vocabulary) */
    subtle: 'pill-subtle',
    outline: 'pill-outline'
  }

  const sizeClasses = {
    sm: 'pill-sm',
    md: 'pill-md',
    lg: 'pill-lg'
  }

  /* Type from the helper ramp — same ruling as Tag (2026-08-01). The pill-*
   * classes hardcoded size + weight and no line-height; kol-helper-* is the
   * single-line ramp (`line-height: 1`) and matches 10/12/14 exactly. */
  const typeClasses = {
    sm: 'kol-helper-10',
    md: 'kol-helper-12',
    lg: 'kol-helper-14'
  }

  return (
    <span className={`${variantClasses[variant]} ${sizeClasses[size]} ${typeClasses[size]} ${className}`.trim()}>
      {children}
    </span>
  )
}

export default Pill
