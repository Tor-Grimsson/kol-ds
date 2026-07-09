import { TiltCard, Button, SectionLabel } from '@kolkrabbi/kol-component'

/**
 * FoundryFeatureSection — a generic split feature block: a visual on one side, a
 * label / title / description / CTA on the other, sides swappable via
 * `imagePosition`. The visual is a `graphic` slot if provided, else a TiltCard
 * over `imageSrc`.
 *
 * TiltCard, Button and SectionLabel are published DS components pulled from
 * `@kolkrabbi/kol-component` (report: the monorepo imported TiltCard from an
 * app-local path; repointed to the DS package rather than dropping, since the
 * component is genuinely available there).
 *
 * Router-severed: the CTA is wrapped by an injected `linkComponent` (receives
 * `to`), defaulting to a plain `<a href>` (report: replaced `react-router-dom`
 * `Link`).
 *
 * Text casing: label, title, description and CTA label render verbatim.
 */
const FoundryFeatureSection = ({
  imageSrc,
  imageAlt = '',
  imageClassName = 'w-full aspect-[5/4] rounded-[4px]',
  imagePosition = 'left',
  label,
  labelSize = 'md',
  title,
  description,
  sectionClassName = '',
  titleClassName = 'kol-heading-lg mb-6',
  descriptionClassName = 'kol-mono text-fg-64 leading-relaxed mb-6',
  cta,
  children,
  graphic,
  graphicWrapperClassName = 'w-full lg:flex-1',
  contentWrapperClassName = 'w-full lg:flex-1 py-16',
  contentWrapperStyle,
  linkComponent,
}) => {
  const isImageRight = imagePosition === 'right'
  const LinkEl = linkComponent || 'a'
  const ctaLinkProps = linkComponent ? { to: cta?.to } : { href: cta?.to }

  const renderVisual = () => {
    if (graphic) {
      return graphic
    }

    if (imageSrc) {
      return (
        <TiltCard
          src={imageSrc}
          alt={imageAlt}
          className={imageClassName}
        />
      )
    }

    return null
  }

  return (
    <div className={`flex flex-col gap-8 lg:gap-16 py-8 lg:py-16 ${isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} ${sectionClassName}`}>
      <div className={graphicWrapperClassName}>
        {renderVisual()}
      </div>

      <div className={contentWrapperClassName} style={contentWrapperStyle}>
        {label && (
          <div className="inline-flex w-auto mb-2">
            <SectionLabel className="inline-flex w-auto whitespace-nowrap" text={label} size={labelSize} />
          </div>
        )}

        {title && (
          <h2 className={titleClassName}>
            {title}
          </h2>
        )}

        {description && (
          <p className={descriptionClassName}>
            {description}
          </p>
        )}

        {children}

        {cta?.label && cta?.to && (
          <LinkEl {...ctaLinkProps} className="inline-flex">
            <Button
              id={cta.id}
              iconLeft={cta.icon}
              size={cta.size || 'md'}
              variant={cta.variant || 'primary'}
              className={cta.className || 'mt-12 mb-3'}
            >
              {cta.label}
            </Button>
          </LinkEl>
        )}
      </div>
    </div>
  )
}

export default FoundryFeatureSection
