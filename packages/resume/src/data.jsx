import { createContext, useContext, useMemo } from 'react'
import { sortedWork, cvEducation, contactLines } from './lib/resume.js'
import { parseLetters } from './lib/letters.js'
import { parsePortfolio } from './lib/portfolio.js'

/**
 * ResumeProvider — the kit's ONE SEAM (ResumeKit, kol-website 2026-10-28: *"Nobody's details ship in the package"*). Every
 * page, component and selector read `@data/business-data.js`, `@data/info.js`, `@data/records`, `data/letters/*.md`,
 * `data/portfolio/*.md` and a bucket helper; they read this instead, under the same names, so the carried code is
 * unchanged but for one `useResume()` line.
 *
 *   person      `{ BIO, SKILLS, LANGUAGES }` — the shape of record's `data/business-data.js` (bio with `_is` twins,
 *               skill groups, languages)
 *   records     `{ WORK, EDUCATION }` — record's `data/records`
 *   contact     record's `data/info.js` `BRAND_INFO` — `{ contact: { phone, emailJobs, web }, social: { linkedin, github } }`
 *   letters     `{ [path]: raw markdown }` — the app's glob of its cover letters (`NN-<id>.md`, frontmatter + paragraphs)
 *   portfolio   `{ [path]: raw markdown }` — the app's glob of its projects
 *   media       the portfolio's downloaded shots by project id (record's `portfolio-manifest.json`)
 *   workBase    where those shots load from (`<workBase>/<id>/hero.jpg`)
 *   workUrl     `(id) => url` — a project's public case study, when its frontmatter has no `work:`
 *   assetUrl    `(key) => url` — an image by bucket key (the cover's portrait)
 *   portrait    the cover portrait's key (record's `portraits/portrait-bw-street-sunglasses-02.jpg`)
 *   copy        the page words, per page and language: `{ back: { en: { kicker, title, blurb, current }, is }, portfolio:
 *               { en: { kicker, title, intro }, is } }` — each key overrides the kit's default
 *   fileStem    the exports' file stem (`<stem>-kit.pdf`); defaults to the person's name, slugged
 */
const ResumeContext = createContext(null)

export function ResumeProvider({ person = {}, records = {}, contact = {}, letters = {}, portfolio = {}, media = {}, workBase = '', workUrl, assetUrl = (k) => k, portrait, fileStem, copy = {}, children }) {
  const value = useMemo(() => {
    const { BIO = {}, SKILLS = [], LANGUAGES = [] } = person
    const { WORK = [], EDUCATION = [] } = records
    const LETTERS = parseLetters(letters)
    const PROJECTS = parsePortfolio(portfolio, { media, workBase, workUrl })
    return {
      BIO, SKILLS, LANGUAGES, WORK, EDUCATION, BRAND_INFO: contact,
      LETTERS,
      DEFAULT_LETTER: LETTERS[0],
      getLetter: (id) => LETTERS.find((l) => l.id === id) ?? LETTERS[0],
      PROJECTS,
      getProject: (id) => PROJECTS.find((p) => p.id === id),
      getMedia: (id) => media[id] ?? [],
      PORTFOLIO_BASE: workBase,
      bucketUrl: assetUrl,
      PORTRAIT: portrait,
      COPY: copy,
      FILE_STEM: fileStem ?? (String(BIO.displayName ?? 'kit').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'kit'),
      sortedWork: () => sortedWork(WORK),
      cvEducation: () => cvEducation(EDUCATION),
      contactLines: () => contactLines(BIO, contact),
    }
  }, [person, records, contact, letters, portfolio, media, workBase, workUrl, assetUrl, portrait, fileStem, copy])
  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const v = useContext(ResumeContext)
  if (!v) throw new Error('kol-resume: wrap the kit in <ResumeProvider> — its pages read the person from it')
  return v
}
