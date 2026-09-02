import { useId, useState } from 'react'
import { bleedClass } from './sectionBleed.js'
import { surfaceClass } from '../utilities/sectionSurface.js'
import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'
import SectionText from '../molecules/SectionText.jsx'
import useSectionTheme from '../hooks/useSectionTheme.js'
import { minHeightClass } from './sectionHeights.js'

/**
 * SectionNewsletter — the newsletter card of the section family
 * (SectionNewsletter, kol-website 2026-08-27 — user: the newsletter as a card
 * in the family, same ladder, same cap, content centred on y, not its own
 * thing). `SectionText` (label · headline · body, centred) with the email
 * form in its children slot: an email Input + submit Button and an inline
 * success / error status line. `NewsletterBand` is the deprecated alias
 * (`title` → `headline`, `description` → `body`).
 *
 * Owns only the local form state — the email value and idle / submitting /
 * success / error, driven by the promise returned from `onSubmit(email)`.
 * No fetch lives here: the consumer's handler posts wherever it wants;
 * resolve → success (field clears), reject → error (logged). An empty submit
 * errors immediately without calling the handler, and the submit Button
 * disables while the promise is pending. Native `type="email"` validation
 * still gates malformed addresses before the handler runs.
 *
 * A11y: the Input carries aria-required and, on error, aria-describedby
 * pointing at the error line; the success line is role=status
 * aria-live=polite, the error line role=alert aria-live=assertive. Field and
 * error ids are useId-generated (or `inputId`) so multiple sections mount
 * without collisions.
 *
 * @param {'full'|'80'|'60'|'40'|string} [height='40']  min-height on the family's ladder — full = 100dvh,
 *   80 = 70svh / 80vh, 60 = 50svh / 60vh, 40 = 35svh / 40vh (default); content stays vertically centred inside it.
 *   DEFAULT DROPPED 60 → 40 (SectionNewsletterMobileMeasure, kol-website 2026-08-31): at rung 60 the band
 *   reserved 422px around 308px of content on an 844-tall phone — ~114px of empty grey to scroll past. The
 *   LADDER is untouched; every other section still wants its rung. Pass `height="60"` to keep the old air.
 * @param {'inverse'|'light'|'dark'} theme  the paired theme of whatever is live, or a pinned one — stamped on the section
 * @param {ReactNode} eyebrow      eyebrow above the headline (uppercase by role); `label` is its alias
 * @param {ReactNode} headline     heading (display-01 by default; `headlineSize` picks another role)
 * @param {string}    headlineSize SectionText role (default 'display-01')
 * @param {ReactNode} body         lede under the heading
 * @param {string}    placeholder  email Input placeholder
 * @param {ReactNode} submitLabel  submit Button label (also its accessible name)
 * @param {Function}  onSubmit     (email) => Promise|void — resolve = success, reject = error
 * @param {ReactNode} successCopy  success status line
 * @param {ReactNode} errorCopy    error status line
 * @param {string}    id           anchor id on the section (e.g. "signup")
 * @param {string}    inputId      id override for the email input (default useId-generated)
 * @param {object}    slotClass · slotStyle   per-slot class / style on the SectionText (reveal seam)
 * @param {'sm'|'md'|'lg'} [controlSize='md']  size rung for BOTH the email Input and the submit
 * @param {string} [submitVariant='primary']  the submit Button's variant (SectionNewsletterSubmitVariant,
 *   kol-website 2026-09-01): `primary` is the page's second surface, which on an inverse band is
 *   dark-on-dark and reads as disabled — a consumer on a dark band passes `secondary`, the
 *   ink-on-page inversion. A prop, not a background read: the organism does not know which
 *   backgrounds are dark, and this lands the way `controlSize` did. Default moves nothing.
 *   Button (SectionNewsletterControlSize, kol-website 2026-08-31). The pair was hardcoded md with no
 *   seam, so a page that sets `size="lg"` on every other call-site button could not match it here and
 *   the newsletter read visibly smaller directly beneath them. Default is today's md — nothing moves.
 * @param {boolean}   [fullBleed=false]  the FILL breaks the page gutter while the content keeps it
 *   (SectionNewsletterFullBleed, kol-website 2026-08-31). This card is a filled surface inside
 *   `.kol-page`, so the gutter clipped its background and left strips of page down both sides of the
 *   colour. Fill and content padding are the same box, so a consumer could not bleed one without
 *   dragging the other out with it. The breakout literal is SectionHero's, character for character —
 *   two organisms in one family must not invent two ways to leave a gutter. The section's own
 *   `px-5 sm:px-8` then re-insets the content, so only the fill moves.
 * @param {string}    className    extra classes on the section
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} background  the section's surface
 *   (SectionBackgroundProp, 2026-08-27) — a named surface, `none`, or a raw utility / token string; default = what it painted before
 */
export default function SectionNewsletter({
  height = '40',
  controlSize = 'md',
  submitVariant = 'primary',
  fullBleed = false,
  theme,
  background,
  eyebrow,
  label,
  headline,
  headlineSize = 'display-01',
  body,
  placeholder,
  submitLabel,
  onSubmit,
  successCopy = 'Thanks for subscribing!',
  errorCopy = 'Please enter a valid email address.',
  id,
  inputId,
  slotClass,
  slotStyle,
  className = '',
}) {
  /* `label` = alias of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const [themeRef, themeStamp] = useSectionTheme(theme)

  const autoId = useId()
  const emailId = inputId ?? `${autoId}email`
  const errorId = `${emailId}-error`

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      return
    }
    if (!onSubmit) return

    setStatus('submitting')
    try {
      await onSubmit(email)
      setStatus('success')
      setEmail('')
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setStatus('error')
    }
  }

  return (
    <section
      id={id}
      ref={themeRef}
      data-theme={themeStamp}
      /* THE FORM NEEDS AN INSET FLOOR (SectionNewsletterMobileMeasure, 2026-08-31).
        * Desktop's 80px is not padding — it is the leftover of the inner measure
        * (1184 band − 1024 max-w, halved), so it SCALES TO ZERO rather than down:
        * at 390 the field and submit ran edge to edge against the band's own
        * boundary and read as breaking out of it. `px-5` is a floor the band owns.
        * Desktop does not move — the measure caps below the padded width, so the
        * inner block still centres at 80px from the band edge.
        *
        * `py-16 md:py-24` (SectionNewsletterMobileFoot, 2026-09-01): the flat
        * `py-24` left 96px of empty band under the Subscribe button at 390 — a
        * fifth of the card. 16/24 is the FAMILY's own mobile rung (SectionFaq,
        * SectionSplit carry it already); this band was the outlier holding the
        * desktop constant. Desktop unmoved. */
        className={`kol-section-newsletter ${bleedClass(fullBleed)} flex flex-col justify-center px-5 sm:px-8 py-16 md:py-24 ${surfaceClass(background, theme ? 'primary' : 'none')} ${theme ? 'text-auto' : ''} ${minHeightClass(height)} ${className}`.replace(/\s+/g, ' ').trim()}
    >
      {/* the family's ONE cap — the shell's --kol-container-max ladder — and
        * inside it the lede's MEASURE on a wrapper (SectionNewsletterForm,
        * 2026-08-27): a measure is a layout seam, not a `bodyClass` override
        * on SectionText — the organism renders the molecule bare */}
      <div className="w-full max-w-[var(--kol-container-max,var(--kol-content-shell,1800px))] mx-auto text-center">
        <div className="mx-auto max-w-[64rem]">
        <SectionText
          align="center"
          eyebrow={eb}
          headline={headline}
          headlineSize={headlineSize}
          body={body}
          gap="gap-6"
          slotClass={slotClass}
          slotStyle={slotStyle}
        >
          {/* `w-full`: SectionText centres its children as flex items, so
            * without it the form shrink-wraps and the Input's `w-full` has
            * nothing to fill — it rendered at its intrinsic ~190px */}
          {/* ON BUTTONGROUP'S LADDER (NewsletterFormGapOffLadder, kol-website
            * 2026-09-01; user: "the gap between input and button in newsletter
            * should be the same as button group"): `gap-2 sm:gap-4` — 8 stacked,
            * 16 in the row — the pair ButtonGroup ruled on 08-31. This form was
            * `gap-4 sm:gap-3`, inverted against it. The `pt-6` went too: the
            * SectionText above already spaces its children by `gap-6`, so the
            * form sat 48 under the body where every other section's actions sit
            * 24. */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
          >
            <Input
              id={emailId}
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={controlSize}
              aria-required="true"
              aria-describedby={status === 'error' ? errorId : undefined}
              className="w-full sm:max-w-[400px] md:max-w-[520px]"
            />
            <Button
              type="submit"
              variant={submitVariant}
              size={controlSize}
              disabled={status === 'submitting'}
              className="w-full sm:w-auto"
            >
              {submitLabel}
            </Button>
          </form>

          {status === 'success' && (
            <p className="kol-mono-14 text-auto opacity-80 pt-4" role="status" aria-live="polite">
              {successCopy}
            </p>
          )}
          {status === 'error' && (
            <p id={errorId} className="kol-mono-14 text-auto opacity-80 pt-4" role="alert" aria-live="assertive">
              {errorCopy}
            </p>
          )}
        </SectionText>
        </div>
      </div>
    </section>
  )
}
