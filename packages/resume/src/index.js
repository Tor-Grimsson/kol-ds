/**
 * @kolkrabbi/kol-resume — the resume kit: a resume in three treatments, the cover, back, cover letter and portfolio pages,
 * the kit preview (A4 and continuous), its options and export. Carried from kol-website apps/record (ResumeKit,
 * 2026-10-28 — *"copy, don't redesign"*), verbatim apart from ONE SEAM: the person. Everything the pages read —
 * bio, jobs, skills, languages, education, contact, letters, portfolio, images — comes through `ResumeProvider`; nobody's
 * details ship here.
 *
 *   <ResumeProvider person={{ BIO, SKILLS, LANGUAGES }} records={{ WORK, EDUCATION }} contact={BRAND_INFO}
 *     letters={import.meta.glob('./letters/*.md', { query: '?raw', import: 'default', eager: true })}
 *     portfolio={import.meta.glob('./portfolio/*.md', { query: '?raw', import: 'default', eager: true })}
 *     assetUrl={(key) => `/bucket/${key}`} portrait="portraits/me.jpg">
 *     <Routes>…<Route path="/resume/t/:slug" element={<ResumeTreatment />} />…</Routes>
 *   </ResumeProvider>
 *
 * The pages read the URL (`?lang=` · `?pages=` · `?role=` · `?company=`), so they live under a react-router. The stylesheet
 * is `@kolkrabbi/kol-resume/kol-resume.css` (opt-in — it styles the page for print). Export: `kitExportPlugin` from
 * `@kolkrabbi/kol-resume/vite` (GET /api/export → build, headless Chrome, `pdfunite`); the URL-to-PDF renderer alone is the
 * `kol-resume-pdf` bin.
 */
export { ResumeProvider, useResume } from './data.jsx'
// the pages
export { default as Cover } from './pages/Cover.jsx'
export { default as Resume } from './pages/Resume.jsx'
export { default as ResumeMarginalia } from './pages/ResumeMarginalia.jsx'
export { default as ResumeRail } from './pages/ResumeRail.jsx'
export { default as ResumeGrid } from './pages/ResumeGrid.jsx'
export { default as CoverLetter } from './pages/CoverLetter.jsx'
export { default as Portfolio } from './pages/Portfolio.jsx'
export { default as Backside } from './pages/Backside.jsx'
export { default as KitPreview } from './pages/KitPreview.jsx'
export { default as ResumeSource } from './pages/ResumeSource.jsx'
export { default as ResumeLibrary } from './pages/ResumeLibrary.jsx'
export { default as ResumeTreatment } from './pages/ResumeTreatment.jsx'
// the controls
export { default as KitOptions } from './components/KitOptions.jsx'
export { default as ExportButtons } from './components/ExportButtons.jsx'
export { default as ContactLine } from './components/ContactLine.jsx'
export { default as LangToggle } from './components/LangToggle.jsx'
// the rules
export { TREATMENTS, exportRequest } from './lib/treatments.js'
export { KIT_PAGES, KIT_PAGE_IDS, readKitOptions, kitOptionsQuery } from './lib/kitOptions.js'
export { kitSections } from './lib/kitSections.jsx'
export { pick, readLang } from './lib/i18n.js'
export { yearLabel, sortedWork, cvEducation, contactLines } from './lib/resume.js'
export { parseLetters } from './lib/letters.js'
export { parsePortfolio } from './lib/portfolio.js'
export { useExportDownload } from './lib/exportDownload.js'
