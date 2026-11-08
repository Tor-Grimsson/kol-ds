import { Icon } from '@kolkrabbi/kol-icons'

/**
 * Label — minimal form label. Inherits typography from parent (consumer
 * supplies `kol-helper-N` or similar via className when needed). Defaults
 * to `text-fg-48` for the muted-control look.
 *
 * @param {string} icon  a kol-icons name, drawn before the text at the label's own size (1em) — never a text glyph
 */
export default function Label({ children, htmlFor, icon, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`text-fg-48 ${icon ? 'inline-flex items-center gap-1 ' : ''}${className}`}>
      {icon && <Icon name={icon} size="1em" />}
      {children}
    </label>
  )
}
