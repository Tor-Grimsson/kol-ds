/**
 * Shared résumé selectors — sort/filter rules + contact composition, so every
 * layout renderer (Layout 1–N under /resume) reads the same data the same way.
 * Facts live in `data/` (ARCHITECTURE §2); this only shapes them for rendering.
 *
 * kol-website apps/record's `lib/resume.js`, verbatim but for the seam (ResumeKit, 2026-10-28): the facts are the
 * provider's (`ResumeProvider`), so each selector takes them; `useResume()` hands them back bound.
 */
const PRESENT = { en: 'Present', is: 'í dag' }

/* year–Present (ongoing), year–endYear (range), or single year. */
export const yearLabel = (e, lang = 'en') =>
  e.ongoing ? `${e.year}–${PRESENT[lang] ?? PRESENT.en}` : e.endYear ? `${e.year}–${e.endYear}` : `${e.year}`

/* `pinned` (founder role) first; then reverse-chronological; ongoing wins ties. */
export const sortedWork = (WORK = []) =>
  [...WORK].sort(
    (a, b) =>
      (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
      b.year - a.year ||
      (b.ongoing ? 1 : 0) - (a.ongoing ? 1 : 0),
  )

/* `cv:false` entries (high school, art-theory year) stay in the registry but
   drop from the CV. Newest first. */
export const cvEducation = (EDUCATION = []) => EDUCATION.filter((e) => e.cv !== false).sort((a, b) => b.year - a.year)

/* The masthead contact line, in render order. */
export const contactLines = (BIO = {}, BRAND_INFO = {}) => {
  const { contact = {}, social = {} } = BRAND_INFO
  return [BIO.currentCity, contact.phone, contact.emailJobs, contact.web, social.linkedin, social.github].filter(Boolean)
}
