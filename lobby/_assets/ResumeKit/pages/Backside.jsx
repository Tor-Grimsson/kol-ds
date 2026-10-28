import ContactLine from '../components/ContactLine'

const LABELS = {
  en: {
    kicker: 'Thank you', title: "Let's talk.",
    blurb: "Thanks for reading. I'm open to design roles and meaningful collaboration — get in touch and let's make something.",
    current: 'See what I’m working on at kolkrabbi.io — I write about projects at kolkrabbi.io/stack.',
  },
  is: {
    kicker: 'Takk fyrir', title: 'Tölum saman.',
    blurb: 'Takk fyrir lesturinn. Ég er opinn fyrir hönnunarstörfum og gefandi samstarfi — hafðu samband og búum eitthvað til saman.',
    current: 'Sjáðu hvað ég er að vinna að á kolkrabbi.io — ég skrifa um verkefnin á kolkrabbi.io/stack.',
  },
}

export default function Backside({ lang = 'en' }) {
  const t = LABELS[lang] ?? LABELS.en

  return (
    <main className="p-8 md:p-12">
      {/* Back cover — same portrait A-page sheet (1:√2) as the front */}
      <div className="w-full max-w-[560px] aspect-[1/1.4142] bg-surface-secondary border border-fg-08 shadow-lg p-10 md:p-12 flex flex-col">
        <div>
          <p className="kol-helper-12 text-meta uppercase mb-4">{t.kicker}</p>
          <h1 className="kol-sans-display-02 text-emphasis mb-3">{t.title}</h1>
          <p className="kol-sans-body-02 text-body max-w-prose mb-4">{t.blurb}</p>
          <p className="kol-sans-body-02 text-meta max-w-prose">{t.current}</p>
        </div>

        <ContactLine />
      </div>
    </main>
  )
}
