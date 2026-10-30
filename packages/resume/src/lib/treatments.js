import { kitOptionsQuery } from './kitOptions.js'

/**
 * Every treatment of the resume source, in Library order. A treatment is one
 * way of rendering the same `data/`:
 *   kit    — the whole kit through KitPreview (mode: continuous | a4)
 *   layout — a single-sheet A4 resume design (ResumeMarginalia / Rail / Grid)
 * The slug is the route (/resume/t/:slug) and, for layouts, the whitelist the
 * /api/export endpoint checks before it reaches bash (vite.config.js).
 */
export const TREATMENTS = [
  {
    slug: 'kit-continuous',
    kind: 'kit',
    mode: 'continuous',
    label: 'Kit · Continuous',
    blurb: 'Every section on an A4-width sheet that grows to its content — one fit-to-length page per section. Also the editable-text SVG source.',
  },
  {
    slug: 'kit-a4',
    kind: 'kit',
    mode: 'a4',
    label: 'Kit · A4',
    blurb: 'The employer PDF — every section paginated onto true A4 sheets with print margins.',
  },
  {
    slug: 'marginalia',
    kind: 'layout',
    label: 'Marginalia',
    blurb: 'Single column, section labels in a fixed left gutter; content flows in the wide right column. Swiss editorial.',
  },
  {
    slug: 'rail',
    kind: 'layout',
    label: 'Rail',
    blurb: 'Facts — contact, profile, skills, education, languages — in a tinted left rail; experience runs down the wide right column.',
  },
  {
    slug: 'grid',
    kind: 'layout',
    label: 'Grid',
    blurb: 'Modular Swiss grid — a numbered experience index with a date gutter and a four-cell footer for the supporting facts.',
  },
]

/** The /api/export request for a treatment, plus the filename the browser
 * saves it as. Kit treatments carry the kit options (section picks, Role /
 * Company) as query; layouts carry the language only. `name` is the file stem — the person's
 * (ResumeProvider `fileStem`), record's `tor-grimsson` until the kit moved to the DS. */
export function exportRequest(t, { lang = 'en', format = 'pdf', options, name = 'kit' } = {}) {
  const is = lang === 'is' ? '-icelandic' : ''
  if (t.kind === 'kit') {
    const q = options ? kitOptionsQuery(options) : ''
    const tag = format === 'svg' ? '-svg' : t.mode === 'continuous' ? '-continuous' : ''
    return {
      url: `/api/export?lang=${lang}&format=${format}&mode=${t.mode}${q}`,
      filename: `${name}-kit${is}${tag}.${format === 'svg' ? 'zip' : 'pdf'}`,
    }
  }
  return {
    url: `/api/export?format=pdf&layout=${t.slug}&lang=${lang}`,
    filename: `${name}-layout-${t.slug}${is}.pdf`,
  }
}
