/* ONE BREAKOUT, ONE LITERAL (SectionFamilyFullBleed, kol-website 2026-08-31).
 *
 * `SectionHero` had `fullBleed`; `SectionNewsletter` needed it and copied the
 * literal character for character. That copy was the right call at the time and
 * is exactly the argument for this file: the second organism to need a thing had
 * to duplicate the first, and the third would have too.
 *
 * WHY IT IS A FILLED-SECTION PROBLEM, not a newsletter one. Any member of the
 * family can be a filled surface, and a filled surface inside `.kol-page` has its
 * colour clipped by the page gutter on mobile — strips of page down both sides of
 * the fill. Reported once per organism until the prop is shared.
 *
 * NOT `.kol-full-bleed`: that escape is CONTAINER-relative, so on an organism
 * whose own parent has no gutter it over-bleeds — kol-website hit exactly that on
 * an Instagram section the same evening. This is viewport-relative and does not
 * care what it is nested in.
 *
 * The section's own horizontal padding re-insets the CONTENT, so only the fill
 * moves. Default false everywhere: the blast radius is wide and shallow — no
 * consumer's rendering changes until it passes the prop.
 *
 * Literal strings, never built at runtime — Tailwind's scanner cannot see a class
 * assembled from parts. */
export const FULL_BLEED = 'w-screen ml-[calc(50%-50vw)]'
export const NO_BLEED = 'w-full'

export const bleedClass = (fullBleed) => (fullBleed ? FULL_BLEED : NO_BLEED)
