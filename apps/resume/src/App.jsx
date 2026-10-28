import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AppHub } from '@kolkrabbi/kol-shell'
import { ResumeProvider, ResumeLibrary, ResumeSource, ResumeTreatment, TREATMENTS } from '@kolkrabbi/kol-resume'
import { MOOD } from 'voyager-fixture'
import { PERSON, RECORDS, CONTACT, LETTERS, PORTFOLIO } from 'voyager-fixture/resume'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

/* THE RESUME KIT (ResumeKit, kol-website 2026-10-28 — *"copy, don't redesign"*). @kolkrabbi/kol-resume on AppHub, the
 * reference for an app that hosts it: the routes record has (/resume/library · /resume/source · /resume/t/:slug), the
 * person from VOYAGER's fixture — invented, so nobody's details ship — and the export through kitExportPlugin in vite.config.
 * Nothing on screen is drawn here. */

const APP = {
  name: 'Resume',
  subtitle: 'The resume kit',
  logomark,
  defaultTheme: 'dark',
  about: 'A resume in three treatments, the cover, letter, portfolio and back pages, the A4 kit and its PDF export — @kolkrabbi/kol-resume with an invented person.',
  links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }],
}

const ITEMS = [
  { icon: 'grid', path: '/resume/library', label: 'Library' },
  { icon: 'file', path: '/resume/source', label: 'Source' },
  ...TREATMENTS.map((t) => ({ icon: 'file', path: `/resume/t/${t.slug}`, label: t.label })),
]

const portrait = MOOD[0]?.url
const copy = { back: { en: { current: 'Routes, dates and kit lists live at voyager.example.' }, is: { current: 'Leiðir, dagsetningar og búnaðarlistar eru á voyager.example.' } } }

function Frame() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <AppHub app={APP} items={ITEMS} currentPath={pathname} onNavigate={navigate} homePath="/resume/library" dev={{ tabs: [] }}>
      <Routes>
        <Route path="/resume/library" element={<ResumeLibrary />} />
        <Route path="/resume/source" element={<ResumeSource />} />
        <Route path="/resume/t/:slug" element={<ResumeTreatment />} />
        <Route path="*" element={<Navigate to="/resume/library" replace />} />
      </Routes>
    </AppHub>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ResumeProvider person={PERSON} records={RECORDS} contact={CONTACT} letters={LETTERS} portfolio={PORTFOLIO} portrait={portrait} fileStem="hekla-sveinsdottir" copy={copy}>
        <Frame />
      </ResumeProvider>
    </BrowserRouter>
  )
}
