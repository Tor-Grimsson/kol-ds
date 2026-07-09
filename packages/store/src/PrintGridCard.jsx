import { useState, useRef, useMemo } from 'react'

/**
 * PrintGridCard — compact storefront card for a print grid: a single portrait
 * image (√2 aspect) with a soft border and a 3D flip when `isFlipped`. On mount
 * it randomly shows the artwork or the framed print mockup (`detailImages[0]`)
 * so a reload reshuffles the wall. Clicking (or Enter/Space) reports the card's
 * bounding rect + slug through `onCardClick` for a FLIP-style detail transition.
 *
 * Data-agnostic and commerce-free — no router, no price, no fulfillment. The
 * whole product enters through `print`; the parent owns navigation via
 * `onCardClick`. Reads only `print.image`, `print.detailImages`, `print.name`,
 * `print.slug`.
 *
 * @param {Object}   print       product record ({ image, detailImages?, name, slug })
 * @param {Function} onCardClick (rect:{top,left,width,height}, slug) => void
 * @param {boolean}  isFlipped   flips the card face (active/selected)
 * @param {string}   className   extra classes on the outer button
 */
export default function PrintGridCard({ print, onCardClick, isFlipped = false, className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef(null)

  // Randomly pick artwork or print mockup on mount.
  const displayImage = useMemo(() => {
    const printMockup = print.detailImages?.[0]
    if (printMockup && Math.random() < 0.5) return printMockup
    return print.image
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    if (cardRef.current && onCardClick) {
      const rect = cardRef.current.getBoundingClientRect()
      onCardClick(
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        print.slug,
      )
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`block cursor-pointer ${className}`}
    >
      <article>
        <div
          className="relative aspect-[1/1.41421] overflow-hidden rounded bg-surface-secondary"
          style={{ perspective: '1000px' }}
        >
          <div
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s ease-out',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              width: '100%',
              height: '100%',
            }}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={print.name}
                className={`size-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            ) : (
              <div className="size-full flex items-center justify-center">
                <span className="kol-mono-sm text-fg-24">No image</span>
              </div>
            )}
          </div>
          <div className="absolute inset-0 border border-fg-08 pointer-events-none rounded" />
        </div>
      </article>
    </div>
  )
}
