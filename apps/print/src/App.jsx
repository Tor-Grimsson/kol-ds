import { useEffect, useState } from 'react'
import { AppHub } from '@kolkrabbi/kol-shell'
import { PrintStudio } from '@kolkrabbi/kol-styleguide'
import { MARKS } from 'voyager-fixture'
import { BRAND_INFO } from 'voyager-fixture/business'
import { STATIONERY_NAMES, stationeryBoard } from 'voyager-fixture/stationery'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import sample from '@kolkrabbi/kol-print/fixtures/probe.md?raw'

/* THE PRINT TOOL (PdfToolsFromStudio, 2026-10-28 — user: *"we have a bunch of stationery, we would like to connect those
 * together with the package"*). kol-styleguide's PrintStudio on AppHub, the reference for any app or site that takes it as a
 * page: the Document layout is @kolkrabbi/kol-print (markdown → the A4 sheets → PDF · DOCX · MD), and the templates are
 * VOYAGER's stationery from voyager-fixture — the letters, invoices and agreements apps/stationery lays on its desk —
 * printed as they are. The studio is VOYAGER's: the package ships no studio's details. Nothing on screen is drawn here. */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/print'

const APP = {
  name: 'Print',
  subtitle: 'Markdown and stationery to A4',
  logomark,
  defaultTheme: 'dark',
  about: 'Markdown to a Kolkrabbi A4 document — PDF, DOCX and MD — on @kolkrabbi/kol-print, and the stationery printed as it is. The same engine the kol-print command line runs.',
  links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }],
}

/* the studio on the sheet's header and in the parties block — VOYAGER's, from the fixture */
const studio = {
  studio: BRAND_INFO.legal.entity,
  designer: BRAND_INFO.identity.founder,
  address: `${BRAND_INFO.studio.street}, ${BRAND_INFO.studio.postcode}`,
  contacts: [BRAND_INFO.contact.web, BRAND_INFO.contact.email, BRAND_INFO.contact.phone],
}
const meta = { project: 'Voyager Probe', slug: 'probe', client: 'Voyager Expeditions ehf', dates: 'Oct 2026' }

/* the stationery's A4 boards, grouped as apps/stationery groups them */
const A4 = ['Letterhead', 'Letter', 'Letter-A', 'Letter-B', 'Letter-C', 'Letter-D', 'Invoice-A', 'Invoice-B', 'Contract', 'NDA']
const LABEL = { Letterhead: 'Letterhead', Letter: 'Letter', 'Letter-A': 'Letter · A Clean', 'Letter-B': 'Letter · B Centered header', 'Letter-C': 'Letter · C Official', 'Letter-D': 'Letter · D Marks and stamps', 'Invoice-A': 'Invoice · A', 'Invoice-B': 'Invoice · B', Contract: 'Contract', NDA: 'NDA' }
const templates = [
  ...A4.filter((n) => STATIONERY_NAMES.includes(n)).map((n) => ({ id: n, label: LABEL[n], sheets: [stationeryBoard(n)] })),
  { id: 'research', label: 'Research paper · 16 sheets', sheets: STATIONERY_NAMES.filter((n) => n.startsWith('Comparison-')).map(stationeryBoard) },
]

export default function App() {
  const [path, setPath] = useState(parse)
  const [logoSvg, setLogoSvg] = useState('')
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  /* the sheet header's logo is markup (the sheets) — the fixture's lockup, fetched once */
  const lockup = MARKS.find((m) => m.id === 'lockup-horizontal-01')?.url
  useEffect(() => { if (lockup) fetch(lockup).then((r) => r.text()).then(setLogoSvg).catch(() => {}) }, [lockup])
  return (
    <AppHub app={APP} items={[{ icon: 'file', path: '/print', label: 'Print' }]} currentPath={path} onNavigate={(p) => { location.hash = encodeURI(p) }} homePath="/print" dev={{ tabs: [] }}>
      {/* the tool fills the screen: the controls left, the sheets on their desk to the right */}
      <div className="h-dvh min-h-0">
        <PrintStudio studio={studio} logoSvg={logoSvg} meta={meta} markdown={sample} templates={templates} />
      </div>
    </AppHub>
  )
}
