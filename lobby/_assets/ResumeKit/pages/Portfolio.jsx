import { Link } from 'react-router-dom'
import { PROJECTS } from '../lib/portfolio'

// Page chrome only. Project copy (title/role/summary/tags) mirrors live Sanity
// /work (ARCHITECTURE §6) and is left in its source language.
const LABELS = {
  en: {
    kicker: 'Portfolio', title: 'Selected Work',
    intro: 'Brand identities, design systems, and digital products — a selection of work across studio, SaaS, and culture.',
  },
  is: {
    kicker: 'Verkmappa', title: 'Valin verk',
    intro: 'Vörumerki, hönnunarkerfi og stafrænar vörur — úrval verkefna úr stofurekstri, SaaS og menningu.',
  },
}

// In the app a card opens the local case study; in the exported kit it has to be
// an absolute link a reader can actually follow off the page (p.work). Hoisted so
// React doesn't remount the whole grid on every render.
const ExternalCard = ({ to, ...rest }) => <a href={to} target="_blank" rel="noreferrer" {...rest} />

export default function Portfolio({ lang = 'en', preview = false }) {
  const t = LABELS[lang] ?? LABELS.en
  const Card = preview ? ExternalCard : Link
  return (
    <main className="p-8 md:p-12 max-w-6xl">
      <header className="mb-10">
        <p className="kol-helper-12 text-meta uppercase mb-1">{t.kicker}</p>
        <h1 className="kol-sans-display-02 text-emphasis mb-3">{t.title}</h1>
        <p className="kol-sans-body-01 text-body max-w-prose">{t.intro}</p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {PROJECTS.filter((p) => !p.hidden).map((p) => (
          <li key={p.id}>
            <Card to={preview ? p.work : `/portfolio/${p.id}`} className="group flex flex-col h-full">
              {/* Image / placeholder — drop a real shot at p.image to replace */}
              <div className="aspect-[4/3] overflow-hidden bg-fg-04 mb-3 flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="kol-mono-12 text-meta">{p.title}</span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <p className="kol-sans-heading-05 text-emphasis">{p.title}</p>
                <p className="kol-mono-12 text-meta whitespace-nowrap">{p.year}</p>
              </div>
              <p className="kol-mono-12 text-meta mb-2">{p.role}</p>
              <p className="kol-sans-body-03 text-body mb-3">{p.summary}</p>

              {p.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="kol-mono-10 text-meta border border-fg-08 rounded px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </main>
  )
}
