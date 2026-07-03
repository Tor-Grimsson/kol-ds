import { Icon } from '@kolkrabbi/kol-loader'
import Dropdown from '../Dropdown.jsx'
import Divider from '../../atoms/Divider.jsx'

/* taxonomy-ok: nests DS Dropdown + Divider (relative imports) plus kol-loader's
 * Icon (a package import the relative-import check can't see). */

/**
 * SpecimenSectionHeader — the shared header every type-specimen section mounts
 * under. A title (with an optional inline icon) on the left, up to two
 * controlled dropdowns (weight + style/axis) on the right, and a horizontal
 * divider beneath. It is the connective tissue that makes the foundry sections
 * read as one system, so it is built before the sections that consume it.
 *
 * Fully controlled and data-free: it holds no font data, only label/badge text,
 * an icon name, and the two dropdowns' value/onChange pairs supplied by the
 * parent section. Promoted from the monorepo's route-local `FoundrySection`;
 * the `Foundry*` name was a route artifact, this name describes the role.
 *
 * Title source forks: `label` wins, else `badgeText`. `size` swaps the title
 * type stop (`sm` → kol-mono-12, else kol-mono-16). Each dropdown is
 * independently gated; the weight dropdown also requires a non-empty
 * `weightOptions`.
 *
 * Text casing: title and option labels render verbatim as authored — no
 * text-transform. Author "Roman" / "Italic" / "Character Set" in intended case.
 *
 * @param {Object} props
 * @param {string} props.label - Title text (takes precedence over badgeText).
 * @param {string} props.badgeText - Fallback title when label is unset.
 * @param {string} props.icon - KOL Icon name shown after the title; omit to hide.
 * @param {'sm'|'lg'} props.size - Title type stop (default 'lg').
 * @param {string} props.selectedStyle - Controlled value of the style/axis dropdown.
 * @param {Function} props.onStyleChange - Style dropdown change handler.
 * @param {boolean} props.showDropdown - Render the style/axis dropdown (default true).
 * @param {Array<{label,value}>} props.styleOptions - Style dropdown options (default Roman/Italic).
 * @param {string} props.selectedWeight - Controlled value of the weight dropdown.
 * @param {Function} props.onWeightChange - Weight dropdown change handler.
 * @param {boolean} props.showWeightDropdown - Gate the weight dropdown (default true; also needs options).
 * @param {Array<{label,value}>} props.weightOptions - Weight dropdown options (default []).
 */
const SpecimenSectionHeader = ({
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
  // kol-mono-text-lg / kol-mono-sm-regular don't exist in the DS theme; the
  // nearest mono stops are kol-mono-16 (lg) and kol-mono-12 (sm).
  const titleClass = size === 'sm' ? 'kol-mono-12' : 'kol-mono-16'

  return (
    <div className="flex flex-col gap-[13px]">
      <div className="w-full flex flex-row justify-between items-end gap-4">
        {/* Left: title + optional icon */}
        <div className="flex items-center gap-3 md:gap-4">
          <span className={titleClass}>{title}</span>
          {icon && <Icon name={icon} size={20} />}
        </div>

        {/* Right: controlled dropdowns */}
        <div className="flex items-center gap-4">
          {showWeightDropdown && weightOptions.length > 0 && (
            <Dropdown options={weightOptions} value={selectedWeight} onChange={onWeightChange} />
          )}
          {showDropdown && (
            <Dropdown options={styleOptions} value={selectedStyle} onChange={onStyleChange} />
          )}
        </div>
      </div>

      <Divider variant="horizontal" />
    </div>
  )
}

export default SpecimenSectionHeader
