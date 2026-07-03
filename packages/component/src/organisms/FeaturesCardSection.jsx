import CardFeatureItem from '../molecules/CardFeatureItem.jsx'

/**
 * FeaturesCardSection — the "N-up feature cards" band: an optional two-part
 * header (heading + mono lede) over a responsive row of CardFeatureItem
 * cards, capped by an optional centered CTA row. Cards stack column-wise
 * below `md` and become a fixed-height row at `md`+; swap
 * `cardsWrapperClassName` for a grid to change the layout.
 *
 * Fully prop-driven — no default copy, images, or routes live here; every
 * block is presence-gated (header on `headerLabel`/`headerDescription`,
 * cards on `features.length`, CTA row on `ctas`), so omitted slots emit no
 * empty nodes. `ctas` is conventionally a row of KOL Buttons (composition
 * dependency — nothing is imported here). Card links are plain anchors;
 * pass `onNavigate` to intercept same-tab navigations in an SPA.
 *
 * Header, lede, and card text render exactly as authored — no casing
 * transforms; author strings in their final case at the call site.
 *
 * @param {{title, icon, visual, description, href, backgroundColor, imageAspectRatio}[]} features
 *                                          cards rendered as CardFeatureItem molecules
 * @param {ReactNode} headerLabel           heading (kol-sans-heading-03)
 * @param {ReactNode} headerDescription     mono lede under the heading
 * @param {ReactNode} ctas                  centered CTA row (a row of Buttons, authored by the caller)
 * @param {Function}  onNavigate            (event, feature) => void — same-tab card-link seam (SPA intercept)
 * @param {string}    sectionClassName      extra classes on the <section>
 * @param {string}    wrapperClassName      outer column container
 * @param {string}    cardsWrapperClassName card row (default) or grid container
 * @param {string}    ctasClassName         CTA row padding
 * @param {string}    headerClassName       header container
 * @param {string}    headerTextWidthClass  lede measure
 */
export default function FeaturesCardSection({
  features = [],
  headerLabel,
  headerDescription,
  ctas,
  onNavigate,
  sectionClassName = '',
  wrapperClassName = 'w-full flex flex-col gap-8 md:gap-10 max-w-[1400px] mx-auto',
  cardsWrapperClassName = 'self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6',
  ctasClassName = 'pt-10 pb-24',
  headerClassName = 'w-full pt-[224px]',
  headerTextWidthClass = 'w-full md:w-[30%]',
}) {
  return (
    <section className={`w-full ${sectionClassName}`.trim()}>
      <div className={wrapperClassName}>
        {(headerLabel || headerDescription) && (
          <div className={headerClassName}>
            {headerLabel && (
              <div className="flex items-center h-8">
                <p className="kol-sans-heading-03">{headerLabel}</p>
              </div>
            )}
            {headerDescription && (
              <p className={`kol-mono-14 text-fg-64 mt-3 ${headerTextWidthClass}`.trim()}>
                {headerDescription}
              </p>
            )}
          </div>
        )}

        {features.length > 0 && (
          <div className={cardsWrapperClassName}>
            {features.map((feature, index) => (
              <CardFeatureItem
                key={index}
                title={feature.title}
                icon={feature.icon}
                visual={feature.visual}
                description={feature.description}
                href={feature.href}
                backgroundColor={feature.backgroundColor}
                imageAspectRatio={feature.imageAspectRatio}
                onNavigate={onNavigate ? (event) => onNavigate(event, feature) : undefined}
              />
            ))}
          </div>
        )}

        {ctas && (
          <div className={`w-full flex flex-wrap items-center justify-center gap-4 ${ctasClassName}`.trim()}>
            {ctas}
          </div>
        )}
      </div>
    </section>
  )
}
