import ContactLine from '../components/ContactLine'
import { useResume } from '../data.jsx'
import { pick } from '../lib/i18n'

const LABELS = {
  en: { kicker: 'Portfolio & CV · 2026' },
  is: { kicker: 'Verkmappa & ferilskrá · 2026' },
}

export default function Cover({ lang = 'en' }) {
  const { BIO, bucketUrl, PORTRAIT } = useResume()
  const t = LABELS[lang] ?? LABELS.en

  return (
    <main className="p-8 md:p-12">
      {/* Portrait A-page sheet — ISO 216 ratio 1:√2, the shape the PDF will print at */}
      <div className="w-full max-w-[560px] aspect-[1/1.4142] bg-surface-secondary border border-fg-08 shadow-lg p-10 md:p-12 flex flex-col">
        <div>
          <img
            src={bucketUrl(PORTRAIT)}
            alt={BIO.displayName}
            className="size-44 object-cover border border-fg-08 mb-8"
          />
          <p className="kol-helper-12 text-meta uppercase mb-4">{t.kicker}</p>
          <h1 className="kol-sans-display-02 text-emphasis mb-3">{BIO.displayName}</h1>
          <p className="kol-sans-heading-04 text-body mb-6">{pick(BIO, 'role', lang)}</p>
        </div>

        <ContactLine />
      </div>
    </main>
  )
}
