import { useLayoutEffect, useRef, useState } from 'react'
import Button from '../atoms/Button.jsx'

/* literal classes — a runtime-built `line-clamp-${n}` is never emitted */
const CLAMP = { 2: 'max-md:line-clamp-2', 3: 'max-md:line-clamp-3', 4: 'max-md:line-clamp-4', 6: 'max-md:line-clamp-6' }

/**
 * TextFold — Long text folded to a few lines on phones. (TextFold, kol-branding 2026-10-22 — the
 * user: *"on mobile text heavy blocks are not always relevant but good to know more information
 * is there if you want it"*.) Below md the text clamps to `lines` with a More / Less ghost button;
 * md and up shows it whole. The button only appears when the text is actually cut — measured,
 * so text that fits shows nothing.
 *
 * @param {2|3|4|6} lines        lines shown while folded (default 4)
 * @param {string}  as           the text element (default `div`)
 * @param {string}  moreLabel · lessLabel   the toggle's words, as authored (default More · Less)
 * @param {string}  className    the text's own type classes
 */
export default function TextFold({ lines = 4, as: Tag = 'div', moreLabel = 'More', lessLabel = 'Less', className = '', children }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [cut, setCut] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    const measure = () => setCut(el.scrollHeight > el.clientHeight + 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <Tag ref={ref} className={`w-full min-w-0 break-words ${open ? '' : CLAMP[lines] ?? CLAMP[4]} ${className}`.trim()}>{children}</Tag>
      {(cut || open) && (
        <Button tone="ghost" size="sm" className="md:hidden" onClick={() => setOpen(!open)}>{open ? lessLabel : moreLabel}</Button>
      )}
    </div>
  )
}
