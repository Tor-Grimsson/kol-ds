import { useResume } from '../data.jsx'
import { pick as f } from '../lib/i18n'
import { yearLabel } from '../lib/resume'

/* Layout 2 — single column, marginalia labels. Section labels sit in a fixed
   left gutter; content flows in the wide right column. Swiss editorial, KOL. */

const LABELS = {
  en: { cv: 'Curriculum Vitae', about: 'About', experience: 'Experience', earlier: 'Selected earlier', education: 'Education', skills: 'Skills', languages: 'Languages' },
  is: { cv: 'Ferilskrá', about: 'Um mig', experience: 'Starfsreynsla', earlier: 'Valin fyrri störf', education: 'Menntun', skills: 'Hæfni', languages: 'Tungumál' },
}

function Row({ label, children, strong }) {
  return (
    <div className={`flex gap-8 py-5 ${strong ? 'border-t-2 border-fg-64' : 'border-t border-fg-12'}`}>
      <div className="w-[126px] shrink-0 kol-mono-10 uppercase tracking-wider text-subtle pt-1">{label}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function ResumeMarginalia({ lang = 'en' }) {
  const { BIO, SKILLS, LANGUAGES, sortedWork, cvEducation, contactLines } = useResume()
  const t = LABELS[lang] ?? LABELS.en
  const work = sortedWork()
  const detailed = work.slice(0, 3)
  const earlier = work.slice(3)
  const edu = cvEducation()

  return (
    <>
    <div className="min-h-screen bg-[#5b5b60] print:bg-transparent">
    <main data-theme="light" className="select-text mx-auto my-8 w-[794px] max-w-full min-h-[1123px] bg-surface-primary border border-fg-08 px-14 py-14 print:m-0 print:w-full print:min-h-0 print:border-0">
      {/* masthead */}
      <header className="pb-6">
        <p className="kol-mono-10 uppercase tracking-wider text-subtle mb-2">{t.cv}</p>
        <div className="flex items-end justify-between gap-7">
          <h1 className="kol-sans-display-02 text-emphasis">{BIO.displayName}</h1>
          <p className="kol-mono-12 text-meta text-right leading-relaxed">
            {contactLines().map((l) => <span key={l} className="block">{l}</span>)}
          </p>
        </div>
        <p className="kol-sans-heading-04 text-body mt-3">{f(BIO, 'role', lang)}</p>
      </header>

      <Row label={t.about} strong>
        <p className="kol-sans-body-02 text-body max-w-[560px]">{f(BIO, 'bio', lang)}</p>
      </Row>

      <Row label={t.experience}>
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
      </Row>

      <Row label={t.education}>
        <ul className="flex flex-col gap-2">
          {edu.map((e) => (
            <li key={`${e.title}-${e.year}`} className="flex items-baseline justify-between gap-4">
              <span className="kol-sans-body-03">
                <span className="text-emphasis">{f(e, 'title', lang)}</span>{' '}
                <span className="text-meta">— {f(e, 'org', lang)}</span>
              </span>
              <span className="kol-mono-12 text-meta whitespace-nowrap">{yearLabel(e, lang)}</span>
            </li>
          ))}
        </ul>
      </Row>

      <Row label={t.skills}>
        <div className="flex flex-col gap-2">
          {SKILLS.map((g) => (
            <div key={g.group} className="flex gap-3">
              <div className="w-[96px] shrink-0 kol-mono-12 text-subtle">{f(g, 'group', lang)}</div>
              <div className="kol-sans-body-03 text-body">{f(g, 'items', lang).join(' · ')}</div>
            </div>
          ))}
        </div>
      </Row>

      <Row label={t.languages}>
        <div className="flex flex-wrap gap-x-10 gap-y-1">
          {LANGUAGES.map((l) => (
            <span key={l.language} className="kol-sans-body-03">
              <span className="text-emphasis">{f(l, 'language', lang)}</span>{' '}
              <span className="text-meta">— {f(l, 'level', lang)}</span>
            </span>
          ))}
        </div>
      </Row>
    </main>
    </div>
    </>
  )
}
