import { Button, Divider } from '@kolkrabbi/kol-component'

/**
 * FoundryLicenseQuestions — two-column "Licence / Questions?" band that closes a
 * typeface page: a licence blurb + CTA on the left, a contact blurb + CTA on the
 * right, split by a divider (horizontal on mobile, vertical on desktop).
 *
 * Text casing: headings and copy render verbatim as authored.
 */
const FoundryLicenseQuestions = () => {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-24 md:gap-12">
        {/* License Section */}
        <div className="w-full flex flex-col gap-6 items-center text-center">
          <h3 className="kol-label-compact-lg">LICENCE</h3>
          <p className="kol-mono-sm-regular text-fg-32">
            TG Málrómur is available for both personal and commercial use.<br />
            Please review licensing terms before use.
          </p>
          <Button variant="outline">Licence details</Button>
        </div>

        <Divider variant="horizontal" className="md:hidden" />
        <Divider variant="vertical" className="hidden md:flex" />

        {/* Questions CTA */}
        <div className="w-full flex flex-col gap-6 items-center text-center">
          <h3 className="kol-label-compact-lg">QUESTIONS?</h3>
          <p className="kol-mono-sm-regular text-fg-32">
            Contextual and discretionary ligatures for improved readability.<br />
            Reach out and get in touch!
          </p>
          <Button variant="outline">Get in touch!</Button>
        </div>
      </div>
    </section>
  )
}

export default FoundryLicenseQuestions
