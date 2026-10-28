import { useEffect, useRef, useState } from 'react'

/* LINK PREVIEW — kol-atlas's hover card (apps/workspace/src/components/LinkPreview.jsx + previews.js), carried for the
 * document space: hover a link in the sheet and, after a short pause, a card opens under it — an image on top, a short
 * text below, Wikipedia-style. `#page` previews the page's title, intro and thumbnail; `#page--section` the section's
 * heading, first paragraph and first image (its page's thumbnail when it has none). Moving into the card keeps it open;
 * leaving both closes it; the card follows the link. Touch: a long press opens the card, a tap follows the link.
 * Not inside the note list — a link's note is its constant source, the card already showed in the text.
 *
 *   cardFor(a)  (anchor element) => { title, text, image, graphic, site, href } | null — the app's, from its corpus */
const W = 320
const PAUSE = 400
const PRESS = 400
const isGraphic = (file = '') => /\.(svg|png)$/i.test(file)

export default function LinkPreview({ root, cardFor }) {
  const [card, setCard] = useState(null)
  const timer = useRef(null)
  const over = useRef(false)

  useEffect(() => {
    const el = root?.current ?? document
    const clear = () => { clearTimeout(timer.current); timer.current = null }
    const close = () => { clear(); setCard(null) }
    const linkOf = (t) => t.closest?.('.kol-sheet a[href]')
    const inNotes = (a) => a.closest('ol.fns')
    const open = (a) => {
      const data = cardFor(a)
      if (!data) return
      const r = a.getBoundingClientRect()
      /* under the link; above it near the bottom of the window; kept inside the viewport's width */
      const below = window.innerHeight - r.bottom > 260
      setCard({ ...data, left: Math.min(Math.max(8, r.left), window.innerWidth - W - 8), top: below ? r.bottom + 8 : null, bottom: below ? null : window.innerHeight - r.top + 8 })
    }
    const onOver = (e) => {
      const a = linkOf(e.target)
      if (!a || inNotes(a) || e.pointerType === 'touch') return
      clear()
      timer.current = setTimeout(() => open(a), PAUSE)
    }
    const onOut = (e) => {
      const a = linkOf(e.target)
      if (!a) return
      clear()
      setTimeout(() => { if (!over.current) setCard(null) }, 120)
    }
    let press = null
    const onDown = (e) => { const a = linkOf(e.target); if (!a || e.pointerType !== 'touch' || inNotes(a)) return; press = setTimeout(() => { open(a); a.dataset.held = '1' }, PRESS) }
    const onUp = () => { clearTimeout(press); press = null }
    const onClick = (e) => { const a = linkOf(e.target); if (a?.dataset.held) { delete a.dataset.held; e.preventDefault() } else if (!e.target.closest('[data-link-card]')) setCard(null) }
    const onKey = (e) => { if (e.key === 'Escape') close() }
    el.addEventListener('pointerover', onOver)
    el.addEventListener('pointerout', onOut)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    document.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    return () => {
      el.removeEventListener('pointerover', onOver); el.removeEventListener('pointerout', onOut)
      el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointerup', onUp)
      document.removeEventListener('click', onClick, true); window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', close, true)
      clear()
    }
  }, [root, cardFor])

  if (!card) return null
  return (
    <a
      href={card.href}
      data-link-card
      onPointerEnter={() => { over.current = true }}
      onPointerLeave={() => { over.current = false; setCard(null) }}
      className="fixed z-[var(--kol-z-tooltip,60)] block overflow-hidden rounded border border-fg-12 bg-surface-primary no-underline shadow-[0_8px_24px_rgba(0,0,0,.18)]"
      style={{ width: W, left: card.left, top: card.top ?? undefined, bottom: card.bottom ?? undefined }}
    >
      {card.image && (
        /* the image keeps its own aspect between 1:1 and 2:1; a graphic is shown whole in a 16:9 frame on the soft ground */
        <div className={`w-full overflow-hidden ${card.graphic ? 'aspect-video bg-fg-04' : 'max-h-80'}`}>
          <img src={card.image} alt="" className={`block w-full ${card.graphic ? 'h-full object-contain p-[6%]' : 'h-auto min-h-40 max-h-80 object-cover'}`} />
        </div>
      )}
      <div className="flex flex-col gap-1 p-3">
        <span className="kol-mono-12 text-emphasis">{card.title}</span>
        {card.text && <span className="kol-mono-12 text-body line-clamp-3">{card.text}</span>}
        {card.site && <span className="kol-helper-10 text-meta uppercase tracking-wider mt-1">{card.site}</span>}
      </div>
    </a>
  )
}
