import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useResume } from '../data.jsx'
import { pick } from '../lib/i18n'
import { readKitOptions } from '../lib/kitOptions'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

// The letter markdown carries `[Role]` / `[Company]` tokens. Left blank they
// fall back to a generic phrasing, so the letter reads as a real letter whether
// or not a specific application has been filled in.
const GENERIC_COMPANY = { en: 'your company', is: 'fyrirtækinu þínu' }

export default function CoverLetter({ preview = false, lang = 'en', role, company }) {
  const { BIO, LETTERS, getLetter } = useResume()
  const [id, setId] = useState(LETTERS[0].id)
  const [params] = useSearchParams()
  const letter = getLetter(id)

  // On the standalone /letter route the props are absent — read the same URL
  // options the kit preview uses, so both surfaces stay in sync.
  const opts = readKitOptions(params)
  const fill = (s) =>
    s
      .replaceAll('[Role]', (role ?? opts.role) || pick(BIO, 'role', lang))
      .replaceAll('[Company]', (company ?? opts.company) || GENERIC_COMPANY[lang])

  return (
    <main className="p-8 md:p-12 max-w-3xl">
      {/* Variant picker — only when there's more than one letter to choose from.
          Hidden in the whole-kit preview, which renders the default letter only. */}
      {!preview && LETTERS.length > 1 && (
        <SegmentedToggle
          value={id}
          onChange={setId}
          options={LETTERS.map((l) => ({ value: l.id, label: l.label }))}
          className="mb-8 max-w-md print:hidden"
        />
      )}

      <p className="kol-mono-12 text-meta mb-8">{pick(letter, 'date', lang)}</p>

      <div className="flex flex-col gap-4">
        <p className="kol-sans-body-01 text-body">{fill(pick(letter, 'recipient', lang))}</p>
        {pick(letter, 'body', lang).map((p, i) => (
          <p key={i} className="kol-sans-body-01 text-body">{fill(p)}</p>
        ))}
        <p className="kol-sans-body-01 text-body mt-4">{pick(letter, 'signoff', lang)}</p>
        <p className="kol-sans-body-01 text-emphasis">{BIO.displayName}</p>
      </div>
    </main>
  )
}
