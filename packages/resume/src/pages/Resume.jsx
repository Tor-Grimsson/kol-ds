import { useResume } from '../data.jsx'
import { pick as f } from '../lib/i18n'

/* Section labels + the "–Present" word per language. Content (bio, titles,
   bullets, …) comes from the data via `f()` below — labels are chrome. */
const LABELS = {
  en: { cv: 'Curriculum Vitae', about: 'About', skills: 'Skills', education: 'Education', languages: 'Languages', experience: 'Experience', present: 'Present' },
  is: { cv: 'Ferilskrá', about: 'Um mig', skills: 'Hæfni', education: 'Menntun', languages: 'Tungumál', experience: 'Starfsreynsla', present: 'í dag' },
}

export default function Resume({ lang = 'en' }) {
  const { BIO, LANGUAGES, SKILLS, WORK, EDUCATION } = useResume()
  const t = LABELS[lang] ?? LABELS.en

  // year–Present (ongoing), year–endYear (range), or single year.
  const yr = (e) =>
    e.ongoing ? `${e.year}–${t.present}` : e.endYear ? `${e.year}–${e.endYear}` : `${e.year}`

  // `pinned` (the founder role) sits first; then reverse-chronological by start
  // year; ongoing roles win ties within the same start year.
  const work = [...WORK].sort(
    (a, b) =>
      (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
      b.year - a.year ||
      (b.ongoing ? 1 : 0) - (a.ongoing ? 1 : 0),
  )
  // `cv: false` entries (high school, the one-year art-theory studies) stay in
  // the registry but are omitted from the CV — matches the Figma's 3-line block.
  const edu = EDUCATION.filter((e) => e.cv !== false).sort((a, b) => b.year - a.year)

  return (
    <main className="p-8 md:p-12 max-w-5xl">
      {/* Header */}
      <header className="mb-10">
        <p className="kol-helper-12 text-meta uppercase mb-1">{t.cv}</p>
        <p className="kol-sans-display-02 text-emphasis">{f(BIO, 'role', lang)}</p>
        <h1 className="kol-sans-heading-04 text-body">{BIO.displayName}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
        {/* Left column */}
        <aside className="flex flex-col gap-8">
          <section>
            <h2 className="kol-helper-12 text-meta uppercase mb-2">{t.about}</h2>
            <p className="kol-sans-body-02 text-body">{f(BIO, 'bio', lang)}</p>
          </section>

          <section>
            <h2 className="kol-helper-12 text-meta uppercase mb-3">{t.skills}</h2>
            <div className="flex flex-col gap-4">
              {SKILLS.map((g) => (
                <div key={g.group}>
                  <p className="kol-sans-heading-05 text-emphasis mb-1.5">{f(g, 'group', lang)}</p>
                  <ul className="flex flex-col gap-0.5">
                    {f(g, 'items', lang).map((it) => (
                      <li key={it} className="kol-sans-body-03 text-body flex gap-2">
                        <span className="text-meta select-none" aria-hidden="true">+</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="kol-helper-12 text-meta uppercase mb-3">{t.education}</h2>
            <div className="flex flex-col gap-4">
              {edu.map((e) => (
                <div key={`${e.title}-${e.year}`} className="print:break-inside-avoid">
                  <p className="kol-sans-heading-05 text-emphasis mb-1.5">{f(e, 'field', lang) || f(e, 'title', lang)}</p>
                  <ul className="flex flex-col gap-0.5">
                    {[f(e, 'degree', lang), f(e, 'org', lang).replace(/\s*\([^)]*\)\s*$/, ''), yr(e)]
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i} className="kol-sans-body-03 text-body flex gap-2">
                          <span className="text-meta select-none" aria-hidden="true">+</span>
                          <span>{line}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="kol-helper-12 text-meta uppercase mb-2">{t.languages}</h2>
            <ul className="flex flex-col gap-1">
              {LANGUAGES.map((l) => (
                <li key={l.language} className="kol-sans-body-02 text-body">
                  {f(l, 'language', lang)} — <span className="text-meta">{f(l, 'level', lang)}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Right column — experience */}
        <section>
          <h2 className="kol-helper-12 text-meta uppercase mb-4">{t.experience}</h2>
          <ol className="flex flex-col gap-7">
            {work.map((w) => {
              const bullets = f(w, 'bullets', lang)
              return (
                <li key={`${w.org}-${w.year}`} className="print:break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="kol-sans-heading-05 text-emphasis">{w.org}</p>
                    <p className="kol-mono-12 text-meta whitespace-nowrap">{yr(w)}</p>
                  </div>
                  <p className="kol-sans-body-02 text-body">
                    {f(w, 'title', lang)}{w.location ? ` · ${f(w, 'location', lang)}` : ''}
                  </p>
                  {bullets?.length ? (
                    <ul className="mt-2 flex flex-col gap-1">
                      {bullets.map((b, i) => (
                        <li key={i} className="kol-sans-body-03 text-body flex gap-2">
                          <span className="text-meta select-none" aria-hidden="true">+</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : f(w, 'notes', lang) ? (
                    <p className="kol-sans-body-03 text-meta mt-1">{f(w, 'notes', lang)}</p>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </main>
  )
}
