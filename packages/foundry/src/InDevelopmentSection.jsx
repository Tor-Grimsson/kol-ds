import { FeaturesCardSection } from '@kolkrabbi/kol-component'

/**
 * InDevelopmentSection — showcases upcoming/in-development typefaces at reduced
 * opacity. Maps each typeface to a feature-card shape and delegates layout to
 * the DS `FeaturesCardSection` (report: pulled from `@kolkrabbi/kol-component`
 * — a published DS organism — rather than dropped). Renders nothing when the
 * list is empty.
 *
 * Text casing: title, description and mapped names render verbatim.
 *
 * @param {Object} props
 * @param {Array} props.typefaces - Upcoming typeface objects ({ name, subtitle, description }).
 * @param {string} props.title - Section title (default "In Development").
 * @param {string} props.description - Section description.
 */
const InDevelopmentSection = ({
  typefaces = [],
  title = "In Development",
  description = "Typefaces currently in progress"
}) => {
  if (!typefaces || typefaces.length === 0) return null

  // Map typeface data to feature card format
  const features = typefaces.map((typeface) => ({
    title: typeface.name,
    icon: 'foundation',
    description: `${typeface.subtitle} — ${typeface.description}`,
    visual: null, // No visual for in-development
    backgroundColor: 'bg-surface-secondary opacity-60'
  }))

  return (
    <FeaturesCardSection
      features={features}
      showHeader={true}
      headerLabel={title}
      headerDescription={description}
      showActions={false}
      sectionClassName="py-16"
      headerClassName="w-full mb-12"
      headerTextWidthClass="w-full"
      cardsWrapperClassName="self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6"
    />
  )
}

export default InDevelopmentSection
