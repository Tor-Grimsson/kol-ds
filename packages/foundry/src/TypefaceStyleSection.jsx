import { useState } from 'react'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'

/* taxonomy-ok: organism — nests SpecimenSectionHeader (relative import) plus a
 * same-file StyleCard row; owns the axis/selection state. */

/**
 * StyleCard (same-file) — one style row: the label rendered live in its own
 * weight/width/italic on the left, the numeric value on the right, with an
 * active/hover flip. Inlined (the monorepo's `.style-card` CSS classes aren't
 * in the DS theme) and rebuilt Tailwind-first.
 */
function StyleCard({ label, weight, width, italic, isActive, onHover, onClick, fontFamily }) {
  return (
    <div
      onMouseEnter={onHover}
      onClick={onClick}
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded cursor-pointer border transition-colors duration-150 ${
        isActive ? 'bg-surface-inverse' : 'border-transparent hover:bg-fg-08'
      }`}
      style={{ borderColor: isActive ? 'transparent' : undefined }}
    >
      <span
        className="text-2xl md:text-3xl leading-none truncate"
        style={{
          fontFamily,
          fontStyle: italic ? 'italic' : 'normal',
          fontWeight: weight || 400,
          fontVariationSettings: width ? `'wdth' ${width}` : undefined,
        }}
      >
        {label}
      </span>
      <span className="kol-mono-12 shrink-0 opacity-70">{width || weight}</span>
    </div>
  )
}

const pickDefault = (list) => list.find((s) => s.isDefault) || list[3] || list[0]

/**
 * TypefaceStyleSection — the weight/width/italic style showcase: a sticky
 * inverted preview panel on the left (renders `AaBbCc / 01234567 / {(!@#$?&)}`
 * in the hovered/selected style) beside a grid of every available style on the
 * right. Derives its behavior generically from `typeface.styles`: italic →
 * Roman/Italic dropdown; weight+width → Weight/Width axis dropdown; single-axis
 * / static → no dropdown.
 *
 * Default selection prefers a style flagged `isDefault`, falling back to index
 * (Regular ≈ [3]) — the monorepo's magic indices assumed a fixed ordering; the
 * flag survives reordering. All preview typography stays inline from the
 * selected style (fontFamily / fontWeight / fontStyle / wdth variation) because
 * arbitrary loaded fonts + variable axes can't be fixed KOL type classes.
 *
 * Text casing: badgeText, style labels and specimen strings render verbatim.
 *
 * @param {Object} props.typeface - { fontFamily, badgeText, styles:{ hasWeight, hasWidth, hasItalic, defaultStyle?, weights[], widths[] } }.
 * @param {string[]} props.sampleLines - Preview lines (default AaBbCc / 01234567 / {(!@#$?&)}).
 */
const TypefaceStyleSection = ({
  typeface = {},
  sampleLines = ['AaBbCc', '01234567', '{(!@#$?&)}'],
}) => {
  const { fontFamily, badgeText, styles: styleConfig = {} } = typeface
  const {
    hasWeight,
    hasWidth,
    hasItalic,
    defaultStyle = 'weight',
    weights = [],
    widths = [],
  } = styleConfig

  const showDropdown = hasItalic || (hasWeight && hasWidth)
  const styleOptions = hasItalic
    ? [
        { label: 'Roman', value: 'roman' },
        { label: 'Italic', value: 'italic' },
      ]
    : hasWeight && hasWidth
      ? [
          { label: 'Weight', value: 'weight' },
          { label: 'Width', value: 'width' },
        ]
      : null

  const [selectedStyleVariant, setSelectedStyleVariant] = useState(
    hasItalic ? 'italic' : defaultStyle,
  )
  const isItalic = selectedStyleVariant === 'italic'
  const activeList = showDropdown && selectedStyleVariant === 'width' ? widths : weights

  const [currentStyle, setCurrentStyle] = useState(() => pickDefault(activeList) || {})

  const handleStyleVariantChange = (newVariant) => {
    setSelectedStyleVariant(newVariant)
    if (newVariant === 'width') setCurrentStyle(pickDefault(widths) || {})
    else setCurrentStyle(pickDefault(weights) || {})
  }

  const previewStyle = {
    fontFamily,
    fontWeight: currentStyle.weight || 400,
    fontStyle: isItalic ? 'italic' : 'normal',
    ...(currentStyle.width ? { fontVariationSettings: `'wdth' ${currentStyle.width}` } : {}),
  }

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          selectedStyle={selectedStyleVariant}
          onStyleChange={handleStyleVariantChange}
          styleOptions={styleOptions || undefined}
          showDropdown={showDropdown}
          badgeText={badgeText}
          icon="book-open"
          size="sm"
        />

        <div className="flex flex-row gap-4 md:gap-6 lg:gap-8 items-start w-full">
          {/* Left: sticky inverted preview panel */}
          <div className="w-1/2 aspect-[4/3] p-6 md:p-12 transition-colors duration-300 sticky top-24 bg-surface-inverse rounded">
            <div
              className="text-center transition-colors duration-300 w-full h-full flex flex-col justify-center items-center gap-2"
              style={previewStyle}
            >
              {sampleLines.map((line, i) => (
                <div key={i} className="text-3xl md:text-5xl lg:text-6xl leading-none">
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Right: styles list */}
          <div className="w-1/2 flex flex-col gap-3">
            {activeList.map((style, index) => (
              <StyleCard
                key={`${style.label}-${index}`}
                label={style.label}
                weight={style.weight}
                width={style.width}
                italic={isItalic}
                isActive={
                  currentStyle?.label === style.label &&
                  (style.weight
                    ? currentStyle?.weight === style.weight
                    : currentStyle?.width === style.width)
                }
                onHover={() => setCurrentStyle(style)}
                onClick={() => setCurrentStyle(style)}
                fontFamily={fontFamily}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TypefaceStyleSection
