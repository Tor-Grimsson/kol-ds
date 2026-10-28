/**
 * Shared résumé selectors — sort/filter rules + contact composition, so every
 * layout renderer (Layout 1–N under /resume) reads the same data the same way.
 * Facts live in `data/` (ARCHITECTURE §2); this only shapes them for rendering.
 */
import { BIO } from '@data/business-data.js'
import { WORK, EDUCATION } from '@data/records/index.js'
import { BRAND_INFO } from '@data/info.js'

const PRESENT = { en: 'Present', is: 'í dag' }

/* year–Present (ongoing), year–endYear (range), or single year. */
export const yearLabel = (e, lang = 'en') =>
  e.ongoing ? `${e.year}–${PRESENT[lang] ?? PRESENT.en}` : e.endYear ? `${e.year}–${e.endYear}` : `${e.year}`

/* `pinned` (founder role) first; then reverse-chronological; ongoing wins ties. */
export const sortedWork = () =>
  [...WORK].sort(
    (a, b) =>
      (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
      b.year - a.year ||
      (b.ongoing ? 1 : 0) - (a.ongoing ? 1 : 0),
  )

/* `cv:false` entries (high school, art-theory year) stay in the registry but
   drop from the CV. Newest first. */
export const cvEducation = () => EDUCATION.filter((e) => e.cv !== false).sort((a, b) => b.year - a.year)

/* The masthead contact line, in render order. */
export const contactLines = () => {
  const { contact, social } = BRAND_INFO
  return [BIO.currentCity, contact.phone, contact.emailJobs, contact.web, social.linkedin, social.github].filter(Boolean)
}
