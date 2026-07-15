import { isValidElement } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

/**
 * Button — canonical KOL button. Emits kol-btn* classes (CSS in @kol/theme).
 *
 * Supports link (href) and button (onClick / default) forms with optional
 * icons (left / right / icon-only), per-icon hover swap, and a selected
 * (toggle) state.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'accent'|'outline'|'ghost'|'danger'|'grey'|'control'} props.variant - Visual variant. `danger` is the destructive treatment (--ui-error fill); `control` is an alias for `ghost` (legacy call-sites).
 * @param {'sm'|'md'|'lg'} props.size - Button size (default: 'md')
 * @param {string} props.iconLeft - Icon name to display on the left
 * @param {string} props.iconRight - Icon name to display on the right
 * @param {string} props.iconLeftHover - Icon to show on hover (left position)
 * @param {string} props.iconRightHover - Icon to show on hover (right position)
 * @param {string} props.iconOnly - Icon name for icon-only button
 * @param {string} props.iconOnlyHover - Icon to show on hover (icon-only)
 * @param {boolean} props.animateIcon - Disable default hover states to focus on icon animation
 * @param {boolean} props.quiet - Dimmed at rest, brightens on hover; stays dimmed when disabled. For secondary icon-only chrome.
 * @param {number} props.iconSize - Size of the icon in pixels (default: auto by size)
 * @param {number} props.iconGap - Gap between icon and text (default: 8)
 * @param {string} props.href - Link destination (makes it an <a>)
 * @param {Function} props.onClick - Click handler (makes it a <button>)
 * @param {string} props.className - Additional classes
 * @param {Object} props.style - Inline styles
 * @param {string} props.type - Button type attribute (default: 'button')
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.selected - Selected/active state (toggle highlight)
 * @param {ElementType|ReactNode} props.iconComponent - Icon renderer seam — a component that receives `{ name, size, className, style }` in place of the DS Icon (custom icon registries plug in here), or a pre-rendered node dropped in verbatim where the glyph would go. Defaults to DS Icon.
 * @param {boolean} props.pressed - Toggle state — sets `aria-pressed` (true/false) and `kol-btn-pressed`; a `quiet` button drops its dimming while pressed. Leave undefined for non-toggle buttons.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  iconLeftHover,
  iconRightHover,
  iconOnly,
  iconOnlyHover,
  animateIcon = false,
  quiet = false,
  iconSize,
  iconGap,
  href,
  onClick,
  className = '',
  style = {},
  type = 'button',
  disabled = false,
  selected = false,
  iconComponent,
  pressed,
  ...props
}) => {
  const resolvedIconSize = iconSize ?? (size === 'sm' ? 14 : size === 'lg' ? 18 : 16)

  // `control` is a legacy alias for `ghost` (kept so web call-sites passing
  // variant="control" keep working post-migration).
  const resolvedVariant = variant === 'control' ? 'ghost' : variant

  const variantClass = resolvedVariant === 'primary'
    ? 'kol-btn-primary'
    : resolvedVariant === 'accent'
    ? 'kol-btn-accent'
    : resolvedVariant === 'outline'
    ? 'kol-btn-outline'
    : resolvedVariant === 'ghost'
    ? 'kol-btn-ghost'
    : resolvedVariant === 'danger'
    ? 'kol-btn-danger'
    : resolvedVariant === 'grey'
    ? 'kol-btn-grey'
    : 'kol-btn-secondary'

  // Add size class — pairs the padding rule with its mono type class.
  const sizeClass = size === 'sm'
    ? 'kol-btn-sm kol-mono-12'
    : size === 'lg'
    ? 'kol-btn-lg kol-mono-16'
    : 'kol-btn-md kol-mono-14'

  // Add kol-btn-animate class if animateIcon is true to disable default hover states
  const animateClass = animateIcon ? 'kol-btn-animate' : ''
  // `selected` is a legacy alias of `pressed` — both express the aria-pressed
  // toggle-on state and render through .kol-btn-pressed. (The old
  // .kol-btn-selected class never had a CSS rule, so `selected` was a no-op.)
  // Resolve to one flag so the quiet-drop and the pressed fill agree.
  const isPressed     = pressed !== undefined ? pressed : selected
  const quietClass    = quiet && !isPressed ? 'kol-btn-quiet' : ''
  const pressedClass  = isPressed ? 'kol-btn-pressed' : ''

  // .kol-btn-icon replaces the old iconOnly INLINE style — inline display
  // beat every consumer utility (lg:hidden could never hide the button).
  const iconOnlyClass = iconOnly ? 'kol-btn-icon' : ''
  const combinedClass = `kol-btn ${variantClass} ${sizeClass} ${animateClass} ${quietClass} ${pressedClass} ${iconOnlyClass} ${className}`.trim().replace(/\s+/g, ' ')

  // Render icon with optional hover state
  const renderIcon = (iconName, iconHoverName) => {
    if (!iconName && !iconHoverName) return null

    // Icon injection seam — a component type resolves names against a custom
    // registry (EditorIcon etc.); a pre-rendered node drops in verbatim.
    if (isValidElement(iconComponent)) return iconComponent
    const IconCmp = iconComponent || Icon

    // If no hover icon, render single icon
    if (!iconHoverName) {
      return <IconCmp name={iconName} size={resolvedIconSize} />
    }

    // Render both default and hover icons with positioning
    return (
      <span className="kol-icon-swap-container" style={{ position: 'relative', display: 'inline-flex', width: resolvedIconSize, height: resolvedIconSize, overflow: 'hidden' }}>
        <IconCmp
          name={iconName}
          size={resolvedIconSize}
          className="kol-icon-default"
          style={{ position: 'absolute' }}
        />
        <IconCmp
          name={iconHoverName}
          size={resolvedIconSize}
          className="kol-icon-hover"
          style={{ position: 'absolute' }}
        />
      </span>
    )
  }

  // Render content with icons
  const renderContent = () => {
    // Icon-only button
    if (iconOnly) {
      return renderIcon(iconOnly, iconOnlyHover)
    }

    // Button with icon(s) and text. Icons render directly as flex items —
    // wrapper spans (with the old -2px optical margins) sat the glyphs on
    // the span's text baseline instead of letting align-items center them
    // against the label.
    if (iconLeft || iconRight || iconLeftHover || iconRightHover) {
      return (
        <span className="flex items-center" style={{ gap: iconGap ?? 8 }}>
          {(iconLeft || iconLeftHover) && renderIcon(iconLeft, iconLeftHover)}
          {children}
          {(iconRight || iconRightHover) && renderIcon(iconRight, iconRightHover)}
        </span>
      )
    }

    // Text-only button
    return children
  }

  const mergedStyle = style

  // Render as button
  if (onClick || !href) {
    return (
      <button
        onClick={onClick}
        type={type}
        className={combinedClass}
        style={mergedStyle}
        disabled={disabled}
        aria-pressed={pressed !== undefined ? pressed : (selected ? true : undefined)}
        aria-label={iconOnly ? (props['aria-label'] || 'Button') : undefined}
        {...props}
      >
        {renderContent()}
      </button>
    )
  }

  // Render as link
  return (
    <a
      href={href}
      className={combinedClass}
      style={mergedStyle}
      aria-label={iconOnly ? (props['aria-label'] || 'Link') : undefined}
      {...props}
    >
      {renderContent()}
    </a>
  )
}

export default Button
