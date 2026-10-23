import { useState } from 'react'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import GalleryCarousel from './GalleryCarousel.jsx'
import MediaTileGallery from './MediaTileGallery.jsx'
import MediaViewer from './MediaViewer.jsx'

const LABELS = { carousel: 'Carousel', grid: 'Grid', waterfall: 'Waterfall' }

/**
 * MediaGalleryModes — One media set, three ways to look at it. (MediaGalleryModes, kol-branding
 * 2026-10-21 — the user: *"a carousel is a nice viewing experience, unless you are looking for
 * specific thing, then you might wanna grid or waterfall the images"*.) The viewer switches
 * carousel (`GalleryCarousel`) · grid · waterfall (`MediaTileGallery`); any item opens the one
 * `MediaViewer` here, paged across the whole set, so the item last opened survives a mode change.
 *
 * @param {Array}    items        [{ url, kind?: 'image'|'video', alt?, caption?, aspect? }]
 * @param {string[]} modes        which modes are offered (default all three); one hides the switch
 * @param {string}   mode · defaultMode · onModeChange   controlled or uncontrolled (default carousel)
 * @param {number}   cols         grid + waterfall columns from sm up (default 3); two below
 * @param {string}   title        the header label, and the alt fallback
 */
export default function MediaGalleryModes({
  items = [], modes = ['carousel', 'grid', 'waterfall'], mode: modeProp, defaultMode, onModeChange,
  cols = 3, title, className = '',
}) {
  const [own, setOwn] = useState(defaultMode ?? modes[0])
  const mode = modeProp ?? own
  const setMode = (m) => { setOwn(m); onModeChange?.(m) }
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const show = (i) => { setIndex(i); setOpen(true) }

  if (!items.length) return null

  return (
    <section className={`flex flex-col gap-4 ${className}`.trim()}>
      {(title || modes.length > 1) && (
        <div className="flex items-center justify-between gap-4">
          {title ? <span className="kol-helper-12 text-meta">{title}</span> : <span />}
          {modes.length > 1 && (
            <SegmentedToggle size="sm" ariaLabel="View" value={mode} onChange={setMode}
              options={modes.map((m) => ({ value: m, label: LABELS[m] }))} />
          )}
        </div>
      )}
      {mode === 'carousel'
        ? <GalleryCarousel media={items} title={title} onOpen={show} />
        : <MediaTileGallery items={items} layout={mode} cols={cols} onOpen={show} />}
      <MediaViewer open={open} media={items} index={index} onIndexChange={setIndex} onClose={() => setOpen(false)} />
    </section>
  )
}
