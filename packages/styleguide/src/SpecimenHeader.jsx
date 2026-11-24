import { Dropdown, IconFrame, SectionHeader } from '@kolkrabbi/kol-component'

/* taxonomy-ok: nests kol-component's SectionHeader, IconFrame and Dropdown (package imports). */

/**
 * SpecimenHeader — The Specimen section head. The library master `SpecimenHeader` (Styleguide page, Sheet section;
 * type-ramp plan 6.8): one `SectionHeader` with the Specimen presets and one boolean, `controls`. False is the plain
 * group head (the ramp and weights sections); true puts the weight and style dropdowns in `SectionHeader`'s trailing
 * slot (the foundry sections). The icon sits in the leading slot, left of the title (his ruling 2026-11-14).
 *
 * Moved from kol-foundry's `SpecimenSectionHeader` (2026-11-14, plan 7.5); that name is the alias on the retirement
 * ledger, and every prop it took still works. `controls` defaults to true when dropdown props are given (an
 * `onStyleChange`, `onWeightChange` or a non-empty `weightOptions`), false otherwise.
 *
 * Text casing: title and option labels render verbatim as authored, no text-transform.
 *
 * @param {Object} props
 * @param {boolean} [props.controls] - The weight and style dropdowns in the trailing slot (Figma `controls`).
 * @param {string} props.label - Title text (takes precedence over badgeText).
 * @param {string} props.badgeText - Fallback title when label is unset.
 * @param {string} props.icon - KOL icon name in an IconFrame in the leading slot; omit to hide.
 * @param {'sm'|'md'|'lg'} props.size - Title stop (`lg` → helper-20, else SectionHeader's helper-16) and the dropdowns' size (`sm` → sm, else md). Default 'lg'.
 * @param {string} props.selectedStyle - Controlled value of the style/axis dropdown.
 * @param {Function} props.onStyleChange - Style dropdown change handler.
 * @param {boolean} props.showDropdown - Render the style/axis dropdown when `controls` is on (default true).
 * @param {Array<{label,value}>} props.styleOptions - Style dropdown options (default Roman/Italic).
 * @param {string} props.selectedWeight - Controlled value of the weight dropdown.
 * @param {Function} props.onWeightChange - Weight dropdown change handler.
 * @param {boolean} props.showWeightDropdown - Gate the weight dropdown (default true; also needs options).
 * @param {Array<{label,value}>} props.weightOptions - Weight dropdown options (default []).
 */
const SpecimenHeader = ({
  controls,
  label,
  badgeText,
  icon,
  size = 'lg',
  selectedStyle,
  onStyleChange,
  showDropdown = true,
  styleOptions = [
    { label: 'Roman', value: 'roman' },
    { label: 'Italic', value: 'italic' },
  ],
  selectedWeight,
  onWeightChange,
  showWeightDropdown = true,
  weightOptions = [],
}) => {
  const title = label || badgeText
  const on = controls ?? Boolean(onStyleChange || onWeightChange || weightOptions.length > 0)
  const ddSize = size === 'sm' ? 'sm' : 'md'
  const weight = showWeightDropdown && weightOptions.length > 0
  const trailing = on && (weight || showDropdown) ? (
    <>
      {weight && <Dropdown options={weightOptions} value={selectedWeight} onChange={onWeightChange} size={ddSize} />}
      {showDropdown && <Dropdown options={styleOptions} value={selectedStyle} onChange={onStyleChange} size={ddSize} />}
    </>
  ) : null

  return (
    <SectionHeader
      leading={icon ? <IconFrame name={icon} variant="secondary" size="md" /> : null}
      /* `lg` keeps the old 20 title: SectionHeader draws helper-16, the inner span takes the size */
      label={size === 'lg' ? <span className="kol-helper-20">{title}</span> : title}
      trailing={trailing}
    />
  )
}

export default SpecimenHeader
