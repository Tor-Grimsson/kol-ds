import { isValidElement, useContext } from 'react'
import { toneClass, VARIANT_TONE } from '../utilities/tone.js'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { glyphSize } from '../hooks/glyphLadders.js'
import Kbd from './Kbd.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'
import { InTooltipKolbox, Tooltip } from '../utilities/Popover.jsx'

/**
 * Button — canonical KOL button. Emits kol-btn* classes (CSS in @kol/theme).
 *
 * Supports link (href) and button (onClick / default) forms with optional
 * icons (left / right / icon-only), per-icon hover swap, and a selected
 * (toggle) state.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Button content
 * @param {'accent'|'danger'|'nav'|'tab'|'tab-filled'|'bare'} props.variant - `bare` is a pressable surface with no button chrome (a tile, a bar row — the caller draws it). The intent; the GROUND is `tone`. `tab` is the tab chip (2026-10-02): quiet text at rest, a soft filled chip while `pressed`. `tab-filled` (2026-10-29) shows its chip at rest (oq-04), brighter on hover (oq-08) and brightest selected (oq-16). `float` (FloatingStyleAndSignInDemos; round 3's values, W16 2026-10-31) is the shape only: a capsule whose height and type step together — sm · md · lg 28 · 36 · 44 with 12 · 13 · 14 type and an 18 glyph, on `pointer: coarse` 36 · 44 · 52, 15 · 16 type and a 20 glyph; icon-only is the square; the ground stays the `tone`'s, the surface is the float it sits on. A composed float component (AppFloatNav, AccountForm's box) passes it, a consumer never sets it by hand. `primary · secondary · outline · ghost · grey · control` are deprecated aliases of tones (2026-10-01, on the retirement ledger): pass `tone` — `secondary` is `tone="inverted"`, `control` is `tone="ghost"`, the rest keep their name. Visual variant. UNSET (the default) inherits the tone of the nearest `kol-tone-*` wrapper, else renders primary; the five ground variants are aliases of `tone`. `danger` is the destructive treatment (--ui-error fill); `nav` is the chrome rung — transparent, oq-64 ink, one step brighter than `ghost`; `control` is an alias for `ghost` (legacy call-sites).
 * @param {'xs'|'sm'|'md'|'lg'} props.size - Button size (default: 'md'); xs is the panel rung (ControlsXsRung, 2026-09-01) — kol-mono-8 in a 22px shell (20 icon-only), opt-in by prop
 * @param {string} props.iconLeft - Icon name to display on the left
 * @param {string} props.iconRight - Icon name to display on the right
 * @param {string} props.iconLeftHover - Icon to show on hover (left position)
 * @param {string} props.iconRightHover - Icon to show on hover (right position)
 * @param {'primary'|'secondary'|'inverted'|'outline'|'ghost'|'grey'|'sunken'} props.tone - the ground (`secondary` = the page surface, `inverted` = the text color as fill — what `variant="secondary"` paints) (tone-is-the-ground-axis, 2026-09-03) — wins over `variant` on the same element; unset = inherit the wrapper's. `sunken` = the control set's dark well + fg-96 ink (ControlToneSunken); `inverse` aliased
 * @param {string} props.iconOnly - Icon name for icon-only button
 * @param {string} props.iconOnlyHover - Icon to show on hover (icon-only)
 * @param {boolean} props.animateIcon - Disable default hover states to focus on icon animation
 * @param {boolean} props.quiet - Dimmed at rest, brightens on hover; stays dimmed when disabled. For secondary icon-only chrome.
 * @param {number} props.iconSize - Size of the icon in pixels (default: auto by size — SOLO when iconOnly, ADJACENT otherwise)
 * @param {'sm'|'full'} props.radius - sm (default, the system's radius token) | full (a full round). Two values, nothing between — mirrors IconFrame, and a round control is its own chrome idiom (edge-straddling controls, avatars), the only sanctioned exception to the hard radius invariant.
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
 * @param {'kolbox'} props.variant - also `kolbox` (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18): kolbox's button, `--kol-kolbox-ctl` high (24), 12 in, radius 4, a 1px line, Inter 12 / 16 / 500, one size. Its grounds are tones: `primary` the accent with the on-accent ink (110% brightness on hover), `secondary` (also unset) the oq-16 field with the oq-24 line (the line's oq-24 on hover), `ghost` bare in oq-64 (the field and the ink on hover); `pressed` is its lit look (the accent tint, the accent ink) and sets aria-pressed. `iconLeft` is a 16 glyph 8 off the label. With `iconOnly` it is kolbox's icon button: a 28 box, the glyph in oq-64, the ink on hover over a 28 oq-16 frame drawn centred on the glyph, so a caller may set a 16 or 24 box and the frame still lights 28; `pressed` lights the frame in the accent tint with the accent glyph; `aria-pressed` is always set; `children` stand in for a glyph that is not an icon. The glyph is your icons by the set's name at 16 with the stroke lift (`.kol-kolbox-icon`, KolboxGlyph); `iconComponent` is not read here (C9.2: kolbox's data carries the set's names).
 * @param {'folio'} props.variant - also `folio` (Folio migration batch A, 2026-11-22): Folio's buttons carried class for class, the chrome in kol-theme `.kol-btn--folio` and `.kol-icon-btn--folio`, the colors Folio's (`--kol-folio-*`). `size` picks the shape: `md` (default) Folio's editor tool, 32 high, 10 in, radius 3, Inter 11, a 16 `iconLeft` 8 off the label; `lg` Folio's page action, 42 high, 16 in, radius 3, a 1px line, the label 12 / 600 and its `glyph` (a character, 16) 12 after it. Grounds are tones: `ghost` (md's default) bare in the ink, the surface on hover; `outline` (lg's default) the paper with the rule line; `primary` the accent fill with the paper ink. `pressed` is its lit look (the accent's soft ground and strong ink) and sets aria-pressed. With `iconOnly` it is Folio's tool icon: a 32 square at radius 4, the glyph 20, the paper on hover, lit when `pressed`. A press does not take the focus (`mousedown` is prevented), so the editor's selection stays.
 * @param {string} props.glyph - folio `lg` only: the character after the label (`+`, `⌄`, `→`)
 * @param {string} props.kbd - a key cap after the label, inside the button (float-everything W2 row 12, 2026-11-04): `Kbd size="sm"`, a leading ⌘ drawn as the `command` icon. On `variant="float"` the cap takes the button's own ink (`.kol-btn-kbd`). The float roles are tones (W0.5): primary `tone="inverted"` · secondary `tone="secondary"` · quiet `tone="ghost"` · destructive `tone="danger"` — `danger` is accepted as a tone on a float button so the role and the shape are two props.
 */
const warned = new Set()
/* kolbox's grounds, by KOL's tone names; unset is its secondary. `outline` the line with no fill (Figma's browser
   top bar: Share, the adjust and star boxes, 2026-11-23) */
const KOLBOX_TONES = ['primary', 'secondary', 'outline', 'ghost']
/* Folio's three grounds; unset is the shape's own (md ghost, lg outline) */
const FOLIO_TONES = ['primary', 'outline', 'ghost']

const Button = ({
  children,
  variant,
  size = 'md',
  iconLeft,
  iconRight,
  iconLeftHover,
  iconRightHover,
  iconOnly,
  iconOnlyHover,
  radius = 'sm',
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
  tone = 'default',
  kbd,
  glyph,
  ...props
}) => {
  /* an icon-only kolbox button names itself in a tooltip unless it already sits in one */
  const inTip = useContext(InTooltipKolbox)
  /* `variant="bare"` (MetricRebuild, 2026-10-31): a pressable SURFACE — a stat tile, a bar row, a column head — that
   * draws itself. No kol-btn chrome (ground, size, type, radius); the button keeps its type, the KOL focus ring
   * (`kol-menu-btn`, as MenuItem's rows) and `disabled`;
   * `kol-menu-btn--bare` keeps it out of the touch rung, so its type holds on every pointer. For a control that looks like a button, use any other variant. */
  if (variant === 'bare') {
    return <button type={type} onClick={onClick} disabled={disabled} className={`kol-menu-btn kol-menu-btn--bare ${className}`.trim()} style={style} {...props}>{children}</button>
  }
  /* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18): kolbox's Button and IconButton carried
   * class for class, the chrome in kol-theme `.kol-btn--kolbox` and `.kol-icon-btn--kolbox`. */
  if (variant === 'kolbox') {
    const on = Boolean(pressed !== undefined ? pressed : selected)
    /* your icons as kolbox draws them (KolboxGlyph: the stroke lift, every chevron 12 at the dock chevron's stroke) */
    const glyph = (name) => <KolboxGlyph name={name} />
    /* IconButton: a box at the kolbox control height (`--kol-kolbox-ctl`, 24) whose hover and pressed fill is its own
       layer (::before) at the same height, centred on the glyph, so a caller's 16 box keeps its size in the layout and
       still lights 24 */
    if (iconOnly) {
      const tip = !inTip && props['aria-label'] && props['aria-hidden'] == null ? props['aria-label'] : null
      const btn = (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          style={style}
          aria-pressed={on}
          className={`kol-icon-btn--kolbox${on ? ' is-pressed' : ''} relative inline-flex size-(--kol-kolbox-ctl) shrink-0 items-center justify-center outline-none focus-visible:outline-solid focus-visible:outline-1 disabled:opacity-40 disabled:pointer-events-none isolate before:absolute before:top-1/2 before:left-1/2 before:-z-10 before:size-(--kol-kolbox-ctl) before:-translate-1/2 before:content-[''] ${className}`}
          {...props}
        >
          {children ?? glyph(iconOnly)}
        </button>
      )
      return tip ? <Tooltip variant="kolbox" asChild label={tip}>{btn}</Tooltip> : btn
    }
    const look = on ? 'lit' : KOLBOX_TONES.includes(tone) ? tone : 'secondary'
    /* the secondary tone is fill only, no border in any state (W15.4, his "I dont like borders with fill") */
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={style}
        aria-pressed={pressed}
        className={`kol-btn--kolbox kol-btn--kolbox-${look} inline-flex h-(--kol-kolbox-ctl) shrink-0 items-center justify-center gap-2 ${look === 'secondary' ? 'border-0' : 'border'} px-3 whitespace-nowrap outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-1 disabled:opacity-40${look === 'primary' ? ' enabled:hover:brightness-110' : ''} ${className}`}
        {...props}
      >
        {iconLeft && glyph(iconLeft)}
        {children}
      </button>
    )
  }
  /* `variant="folio"` (Folio migration batch A, 2026-11-22): Folio's Action, Tool and ToolIcon carried class for class
   * (apps/folio parts.jsx, EditorChrome.jsx), the chrome in kol-theme `.kol-btn--folio` and `.kol-icon-btn--folio`. */
  if (variant === 'folio') {
    const on = pressed !== undefined ? pressed : (selected || undefined)
    const keep = (e) => e.preventDefault()
    if (iconOnly) {
      return (
        <button type={type} onMouseDown={keep} onClick={onClick} disabled={disabled} style={style} aria-pressed={on} {...props} className={`kol-icon-btn--folio flex size-[32px] shrink-0 items-center justify-center rounded-[4px] ${className}`}>
          {children ?? <IconLoader name={iconOnly} size={20} />}
        </button>
      )
    }
    const look = FOLIO_TONES.includes(tone) ? tone : size === 'lg' ? 'outline' : 'ghost'
    if (size === 'lg') {
      return (
        <button type={type} onClick={onClick} disabled={disabled} style={style} aria-pressed={on} {...props} className={`kol-btn--folio kol-btn--folio-lg kol-btn--folio-${look} flex h-[42px] shrink-0 items-center gap-[12px] whitespace-nowrap rounded-[3px] border px-[16px] ${className}`}>
          <span className="kol-btn-label">{children}</span>
          <span className="kol-btn-glyph">{glyph}</span>
        </button>
      )
    }
    return (
      <button type={type} onMouseDown={keep} onClick={onClick} disabled={disabled} style={style} aria-pressed={on} {...props} className={`kol-btn--folio kol-btn--folio-md kol-btn--folio-${look} flex h-[32px] shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[3px] px-[10px] disabled:opacity-30 ${className}`}>
        {iconLeft && <IconLoader name={iconLeft} size={16} />}{children}
      </button>
    )
  }
  // Two ladders, split on whether a label sits beside the glyph. An icon-only
  // button is a solo glyph in a pinned square, so it takes SOLO (16/20/24) —
  // it took the text-adjacent ladder until component 0.20.0, which put a 14px
  // glyph in a 28px square at `sm`. `iconSize` still overrides either.
  /* a float glyph follows the pointer (18, 20 on touch — `--kol-float-ic`), so its size is the token, not a number */
  /* …except a chevron or caret: LAW 9 (the user, 2026-11-12: *"USE 12px chevron"*), the float chevron token per size
     (12 · 12 · 16, touch 14 · 14 · 18), the same as the Dropdown and the fold. Only when every glyph is one. */
  const glyphs = [iconOnly, iconLeft, iconRight].filter(Boolean)
  const chevronOnly = glyphs.length > 0 && glyphs.every((g) => /^(chevron|caret)/.test(g))
  const resolvedIconSize = iconSize ?? (variant === 'float' ? (chevronOnly ? `var(--kol-float-chev-${size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'})` : 'var(--kol-float-ic)') : glyphSize(size, Boolean(iconOnly)))

  // `control` is a legacy alias for `ghost` (kept so web call-sites passing
  // variant="control" keep working post-migration).
  const resolvedVariant = variant === 'control' ? 'ghost' : variant

  /* THE GROUND IS A TONE (tone-is-the-ground-axis, 2026-09-03). No variant →
   * NO class: the button paints from the `--kol-tone-*` properties it inherits
   * from a toned wrapper, else the theme's primary fallback — that is how a
   * set gets its tone "already set". An explicit variant stamps its class,
   * which is an alias of the tone (primary · secondary · outline · ghost ·
   * grey) or its own bundle (nav · danger · accent); `nav` is ghost's chrome
   * rung, oq-80 ink + aria-current — it had lived in the theme with no
   * component able to emit it, the direct cause of the four-container header. */
  /* An UNKNOWN variant is a typo, not a request for the inverted fill — it fell back to
   * `kol-btn-secondary` (the text color as fill) until 2026-09-29, so a misspelt variant
   * shipped inverted. It now stamps nothing, like an unset variant: the wrapper's tone,
   * else primary — and says so in dev. */
  /* the six tone-duplicates still render exactly as they did — an alias gains nothing and loses
   * nothing — and say once in dev what replaces them */
  if (import.meta.env.DEV && VARIANT_TONE[variant] && !warned.has(variant)) {
    warned.add(variant)
    console.warn(`Button: variant="${variant}" is deprecated — use tone="${VARIANT_TONE[variant]}"`)
  }
  const KNOWN = ['primary', 'secondary', 'accent', 'outline', 'ghost', 'nav', 'tab', 'tab-filled', 'danger', 'grey', 'float']
  const known = !resolvedVariant || KNOWN.includes(resolvedVariant)
  if (!known && import.meta.env.DEV) console.warn(`Button: unknown variant "${resolvedVariant}" — rendering the inherited tone (primary)`)
  const variantClass = resolvedVariant && known ? `kol-btn-${resolvedVariant}` : ''

  // Add size class — pairs the padding rule with its mono type class.
  const sizeClass = size === 'sm'
    ? 'kol-btn-sm kol-mono-12'
    : size === 'xs'
    ? 'kol-btn-xs kol-mono-8'
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

  // `sm` is the default and carries no class — it's on .kol-btn itself.
  // The rule for `full` is shared with .kol-icon-frame-radius-full, one
  // selector, so the two controls can never disagree on the value.
  const radiusClass   = radius === 'full' ? 'kol-btn-radius-full' : ''
  /* `tone="sunken"` (ControlToneSunken, 2026-08-28): the dark well + fg-96 ink of the control set, so an
   * icon-only button beside a sunken Dropdown is declared, not painted (kol-website hand-wrote the fill
   * AND guessed the ink — the secondary's dark ink vanished on the forced dark fill). Theme rules. */
  /* `tone="danger"` is the float's destructive role (W0.5): the danger bundle is a variant's, worn here as a tone so
   * `variant="float"` keeps the shape slot */
  const toneCls       = tone === 'danger' ? 'kol-btn-danger' : toneClass(tone)
  const combinedClass = `kol-btn ${variantClass} ${sizeClass} ${animateClass} ${quietClass} ${pressedClass} ${iconOnlyClass} ${radiusClass} ${toneCls} ${className}`.trim().replace(/\s+/g, ' ')

  // Render icon with optional hover state
  const renderIcon = (iconName, iconHoverName) => {
    if (!iconName && !iconHoverName) return null

    // Icon injection seam — a component type resolves names against a custom
    // registry (EditorIcon etc.); a pre-rendered node drops in verbatim.
    if (isValidElement(iconComponent)) return iconComponent
    const IconCmp = iconComponent || IconLoader

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

  /* the key cap after the label (row 12): ⌘ is drawn, never typed — the Kbd's `command` glyph */
  const cap = kbd != null && (
    typeof kbd === 'string' && kbd.startsWith('⌘')
      ? <Kbd size="sm" icon="command" className="kol-btn-kbd">{kbd.slice(1)}</Kbd>
      : <Kbd size="sm" className="kol-btn-kbd">{kbd}</Kbd>
  )

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
          {cap}
        </span>
      )
    }

    // Text-only button
    return cap ? <>{children}{cap}</> : children
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
