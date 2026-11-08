import { useEffect, useRef, useState } from 'react'
import Dropdown from './Dropdown.jsx'
import Slider from './Slider.jsx'

/**
 * TypeTester — One live type-testing block. a style Dropdown and Size / Leading / Spacing Sliders over an
 * editable sample in the font under test (lobby TypeTester, 2026-11-08 — ported class-for-class from
 * kol-website's foundry FontPreviewItem). The size ladder around it is the caller's: render one per rung.
 *
 * Leading maps 0–50 → 90–140% line-height. Below md only Size shows. The sample re-seeds from `text` only
 * when its content differs, so in-place edits survive a re-render.
 *
 * SIDE BEARINGS: the sample pads 0.15em inline and pulls back by the same, so overhangs (italic s, ð, f)
 * survive the clamp's own overflow: hidden. The wrapper must NOT clip (FontPreviewClampAndBearings, 2026-08-27).
 *
 * @param {string} fontFamily - Family of the sample
 * @param {'normal'|'italic'} fontStyle - Style of the sample (default 'normal')
 * @param {string} text - The editable sample text (re-seeded when it changes)
 * @param {{label: string, value: string|number}[]} styles - The Dropdown's options; `value` is the CSS font-weight
 * @param {string} initialStyle - The Dropdown's starting option, by label or value (default 'Regular')
 * @param {number} initialSize - Size slider start, px (default 64)
 * @param {number} initialLeading - Leading slider start, 0–50 → 90–140% (default 10)
 * @param {number|null} lineClamp - Clamp the sample to n lines with an ellipsis (default null)
 */
export default function TypeTester({
  fontFamily,
  fontStyle = 'normal',
  text = '',
  styles = [],
  initialStyle = 'Regular',
  initialSize = 64,
  initialLeading = 10,
  lineClamp = null,
}) {
  const seed = styles.find((s) => s.label === initialStyle || s.value === initialStyle)?.value ?? initialStyle
  const [size, setSize] = useState(initialSize)
  const [leading, setLeading] = useState(initialLeading)
  const [spacing, setSpacing] = useState(0)
  const [weight, setWeight] = useState(seed)
  const editableRef = useRef(null)

  useEffect(() => setWeight(seed), [seed])
  useEffect(() => {
    if (editableRef.current && editableRef.current.textContent !== text) {
      editableRef.current.textContent = text
    }
  }, [text])

  return (
    <div className="self-stretch min-h-40 p-4 md:p-6 rounded border border-fg-08 hover:border-fg-24 transition-colors duration-300 flex flex-col justify-start items-start gap-6 bg-surface-primary">
      <div className="self-stretch flex flex-wrap justify-between items-start gap-4 md:gap-8">
        <div className="flex-shrink-0">
          <Dropdown options={styles} value={weight} onChange={setWeight} />
        </div>
        <div className="flex flex-wrap justify-start items-start gap-4 md:gap-8">
          <Slider readoutPreset="rail" displayWidth={4} label="Size" min={12} max={200} value={size} onChange={setSize} className="w-56" />
          <Slider readoutPreset="rail" displayWidth={4}
            label="Leading"
            min={0}
            max={50}
            value={leading}
            onChange={setLeading}
            className="hidden md:flex w-56"
            formatValue={(val) => 90 + val}
          />
          <Slider readoutPreset="rail" displayWidth={4} label="Spacing" min={-50} max={50} value={spacing} onChange={setSpacing} className="hidden md:flex w-56" />
        </div>
      </div>

      {/* no overflow clip on the wrapper — the clamped element clips itself */}
      <div className="self-stretch rounded flex justify-start items-start">
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 bg-transparent outline-none border-none text-auto"
          style={{
            fontFamily,
            fontStyle,
            fontWeight: weight,
            fontSize: `${size}px`,
            lineHeight: `${90 + leading}%`,
            letterSpacing: `${spacing}px`,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            hyphens: 'none',
            maxWidth: '100%',
            paddingInline: '0.15em',
            marginInline: '-0.15em',
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
