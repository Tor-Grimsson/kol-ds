import { useEffect, useRef, useState } from 'react'
import Dropdown from '../../molecules/Dropdown.jsx'
import Slider from '../../molecules/Slider.jsx'
import SpecimenSectionHeader from '../../molecules/foundry/SpecimenSectionHeader.jsx'
import { SPECIMEN_SAMPLE_TEXT } from './glyphData.js'

/* taxonomy-ok: organism — nests Dropdown, Slider, SpecimenSectionHeader
 * (relative imports) plus a same-file FontPreviewItem. */

const WEIGHT_VALUES = {
  Thin: 100,
  Extralight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  Semibold: 600,
  Bold: 700,
  Extrabold: 800,
  Black: 900,
}

/**
 * FontPreviewItem (same-file) — one preview block: a weight dropdown + Size /
 * Leading / Spacing sliders over an editable, in-family sample. Weight is
 * seeded from the section header (re-syncs when the parent's selection changes);
 * size/leading/spacing are local. Leading maps 0–50 → 90–140% line-height.
 */
function FontPreviewItem({
  fontFamily,
  fontStyle = 'normal',
  text = SPECIMEN_SAMPLE_TEXT,
  initialWeight = 'Regular',
  initialSize = 64,
  initialLeading = 10,
  lineClamp = null,
  availableWeights,
}) {
  const [size, setSize] = useState(initialSize)
  const [leading, setLeading] = useState(initialLeading)
  const [spacing, setSpacing] = useState(0)
  const [selectedWeight, setSelectedWeight] = useState(initialWeight)
  const editableRef = useRef(null)

  useEffect(() => setSelectedWeight(initialWeight), [initialWeight])
  useEffect(() => {
    if (editableRef.current && editableRef.current.textContent !== text) {
      editableRef.current.textContent = text
    }
  }, [text])

  const weightOptions = availableWeights.map((label) => ({ label, value: label }))
  const numericWeight = WEIGHT_VALUES[selectedWeight] || 400

  return (
    <div className="self-stretch min-h-40 p-6 rounded border border-fg-16 flex flex-col justify-start items-start gap-6 bg-surface-primary">
      <div className="self-stretch flex justify-start items-start gap-8">
        <div className="flex-shrink-0">
          <Dropdown
            options={weightOptions}
            value={selectedWeight}
            onChange={setSelectedWeight}
            variant="minimal"
          />
        </div>
        <div className="flex-1 flex justify-start items-start gap-8">
          <Slider label="Size" min={12} max={200} value={size} onChange={setSize} variant="minimal" className="flex-1" />
          <Slider
            label="Leading"
            min={0}
            max={50}
            value={leading}
            onChange={setLeading}
            variant="minimal"
            className="hidden md:flex flex-1"
            formatValue={(val) => 90 + val}
          />
          <Slider label="Spacing" min={-50} max={50} value={spacing} onChange={setSpacing} variant="minimal" className="hidden md:flex flex-1" />
        </div>
      </div>

      <div className="self-stretch rounded flex justify-start items-start overflow-hidden">
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 bg-transparent outline-none border-none text-auto"
          style={{
            fontFamily,
            fontStyle,
            fontWeight: numericWeight,
            fontSize: `${size}px`,
            lineHeight: `${90 + leading}%`,
            letterSpacing: `${spacing}px`,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            hyphens: 'none',
            maxWidth: '100%',
            ...(lineClamp && {
              display: '-webkit-box',
              WebkitLineClamp: lineClamp,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }),
          }}
        />
      </div>
    </div>
  )
}

const DEFAULT_WEIGHTS = [
  'Thin', 'Extralight', 'Light', 'Regular', 'Medium', 'Semibold', 'Bold', 'Extrabold', 'Black',
]
const SIZE_LADDER = [
  { size: 96, lines: 1 },
  { size: 64, lines: 3 },
  { size: 48, lines: 4 },
  { size: 24, lines: 5, leading: 50 },
]

/**
 * FontPreviewSection — a stacked multi-size preview: the shared header (weight +
 * Roman/Italic dropdowns) above a ladder of preview blocks at 96 / 64 / 48 / 24
 * px, each pre-seeded with the section's selected weight + italic state. Read a
 * family from display down to body size at a chosen weight.
 *
 * Font-agnostic: the monorepo's TGMalromur/Málrómur defaults are dropped —
 * `fontFamily` + `badgeText` are prop-driven. The size ladder + weight ramp are
 * sensible defaults, overridable via `sizes` / `availableWeights`.
 *
 * Text casing: badgeText, weight labels and style labels render verbatim.
 *
 * @param {string} props.fontFamily - Family rendered in every preview item.
 * @param {string} props.badgeText - Header title.
 * @param {boolean} props.showDropdown - Render the style dropdown; seeds italic (default true).
 * @param {string[]} props.availableWeights - Weight dropdown options (default 9-stop ramp).
 * @param {string} props.initialWeight - Initially selected weight (default 'Regular').
 * @param {Array<{size,lines,leading?}>} props.sizes - Size ladder (default 96/64/48/24).
 */
const FontPreviewSection = ({
  fontFamily = 'system-ui, sans-serif',
  badgeText = 'Preview',
  showDropdown = true,
  availableWeights = DEFAULT_WEIGHTS,
  initialWeight = 'Regular',
  sizes = SIZE_LADDER,
}) => {
  const [selectedStyleVariant, setSelectedStyleVariant] = useState(showDropdown ? 'italic' : 'roman')
  const [selectedWeight, setSelectedWeight] = useState(initialWeight)
  const isItalic = selectedStyleVariant === 'italic'
  const weightOptions = availableWeights.map((label) => ({ label, value: label }))

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          selectedStyle={selectedStyleVariant}
          onStyleChange={setSelectedStyleVariant}
          showDropdown={showDropdown}
          badgeText={badgeText}
          icon="foundation"
          size="sm"
          selectedWeight={selectedWeight}
          onWeightChange={setSelectedWeight}
          showWeightDropdown={availableWeights.length > 0}
          weightOptions={weightOptions}
        />

        {sizes.map(({ size, lines, leading }) => (
          <FontPreviewItem
            key={size}
            fontFamily={fontFamily}
            fontStyle={isItalic ? 'italic' : 'normal'}
            initialWeight={selectedWeight}
            availableWeights={availableWeights}
            initialSize={size}
            initialLeading={leading}
            lineClamp={lines}
          />
        ))}
      </div>
    </section>
  )
}

export default FontPreviewSection
