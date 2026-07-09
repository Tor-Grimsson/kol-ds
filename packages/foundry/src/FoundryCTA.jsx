import { Button } from '@kolkrabbi/kol-component'

/**
 * FoundryCTA — reusable centered call-to-action band for foundry pages: a
 * divider line, heading, description, and one or more action buttons.
 *
 * Router-severed: the package does not depend on react-router. Pass an injected
 * `linkComponent` (e.g. your router's `Link`) to wrap each action — it receives
 * a `to` prop. When omitted, actions render as a plain `<a href>` opening in a
 * new tab. Report: replaced the monorepo's `useInRouterContext()` probe with
 * this prop.
 *
 * Text casing: heading, description and labels render verbatim as authored.
 *
 * @param {string} props.heading - Main heading text.
 * @param {string} props.description - Description below the heading.
 * @param {Object|Array} props.action - One action object or an array: { to, label, variant? }.
 * @param {string} props.className - Additional section classes.
 * @param {React.ElementType} props.linkComponent - Optional link wrapper (receives `to`); defaults to `<a href>`.
 */
const FoundryCTA = ({
  heading,
  description,
  action,
  className = '',
  linkComponent
}) => {
  const actions = Array.isArray(action) ? action : [action]
  const LinkEl = linkComponent || 'a'

  return (
    <section className={`w-full py-24 ${className}`}>
      <div className="max-w-[900px] mx-auto text-center space-y-8">
        <div className="reveal w-32 h-[1px] bg-fg-24 mx-auto" style={{ '--reveal-delay': '0s' }} />

        <h2 className="reveal kol-heading-lg text-auto" style={{ '--reveal-delay': '0.1s' }}>
          {heading}
        </h2>

        <p className="reveal kol-mono-text text-fg-64 max-w-[600px] mx-auto" style={{ '--reveal-delay': '0.2s' }}>
          {description}
        </p>

        <div className={`reveal pt-4 ${actions.length > 1 ? 'flex flex-col sm:flex-row gap-4 justify-center' : ''}`} style={{ '--reveal-delay': '0.3s' }}>
          {actions.map((act, index) => {
            const isPrimary = act.variant !== 'secondary'
            const linkProps = linkComponent
              ? { to: act.to }
              : { href: act.to, target: '_blank', rel: 'noreferrer noopener' }
            return (
              <LinkEl key={index} {...linkProps}>
                <Button
                  variant={isPrimary ? 'primary' : 'outline'}
                  size="md"
                  uppercase={true}
                >
                  {act.label}
                </Button>
              </LinkEl>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FoundryCTA
