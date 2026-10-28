import { motion as Motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import TextPressure from '../ui/TextPressure'
import CursorTrail from '../cursor/CursorTrail'
import { CursorProvider } from '../cursor/CursorContext'

/* IntroLoader — the site's intro curtain (was LoaderOverlay + ColorLoader; the
 * name carried no color and the 12-line wrapper had one consumer, so both
 * collapsed here 2026-08-14). Owns the CursorProvider (CursorTrail reads it),
 * the fixed z-100 shell, the KOLKRABBI TextPressure wordmark, and the
 * scroll/touch/keyboard exit gestures. Deliberately NOT the DS pair — the
 * kol-foundry ColorLoader dropped the gesture engine on purpose; audit ruling
 * 2026-08-14: keep local. */
export default function IntroLoader({ onEnter }) {
  const [showKolkrabbi, setShowKolkrabbi] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const controls = useAnimationControls()

  useEffect(() => {
    // Show KOLKRABBI after 1 second
    const kolkrabbiTimer = setTimeout(() => {
      setShowKolkrabbi(true)
    }, 1000)

    // Show Scroll arrow after 2 seconds
    const scrollTimer = setTimeout(() => {
      setShowScroll(true)
    }, 2000)

    return () => {
      clearTimeout(kolkrabbiTimer)
      clearTimeout(scrollTimer)
    }
  }, [])

  useEffect(() => {
    if (!showScroll || isExiting) return

    let touchStartY = 0

    const slideUp = () => {
      setIsExiting(true)
      window.scrollTo(0, 0)
      // Slide loader up - longer duration for more scroll feel
      controls.start({
        y: '-100%',
        transition: { duration: 1.8, ease: 'easeInOut' }
      }).then(() => {
        if (onEnter) onEnter()
      })
    }

    const handleScroll = (e) => {
      if (e.cancelable) {
        e.preventDefault()
      }
      // Detect scroll down
      if (e.deltaY > 0) {
        slideUp()
      }
    }

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      const touchEndY = e.touches[0].clientY
      const deltaY = touchStartY - touchEndY

      // Detect swipe up (delta > 50px to avoid accidental triggers)
      if (deltaY > 50) {
        slideUp()
      }

      if (e.cancelable) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e) => {
      const blockedKeys = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar', 'PageDown', 'PageUp', 'Home', 'End'])
      if (blockedKeys.has(e.key)) {
        e.preventDefault()
        slideUp()
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('keydown', handleKeyDown, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showScroll, isExiting, controls, onEnter])

  return (
    <CursorProvider>
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[100]">
      <CursorTrail />

      {/* Main container - fills parent, flex column layout, hide cursor */}
      <Motion.div
        className="w-full h-full flex flex-col"
        style={{ cursor: 'none', backgroundColor: 'var(--kol-color-absolute-black)' }}
        animate={controls}
        initial={{ y: 0 }}
      >
        {/* Top third - empty */}
        <div className="self-stretch flex-1 flex justify-center items-end" />

        {/* Middle third - Kolkrabbi + Scroll Arrow */}
        <div className="self-stretch flex-1 flex flex-col items-center justify-center gap-12">
          {/* KOLKRABBI - Fades in after 1 second */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showKolkrabbi ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full px-6"
          >
            <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] h-20 sm:h-24 md:h-32 mx-auto">
              <TextPressure
                text="KOLKRABBI"
                fontFamily="TG Rot"
                fontUrl="/fonts/tg-foundry/TGRotVF.ttf"
                textColor="var(--kol-color-absolute-white)"
                flex={true}
                width={true}
                weight={true}
                italic={false}
                minFontSize={40}
              />
            </div>
          </Motion.div>

          {/* Scroll Arrow - Fades in after 2 seconds with bounce animation */}
          <Motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: showScroll ? 0.6 : 0,
              y: showScroll ? [0, 12, 0] : 0
            }}
            transition={{
              opacity: { duration: 0.5 },
              y: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="mt-12"
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
              className="text-white"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Motion.div>
        </div>

        {/* Bottom third - empty */}
        <div className="self-stretch flex-1 flex justify-center items-end" />
      </Motion.div>
      </div>
    </CursorProvider>
  )
}
