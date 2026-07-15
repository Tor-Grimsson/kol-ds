import { useState } from 'react'
import { Pill } from '@kolkrabbi/kol-component'
import { Slider } from '@kolkrabbi/kol-component'
import SpecimenSectionHeader from './SpecimenSectionHeader.jsx'
import { useAxisAnimation } from '@kolkrabbi/kol-component'

/* taxonomy-ok: organism — nests Pill, Slider, SpecimenSectionHeader (relative
 * imports) plus a same-file PlayPauseButton; owns the axis-animation state. */

/**
 * PlayPauseButton (same-file) — CSS-shape play/pause toggle. Two bars when
 * playing, a right-pointing triangle when paused. Pure `currentColor` shapes so
 * it needs no icon registry and inherits the surrounding text color.
 */
function PlayPauseButton({ isPlaying = false, onToggle, size = 28 }) {
  const barH = Math.round(size * 0.43)
  const barW = Math.max(2, Math.round(size * 0.07))
  const tri = Math.round(size * 0.21)
  const gap = Math.max(2, Math.round(size * 0.07))
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      aria-pressed={isPlaying}
      className="cursor-pointer flex items-center justify-center text-auto shrink-0"
      style={{ width: size, height: size, gap }}
    >
      {isPlaying ? (
        <>
          <span className="bg-current" style={{ width: barW, height: barH }} />
          <span className="bg-current" style={{ width: barW, height: barH }} />
        </>
      ) : (
        <span
          className="w-0 h-0"
          style={{
            borderLeft: `${tri}px solid currentColor`,
            borderTop: `${tri}px solid transparent`,
            borderBottom: `${tri}px solid transparent`,
            marginLeft: Math.round(size * 0.07),
          }}
        />
      )}
    </button>
  )
}

/**
 * VariableFontSection — the animated variable-axis playground. A big specimen
 * word whose weight auto-oscillates between `minWeight` and `maxWeight` via
 * `useAxisAnimation` (ping-pong rAF, reduced-motion gated), pausing the instant
 * the user scrubs the weight slider. A SpecimenSectionHeader sits above with a
 * Roman/Italic dropdown. "Watch the weight breathe, then grab the slider."
 *
 * The weight is applied as CSS `font-weight` (→ the font's wght axis), so it
 * animates against ANY font with multiple weights — a true variable font makes
 * the morph continuous rather than stepped. See the page's FONT-ASSET CONTRACT.
 *
 * Reconciliations vs the monorepo source: the crude `Date.now()`/`delta>16`
 * throttle is replaced by the hook's `performance.now()` accumulator; the
 * previously unguarded loop now honors `prefers-reduced-motion` (starts paused,
 * static value); brand copy defaults ('Málrómur Aa' / 'Variable' / TGMalromur)
 * are dropped for neutral defaults.
 *
 * Text casing: badgeText, text and dropdown labels render verbatim.
 *
 * @param {Object} props
 * @param {string} props.fontFamily - Specimen family (default system stack).
 * @param {string} props.badgeText - Header title (default 'Variable axis').
 * @param {string} props.text - The big specimen word (default 'Variable').
 * @param {number} props.minWeight - Oscillation + slider lower bound (default 300).
 * @param {number} props.maxWeight - Oscillation + slider upper bound (default 900).
 * @param {boolean} props.showDropdown - Show the Roman/Italic dropdown (default true).
 */
const VariableFontSection = ({
  fontFamily = 'system-ui, sans-serif',
  badgeText = 'Variable axis',
  text = 'Variable',
  minWeight = 300,
  maxWeight = 900,
  showDropdown = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState(showDropdown ? 'italic' : 'roman')

  const { value: weight, setValue: setWeight, reduced } = useAxisAnimation({
    min: minWeight,
    max: maxWeight,
    running: isAnimating,
    initial: 400,
  })

  const handleSliderChange = (value) => {
    setIsAnimating(false)
    setWeight(value)
  }

  const playing = isAnimating && !reduced
  const fontStyle = selectedStyle === 'italic' ? 'italic' : 'normal'

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          showDropdown={showDropdown}
          badgeText={badgeText}
          icon="book-open"
          size="sm"
        />

        {/* VariableFontDisplay (inlined) — giant text behind, controls in front */}
        <div className="relative w-full rounded border border-fg-16 bg-surface-primary overflow-hidden p-6 md:p-10 h-[40vh] md:h-[60vh]">
          <p
            className="absolute inset-0 flex items-center justify-center text-[80px] md:text-[144px] transition-colors duration-300"
            style={{
              fontFamily,
              fontWeight: Math.round(weight),
              fontStyle,
              color: 'var(--kol-surface-on-primary)',
            }}
          >
            {text}
          </p>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="kol-mono-10 text-fg-32">AXES:</span>
                <span className="kol-helper-12 text-auto">WEIGHT</span>
              </div>
              <div className="flex gap-2">
                <Pill variant="subtle">wght {Math.round(weight)}</Pill>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <PlayPauseButton isPlaying={playing} onToggle={() => setIsAnimating((a) => !a)} />
              <Slider
                label="Weight"
                min={minWeight}
                max={maxWeight}
                value={Math.round(weight)}
                onChange={handleSliderChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VariableFontSection
