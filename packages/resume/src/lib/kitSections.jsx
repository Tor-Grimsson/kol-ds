import Cover from '../pages/Cover.jsx'
import Resume from '../pages/Resume.jsx'
import CoverLetter from '../pages/CoverLetter.jsx'
import Portfolio from '../pages/Portfolio.jsx'
import Backside from '../pages/Backside.jsx'

/** The five kit sections keyed by KIT_PAGES id, rendered from `data/` for one
 * language. The source page renders them plain; the kit treatments pass
 * `preview` (external portfolio links, no letter picker) plus the letter's
 * Role/Company. Portfolio project copy stays in its Sanity source language
 * (ARCHITECTURE §6) — only page chrome translates. */
export const kitSections = (lang, { preview = false, role, company } = {}) => ({
  cover: <Cover lang={lang} />,
  resume: <Resume lang={lang} />,
  letter: <CoverLetter preview={preview} lang={lang} role={role} company={company} />,
  portfolio: <Portfolio preview={preview} lang={lang} />,
  back: <Backside lang={lang} />,
})
