import { isValidElement } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'

/**
 * Button — canonical KOL button. Emits kol-btn* classes (CSS in @kol/theme).
 *
 * Supports link (href) and button (onClick / default) forms with optional
 * icons (left / right / icon-only), per-icon hover swap, and a selected
 * (toggle) state.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'accent'|'outline'|'ghost'|'control'} props.variant - Visual variant. `control` is an alias for `ghost` (legacy call-sites).
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
    : 'kol-btn-secondary'

  // Add size class — pairs the padding rule with its mono type class.
  const sizeClass = size === 'sm'
    ? 'kol-btn-sm kol-mono-12'
    : size === 'lg'
    ? 'kol-btn-lg kol-mono-16'
    : 'kol-btn-md kol-mono-14'

  // Add kol-btn-animate class if animateIcon is true to disable default hover states
  const animateClass = animateIcon ? 'kol-btn-animate' : ''
  const quietClass    = quiet && !pressed ? 'kol-btn-quiet' : ''
  const selectedClass = selected ? 'kol-btn-selected' : ''
  const pressedClass  = pressed ? 'kol-btn-pressed' : ''

  const combinedClass = `kol-btn ${variantClass} ${sizeClass} ${animateClass} ${quietClass} ${selectedClass} ${pressedClass} ${className}`.trim().replace(/\s+/g, ' ')

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

  // Merge icon-only specific styles with user-provided styles
  const mergedStyle = iconOnly
    ? { lineHeight: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }
    : style

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
