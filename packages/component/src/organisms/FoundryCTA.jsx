import Button from '../atoms/Button.jsx'
import SectionCta from './SectionCta.jsx'

/* taxonomy-ok: nests component's Button */

/**
 * @deprecated 2026-08-26 — `FoundryCTA` is `SectionCta variant="centered"`
 * (SectionHeroRound2: a second way to render SectionText). Same render; the
 * `action` object(s) become Buttons. Alias kept; removed at the next major.
 *
 * @param {ReactNode} heading · description
 * @param {Object|Array} action    one {href, label, variant?, target?, rel?} or an array
 * @param {Function}  onNavigate   (href, event) => void
 */
export default function FoundryCTA({ heading, description, action, onNavigate, className = '' }) {
  const actions = (Array.isArray(action) ? action : [action]).filter(Boolean)
  return (
    <SectionCta
      variant="centered"
      headline={heading}
      body={description}
      className={className}
      actions={actions.length > 0 ? actions.map((act, i) => (
        <Button
          key={i}
          variant={act.variant === 'secondary' ? 'outline' : 'primary'}
          size="md"
          href={act.href}
          target={act.target}
          rel={act.rel}
          onClick={onNavigate ? (e) => onNavigate(act.href, e) : undefined}
        >
          {act.label}
        </Button>
      )) : undefined}
    />
  )
}
