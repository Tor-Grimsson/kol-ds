import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * AnimatedTitle — scroll-triggered heading that reveals its words one by
 * one as it scrolls into view: each word starts far off-screen right,
 * rotated in 3D, and flies into place with a fast stagger (GSAP +
 * ScrollTrigger; plays entering the viewport, reverses scrolling back
 * out). `title` is an HTML-bearing string: the literal '<br />' splits
 * lines, spaces split words, and each word renders via
 * dangerouslySetInnerHTML so it can carry inline markup (<b>,
 * <span class>) — pass trusted strings only.
 *
 * Typography and color are inherited from the consumer via
 * `containerClass` — the component owns only the split and the motion.
 * When the user prefers reduced motion, no GSAP runs at all and the
 * title renders fully visible and static.
 *
 * @param {string}  title          HTML string; '<br />' → lines, ' ' → words. Required. Trusted content only
 * @param {string}  containerClass classes on the root (typography/color live here)
 * @param {object}  style          inline style on the root
 * @param {string}  lineClass      extra classes on each line row, after the flex defaults
 * @param {number}  stagger        seconds between word starts
 * @param {string}  start          ScrollTrigger start position
 * @param {string}  end            ScrollTrigger end position
 * @param {boolean} immediate      skip ScrollTrigger, play the reveal on mount (non-scrolling stages)
 */
export default function AnimatedTitle({
  title,
  containerClass,
  style,
  lineClass,
  stagger = 0.02,
  start = '100 bottom',
  end = 'center bottom',
  immediate = false,
}) {
  const containerRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return undefined

    const ctx = gsap.context(() => {
      const words = containerRef.current.querySelectorAll('.animatedWord')

      gsap.set(words, {
        opacity: 0,
        x: '150vw',
        y: 50,
        rotateY: -45,
        rotateX: 15,
      })

      const titleAnimation = gsap.timeline(
        immediate
          ? undefined
          : {
              scrollTrigger: {
                trigger: containerRef.current,
                start,
                end,
                toggleActions: 'play none none reverse',
              },
            },
      )

      titleAnimation.to(
        words,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          ease: 'power2.inOut',
          stagger,
        },
        0,
      )
    }, containerRef)

    return () => ctx.revert()
  }, [title, reducedMotion, immediate, stagger, start, end])

  return (
    <div ref={containerRef} className={containerClass} style={style}>
      {title.split('<br />').map((line, index) => (
        <div
          key={index}
          className={`flex items-center justify-center flex-wrap gap-2 md:gap-3 ${lineClass || ''}`}
        >
          {line.split(' ').map((word, i) => (
            <span
              key={i}
              className="animatedWord"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
