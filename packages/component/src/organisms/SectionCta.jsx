import Button from '../atoms/Button.jsx'
import { FULL_BLEED } from './sectionBleed.js'
import { surfaceClass } from '../utilities/sectionSurface.js'
import SectionText from '../molecules/SectionText.jsx'
import { minHeightClass } from './sectionHeights.js'

/**
 * SectionCta — the editorial two-column contact/CTA band: a large display
 * wordmark on the left (e.g. "/ CONNECT") and a right column of stacked
 * label-over-value rows, each a `SectionText` (label in the helper voice,
 * value as a heading-01; a row with `href` renders its value as a link).
 * `CtaGlobal` is this component under its old name (alias kept). Columns sit
 * side by side from `md` up and stack below. Row labels are uppercase by role.
 *
 * TWO VARIANTS. `editorial` (default): the two-column band above. `centered`
 * (SectionHeroRound2, 2026-08-26): the quiet mid-page tier — a short rule, a
 * heading, a mono line and Buttons, centred — which was `FoundryCTA`, a second
 * way to render SectionText. FoundryCTA was its alias until 2026-09-25, when it dropped.
 *
 * @param {'full'|'80'|'60'|string} [height='60']  min-height on the family's ladder — full = 100dvh,
 *   80 = 70svh / 80vh, 60 = 50svh / 60vh (default), 40 = 35svh / 40vh; content stays vertically centred inside it
 * @param {'editorial'|'centered'|'connect'} variant  `connect` = editorial with the contact copy as defaults (/ CONNECT · WORKING ON A PROJECT? · SEND A MESSAGE · CONTACT · hello@kolkrabbi.io), every prop still overridable
 * @param {ReactNode} headline · body · actions   centered: the SectionText slots
 * @param {ReactNode} eyebrow       left-column display wordmark (kol-sans-display-01)
 * @param {ReactNode} promptLabel   prompt-row label
 * @param {ReactNode} heading       prompt-row value
 * @param {ReactNode} contactLabel  contact-row label
 * @param {string}    email         contact-row value + `mailto:` target; omit to drop the row
 * @param {{label: ReactNode, value: ReactNode, href?: string}[]} secondaryRows  extra rows between prompt and contact
 * @param {boolean}  [fullBleed=false]  the FILL breaks the page gutter while the content keeps it —
 *   the family's shared breakout (`sectionBleed.js`, SectionFamilyFullBleed, kol-website 2026-08-31).
 *   Any member of this family can be a filled surface, and a filled surface inside `.kol-page` has its
 *   colour clipped by the gutter on mobile. Viewport-relative, so unlike `.kol-full-bleed` it does not
 *   over-bleed in a parent with no gutter of its own. The section's horizontal padding re-insets the
 *   CONTENT, so only the fill moves. Default false — nothing renders differently until it is passed.
 * @param {string}    className     extra classes on the section
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} background  the section's surface
 *   (SectionBackgroundProp, 2026-08-27) — a named surface, `none`, or a raw utility / token string; default = what it painted before
 */
export default function SectionCta({
  fullBleed = false,
  variant = 'editorial',
  background,
  height = '60',
  headline,
  body,
  actions,
  eyebrow,
  promptLabel,
  heading,
  contactLabel,
  email,
  secondaryRows = [],
  slotClass,
  slotStyle,
  className = '',
}) {
  /* `connect` (SectionCtaConnectVariant, kol-website 2026-08-27 — user: "it's stupid
   * to make a prefix family that we opt out of at the first opportunity"): the
   * editorial layout with the site's contact copy as defaults — every one still
   * overridable by the props. Pages speak SectionCta directly; ConnectCta retires. */
  if (variant === 'connect') {
    eyebrow = eyebrow ?? '/ CONNECT'
    promptLabel = promptLabel ?? 'WORKING ON A PROJECT?'
    heading = heading ?? 'SEND A MESSAGE'
    contactLabel = contactLabel ?? 'CONTACT'
    email = email ?? 'hello@kolkrabbi.io'
  }
  if (variant === 'centered') {
    return (
      <section className={`${fullBleed ? FULL_BLEED : 'w-full'} flex flex-col justify-center py-24 ${surfaceClass(background, 'auto')} ${minHeightClass(height)} ${className}`.replace(/\s+/g, ' ').trim()}>
        <div className="w-full max-w-[var(--kol-container-max,var(--kol-content-shell,1800px))] mx-auto">
          <div className="w-32 h-px bg-fg-24 mx-auto mb-8" />
          <SectionText
            align="center"
            headline={headline}
            headlineSize="heading-02"
            headlineClass="kol-sans-heading-02 text-auto"
            body={body}
            bodyClass="kol-mono-14 text-fg-64 max-w-[600px] mx-auto"
            actions={actions}
            actionsClass="pt-4 flex flex-col sm:flex-row gap-4 justify-center"
            gap="gap-8"
            slotClass={slotClass}
            slotStyle={slotStyle}
          />
        </div>
      </section>
    )
  }

  const rows = [
    ...(promptLabel || heading ? [{ label: promptLabel, value: heading }] : []),
    ...secondaryRows,
    ...(email ? [{ label: contactLabel, value: email, href: `mailto:${email}` }] : []),
  ]
  return (
    <section className={`${fullBleed ? FULL_BLEED : 'w-full'} ${surfaceClass(background, 'auto')} flex flex-col justify-center ${minHeightClass(height)} ${className}`.replace(/\s+/g, ' ').trim()}>
      {/* the family's ONE cap — the shell's --kol-container-max ladder (user
        * ruling 2026-08-26; the 1600 SectionCtaEditorial asked for was a third
        * number beside split's 1200 and cards' 1400) — the surface stays full
        * width, the columns stop hugging the viewport edges */}
      <div className="w-full max-w-[var(--kol-container-max,var(--kol-content-shell,1800px))] mx-auto py-10 flex flex-col md:flex-row items-start gap-12 overflow-hidden">
        <div className="flex-1 self-stretch text-auto kol-sans-display-01">{eyebrow}</div>
        <div className="flex-1 self-stretch pb-6 md:pt-32 flex flex-col justify-end items-start gap-12">
          {rows.map((row, i) => (
            <SectionText
              key={i}
              eyebrow={row.label}
              /* the set's eyebrow voice (helper-12 · meta · uppercase by role),
               * not the shipped helper-16 — one eyebrow across the set */
              headline={row.href ? <a href={row.href} className="hover:opacity-70 transition-opacity">{row.value}</a> : row.value}
              headlineAs="div"
              headlineClass="text-auto kol-sans-heading-01"
              gap="gap-2"
              slotClass={slotClass}
              slotStyle={slotStyle}
              className="self-stretch"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
