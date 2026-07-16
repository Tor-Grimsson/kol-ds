import React, { useEffect, useRef, useState } from 'react'
import { FontLoader } from './FontLoader.js'
import { GlyphAnimator } from './GlyphAnimator.js'
import { MetricsOverlay } from './MetricsOverlay.js'
import { UIControls } from './UIControls.js'
import { FontInfoRenderer } from './FontInfo.js'

const DEFAULT_VERTICAL = 50

const FontViewer = ({
  fontUrl,
  showControls = true,
  showMetrics = false,
  initialFontSize = 600,
  autoStart = true,
  animationDelay = 1000,
  config = {}
}) => {
  const mergedConfig = {
    showControls,
    showMetrics,
    initialFontSize,
    autoStart,
    animationDelay,
    ...config
  }

  const wrapperRef = useRef(null)
  const displayRef = useRef(null)
  const metricsOverlayElementRef = useRef(null)
  const fontInfoContentRef = useRef(null)
  const glyphInfoContentRef = useRef(null)

  const fontLoaderRef = useRef(null)
  const glyphAnimatorRef = useRef(null)
  const metricsOverlayRef = useRef(null)
  const uiControlsRef = useRef(null)
  const currentFontRef = useRef(null)

  const fontSizeRef = useRef(mergedConfig.initialFontSize)
  const verticalRef = useRef(DEFAULT_VERTICAL)
  const delayRef = useRef(mergedConfig.animationDelay)
  const metricsVisibleRef = useRef(mergedConfig.showMetrics)

  const [fontInfoVisible, setFontInfoVisible] = useState(false)
  const [glyphInfoVisible, setGlyphInfoVisible] = useState(false)
  const [metricsVisible, setMetricsVisible] = useState(mergedConfig.showMetrics)
  const [randomOrder, setRandomOrder] = useState(false)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [fontSizeValue, setFontSizeValue] = useState(mergedConfig.initialFontSize)
  const [verticalValue, setVerticalValue] = useState(DEFAULT_VERTICAL)
  const [delayValue, setDelayValue] = useState(mergedConfig.animationDelay)
  const [variationAxes, setVariationAxes] = useState([])
  const [variationValues, setVariationValues] = useState({})
  const [controlsVisible, setControlsVisible] = useState(false)

  useEffect(() => {
    const displayEl = displayRef.current
    const metricsEl = metricsOverlayElementRef.current
    if (!displayEl || !metricsEl) {
      return undefined
    }

    uiControlsRef.current = new UIControls()
    metricsOverlayRef.current = new MetricsOverlay(metricsEl)

    fontLoaderRef.current = new FontLoader({
      onFontLoaded: ({ font, fontInfo, fontFamily }) => {
        currentFontRef.current = font
        displayEl.style.fontFamily = `"${fontFamily}"`
        displayEl.style.fontSize = `${fontSizeRef.current}px`
        displayEl.style.top = `${verticalRef.current - 50}%`

        FontInfoRenderer.renderFontInfo(fontInfoContentRef.current, fontInfo)

        if (fontInfo.axes?.length > 0) {
          setVariationAxes(fontInfo.axes.map((axis) => ({ ...axis })))
          const defaults = fontInfo.axes.reduce((acc, axis) => {
            const numericDefault = Number(axis.default)
            acc[axis.tag] = Number.isNaN(numericDefault) ? Number(axis.min) || 0 : numericDefault
            return acc
          }, {})
          setVariationValues(defaults)
        } else {
          setVariationAxes([])
          setVariationValues({})
        }

        glyphAnimatorRef.current = new GlyphAnimator({
          displayElement: displayEl,
          onGlyphChange: (glyph) => {
            FontInfoRenderer.renderGlyphInfo(
              glyphInfoContentRef.current,
              font,
              glyph
            )

            if (metricsOverlayRef.current.isVisible) {
              metricsOverlayRef.current.render(font, displayEl)
            }
          }
        })

        glyphAnimatorRef.current.setGlyphsFromFont(font).then(() => {
          if (mergedConfig.autoStart) {
            if (delayRef.current >= 1000) {
              glyphAnimatorRef.current.stop()
            } else {
              glyphAnimatorRef.current.start(delayRef.current)
            }
          }
        })

        if (metricsVisibleRef.current) {
          metricsOverlayRef.current.isVisible = true
          metricsEl.style.display = 'block'
          metricsOverlayRef.current.render(font, displayEl)
        } else {
          metricsOverlayRef.current.isVisible = false
          metricsEl.style.display = 'none'
        }

        setFontLoaded(true)
      },
      onError: (error) => {
        console.error('FontViewer error:', error)
      }
    })

    return () => {
      fontLoaderRef.current?.cleanup()
      glyphAnimatorRef.current?.stop()
      metricsOverlayElementRef.current?.replaceChildren()
    }
  }, [mergedConfig.autoStart, mergedConfig.initialFontSize, mergedConfig.showMetrics])

  useEffect(() => {
    if (!fontUrl || !fontLoaderRef.current) {
      return
    }

    let cancelled = false

    const loadFont = async () => {
      try {
        const response = await fetch(fontUrl)
        const buffer = await response.arrayBuffer()
        const filename = fontUrl.split('/').pop() || 'font.ttf'
        if (!cancelled) {
          await fontLoaderRef.current.loadFont(buffer, filename)
        }
      } catch (error) {
        console.error('Error loading font:', error)
      }
    }

    loadFont()

    return () => {
      cancelled = true
    }
  }, [fontUrl])

  useEffect(() => {
    fontSizeRef.current = fontSizeValue
  }, [fontSizeValue])

  useEffect(() => {
    verticalRef.current = verticalValue
  }, [verticalValue])

  useEffect(() => {
    delayRef.current = delayValue
  }, [delayValue])

  useEffect(() => {
    metricsVisibleRef.current = metricsVisible
  }, [metricsVisible])

  useEffect(() => {
    const displayEl = displayRef.current
    if (!displayEl) {
      return
    }

    const settings = Object.entries(variationValues)
      .filter(([, val]) => typeof val === 'number' && !Number.isNaN(val))
      .map(([tag, val]) => `"${tag}" ${val.toFixed(1)}`)
      .join(', ')

    displayEl.style.fontVariationSettings = settings || 'normal'
  }, [variationValues])

  const handleToggleFontInfo = () => {
    setFontInfoVisible((prev) => !prev)
  }

  const handleToggleGlyphInfo = () => {
    setGlyphInfoVisible((prev) => !prev)
  }

  const handleToggleMetrics = () => {
    if (!metricsOverlayRef.current || !currentFontRef.current || !displayRef.current) {
      return
    }

    metricsOverlayRef.current.toggle()
    const isVisible = metricsOverlayRef.current.isVisible
    setMetricsVisible(isVisible)

    if (isVisible) {
      metricsOverlayRef.current.render(currentFontRef.current, displayRef.current)
    }
  }

  const handleSwapColors = () => {
    uiControlsRef.current?.toggleColorScheme()
  }

  const handleRandomize = () => {
    if (!glyphAnimatorRef.current) return
    glyphAnimatorRef.current.toggleOrder()
    setRandomOrder(glyphAnimatorRef.current.isRandomOrder)
  }

  const handleFontSizeChange = (value) => {
    const numeric = Number(value)
    setFontSizeValue(numeric)

    if (displayRef.current) {
      displayRef.current.style.fontSize = `${numeric}px`
    }

    if (metricsOverlayRef.current?.isVisible && currentFontRef.current && displayRef.current) {
      metricsOverlayRef.current.render(currentFontRef.current, displayRef.current)
    }
  }

  const handleVerticalChange = (value) => {
    const numeric = Number(value)
    setVerticalValue(numeric)

    if (displayRef.current) {
      const offset = numeric - 50
      displayRef.current.style.top = `${offset}%`
    }

    if (metricsOverlayRef.current?.isVisible && currentFontRef.current && displayRef.current) {
      metricsOverlayRef.current.render(currentFontRef.current, displayRef.current)
    }
  }

  const handleDelayChange = (value) => {
    const numeric = Number(value)
    setDelayValue(numeric)

    if (!glyphAnimatorRef.current) {
      return
    }

    if (numeric >= 1000) {
      glyphAnimatorRef.current.stop()
    } else {
      glyphAnimatorRef.current.start(numeric)
    }
  }

  const handleVariationChange = (tag, value) => {
    const numeric = Number(value)
    setVariationValues((prev) => {
      if (Number.isNaN(numeric)) {
        return prev
      }

      return {
        ...prev,
        [tag]: numeric
      }
    })
  }

  return (
    <div ref={wrapperRef} className="font-viewer-wrapper">
      <div className="font-viewer-display-container">
        <div
          ref={displayRef}
          className="font-viewer-glyph-buffer"
          style={{ top: `${verticalValue - 50}%`, fontSize: `${fontSizeValue}px` }}
        />
        <div
          ref={metricsOverlayElementRef}
          className="font-viewer-metrics-overlay"
          style={{ display: metricsVisible ? 'block' : 'none' }}
        />
      </div>

      <div
        className="font-viewer-info-panel font-viewer-font-info"
        aria-hidden={!fontInfoVisible}
        style={{ display: fontInfoVisible ? 'block' : 'none' }}
      >
        <div ref={fontInfoContentRef} className="font-viewer-info-content" />
      </div>

      <div
        className="font-viewer-info-panel font-viewer-glyph-info"
        aria-hidden={!glyphInfoVisible}
        style={{ display: glyphInfoVisible ? 'block' : 'none' }}
      >
        <div ref={glyphInfoContentRef} className="font-viewer-info-content" />
      </div>

      {mergedConfig.showControls ? (
        <div
          className={`font-viewer-controls${controlsVisible ? ' is-visible' : ''}`}
          role="toolbar"
          aria-label="Font viewer controls"
          onMouseEnter={() => setControlsVisible(true)}
          onMouseLeave={() => setControlsVisible(false)}
        >
          <div className="font-viewer-buttons">
            <ControlButton active={fontInfoVisible} onClick={handleToggleFontInfo}>
              {fontInfoVisible ? 'Hide font info' : 'Show font info'}
            </ControlButton>
            <ControlButton active={glyphInfoVisible} onClick={handleToggleGlyphInfo}>
              {glyphInfoVisible ? 'Hide glyph info' : 'Show glyph info'}
            </ControlButton>
            <ControlButton active={metricsVisible} onClick={handleToggleMetrics}>
              {metricsVisible ? 'Hide metrics' : 'Show metrics'}
            </ControlButton>
            <ControlButton onClick={handleSwapColors}>Swap colours</ControlButton>
            <ControlButton active={randomOrder} onClick={handleRandomize} disabled={!fontLoaded}>
              {randomOrder ? 'Sequential glyph order' : 'Randomize glyph order'}
            </ControlButton>
          </div>

          <div className="font-viewer-sliders">
            <SliderControl
              id="font-viewer-font-size"
              label="Font size"
              min={100}
              max={1200}
              value={fontSizeValue}
              onChange={handleFontSizeChange}
              formattedValue={`${fontSizeValue}px`}
            />

            <SliderControl
              id="font-viewer-vertical"
              label="Vertical position"
              min={0}
              max={100}
              value={verticalValue}
              onChange={handleVerticalChange}
              formattedValue={`${verticalValue}%`}
            />

            <SliderControl
              id="font-viewer-delay"
              label="Animation delay"
              min={10}
              max={1000}
              value={delayValue}
              onChange={handleDelayChange}
              formattedValue={delayValue >= 1000 ? 'Off' : `${delayValue}ms`}
            />

            {variationAxes.map((axis) => (
              <VariationControl
                key={axis.tag}
                axis={axis}
                value={variationValues[axis.tag]}
                onChange={(newValue) => handleVariationChange(axis.tag, newValue)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const ControlButton = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`font-viewer-btn${active ? ' active' : ''}${disabled ? ' disabled' : ''}`}
  >
    {children}
  </button>
)

const SliderControl = ({ id, label, min, max, step, value, onChange, formattedValue }) => {
  const handleChange = (event) => {
    onChange(event.target.value)
  }

  return (
    <div className="font-viewer-slider-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <span>{formattedValue}</span>
    </div>
  )
}

const VariationControl = ({ axis, value, onChange }) => {
  const sliderId = `font-axis-${axis.tag}`
  const min = Number(axis.min)
  const max = Number(axis.max)
  const defaultValue = Number(axis.default ?? axis.min ?? 0)
  let numericValue = typeof value === 'number' && !Number.isNaN(value) ? value : defaultValue

  if (!Number.isNaN(min)) {
    numericValue = Math.max(numericValue, min)
  }

  if (!Number.isNaN(max)) {
    numericValue = Math.min(numericValue, max)
  }

  const formattedValue = Number.isFinite(numericValue) ? numericValue.toFixed(1) : '0.0'
  const rawStep = axis.step ? Number(axis.step) : 0.1
  const step = Number.isNaN(rawStep) || rawStep === 0 ? 0.1 : rawStep

  return (
    <SliderControl
      id={sliderId}
      label={`${axis.name} (${axis.tag})`}
      min={Number.isNaN(min) ? undefined : min}
      max={Number.isNaN(max) ? undefined : max}
      step={step}
      value={numericValue}
      onChange={onChange}
      formattedValue={formattedValue}
    />
  )
}

export default FontViewer
