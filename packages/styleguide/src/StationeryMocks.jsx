/**
 * StationeryMocks — the printed stationery set a brand manual shows: business
 * card front/back, DL envelope, letterhead (plain and correspondence), and the
 * email signature.
 *
 * Lifted from the two brand apps (`brand-book-mocks-two-consumers`,
 * 2026-09-03). ASSET-AGNOSTIC like `LogoCard` and `SocialMocks`: the mark is a
 * consumer-injected node, the brand's own details arrive as `info`, and every
 * body string is a prop or a child. The geometry — paddings, type sizes, the
 * rules and the grids — is carried through from the forks unchanged.
 *
 * ⚠ **SIX of the fork's TWENTY-SEVEN exports are here.** The other 21 are the
 * garment / packaging kit (hangtags, swing tags, care · neck · size labels,
 * edition cards, dust bags, garment bags, gift boxes, and their B variants —
 * ~500 lines). They are NOT ported yet, deliberately: that file had accreted
 * three clients' content in one place — a customer's real name and street
 * address in the letter body, prices in €, another brand's woven-label
 * references, and a palette its own source comment attributes to *"another
 * client, carried in with the app"*. Carrying that through verbatim would ship
 * one client's correspondence inside a shared package; stripping it is not a
 * port but a new API of 21 components with four to eight text props each. The
 * remainder is recorded on the ticket for the user's ruling.
 *
 *   const brand = { mark: <Asset name="logomark" />, info: BRAND_INFO }
 *   <AssetCard caption="Business card">
 *     <div style={{ aspectRatio: '85 / 55' }}><BusinessCardFront {...brand} /></div>
 *   </AssetCard>
 *
 * Every mock fills its container (`w-full h-full`) and takes its proportion
 * from the wrapper — the forks' contract, so a card is sized by an 85×55 box
 * and a letterhead by an A4 one, never by the component.
 */

/* Neutral placeholders. Nothing here is a real brand's data — a consumer
 * passes its own `info` and the defaults exist so an un-fed mock still shows
 * the layout rather than collapsing. */
export const DEFAULT_BRAND_INFO = {
  identity: { name: 'Brand name', role: 'Role', founder: 'Founder name' },
  contact: { email: 'hello@example.com', phone: '+00 000 0000', web: 'example.com' },
  studio: { street: 'Street 1', postcode: '000 City', city: 'City', country: 'Country', locShort: 'City' },
  legal: { entity: 'Entity name', kt: '000000-0000' },
  labels: { madeIn: 'Made in' },
}

export const DEFAULT_STATIONERY_PALETTE = {
  paper: '#FCFBFB',
  ink: '#131316',
  accent: '#F3F1EC',
}

export const DEFAULT_STATIONERY_FONTS = {
  display: 'var(--kol-font-family-sans-narrow)',
  text: 'var(--kol-font-family-sans)',
  mono: 'var(--kol-font-family-mono)',
}

/* One resolver for all six so a consumer can pass a partial `info` (just
 * `contact`, say) without the rest going undefined mid-render. */
function resolve(info, palette, fonts) {
  const merged = {
    identity: { ...DEFAULT_BRAND_INFO.identity, ...info?.identity },
    contact: { ...DEFAULT_BRAND_INFO.contact, ...info?.contact },
    studio: { ...DEFAULT_BRAND_INFO.studio, ...info?.studio },
    legal: { ...DEFAULT_BRAND_INFO.legal, ...info?.legal },
    labels: { ...DEFAULT_BRAND_INFO.labels, ...info?.labels },
  }
  return [
    merged,
    { ...DEFAULT_STATIONERY_PALETTE, ...palette },
    { ...DEFAULT_STATIONERY_FONTS, ...fonts },
  ]
}

const capsStyle = (fonts) => ({
  fontFamily: fonts.mono,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
})

/**
 * BusinessCardFront — the mark, centred, on paper.
 *
 * @param {ReactNode} mark - The brand mark; sized to 70% of the card height
 * @param {Object} palette - Partial override of DEFAULT_STATIONERY_PALETTE
 * @param {string} className - Extra classes on the card
 */
export function BusinessCardFront({ mark, palette, className = '' }) {
  const [, pal] = resolve(null, palette)
  return (
    <div
      className={`w-full h-full flex items-center justify-center p-8 [&_svg]:w-auto [&_svg]:h-full ${className}`.trim()}
      style={{ background: pal.paper, color: pal.ink }}
    >
      <span className="max-h-[70%] flex items-center">{mark}</span>
    </div>
  )
}

/**
 * BusinessCardBack — role and name over the contact block, inked.
 *
 * @param {Object} info - Partial override of DEFAULT_BRAND_INFO — reads identity.role, identity.founder, contact.email, contact.phone, studio.city, studio.country
 * @param {Object} palette - Partial override of DEFAULT_STATIONERY_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_STATIONERY_FONTS
 * @param {string} className - Extra classes on the card
 */
export function BusinessCardBack({ info, palette, fonts, className = '' }) {
  const [brand, pal, font] = resolve(info, palette, fonts)
  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-8 border border-fg-08 ${className}`.trim()}
      style={{ background: pal.ink, color: pal.paper }}
    >
      <div>
        <p style={{ ...capsStyle(font), fontSize: 9, opacity: 0.6 }}>{brand.identity.role}</p>
        <p style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500, marginTop: 4 }}>
          {brand.identity.founder}
        </p>
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 9, lineHeight: 1.6, letterSpacing: '0.05em' }}>
        <p>{brand.contact.email}</p>
        <p>{brand.contact.phone}</p>
        <p>{brand.studio.city}, {brand.studio.country}</p>
      </div>
    </div>
  )
}

/**
 * Envelope — DL, mark top-left, return address bottom-right, fold line.
 *
 * @param {ReactNode} mark - The brand mark, in an 8-unit-tall box
 * @param {Object} info - Partial override of DEFAULT_BRAND_INFO — reads identity.name and the studio block
 * @param {Object} palette - Partial override of DEFAULT_STATIONERY_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_STATIONERY_FONTS
 * @param {string} className - Extra classes on the envelope
 */
export function Envelope({ mark, info, palette, fonts, className = '' }) {
  const [brand, pal, font] = resolve(info, palette, fonts)
  return (
    <div
      className={`w-full h-full relative p-8 [&_svg]:w-auto [&_svg]:h-full ${className}`.trim()}
      style={{ background: pal.paper, color: pal.ink }}
    >
      <div
        className="absolute inset-x-0 top-1/2 border-t border-dashed"
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
      />
      <div className="absolute top-8 left-8 h-8">{mark}</div>
      <div
        className="absolute bottom-8 right-8 text-right"
        style={{ fontFamily: font.text, fontSize: 11, lineHeight: 1.5, color: pal.ink, opacity: 0.8 }}
      >
        <p>{brand.identity.name}</p>
        <p>{brand.studio.street}</p>
        <p>{brand.studio.postcode}</p>
        <p>{brand.studio.country}</p>
      </div>
    </div>
  )
}

/**
 * Letterhead — A4: wordmark, body, contact rule at the foot.
 *
 * @param {ReactNode} mark - The brand mark (a wordmark in the forks), in a 10-unit-tall box
 * @param {Object} info - Partial override of DEFAULT_BRAND_INFO — reads identity.founder, contact.web, contact.phone, studio.city, studio.country
 * @param {Object} palette - Partial override of DEFAULT_STATIONERY_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_STATIONERY_FONTS
 * @param {ReactNode} children - The letter body; omitted, nothing renders between the mark and the signoff
 * @param {ReactNode} signoff - Line above the signature (default: 'Warmly,')
 * @param {string} className - Extra classes on the sheet
 */
export function Letterhead({ mark, info, palette, fonts, children, signoff = 'Warmly,', className = '' }) {
  const [brand, pal, font] = resolve(info, palette, fonts)
  return (
    <div
      className={`w-full h-full flex flex-col p-12 [&_svg]:w-auto [&_svg]:h-auto ${className}`.trim()}
      style={{ background: pal.paper, color: pal.ink }}
    >
      <div className="h-10 mb-12 [&_svg]:h-full [&_svg]:w-auto">{mark}</div>
      <div
        style={{
          fontFamily: font.text,
          fontSize: 10,
          lineHeight: 1.7,
          color: pal.ink,
          fontWeight: 300,
          letterSpacing: '0.02em',
        }}
      >
        {children}
        <p>{signoff}</p>
        <p style={{ fontFamily: font.display, fontSize: 12, fontWeight: 500, marginTop: 16 }}>
          {brand.identity.founder}
        </p>
      </div>
      <div
        className="mt-auto pt-8 border-t"
        style={{
          borderColor: 'rgba(0,0,0,0.08)',
          fontFamily: font.mono,
          fontSize: 8,
          letterSpacing: '0.06em',
          color: pal.ink,
          opacity: 0.6,
        }}
      >
        <p>{brand.contact.web}  ·  {brand.studio.city}, {brand.studio.country}  ·  {brand.contact.phone}</p>
      </div>
    </div>
  )
}

/**
 * LetterheadCorrespondence — the richer sheet: mark + address block, a
 * date/ref/to grid, the body, a signed signoff, and a legal footer.
 *
 * The forks called this `LetterheadB`. Renamed on the way in — a B suffix says
 * nothing about which sheet to reach for, and this is the correspondence
 * variant. `LetterheadB` is exported as an alias so a fork can migrate without
 * touching its call sites.
 *
 * @param {ReactNode} mark - The brand mark for the header, 48px tall
 * @param {ReactNode} signature - Mark or scan above the signed name, 22px tall in the forks
 * @param {Object} info - Partial override of DEFAULT_BRAND_INFO — reads the studio, contact, identity and legal blocks
 * @param {Object} palette - Partial override of DEFAULT_STATIONERY_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_STATIONERY_FONTS
 * @param {Array<{label: string, value: ReactNode}>} fields - The date/ref/to grid; each row is a caps label and its value
 * @param {ReactNode} children - The letter body
 * @param {ReactNode} signoff - Line above the signature (default: 'With thanks,')
 * @param {ReactNode} page - Footer page marker (default: 'Page 01 / 01')
 * @param {string} className - Extra classes on the sheet
 */
export function LetterheadCorrespondence({
  mark,
  signature,
  info,
  palette,
  fonts,
  fields = [],
  children,
  signoff = 'With thanks,',
  page = 'Page 01 / 01',
  className = '',
}) {
  const [brand, pal, font] = resolve(info, palette, fonts)
  const inkAt = (alpha) => `rgba(19,19,22,${alpha})`

  return (
    <div
      className={`w-full h-full flex flex-col p-7 [&_svg]:w-auto [&_svg]:h-auto ${className}`.trim()}
      style={{ background: pal.paper, color: pal.ink }}
    >
      <div className="flex justify-between items-start">
        <span className="[&_svg]:h-12 [&_svg]:w-auto">{mark}</span>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 6.5,
            lineHeight: 1.7,
            color: inkAt(0.6),
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'right',
          }}
        >
          {brand.studio.street}<br />
          {brand.studio.locShort}<br />
          {brand.contact.email}<br />
          {brand.contact.phone}
        </div>
      </div>

      {fields.length > 0 && (
        <div
          className="grid mt-6"
          style={{
            gridTemplateColumns: 'auto 1fr',
            columnGap: 16,
            rowGap: 3,
            fontFamily: font.mono,
            fontSize: 6.5,
            letterSpacing: '0.04em',
            color: inkAt(0.85),
          }}
        >
          {fields.map((field) => (
            <div key={field.label} className="contents">
              <span style={{ color: inkAt(0.45), textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 6 }}>
                {field.label}
              </span>
              <span>{field.value}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className="mt-5 flex-1"
        style={{ fontFamily: font.text, fontSize: 7.5, lineHeight: 1.6, color: inkAt(0.88), letterSpacing: '0.005em' }}
      >
        {children}
        <p style={{ margin: '0 0 7px 0' }}>{signoff}</p>
        <div style={{ marginTop: 12 }}>
          {signature && (
            <span className="block [&_svg]:h-[22px] [&_svg]:w-auto" style={{ margin: '6px 0 4px' }}>
              {signature}
            </span>
          )}
          <div style={{ fontFamily: font.display, fontSize: 8, fontWeight: 600, letterSpacing: '0.02em' }}>
            {brand.identity.founder}
          </div>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 6,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: inkAt(0.55),
              marginTop: 2,
            }}
          >
            {brand.identity.role}
          </div>
        </div>
      </div>

      <div
        className="mt-auto pt-2 flex justify-between"
        style={{
          fontFamily: font.mono,
          fontSize: 5.5,
          letterSpacing: '0.18em',
          color: inkAt(0.45),
          textTransform: 'uppercase',
          borderTop: '0.5px solid rgba(19,19,22,0.18)',
        }}
      >
        <span>{brand.legal.entity} · Kt. {brand.legal.kt}</span>
        <span>{brand.contact.web}</span>
        <span>{page}</span>
      </div>
    </div>
  )
}

/** Deprecated alias — the forks' name for LetterheadCorrespondence. */
export const LetterheadB = LetterheadCorrespondence

/**
 * EmailSignature — mark, rule, name and contact line.
 *
 * @param {ReactNode} mark - The brand mark, in a 16-unit square
 * @param {Object} info - Partial override of DEFAULT_BRAND_INFO — reads identity.founder, identity.name, contact.email, contact.web
 * @param {Object} palette - Partial override of DEFAULT_STATIONERY_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_STATIONERY_FONTS
 * @param {ReactNode} role - The line under the name; unset, it composes identity.role and identity.name
 * @param {string} className - Extra classes on the block
 */
export function EmailSignature({ mark, info, palette, fonts, role, className = '' }) {
  const [brand, pal, font] = resolve(info, palette, fonts)
  return (
    <div
      className={`flex items-center gap-6 p-6 rounded-sm ${className}`.trim()}
      style={{ background: pal.paper, color: pal.ink }}
    >
      <div className="h-16 w-16 flex items-center justify-center [&_svg]:w-auto [&_svg]:h-full">{mark}</div>
      <div className="border-l h-16" style={{ borderColor: 'rgba(0,0,0,0.12)' }} />
      <div style={{ color: pal.ink }}>
        <p style={{ fontFamily: font.display, fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>
          {brand.identity.founder}
        </p>
        <p style={{ ...capsStyle(font), fontSize: 9, opacity: 0.6, marginTop: 2 }}>
          {role ?? `${brand.identity.role} · ${brand.identity.name}`}
        </p>
        <p style={{ fontFamily: font.mono, fontSize: 10, marginTop: 8, lineHeight: 1.5, letterSpacing: '0.04em' }}>
          <span style={{ opacity: 0.6 }}>{brand.contact.email}</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>·</span>
          <span style={{ opacity: 0.6 }}>{brand.contact.web}</span>
        </p>
      </div>
    </div>
  )
}
