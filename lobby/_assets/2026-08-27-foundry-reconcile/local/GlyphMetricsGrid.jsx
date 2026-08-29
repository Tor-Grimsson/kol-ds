import { useEffect, useRef, useState } from 'react'
import { FontLoader } from '@kolkrabbi/kol-foundry'
import { glyphSets } from '@kolkrabbi/kol-foundry'
import { Tag } from '@kolkrabbi/kol-component'
const defaultFontUrl = '/fonts/tg-foundry/TGMalromurItalicVF.ttf'

/**
 * GlyphMetricsGrid - Table-style glyph inspector with real font metrics
 *
 * A component matching the Figma spec with:
 * - Left: 504px wide glyph viewer with live font metrics overlay
 * - Right: 832px wide dual stacked character grids with table-like borders
 *
 * All metric values are extracted from the actual font file using FontLoader.
 *
 * @component
 * @param {Object} props
 * @param {string} props.fontUrl - URL to the font file to load
 * @param {string} props.fontFamily - CSS font-family name
 * @param {string} props.fontStyle - Font style: 'normal' or 'italic'
 * @param {string} props.initialGlyph - Initial glyph to display (default: 'f')
 * @param {Array<string>} props.uppercaseGlyphs - Glyphs for top grid (default: uppercase + latin1)
 * @param {Array<string>} props.lowercaseGlyphs - Glyphs for bottom grid (default: lowercase + latinExtended)
 *
 * @example
 * ```jsx
 * // Basic usage with defaults
 * <GlyphMetricsGrid
 *   fontUrl={malromurFont}
 *   fontFamily="TGMalromur"
 *   fontStyle="italic"
 * />
 *
 * // Custom glyph sets
 * <GlyphMetricsGrid
 *   fontUrl={dylgjurFont}
 *   fontFamily="TGDylgjur"
 *   fontStyle="normal"
 *   uppercaseGlyphs={glyphSets.uppercase}
 *   lowercaseGlyphs={glyphSets.lowercase}
 *   initialGlyph="A"
 * />
 * ```
 */
const GlyphMetricsGrid = ({
  fontUrl = defaultFontUrl,
  fontFamily = 'TGMalromur',
  fontStyle = 'normal',
  initialGlyph = 'f',
  uppercaseGlyphs = [...glyphSets.uppercase, ...glyphSets.latin1],
  lowercaseGlyphs = [...glyphSets.lowercase, ...(glyphSets.latinExtended || [])],
  variationSettings = {}
}) => {
  const [selectedGlyph, setSelectedGlyph] = useState(initialGlyph)
  const [hoveredGlyph, setHoveredGlyph] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [fontData, setFontData] = useState(null)
  const [activeTab, setActiveTab] = useState('uppercase')

  const glyphRef = useRef(null)
  const overlayRef = useRef(null)

  const displayGlyph = hoveredGlyph || selectedGlyph

  // Convert variationSettings object to CSS font-variation-settings string
  const fontVariationSettingsCSS = Object.entries(variationSettings)
    .map(([axis, value]) => `"${axis}" ${value}`)
    .join(', ') || 'normal'

  // Load font and extract metrics
  useEffect(() => {
    const glyphElement = glyphRef.current
    if (!glyphElement) return

    const loader = new FontLoader({
      onFontLoaded: ({ font, fontInfo, fontFamily: loadedFontFamily }) => {
        glyphElement.style.fontFamily = `"${loadedFontFamily}", sans-serif`
        glyphElement.textContent = displayGlyph
        setFontData({ font, fontInfo })

        // Extract REAL metrics from the font
        const unitsPerEm = font.unitsPerEm || fontInfo?.unitsPerEm || 1000
        const ascender = font.tables?.os2?.sTypoAscender ?? font.tables?.hhea?.ascender ?? 800
        const descender = font.tables?.os2?.sTypoDescender ?? font.tables?.hhea?.descender ?? -200
        const capHeight = font.tables?.os2?.sCapHeight ?? 700
        const xHeight = font.tables?.os2?.sxHeight ?? 500

        setMetrics({
          unitsPerEm,
          ascender,
          descender,
          capHeight,
          xHeight
        })
      },
      onError: (err) => {
        console.error('Font load failed', err)
      }
    })

    let cancelled = false

    const loadFont = async () => {
      try {
        const response = await fetch(fontUrl)
        const buffer = await response.arrayBuffer()
        const filename = fontUrl.split('/').pop() || 'font.ttf'
        if (!cancelled) {
          await loader.loadFont(buffer, filename)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Font load failed', err)
        }
      }
    }

    loadFont()

    return () => {
      cancelled = true
      loader.cleanup()
    }
  }, [fontUrl])

  // Update glyph when selected/hovered changes
  useEffect(() => {
    if (glyphRef.current) {
      glyphRef.current.textContent = displayGlyph
    }
  }, [displayGlyph])

  // Render metric lines
  useEffect(() => {
    if (!fontData || !metrics || !glyphRef.current || !overlayRef.current) return

    const glyph = glyphRef.current
    const overlay = overlayRef.current
    const { font } = fontData

    const render = () => {
      const overlayRect = overlay.getBoundingClientRect()
      const glyphRect = glyph.getBoundingClientRect()
      const glyphTop = glyphRect.top - overlayRect.top

      const computedStyle = window.getComputedStyle(glyph)
      const fontSize = parseFloat(computedStyle.fontSize)
      if (!fontSize || Number.isNaN(fontSize)) return

      const scale = fontSize / metrics.unitsPerEm

      const totalHeightUnits = metrics.ascender - metrics.descender
      const totalPixelHeight = totalHeightUnits * scale
      const baselineOffsetUnits = metrics.ascender
      const baseline = glyphTop + glyphRect.height / 2 - totalPixelHeight / 2 + baselineOffsetUnits * scale

      const lines = [
        { y: baseline - metrics.capHeight * scale, label: 'Cap Height', value: metrics.capHeight },
        { y: baseline - metrics.ascender * scale, label: 'Ascender', value: metrics.ascender },
        { y: baseline - metrics.xHeight * scale, label: 'x-height', value: metrics.xHeight },
        { y: baseline, label: 'Baseline', value: 0 },
        { y: baseline - metrics.descender * scale, label: 'Descender', value: metrics.descender }
      ]

      overlay.innerHTML = ''
      lines.forEach(({ y, label, value }) => {
        if (!Number.isFinite(y)) return

        // Line
        const line = document.createElement('div')
        line.style.cssText = `
          position: absolute;
          left: 0;
          right: 0;
          top: ${y}px;
          border-top: 1px solid var(--kol-border-default);
        `
        overlay.appendChild(line)

        // Left label
        const leftLabel = document.createElement('div')
        leftLabel.style.cssText = `
          position: absolute;
          left: 13px;
          top: ${y - 18}px;
          opacity: 0.8;
          color: var(--kol-surface-on-primary);
          font-size: 12px;
          font-family: var(--kol-font-family-mono);
          line-height: 12px;
          user-select: none;
        `
        leftLabel.textContent = label
        overlay.appendChild(leftLabel)

        // Right value
        const rightValue = document.createElement('div')
        rightValue.style.cssText = `
          position: absolute;
          right: 13px;
          top: ${y - 18}px;
          opacity: 0.8;
          color: var(--kol-surface-on-primary);
          font-size: 12px;
          font-family: var(--kol-font-family-mono);
          line-height: 12px;
          user-select: none;
        `
        rightValue.textContent = value
        overlay.appendChild(rightValue)
      })
    }

    const raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [fontData, metrics, displayGlyph])

  // Get Unicode info
  const charCode = displayGlyph.charCodeAt(0)
  const unicodeHex = charCode.toString(16).toUpperCase().padStart(4, '0')

  // Render table-like grid
  const renderGrid = (glyphs, title) => (
    <div className="w-full flex flex-col gap-4">
      <div className="text-auto kol-mono-16">
        {title}
      </div>
      <div
        className="inline-flex justify-start items-start flex-wrap"
        onMouseLeave={() => setHoveredGlyph(null)}
      >
        {glyphs.map((glyph, index) => (
          <div
            key={index}
            onClick={() => setSelectedGlyph(glyph)}
            onMouseEnter={() => setHoveredGlyph(glyph)}
            className={`
              w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
              outline outline-offset-[-0.5px] outline-auto
              inline-flex flex-col justify-center items-center
              overflow-hidden cursor-pointer
              transition-colors duration-150
              text-center text-lg md:text-xl lg:text-2xl leading-6
              ${glyph === selectedGlyph
                ? 'bg-surface-inverse text-auto'
                : 'bg-transparent text-auto hover:bg-auto/10'
              }
            `.trim()}
            style={{
              fontFamily: fontFamily,
              fontStyle: fontStyle,
              fontVariationSettings: fontVariationSettingsCSS
            }}
          >
            {glyph}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-surface-primary flex flex-col lg:flex-row justify-start items-start gap-6 md:gap-8 lg:gap-10">
      {/* Left: Glyph Viewer */}
      <div className="w-full lg:flex-[504] flex flex-col justify-start items-start gap-4 md:gap-6">
        <div className="text-auto kol-mono-16">
          Glyph Viewer
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6 lg:gap-10">
          {/* Glyph Display with Metrics */}
          <div className="self-stretch h-64 md:h-80 lg:h-96 relative rounded-md overflow-hidden">
            {/* Glyph */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                ref={glyphRef}
                className="text-center text-auto"
                style={{
                  fontSize: 'clamp(180px, 25vw, 316px)',
                  lineHeight: '1',
                  fontFamily: fontFamily,
                  fontStyle: fontStyle,
                  fontVariationSettings: fontVariationSettingsCSS
                }}
              >
                Loading…
              </span>
            </div>

            {/* Metrics Overlay */}
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
              aria-hidden
            />
          </div>

          {/* Metadata */}
          <div className="hidden md:inline-flex justify-start items-start gap-8">
            <div className="text-fg-64 kol-mono-14">
              Font style<br/>
              Glyph name<br/>
              Unicode<br/>
              Decimal<br/>
              Hex
            </div>
            <div className="text-fg-64 kol-mono-14">
              {fontStyle === 'italic' ? 'Italic' : 'Roman'}<br/>
              {displayGlyph}<br/>
              U+{unicodeHex}<br/>
              {charCode}<br/>
              0x{unicodeHex}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Dual Grids */}
      <div className="w-full lg:flex-[832] flex flex-col justify-start items-start gap-4 md:gap-6">
        {/* Tab Controls - Mobile Only */}
        <div className="flex lg:hidden gap-3">
          <Tag
            onClick={() => setActiveTab('uppercase')}
            className={activeTab === 'uppercase' ? 'is-active' : ''}
          >
            Uppercase & Latin
          </Tag>
          <Tag
            onClick={() => setActiveTab('lowercase')}
            className={activeTab === 'lowercase' ? 'is-active' : ''}
          >
            Lowercase & Extended
          </Tag>
        </div>

        {/* Mobile: Show only active tab */}
        <div className="lg:hidden w-full">
          {activeTab === 'uppercase' && renderGrid(uppercaseGlyphs, 'Uppercase & Latin')}
          {activeTab === 'lowercase' && renderGrid(lowercaseGlyphs, 'Lowercase & Extended')}
        </div>

        {/* Desktop: Show both grids */}
        <div className="hidden lg:flex lg:flex-col lg:gap-4 md:lg:gap-6 w-full">
          {renderGrid(uppercaseGlyphs, 'Uppercase & Latin')}
          {renderGrid(lowercaseGlyphs, 'Lowercase & Extended')}
        </div>
      </div>
    </div>
  )
}

export default GlyphMetricsGrid
