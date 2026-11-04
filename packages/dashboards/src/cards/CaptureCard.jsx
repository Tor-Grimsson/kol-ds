/** CaptureCard — a captured screen as a card: the image, its title, a mono meta line and the → that advances it
 * (float-everything W7 row 103, 2026-11-04; the exploration's "#kol-ob bingo · 124d · →").
 *
 * `image` is a node (an `<img>`, a drawn placeholder) shown at the capture's 5:3 in an 8 round; `src` draws one for
 * you. `title` in Inter body, `meta` in mono ("124d" — its age), `onNext` the → float button; `onOpen` makes the
 * image pressable. Stacks inside a `KanbanColumn`. */
import { Button } from '@kolkrabbi/kol-component'
import { SHEET, PRESS } from './_shared/float.js'

export default function CaptureCard({ image, src, title, meta, onNext, onOpen, className = '' }) {
  const Frame = onOpen ? 'button' : 'div'
  return (
    <section className={`${SHEET} flex flex-col p-4 ${className}`.trim()}>
      <Frame type={onOpen ? 'button' : undefined} onClick={onOpen} className={`block w-full aspect-[5/3] rounded-[var(--kol-float-list-r)] overflow-hidden bg-fg-08 ${onOpen ? PRESS : ''}`}>
        {image ?? (src && <img src={src} alt="" className="block w-full h-full object-cover" />)}
      </Frame>
      <span className="kol-float-body text-fg-96 mt-3 truncate">{title}</span>
      <span className="flex items-end justify-between gap-4 mt-2">
        <span className="kol-float-timecode text-fg-64">{meta}</span>
        {onNext && <Button variant="float" tone="sunken" size="sm" iconOnly="arrow-right" aria-label="Next" onClick={onNext} />}
      </span>
    </section>
  )
}
