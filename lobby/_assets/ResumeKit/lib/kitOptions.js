/**
 * Kit export options — which sections compile into the PDF, plus the Role /
 * Company the cover letter is addressed to.
 *
 * They live in the URL (`?pages=…&role=…&company=…`) rather than React state
 * because the headless export loads the preview route in a fresh browser
 * (scripts/export-kit.sh) — anything not in the URL doesn't survive the trip.
 * This module is the single place the param names and defaults are spelled.
 */

export const KIT_PAGES = [
  { id: 'cover', label: 'Cover' },
  { id: 'resume', label: 'Resume' },
  { id: 'letter', label: 'Cover Letter' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'back', label: "Let's talk" },
]

export const KIT_PAGE_IDS = KIT_PAGES.map((p) => p.id)

/** Read the options out of a URLSearchParams. No `pages` param = the whole kit. */
export function readKitOptions(params) {
  const raw = params.get('pages')
  return {
    pages: raw === null ? KIT_PAGE_IDS : raw.split(',').filter((id) => KIT_PAGE_IDS.includes(id)),
    role: params.get('role') ?? '',
    company: params.get('company') ?? '',
  }
}

/** Serialize back to a `&k=v…` fragment, omitting anything left at its default. */
export function kitOptionsQuery({ pages, role, company }) {
  const q = new URLSearchParams()
  if (pages.length !== KIT_PAGE_IDS.length) q.set('pages', pages.join(','))
  if (role) q.set('role', role)
  if (company) q.set('company', company)
  const s = q.toString()
  return s ? `&${s}` : ''
}
