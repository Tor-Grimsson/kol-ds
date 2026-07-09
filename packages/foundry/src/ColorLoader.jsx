import { motion as Motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@kolkrabbi/kol-component'
import TextPressure from './TextPressure.jsx'

/**
 * ColorLoader — a full-height branded intro/loading curtain. Fills its parent
 * on a solid backdrop, times in a variable-font wordmark (a live TextPressure
 * effect) after `wordmarkDelay`, then reveals a bouncing down-chevron cue after
 * `scrollDelay`. With `dismissOnClick`, clicking the curtain slides the whole
 * thing up out of view and fires `onComplete`; otherwise the parent owns
 * dismissal (unmount when its work is done). Generalized from the app's
 * KOLKRABBI loader: the cursor trail, `cursor: none`, and window-scroll/keyboard
 * gesture hijack are all dropped — exit is a plain click or parent-driven.
 *
 * Reduced motion → no timers, no tweens: one static frame (wordmark + cue shown
 * at rest) and `onComplete` fires immediately on mount, so the curtain never
 * makes a reduced-motion user wait.
 *
 * The wordmark needs a variable font — see TextPressure's font contract. Pass
 * `fontFamily` / `fontUrl` to point at the KOL variable font (a consumer asset).
 *
 * @param {string}    text           wordmark string fed to TextPressure
 * @param {string}    fontFamily     wordmark font family (→ TextPressure)
 * @param {string}    [fontUrl]      variable-font URL → TextPressure @font-face
 * @param {() => void} onComplete    fired after the exit slide-up (or at once, reduced)
 * @param {boolean}   dismissOnClick click the curtain to slide up + complete
 * @param {string}    bgColor        backdrop color (KOL token / CSS color)
 * @param {string}    markColor      wordmark + chevron color (KOL token / CSS color)
 * @param {number}    wordmarkDelay  ms before the wordmark fades in
 * @param {number}    scrollDelay    ms before the chevron cue reveals
 * @param {number}    exitDuration   seconds for the slide-up exit tween
 */
export default function ColorLoader({
  text = 'KOLKRABBI',
  fontFamily = 'var(--kol-font-family-sans)',
  fontUrl,
  onComplete,
  dismissOnClick = false,
  bgColor = 'var(--kol-surface-primary)',
  markColor = 'var(--kol-fg-emphasis)',
  wordmarkDelay = 1000,
  scrollDelay = 2000,
  exitDuration = 1.8,
}) {
  const reducedMotion = usePrefersReducedMotion()
  const [showMark, setShowMark] = useState(reducedMotion)
  const [showCue, setShowCue] = useState(reducedMotion)
  const [exiting, setExiting] = useState(false)
  const controls = useAnimationControls()
  const firedRef = useRef(false)

  const fireComplete = () => {
    if (firedRef.current) return
    firedRef.current = true
    onComplete?.()
  }

  useEffect(() => {
    if (reducedMotion) {
      // Skip the whole sequence: static frame, signal done at once.
      setShowMark(true)
      setShowCue(true)
      fireComplete()
      return undefined
    }
    const markTimer = setTimeout(() => setShowMark(true), wordmarkDelay)
    const cueTimer = setTimeout(() => setShowCue(true), scrollDelay)
    return () => {
      clearTimeout(markTimer)
      clearTimeout(cueTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, wordmarkDelay, scrollDelay])

  const dismiss = () => {
    if (exiting) return
    setExiting(true)
    if (reducedMotion) {
      fireComplete()
      return
    }
    controls
      .start({ y: '-100%', transition: { duration: exitDuration, ease: 'easeInOut' } })
      .then(fireComplete)
  }

  return (
    <Motion.div
      className={`flex h-full w-full flex-col ${dismissOnClick ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: bgColor }}
      animate={controls}
      initial={{ y: 0 }}
      onClick={dismissOnClick ? dismiss : undefined}
    >
      {/* Top third — spacer */}
      <div className="flex flex-1 items-end justify-center self-stretch" />

      {/* Middle third — wordmark + cue */}
      <div className="flex flex-1 flex-col items-center justify-center gap-12 self-stretch">
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showMark ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          className="w-full px-6"
        >
          <div className="mx-auto h-20 w-full max-w-[280px] sm:h-24 sm:max-w-[400px] md:h-32 md:max-w-[600px]">
            <TextPressure
              text={text}
              fontFamily={fontFamily}
              fontUrl={fontUrl}
              textColor={markColor}
              flex
              width
              weight
              italic={false}
              minFontSize={40}
            />
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: showCue ? 0.6 : 0,
            y: showCue && !reducedMotion ? [0, 12, 0] : 0,
          }}
          transition={{
            opacity: { duration: reducedMotion ? 0 : 0.5 },
            y: reducedMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="mt-12"
          style={{ color: markColor }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Motion.div>
      </div>

      {/* Bottom third — spacer */}
      <div className="flex flex-1 items-end justify-center self-stretch" />
    </Motion.div>
  )
}
