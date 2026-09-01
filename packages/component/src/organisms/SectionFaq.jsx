import { useState } from 'react'
import { FULL_BLEED } from './sectionBleed.js'
import { surfaceClass } from './sectionSurface.js'
import { Accordion, AccordionPanel } from '../molecules/Accordion.jsx'
import SectionText from '../molecules/SectionText.jsx'
import { minHeightClass } from './sectionHeights.js'

/**
 * SectionFaq — a `SectionText` header over an `Accordion` of question /
 * answer items. The one NEW surface in the section family (SectionSet,
 * 2026-08-26) — the behaviour already shipped in the Accordion molecule; this
 * is the section around it.
 *
 * @param {ReactNode} eyebrow (alias label) · headline · body · actions  the header (SectionText)
 * @param {string}    [headlineSize='heading-02']
 * @param {'full'|'80'|'60'|string} [height='60']  min-height on the family's ladder — full = 100dvh,
 *   80 = 70svh / 80vh, 60 = 50svh / 60vh (default), 40 = 35svh / 40vh; content stays vertically centred inside it
 * @param {{ q: ReactNode, a: ReactNode, meta?: ReactNode }[]} items
 * @param {boolean}   [singleOpen=false]  opening one panel closes the others
 * @param {number}    [defaultOpen]       index open on mount (singleOpen) — omit for all closed
 * @param {boolean}  [fullBleed=false]  the FILL breaks the page gutter while the content keeps it —
 *   the family's shared breakout (`sectionBleed.js`, SectionFamilyFullBleed, kol-website 2026-08-31).
 *   Any member of this family can be a filled surface, and a filled surface inside `.kol-page` has its
 *   colour clipped by the gutter on mobile. Viewport-relative, so unlike `.kol-full-bleed` it does not
 *   over-bleed in a parent with no gutter of its own. The section's horizontal padding re-insets the
 *   CONTENT, so only the fill moves. Default false — nothing renders differently until it is passed.
 * @param {string}    className · innerClassName  layout seams
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} background  the section's surface
 *   (SectionBackgroundProp, 2026-08-27) — a named surface, `none`, or a raw utility / token string; default = what it painted before
 */
export default function SectionFaq({
  fullBleed = false,
  eyebrow,
  label,
  headline,
  headlineSize = 'heading-02',
  body,
  actions,
  items = [],
  singleOpen = false,
  defaultOpen,
  height = '60',
  background,
  slotClass,
  slotStyle,
  className = '',
  /* the section sits on the family's cap; the list itself is a READING
   * column inside it — a measure is a content decision, not the frame */
  innerClassName = 'max-w-[var(--kol-content-column)] flex flex-col gap-8',
}) {
  /* `label` = alias of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  const [open, setOpen] = useState(defaultOpen ?? null)
  return (
    <section className={`kol-section-faq ${fullBleed ? FULL_BLEED : 'w-full'} flex flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:px-14 ${minHeightClass(height)} ${surfaceClass(background, 'none')} ${className}`.replace(/\s+/g, ' ').trim()}>
      <div className="w-full max-w-[var(--kol-container-max,var(--kol-content-shell,1800px))] mx-auto">
      <div className={innerClassName}>
        {(eb || headline || body || actions) && (
          <SectionText eyebrow={eb} headline={headline} headlineSize={headlineSize} body={body} actions={actions} slotClass={slotClass} slotStyle={slotStyle} />
        )}
        {items.length > 0 && (
          <Accordion className="mt-0 mb-0">
            {items.map((item, i) => (
              <AccordionPanel
                key={i}
                title={item.q}
                meta={item.meta}
                {...(singleOpen
                  ? { open: open === i, onToggle: (next) => setOpen(next ? i : null) }
                  : { defaultOpen: defaultOpen === i })}
              >
                {item.a}
              </AccordionPanel>
            ))}
          </Accordion>
        )}
      </div>
      </div>
    </section>
  )
}
