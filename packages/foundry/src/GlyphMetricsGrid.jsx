import { useEffect, useRef, useState } from 'react'
import { Tag } from '@kolkrabbi/kol-component'
import { glyphSets } from './glyphData.js'

/* taxonomy-ok: organism — nests DS Tag (relative import) and owns font I/O +
 * parsed-metric geometry. */

/* ---------------------------------------------------------------------------
 * FontLoader (same-file) — fetch → FontFace inject → best-effort opentype parse.
 *
 * The font face is ALWAYS injected (under a unique family name) so the big
 * glyph + grid cells render the real file even when metric parsing is
 * unavailable. opentype.js is loaded via a DYNAMIC import so a consumer that
 * hasn't installed the peer dep simply gets no parsed metrics (the grid renders
 * without the baseline/x-height/cap/ascender/descender overlay) instead of a
 * hard crash. Folds in the fallback-chain metric extraction the monorepo's
 * inline overlay added (os2 ?? hhea ?? literal), so incomplete fonts don't throw.
 * ------------------------------------------------------------------------- */
class FontLoader {
  constructor(options = {}) {
    this.callbacks = options
    this.family = null
  }

  async loadFont(buffer, filename) {
    // Inject the face first — this never needs opentype and guarantees the
    // glyph renders in the real font.
    const uniqueFontName = `KolFoundryFont_${Date.now()}`
    try {
      const fontFace = new FontFace(uniqueFontName, buffer)
      await fontFace.load()
      document.fonts.add(fontFace)
      this.family = uniqueFontName
    } catch (err) {
      this.callbacks.onError?.(err)
    }

    // Best-effort metric parse. Dynamic import degrades gracefully when the
    // opentype.js peer dep is absent.
    let font = null
    try {
      const mod = await import('opentype.js')
      const parse = mod.parse || mod.default?.parse || mod.default
      font = parse(buffer)
    } catch (err) {
      // No metrics — the overlay just won't draw. Not fatal.
      this.callbacks.onError?.(err)
    }

    this.callbacks.onFontLoaded?.({ font, fontFamily: this.family, filename })
    return { font, fontFamily: this.family }
  }

  cleanup() {
    if (typeof document === 'undefined') return
    document.fonts.forEach((f) => {
      if (f.family && f.family.startsWith('KolFoundryFont_')) document.fonts.delete(f)
    })
    this.family = null
  }
}

/**
 * GlyphMetricsGrid — table-style glyph inspector with real, parsed font metrics.
 *
 * One giant glyph carrying a live baseline / x-height / cap-height / ascender /
 * descender overlay drawn from the font's OWN OS/2 + hhea tables, beside two
 * clickable uppercase/lowercase glyph grids and a Unicode / decimal / hex
 * readout. Clicking a cell pins the big glyph; hovering previews it.
 * `variationSettings` feed straight into `font-variation-settings` so the
 * overlay stays correct under a live variable axis driven from the parent.
 *
 * FONT-ASSET CONTRACT: pass a real `.ttf`/`.otf` at `fontUrl` (same-origin, so
 * the fetch + FontFace injection succeed). The metric lines require opentype.js
 * (a peer dep, dynamically imported) — without it the grids still render, just
 * with no overlay. The showcase serves fonts under `/fonts/`; e.g.
 * `/fonts/Right-Grotesk-ttf/PPRightGrotesk-Regular.ttf`.
 *
 * Metric extraction uses fallback chains so incomplete fonts degrade instead of
 * throwing: unitsPerEm ← font.unitsPerEm ?? 1000; ascender ← os2.sTypoAscender
 * ?? hhea.ascender ?? 800; descender ← os2.sTypoDescender ?? hhea.descender ??
 * -200; capHeight ← os2.sCapHeight ?? 700; xHeight ← os2.sxHeight ?? 500.
 *
 * Text casing: metadata labels, grid titles and tab labels render verbatim.
 *
 * @param {Object} props
 * @param {string} props.fontUrl - URL of the font to fetch + parse (required for real metrics).
 * @param {string} props.fontFamily - CSS family fallback until the parsed face is injected.
 * @param {'normal'|'italic'} props.fontStyle - Inline font-style + the Roman/Italic metadata label.
 * @param {string} props.initialGlyph - Initially selected glyph (default 'f').
 * @param {string[]} props.uppercaseGlyphs - Top grid contents.
 * @param {string[]} props.lowercaseGlyphs - Bottom grid contents.
 * @param {Object} props.variationSettings - axis→value map serialized to font-variation-settings.
 */
const GlyphMetricsGrid = ({
  fontUrl,
  fontFamily = 'sans-serif',
  fontStyle = 'normal',
  initialGlyph = 'f',
  uppercaseGlyphs = [...glyphSets.uppercase, ...glyphSets.latin1],
  lowercaseGlyphs = [...glyphSets.lowercase, ...glyphSets.latinExtended],
  variationSettings = {},
}) => {
  const [selectedGlyph, setSelectedGlyph] = useState(initialGlyph)
  const [hoveredGlyph, setHoveredGlyph] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [fontData, setFontData] = useState(null)
  const [loadedFamily, setLoadedFamily] = useState(null)
  const [activeTab, setActiveTab] = useState('uppercase')

  const glyphRef = useRef(null)
  const overlayRef = useRef(null)

  const displayGlyph = hoveredGlyph || selectedGlyph
  const renderFamily = loadedFamily || fontFamily

  // Serialize the axis map once for the big glyph + every cell.
  const fontVariationSettingsCSS =
    Object.entries(variationSettings)
      .map(([axis, value]) => `"${axis}" ${value}`)
      .join(', ') || 'normal'

  // Load font + extract metrics (keyed on fontUrl only).
  useEffect(() => {
    if (!fontUrl) return
    const glyphElement = glyphRef.current
    if (!glyphElement) return

    const loader = new FontLoader({
      onFontLoaded: ({ font, fontFamily: injectedFamily }) => {
        if (injectedFamily) setLoadedFamily(injectedFamily)
        glyphElement.textContent = displayGlyph
        if (!font) return

        const os2 = font.tables?.os2
        const hhea = font.tables?.hhea
        setFontData({ font })
        setMetrics({
          unitsPerEm: font.unitsPerEm || 1000,
          ascender: os2?.sTypoAscender ?? hhea?.ascender ?? 800,
          descender: os2?.sTypoDescender ?? hhea?.descender ?? -200,
          capHeight: os2?.sCapHeight ?? 700,
          xHeight: os2?.sxHeight ?? 500,
        })
      },
      onError: (err) => console.warn('GlyphMetricsGrid: metrics unavailable', err),
    })

    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch(fontUrl)
        const buffer = await response.arrayBuffer()
        const filename = fontUrl.split('/').pop() || 'font.ttf'
        if (!cancelled) await loader.loadFont(buffer, filename)
      } catch (err) {
        if (!cancelled) console.warn('GlyphMetricsGrid: font fetch failed', err)
      }
    })()

    return () => {
      cancelled = true
      loader.cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontUrl])

  // Imperative glyph text on select/hover.
  useEffect(() => {
    if (glyphRef.current) glyphRef.current.textContent = displayGlyph
  }, [displayGlyph])

  // Metric-line overlay — overlay-relative coords, KOL tokens, mono type var.
  useEffect(() => {
    if (!fontData || !metrics || !glyphRef.current || !overlayRef.current) return
    const glyph = glyphRef.current
    const overlay = overlayRef.current

    const render = () => {
      const overlayRect = overlay.getBoundingClientRect()
      const glyphRect = glyph.getBoundingClientRect()
      const glyphTop = glyphRect.top - overlayRect.top

      const fontSize = parseFloat(window.getComputedStyle(glyph).fontSize)
      if (!fontSize || Number.isNaN(fontSize)) return

      const scale = fontSize / metrics.unitsPerEm
      const totalPixelHeight = (metrics.ascender - metrics.descender) * scale
      const baseline =
        glyphTop + glyphRect.height / 2 - totalPixelHeight / 2 + metrics.ascender * scale

      const lines = [
        { y: baseline - metrics.capHeight * scale, label: 'Cap Height', value: metrics.capHeight },
        { y: baseline - metrics.ascender * scale, label: 'Ascender', value: metrics.ascender },
        { y: baseline - metrics.xHeight * scale, label: 'x-height', value: metrics.xHeight },
        { y: baseline, label: 'Baseline', value: 0 },
        { y: baseline - metrics.descender * scale, label: 'Descender', value: metrics.descender },
      ]

      overlay.innerHTML = ''
      const labelCss = (side, y) => `
        position: absolute; ${side}: 13px; top: ${y - 18}px;
        opacity: 0.8; color: var(--kol-surface-on-primary);
        font-size: 12px; font-family: var(--kol-font-family-mono, monospace);
        line-height: 12px; user-select: none;`
      lines.forEach(({ y, label, value }) => {
        if (!Number.isFinite(y)) return
        const line = document.createElement('div')
        line.style.cssText = `position: absolute; left: 0; right: 0; top: ${y}px; border-top: 1px solid var(--kol-border-default);`
        overlay.appendChild(line)
        const left = document.createElement('div')
        left.style.cssText = labelCss('left', y)
        left.textContent = label
        overlay.appendChild(left)
        const right = document.createElement('div')
        right.style.cssText = labelCss('right', y)
        right.textContent = value
        overlay.appendChild(right)
      })
    }

    const raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [fontData, metrics, displayGlyph])

  const charCode = displayGlyph.charCodeAt(0)
  const unicodeHex = charCode.toString(16).toUpperCase().padStart(4, '0')

  const cellStyle = {
    fontFamily: renderFamily,
    fontStyle,
    fontVariationSettings: fontVariationSettingsCSS,
    outline: '1px solid var(--kol-border-default)',
    outlineOffset: '-0.5px',
  }

  const renderGrid = (glyphs, title) => (
    <div className="w-full flex flex-col gap-4">
      <div className="text-auto text-base md:text-lg kol-mono-text leading-7">{title}</div>
      <div
        className="inline-flex justify-start items-start flex-wrap"
        onMouseLeave={() => setHoveredGlyph(null)}
      >
        {glyphs.map((glyph, index) => {
          const isSelected = glyph === selectedGlyph
          return (
            <div
              key={index}
              onClick={() => setSelectedGlyph(glyph)}
              onMouseEnter={() => setHoveredGlyph(glyph)}
              className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 inline-flex flex-col justify-center items-center overflow-hidden cursor-pointer transition-colors duration-150 text-center text-lg md:text-xl lg:text-2xl leading-6 ${
                isSelected ? 'bg-surface-inverse' : 'bg-transparent text-auto hover:bg-fg-08'
              }`}
              style={cellStyle}
            >
              {glyph}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="bg-surface-primary flex flex-col lg:flex-row justify-start items-start gap-6 md:gap-8 lg:gap-10">
      {/* Left: glyph viewer + metrics overlay */}
      <div className="w-full lg:flex-[504] flex flex-col justify-start items-start gap-4 md:gap-6">
        <div className="text-auto text-base md:text-lg kol-mono-text leading-7">Glyph Viewer</div>

        <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6 lg:gap-10">
          <div className="self-stretch h-64 md:h-80 lg:h-96 relative rounded-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                ref={glyphRef}
                className="text-center text-auto"
                style={{
                  fontSize: 'clamp(180px, 25vw, 316px)',
                  lineHeight: '1',
                  fontFamily: renderFamily,
                  fontStyle,
                  fontVariationSettings: fontVariationSettingsCSS,
                }}
              >
                {displayGlyph}
              </span>
            </div>
            <div ref={overlayRef} className="absolute inset-0 pointer-events-none" aria-hidden />
          </div>

          {/* Metadata */}
          <div className="hidden md:inline-flex justify-start items-start gap-8">
            <div className="opacity-80 text-auto text-sm md:text-base lg:text-lg kol-mono-text leading-7">
              Font style<br />
              Glyph name<br />
              Unicode<br />
              Decimal<br />
              Hex
            </div>
            <div className="opacity-80 text-auto text-sm md:text-base lg:text-lg kol-mono-text leading-7">
              {fontStyle === 'italic' ? 'Italic' : 'Roman'}<br />
              {displayGlyph}<br />
              U+{unicodeHex}<br />
              {charCode}<br />
              0x{unicodeHex}
            </div>
          </div>
        </div>
      </div>

      {/* Right: dual grids */}
      <div className="w-full lg:flex-[832] flex flex-col justify-start items-start gap-4 md:gap-6">
        <div className="flex lg:hidden gap-3">
          <Tag hash={false} active={activeTab === 'uppercase'} onClick={() => setActiveTab('uppercase')}>
            Uppercase &amp; Latin
          </Tag>
          <Tag hash={false} active={activeTab === 'lowercase'} onClick={() => setActiveTab('lowercase')}>
            Lowercase &amp; Extended
          </Tag>
        </div>

        <div className="lg:hidden w-full">
          {activeTab === 'uppercase' && renderGrid(uppercaseGlyphs, 'Uppercase & Latin')}
          {activeTab === 'lowercase' && renderGrid(lowercaseGlyphs, 'Lowercase & Extended')}
        </div>

        <div className="hidden lg:flex lg:flex-col lg:gap-6 w-full">
          {renderGrid(uppercaseGlyphs, 'Uppercase & Latin')}
          {renderGrid(lowercaseGlyphs, 'Lowercase & Extended')}
        </div>
      </div>
    </div>
  )
}

export default GlyphMetricsGrid
