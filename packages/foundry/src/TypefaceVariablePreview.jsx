import { useState } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

/**
 * TypefaceVariablePreview — interactive preview for a single typeface weight.
 * List view: editable specimen text with Size / Leading / Spacing sliders. Card
 * view: static metrics readout. Used in the "By Typeface" library filter to
 * compare weights side by side.
 *
 * @param {Object} props
 * @param {Object} props.typeface - Typeface data ({ name, styles, classification, status, year }).
 * @param {string} props.weight - Weight label (e.g. 'Medium', 'Bold').
 * @param {number} props.weightValue - Numeric weight value (200–900).
 * @param {'list'|'card'} props.variant - Display variant (default 'list').
 */
const TypefaceVariablePreview = ({
  typeface,
  weight = 'Medium',
  weightValue = 400,
  variant = 'list'
}) => {
  // Font family mapping
  const fontFamilyMap = {
    'TG Málrómur': 'TGMalromur',
    'TG Rót': 'TGRoot',
    'TG Gullhamrar': 'TGGullhamrar',
    'TG Tröllatunga': 'TGTrollatunga',
    'TG Dylgjur': 'TGDylgjur'
  }

  const fontFamily = fontFamilyMap[typeface.name] || 'TGMalromur'
  const isItalic = typeface.name === 'TG Málrómur' || typeface.name === 'TG Dylgjur'

  // State for interactive controls
  const [size, setSize] = useState(64)
  const [leading, setLeading] = useState(10) // 0-50 range (maps to 90-140%)
  const [spacing, setSpacing] = useState(0)
  const [previewText, setPreviewText] = useState('Rennimjúkt eðal flauel, duft slæðist, silkislaufa')

  // Card View - Static information display
  if (variant === 'card') {
    return (
      <div className="bg-surface-primary border border-fg-08 rounded-sm p-6 h-full">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="kol-heading-sm mb-1">{typeface.name} — {weight}</h3>
            <p className="kol-mono-xs text-fg-64">{typeface.styles}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div>
              <span className="kol-mono-xs text-fg-64">Classification</span>
              <p className="kol-mono-sm text-auto">{typeface.classification}</p>
            </div>
            <div>
              <span className="kol-mono-xs text-fg-64">Weight</span>
              <p className="kol-mono-sm text-auto">{weight} ({weightValue})</p>
            </div>
            <div>
              <span className="kol-mono-xs text-fg-64">Status</span>
              <p className="kol-mono-sm text-auto">{typeface.status}</p>
            </div>
            <div>
              <span className="kol-mono-xs text-fg-64">Year</span>
              <p className="kol-mono-sm text-auto">{typeface.year}</p>
            </div>
          </div>

          {/* Typography Metrics - Placeholder for future implementation */}
          <div className="pt-4 border-t border-fg-08">
            <h4 className="kol-mono-xs text-fg-64 mb-2">Typography Metrics</h4>
            <div className="grid grid-cols-2 gap-2 kol-mono-xs text-fg-64">
              <div>Baseline: —</div>
              <div>x-height: —</div>
              <div>Cap height: —</div>
              <div>Ascender: —</div>
              <div>Descender: —</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // List View - Interactive preview with controls
  return (
    <div className="self-stretch min-h-40 p-6 rounded border border-fg-16 flex flex-col justify-start items-start gap-6 overflow-hidden bg-surface-primary">
      {/* Header Row with Controls */}
      <div className="self-stretch flex justify-between items-center">
        {/* Left: Typeface Name & Info */}
        <div className="w-64 flex justify-start items-start gap-6">
          <div className="flex-1 flex flex-col justify-start items-start gap-3">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch kol-mono-sm uppercase">
                {typeface.name} — {weight}
              </div>
              <div className="self-stretch kol-mono-xs text-fg-64">
                {typeface.styles}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Three Sliders Horizontal */}
        <div className="w-[960px] flex justify-start items-start gap-8">
          <Slider
            label="Size"
            min={12}
            max={200}
            value={size}
            onChange={setSize}
            className="flex-1"
          />
          <Slider
            label="Leading"
            min={0}
            max={50}
            value={leading}
            onChange={setLeading}
            className="flex-1"
            formatValue={(val) => 90 + val}
          />
          <Slider
            label="Spacing"
            min={-50}
            max={50}
            value={spacing}
            onChange={setSpacing}
            className="flex-1"
          />
        </div>
      </div>

      {/* Preview Text Row */}
      <div className="self-stretch rounded flex justify-start items-center">
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="flex-1 self-stretch justify-start bg-transparent text-auto font-black leading-[52px] outline-none border-none placeholder:text-auto"
          style={{
            fontFamily: fontFamily,
            fontStyle: isItalic ? 'italic' : 'normal',
            fontWeight: weightValue,
            fontSize: `${size}px`,
            lineHeight: `${90 + leading}%`,
            letterSpacing: `${spacing}px`
          }}
        />
      </div>
    </div>
  )
}

export default TypefaceVariablePreview
