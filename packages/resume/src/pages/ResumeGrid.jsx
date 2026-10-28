import { useResume } from '../data.jsx'
import { pick as f } from '../lib/i18n'
import { yearLabel } from '../lib/resume'

/* Layout 4 — modular Swiss grid. Numbered experience index with a date gutter,
   and a four-cell footer for the supporting facts. KOL tokens. */

const LABELS = {
  en: { about: 'Profile', experience: 'Experience', education: 'Education', languages: 'Languages' },
  is: { about: 'Um mig', experience: 'Starfsreynsla', education: 'Menntun', languages: 'Tungumál' },
}

const num = (i) => String(i + 1).padStart(2, '0')

export default function ResumeGrid({ lang = 'en' }) {
  const { BIO, SKILLS, LANGUAGES, sortedWork, cvEducation, contactLines } = useResume()
  const t = LABELS[lang] ?? LABELS.en
  const work = sortedWork()
  const detailed = work.slice(0, 3)
  const earlier = work.slice(3)
  const edu = cvEducation()

  return (
    <>
    <div className="min-h-screen bg-[#5b5b60] print:bg-transparent">
    <main data-theme="light" className="select-text mx-auto my-8 w-[794px] max-w-full min-h-[1123px] bg-surface-primary border border-fg-08 px-14 pt-12 pb-0 print:m-0 print:w-full print:min-h-0 print:border-0">
      {/* masthead */}
      <div className="flex items-start justify-between gap-6 pb-5 border-b-2 border-fg-80">
        <h1 className="kol-sans-display-01 text-emphasis leading-none tracking-tight">{BIO.displayName}</h1>
        <div className="text-right pt-1.5">
          <p className="kol-sans-body-03 text-meta max-w-[210px] ml-auto mb-3">{f(BIO, 'role', lang)}</p>
          <p className="kol-mono-12 text-meta leading-relaxed">
            {contactLines().map((l) => <span key={l} className="block">{l}</span>)}
          </p>
        </div>
      </div>

      {/* about strip */}
      <div className="flex gap-5 py-4 border-b border-fg-12">
        <div className="w-11 shrink-0 kol-mono-12 text-subtle">00</div>
        <p className="flex-1 kol-sans-body-03 text-body max-w-[640px]">{f(BIO, 'bio', lang)}</p>
      </div>

      {/* experience index */}
      <div className="kol-mono-10 uppercase tracking-wider text-subtle pt-4 pb-2">{t.experience}</div>
      <div className="flex flex-col">
        {detailed.map((w, i) => (
          <div key={`${w.org}-${w.year}`} className="flex gap-5 py-3 border-t border-fg-12">
            <div className="w-11 shrink-0">
              <div className="kol-mono-12 text-subtle">{num(i)}</div>
              <div className="kol-mono-10 text-meta mt-1.5">{yearLabel(w, lang)}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-4">
                <p className="kol-sans-heading-05 text-emphasis">{w.org}</p>
                <p className="kol-sans-body-03 text-meta">
                  {f(w, 'title', lang)}{w.location ? ` · ${f(w, 'location', lang)}` : ''}
                </p>
              </div>
              <p className="kol-sans-body-03 text-body mt-1 max-w-[560px]">
                {f(w, 'bullets', lang)?.[0] ?? f(w, 'notes', lang)}
              </p>
            </div>
          </div>
        ))}
        {earlier.map((w, i) => (
          <div key={`${w.org}-${w.year}`} className="flex gap-5 py-[9px] border-t border-fg-12 items-baseline">
            <div className="w-11 shrink-0 kol-mono-12 text-subtle">{num(detailed.length + i)}</div>
            <div className="flex-1 min-w-0 flex items-baseline justify-between gap-4">
              <span className="kol-sans-body-03">
                <span className="text-emphasis">{w.org}</span>{' '}
                <span className="text-meta">{f(w, 'title', lang)}</span>
              </span>
              <span className="kol-mono-12 text-subtle whitespace-nowrap">{yearLabel(w, lang)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* footer modular cells */}
      <div className="grid grid-cols-4 border-t-2 border-fg-80 mt-4">
        <FooterCell label={t.education} border>
          {edu.map((e) => (
            <p key={`${e.title}-${e.year}`} className="mb-2 last:mb-0">
              <span className="text-emphasis">{f(e, 'title', lang)}</span><br />
              {f(e, 'org', lang)} · {yearLabel(e, lang)}
            </p>
          ))}
        </FooterCell>
        {SKILLS.map((g, i) => (
          <FooterCell key={g.group} label={f(g, 'group', lang)} border={i < SKILLS.length - 1}>
            <p>{f(g, 'items', lang).join(' · ')}</p>
            {i === SKILLS.length - 1 && (
              <p className="mt-3">
                {LANGUAGES.map((l) => (
                  <span key={l.language} className="block">{f(l, 'language', lang)} — {f(l, 'level', lang)}</span>
                ))}
              </p>
            )}
          </FooterCell>
        ))}
      </div>
    </main>
    </div>
    </>
  )
}

function FooterCell({ label, children, border }) {
  return (
    <div className={`py-5 pr-4 ${border ? 'border-r border-fg-12 pl-4 first:pl-0' : 'pl-4'}`}>
      <div className="kol-mono-10 uppercase tracking-wider text-subtle mb-2.5">{label}</div>
      <div className="kol-sans-body-03 text-body leading-relaxed">{children}</div>
    </div>
  )
}
