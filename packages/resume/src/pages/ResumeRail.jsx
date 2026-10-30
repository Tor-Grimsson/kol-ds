import { useResume } from '../data.jsx'
import { pick as f } from '../lib/i18n.js'
import { yearLabel } from '../lib/resume.js'

/* Layout 3 — sidebar rail. Facts (contact, profile, skills, education,
   languages) fill a tinted left rail; experience runs down the wide right
   column. KOL tokens, theme-adaptive. */

/* the role is the person's (the seam): LABELS takes BIO, read inside the component */
const LABELS = (BIO) => ({
  en: { role: BIO.role, contact: 'Contact', profile: 'Profile', skills: 'Skills', education: 'Education', languages: 'Languages', experience: 'Experience', earlier: 'Selected earlier' },
  is: { role: BIO.role_is, contact: 'Samskipti', profile: 'Um mig', skills: 'Hæfni', education: 'Menntun', languages: 'Tungumál', experience: 'Starfsreynsla', earlier: 'Valin fyrri störf' },
})

function RailBlock({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="kol-mono-10 uppercase tracking-wider text-subtle">{label}</div>
      {children}
    </div>
  )
}

export default function ResumeRail({ lang = 'en' }) {
  const { BIO, SKILLS, LANGUAGES, sortedWork, cvEducation, contactLines } = useResume()
  const t = LABELS(BIO)[lang] ?? LABELS(BIO).en
  const work = sortedWork()
  const detailed = work.slice(0, 3)
  const earlier = work.slice(3)
  const edu = cvEducation()

  return (
    <>
    {/* flow-root: the sheet's my-8 no longer collapses through the backdrop and leaves a band of page wash (LayoutsAppPages) */}
    <div className="flow-root min-h-screen bg-[#5b5b60] print:bg-transparent">
    <main data-theme="light" className="select-text mx-auto my-8 flex w-[794px] max-w-full min-h-[1123px] bg-surface-primary border border-fg-08 print:m-0 print:w-full print:min-h-0 print:border-0">
      {/* left rail */}
      <aside className="w-[288px] shrink-0 bg-surface-secondary border-r border-fg-12 px-8 py-12 flex flex-col gap-7">
        <div>
          <h1 className="kol-sans-heading-01 text-emphasis leading-none">{BIO.displayName}</h1>
          <p className="kol-sans-body-03 text-meta mt-3">{f(BIO, 'role', lang)}</p>
        </div>

        <RailBlock label={t.contact}>
          <div className="kol-mono-12 text-body leading-relaxed">
            {contactLines().map((l) => <span key={l} className="block">{l}</span>)}
          </div>
        </RailBlock>

        <RailBlock label={t.profile}>
          <p className="kol-sans-body-03 text-body">{f(BIO, 'tagline', lang)}</p>
        </RailBlock>

        <RailBlock label={t.skills}>
          <div className="flex flex-col gap-2">
            {SKILLS.map((g) => (
              <div key={g.group}>
                <p className="kol-mono-12 text-subtle mb-0.5">{f(g, 'group', lang)}</p>
                <p className="kol-sans-body-03 text-body">{f(g, 'items', lang).join(', ')}</p>
              </div>
            ))}
          </div>
        </RailBlock>

        <RailBlock label={t.education}>
          <div className="flex flex-col gap-2">
            {edu.map((e) => (
              <p key={`${e.title}-${e.year}`} className="kol-sans-body-03 text-body">
                <span className="text-emphasis">{f(e, 'title', lang)}</span><br />
                <span className="text-meta">{f(e, 'org', lang)} · {yearLabel(e, lang)}</span>
              </p>
            ))}
          </div>
        </RailBlock>

        <RailBlock label={t.languages}>
          <div className="kol-sans-body-03 text-body leading-relaxed">
            {LANGUAGES.map((l) => (
              <span key={l.language} className="block">
                <span className="text-emphasis">{f(l, 'language', lang)}</span> — <span className="text-meta">{f(l, 'level', lang)}</span>
              </span>
            ))}
          </div>
        </RailBlock>
      </aside>

      {/* main — experience */}
      <section className="flex-1 min-w-0 px-10 py-12">
        <h2 className="kol-mono-10 uppercase tracking-wider text-subtle pb-3 mb-5 border-b-2 border-fg-64">{t.experience}</h2>

        <ol className="flex flex-col gap-5">
          {detailed.map((w) => (
            <li key={`${w.org}-${w.year}`}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="kol-sans-heading-05 text-emphasis">{w.org}</p>
                <p className="kol-mono-12 text-meta whitespace-nowrap">{yearLabel(w, lang)}</p>
              </div>
              <p className="kol-sans-body-03 text-meta">
                {f(w, 'title', lang)}{w.location ? ` · ${f(w, 'location', lang)}` : ''}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {(f(w, 'bullets', lang) ?? []).map((b, i) => (
                  <li key={i} className="kol-sans-body-03 text-body flex gap-2">
                    <span className="kol-mono-12 text-subtle select-none" aria-hidden="true">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {earlier.length > 0 && (
            <li className="mt-1">
              <p className="kol-mono-10 uppercase tracking-wider text-subtle mb-1">{t.earlier}</p>
              <ul>
                {earlier.map((w) => (
                  <li key={`${w.org}-${w.year}`} className="flex items-baseline justify-between gap-4 py-[7px] border-t border-fg-08">
                    <span className="kol-sans-body-03">
                      <span className="text-emphasis">{w.org}</span>{' '}
                      <span className="text-meta">— {f(w, 'title', lang)}</span>
                    </span>
                    <span className="kol-mono-12 text-meta whitespace-nowrap">{yearLabel(w, lang)}</span>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ol>
      </section>
    </main>
    </div>
    </>
  )
}
