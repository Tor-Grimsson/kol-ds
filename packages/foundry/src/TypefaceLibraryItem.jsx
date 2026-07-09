import { useState, useRef, useLayoutEffect } from 'react'

/**
 * TypefaceLibraryItem — a single typeface entry in the library, in either card
 * or list layout. Card: vertical layout with a large "Ðð" preview that swaps to
 * a pangram on hover. List: horizontal layout with a width-clipped alphabet
 * preview (binary-search clipping via ResizeObserver, mirroring DisplaySpecimen).
 *
 * Meant to be wrapped by the parent for navigation (see TypefaceLibraryGrid*).
 *
 * @param {Object} props
 * @param {Object} props.typeface - Typeface data ({ name, styles, classification, year, ... }).
 * @param {'card'|'list'} props.variant - Display variant (default 'card').
 * @param {boolean} props.isActive - Whether this item is the last-hovered/active one.
 * @param {Function} props.onMouseEnter - Callback fired on mouse enter.
 */
const TypefaceLibraryItem = ({ typeface, variant = 'card', isActive = false, onMouseEnter }) => {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [visibleText, setVisibleText] = useState('Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz')
  // Map typeface name to font family
  const fontFamily = typeface.name === 'TG Rót' ? 'TGRoot' :
                     typeface.name === 'TG Tröllatunga' ? 'TGTrollatunga' :
                     typeface.name === 'TG Dylgjur' ? 'TGDylgjur' :
                     typeface.name === 'TG Gullhamrar' ? 'TGGullhamrar' :
                     'TGMalromur'

  const fontStyle = typeface.name === 'TG Málrómur' ? 'italic' : 'normal'

  const fullAlphabet = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz'

  // TEXT CLIPPING LOGIC - similar to DisplaySpecimen but for horizontal width
  useLayoutEffect(() => {
    if (variant !== 'list') return

    const container = containerRef.current
    const textElement = textRef.current
    if (!container || !textElement) return

    const calculateClipping = () => {
      if (container.clientWidth === 0) return
      const availableWidth = container.clientWidth - 40
      const chars = fullAlphabet.split('')
      let clippedText = ''
      let low = 0
      let high = chars.length

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const testText = chars.slice(0, mid).join('')
        textElement.textContent = testText
        if (textElement.scrollWidth <= availableWidth) {
          clippedText = testText
          low = mid + 1
        } else {
          high = mid - 1
        }
      }

      setVisibleText(clippedText)
    }

    // Use ResizeObserver so it fires when container actually has dimensions
    const ro = new ResizeObserver(calculateClipping)
    ro.observe(container)

    window.addEventListener('resize', calculateClipping)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', calculateClipping)
    }
  }, [variant, fontFamily, fontStyle])

  // Card variant
  if (variant === 'card') {
    return (
      <div
        className={`group bg-surface-primary hover:bg-surface-inverse rounded transition-all duration-300 h-[500px] relative border border-fg-08 cursor-pointer ${
          isActive ? 'bg-surface-inverse' : ''
        }`}
        onMouseEnter={onMouseEnter}
      >
          {/* Details at Top */}
          <div className={`p-6 space-y-2 group-hover:opacity-0 transition-opacity duration-300 relative z-10 ${isActive ? 'opacity-0' : ''}`}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`kol-helper-lg group-hover:text-auto-inverse transition-colors ${isActive ? 'text-auto-inverse' : 'text-auto'}`}>
                {typeface.name}
              </h3>
            </div>
            <p className={`kol-helper-s group-hover:text-fg-inverse-64 transition-colors ${isActive ? 'text-fg-inverse-64' : 'text-fg-64'}`}>
              {typeface.styles}
            </p>
          </div>

          {/* Preview Area */}
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-start p-8">
            {/* Default: Ðð */}
            <div
              className={`text-[140px] lg:text-[160px] leading-none group-hover:text-auto-inverse group-hover:opacity-0 transition-all duration-300 relative z-10 ${
                isActive ? 'text-auto-inverse opacity-0' : 'text-auto'
              }`}
              style={{
                fontFamily,
                fontStyle,
                fontWeight: 400
              }}
            >
              Ðð
            </div>
          </div>

          {/* Hover: Sentence - Covers entire card */}
          <div className={`absolute inset-0 flex items-center justify-center p-8 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}>
            <p
              className="text-auto-inverse text-4xl lg:text-5xl leading-tight text-center"
              style={{
                fontFamily,
                fontStyle,
                fontWeight: 400
              }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
    )
  }

  // List variant - compact horizontal style matching TypefaceVariablePreview
  return (
    <div
      ref={containerRef}
      className={`self-stretch min-h-40 p-6 rounded flex flex-col justify-start items-start gap-6 mb-6 overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive
          ? 'bg-[color-mix(in_srgb,var(--kol-surface-on-primary)_1%,transparent)] border border-[color-mix(in_srgb,var(--kol-surface-on-primary)_24%,transparent)]'
          : 'bg-transparent border border-fg-08 hover:bg-[color-mix(in_srgb,var(--kol-surface-on-primary)_1%,transparent)] hover:border-[color-mix(in_srgb,var(--kol-surface-on-primary)_24%,transparent)]'
      }`}
      onMouseEnter={onMouseEnter}
    >
      {/* Header Row */}
      <div className="self-stretch flex justify-between items-center">
        {/* Left: Typeface Name & Info */}
        <div className="w-64 flex justify-start items-start gap-6">
          <div className="flex-1 flex flex-col justify-start items-start gap-3">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch kol-mono-sm uppercase">
                {typeface.name}
              </div>
              <div className="self-stretch kol-mono-xs text-fg-64">
                {typeface.styles}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status/Year info */}
        <div className="flex flex-col items-end gap-2">
          <span className="kol-mono-sm">
            {typeface.classification}
          </span>
          <span className="kol-mono-xs text-fg-64">
            {typeface.year}
          </span>
        </div>
      </div>

      {/* Preview Text Row */}
      <div className="self-stretch rounded flex justify-start items-center">
        <div
          ref={textRef}
          className="flex-1 self-stretch justify-start text-auto font-black leading-[52px] whitespace-nowrap"
          style={{
            fontFamily,
            fontStyle,
            fontWeight: 400,
            fontSize: '48px',
            letterSpacing: '0'
          }}
        >
          {visibleText}
        </div>
      </div>
    </div>
  )
}

export default TypefaceLibraryItem
