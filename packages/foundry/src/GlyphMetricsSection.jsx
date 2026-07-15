import { useState } from 'react'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'
import GlyphMetricsGrid from './GlyphMetricsGrid.jsx'

/**
 * GlyphMetricsSection — the "Glyph Metrics" specimen section: a section header
 * (Roman/Italic or Weight/Width axis dropdowns) over the parsed-metric
 * GlyphMetricsGrid. Owns the style/axis selection state and feeds the grid the
 * chosen font URL + `variationSettings`.
 *
 * Composes the package's existing canonical leaves — SpecimenSectionHeader
 * (promoted from the monorepo's `FoundrySection`) and GlyphMetricsGrid (which
 * already handles font I/O with opentype.js as an optional peer).
 *
 * @param {Object} props
 * @param {string} props.fontFamily - CSS family fallback until the parsed face injects.
 * @param {string} props.fontUrlRoman - Roman/upright font URL.
 * @param {string} props.fontUrlItalic - Italic font URL.
 * @param {'normal'|'italic'} props.fontStyle - Initial style variant.
 * @param {string} props.badgeText - Section title text.
 * @param {boolean} props.showDropdown - Show the Roman/Italic style dropdown.
 * @param {boolean} props.hasWeight - Font has a weight axis.
 * @param {boolean} props.hasWidth - Font has a width axis.
 * @param {Array<{label,weight}>} props.weights - Weight axis options.
 * @param {Array<{label,width}>} props.widths - Width axis options.
 */
const GlyphMetricsSection = ({
  fontFamily = 'TGMalromur',
  fontUrlRoman,
  fontUrlItalic,
  fontStyle = 'normal',
  badgeText = 'Málrómur',
  showDropdown = true,
  // Variable font axis support
  hasWeight = false,
  hasWidth = false,
  weights = [],
  widths = []
}) => {
  const [selectedStyleVariant, setSelectedStyleVariant] = useState(
    fontStyle === 'italic' ? 'italic' : 'roman'
  )
  const [selectedAxis] = useState('weight')
  const [selectedWeight, setSelectedWeight] = useState(400)
  const [selectedWidth, setSelectedWidth] = useState(100)

  const isItalic = selectedStyleVariant === 'italic'

  // Select the correct font URL based on the dropdown
  const currentFontUrl = isItalic ? fontUrlItalic : fontUrlRoman

  // Build axis options for dropdown
  const axisOptions = []
  if (hasWeight) axisOptions.push({ label: 'Weight', value: 'weight' })
  if (hasWidth) axisOptions.push({ label: 'Width', value: 'width' })

  // Build value options based on selected axis
  const valueOptions = selectedAxis === 'weight'
    ? weights.map(w => ({ label: w.label, value: w.weight }))
    : widths.map(w => ({ label: w.label, value: w.width }))

  const selectedValue = selectedAxis === 'weight' ? selectedWeight : selectedWidth
  const onValueChange = selectedAxis === 'weight' ? setSelectedWeight : setSelectedWidth

  // Show axis dropdown if font has variable axes
  const showAxisDropdown = axisOptions.length > 0

  // Get variation settings for the glyph display
  const variationSettings = {}
  if (hasWeight) variationSettings.wght = selectedWeight
  if (hasWidth) variationSettings.wdth = selectedWidth

  // Style dropdown: roman/italic when font has italic
  const italicOptions = [
    { label: 'Roman', value: 'roman' },
    { label: 'Italic', value: 'italic' }
  ]

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          selectedStyle={showDropdown ? selectedStyleVariant : showAxisDropdown ? selectedValue : undefined}
          onStyleChange={showDropdown ? setSelectedStyleVariant : showAxisDropdown ? onValueChange : undefined}
          showDropdown={showDropdown || (showAxisDropdown && valueOptions.length > 0)}
          styleOptions={showDropdown ? italicOptions : valueOptions}
          badgeText={badgeText}
          icon="book-open"
          size="sm"
          showWeightDropdown={showAxisDropdown && valueOptions.length > 0}
          weightOptions={valueOptions}
          selectedWeight={selectedValue}
          onWeightChange={onValueChange}
        />

        <GlyphMetricsGrid
          fontUrl={currentFontUrl}
          fontFamily={fontFamily}
          fontStyle="normal"
          variationSettings={variationSettings}
        />
      </div>
    </section>
  )
}

export default GlyphMetricsSection
