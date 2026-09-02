import { useId, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import IconFrame from '../atoms/IconFrame.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import useSectionTheme from '../hooks/useSectionTheme.js'
import { surfaceClass } from '../utilities/sectionSurface.js'

/* taxonomy-ok: nests kol-icons's Icon (a package import the relative-import
 * check can't see). */

/**
 * ProfileCard — the digital namecard (ProfileCard, kol-website 2026-09-01;
 * carried class-for-class from `apps/web/src/components/ui/ProfileCard.jsx`):
 * a square photo with a disclosure control inset on it, and a SHELF that opens
 * under it (vertical) or beside it (horizontal) — logo, name, mailto, a rack of
 * socials. The shelf is `bg-surface-inverse` / `text-auto-inverse` at every
 * theme by default: the inverse of the page is the design, not a bug.
 *
 * THE SHELF HAS SEAMS (user, 2026-09-01: "is it dark in light mode? are there
 * light/dark or color variants on the shelf? variant on toggle? variant on
 * logo? padding?"), on the mechanisms the section family already uses:
 * `shelfTheme` is the section `theme` stamp (`data-theme` on the shelf, so
 * every token inside — text, logo ink via currentColor, the mailto's underline
 * — resolves to that theme and `inverse` follows the toggle); `shelfBackground`
 * is the section `background` prop (a named surface or a raw token); with a
 * theme stamped the default paint is that theme's `primary`, without one it is
 * `inverse` with inverse ink, exactly as shipped. `controlVariant` goes straight
 * to the disclosure's `IconFrame`; `pad` is `ContentCard`'s — one step on
 * `--kol-pad-card-*`, overriding the size ramp's padding. The logo is a slot
 * and stays one: its ink follows the shelf, a coloured mark is the asset's.
 *
 * THE SHELF SIZES TO ITS CONTENT. The source held it in a fixed box
 * (`h-60`/`h-44`/`h-32`/`h-24`, `overflow-hidden`) and every vertical size
 * clipped its own socials rack on a phone — lg needed 204px inside 176, sm 140
 * inside 96. The consumer patched a `min-h` floor under a raised `max-height`
 * ceiling; that is two guesses at one number. Here the open state animates
 * `grid-template-rows: 0fr → 1fr` — the browser measures, nothing is guessed,
 * and a sixth social or a longer name never clips. Horizontal keeps the user's
 * 2026-08-27 ruling — the CARD holds a fixed square and the PHOTO crops as the
 * shelf comes in — as `grid-template-columns: 0px → 224px`, ONE number where
 * the source carried three (`w-56`, `'320px'`, an inline `'224px'` — only the
 * last was ever read).
 *
 * SCALE AND WIDTH ARE SEPARATE. `size` drives the ramp — logo height, mono
 * step, glyph size, rack gap, control inset — and caps the width
 * (`max-w-[680/480/320/200]`); the card is `w-full` inside that cap, so a
 * caller's `className="w-full"` no longer fights a second width utility.
 *
 * THE DISCLOSURE IS A BUTTON, NOT A SWITCH. The source opened the shelf with
 * `ToggleSwitch` — a form control that states a persistent setting, used for a
 * reveal that sets nothing. Ruling applied here rather than minted as a second
 * component: a disclosure is a button carrying `aria-expanded` +
 * `aria-controls`, `plus` closed / `minus` open. Over MEDIA it is
 * `IconFrame variant="secondary" radius="full"` — the glyph needs a surface
 * (the bare `nav` glyph was measured invisible over the photo: page ink on a
 * dark picture); on a surface the bare `nav` idiom the close X standardised
 * on (FullscreenOverlayCloseIdiom) is the same ruling with no frame.
 *
 * Brand content is the CONSUMER'S: `logo` is a slot (the source baked
 * `kol-brand`'s lockup, which this package cannot import), `name` / `email` /
 * `socials` are props with no defaults.
 *
 * @param {string}    image        photo URL — square, `object-cover object-top`
 * @param {string}    alt          the photo's alt (default: `name`)
 * @param {ReactNode} logo         the lockup — sized by the ramp: the node and any svg inside it take the ramp's height, width auto; `text-auto-inverse`
 * @param {string}    name         the person
 * @param {string}    email        rendered as a `mailto:`
 * @param {Array}     socials      `[{ icon, href, label }]` — one Icon-in-Tooltip each, external links
 * @param {'xl'|'lg'|'md'|'sm'} size  the ramp + width cap (680 · 480 · 320 · 200); default xl
 * @param {'vertical'|'horizontal'} orientation  shelf under the photo (card grows) or beside it (card holds its square, photo crops)
 * @param {string}    variant      alias for the source's names — `'lg-h'` = `size="lg" orientation="horizontal"`, any other value = `size`
 * @param {'inverse'|'light'|'dark'} shelfTheme  the shelf's theme scope — stamps `data-theme`; `inverse` = the paired theme of the page, following the toggle; omit for the shipped inverse-surface look
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} shelfBackground  the shelf's surface — a named surface or a raw utility / token string; default `inverse`, or `primary` once a `shelfTheme` is stamped
 * @param {'primary'|'secondary'|'accent'|'outline'|'ghost'|'nav'|'grey'|'danger'} controlVariant  the disclosure's `IconFrame` variant (default `secondary`)
 * @param {'sm'|'md'|'lg'} pad  shelf padding on `--kol-pad-card-*` (12 · 16 · 24), overriding the size ramp's
 * @param {boolean}   open         controlled open state
 * @param {boolean}   defaultOpen  uncontrolled initial state (default false)
 * @param {Function}  onOpenChange `(open) => void`
 * @param {string}    className    extra classes on the card
 */

const SIZES = {
  xl: { cap: 'max-w-[680px]', pad: 'p-6', logo: 'h-20', text: 'kol-mono-16', iconSize: 24, iconBox: 'w-8 h-8', iconGap: 'gap-2', control: 'bottom-4 left-4' },
  lg: { cap: 'max-w-[480px]', pad: 'p-5', logo: 'h-14', text: 'kol-mono-14', iconSize: 20, iconBox: 'w-7 h-7', iconGap: 'gap-1.5', control: 'bottom-3 left-3' },
  md: { cap: 'max-w-[320px]', pad: 'p-4', logo: 'h-10', text: 'kol-mono-12', iconSize: 16, iconBox: 'w-6 h-6', iconGap: 'gap-1', control: 'bottom-3 left-3' },
  sm: { cap: 'max-w-[200px]', pad: 'p-3', logo: 'h-7', text: 'kol-mono-10', iconSize: 12, iconBox: 'w-5 h-5', iconGap: 'gap-1', control: 'bottom-2 left-2' },
}
/* the source's `lg-h`: lg's ramp with a 16px glyph in a 24 box, p-4, and the
 * one open-shelf width */
const HORIZONTAL = { pad: 'p-4', iconSize: 16, iconBox: 'w-6 h-6', shelf: 224 }
const SHADOW = '0 112px 192px -80px rgba(0,0,0,0.6)'

export default function ProfileCard({
  image,
  alt,
  logo,
  name,
  email,
  socials = [],
  size = 'xl',
  orientation = 'vertical',
  variant,
  shelfTheme,
  shelfBackground,
  controlVariant = 'secondary',
  pad,
  open,
  defaultOpen = false,
  onOpenChange,
  className = '',
}) {
  /* the alias maps and gains nothing (gate R4) */
  const horizontal = variant === 'lg-h' || (variant == null && orientation === 'horizontal')
  const s = SIZES[variant === 'lg-h' ? 'lg' : (variant ?? size)] ?? SIZES.xl
  const ramp = horizontal ? { ...s, ...HORIZONTAL } : s

  const [localOpen, setLocalOpen] = useState(defaultOpen)
  const isOpen = open ?? localOpen
  const setOpen = (next) => {
    if (open == null) setLocalOpen(next)
    onOpenChange?.(next)
  }
  const shelfId = useId()

  /* the shelf's paint and ink: stamped → that theme's own tokens (`text-auto`
   * resolves inside the stamp); unstamped → the shipped inverse pair */
  const [themeRef, themeStamp] = useSectionTheme(shelfTheme)
  const shelfBg = surfaceClass(shelfBackground, shelfTheme ? 'primary' : 'inverse')
  const ink = !shelfTheme && shelfBg === 'bg-surface-inverse' ? 'text-auto-inverse' : 'text-auto'
  const padStyle = pad ? { padding: `var(--kol-pad-card-${pad})` } : undefined
  const padCls = pad ? '' : ramp.pad

  const control = (
    <div className={`absolute ${ramp.control}`}>
      <IconFrame
        name={isOpen ? 'minus' : 'plus'}
        variant={controlVariant}
        size="md"
        radius="full"
        aria-expanded={isOpen}
        aria-controls={shelfId}
        aria-label={isOpen ? 'Hide contact details' : 'Show contact details'}
        onClick={() => setOpen(!isOpen)}
      />
    </div>
  )
  const photo = (
    <img src={image} alt={alt ?? name ?? ''} className="w-full h-full object-cover object-top" loading="lazy" />
  )
  const lockup = logo != null && (
    /* `[&_svg]` not `[&>svg]`: a brand `Asset` wraps its svg, so the site had to
     * re-add the sizing on the node it passed — the slot sizes whatever it is
     * handed, wrapped or bare */
    <div className={`inline-flex ${ramp.logo} ${ink} [&>*]:h-full [&_svg]:h-full [&_svg]:w-auto`}>{logo}</div>
  )
  const contact = (
    <div className={`flex flex-col ${horizontal ? 'gap-1.5' : 'gap-1'} antialiased`} style={{ lineHeight: 1 }}>
      {name && <span className={`${ramp.text} ${ink}`}>{name}</span>}
      {email && (
        <a
          href={`mailto:${email}`}
          className={`${ramp.text} ${ink} underline decoration-2 decoration-transparent hover:decoration-current transition-all`}
        >
          {email}
        </a>
      )}
    </div>
  )
  const rack = (
    <div className={`flex ${horizontal ? 'flex-row' : 'flex-col items-start'} ${ramp.iconGap}`}>
      {socials.map(({ icon, href, label }) => (
        <Tooltip key={icon} label={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`${ramp.iconBox} flex items-center justify-center ${ink} transition-transform hover:scale-125`}
          >
            <Icon name={icon} size={ramp.iconSize} />
          </a>
        </Tooltip>
      ))}
    </div>
  )

  if (horizontal) {
    return (
      <div
        className={`grid w-full aspect-square rounded overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out ${className}`}
        style={{ gridTemplateColumns: `${isOpen ? HORIZONTAL.shelf : 0}px minmax(0, 1fr)`, boxShadow: SHADOW }}
      >
        {/* Shelf — LEFT. The inner column holds the open width so the text does
          * not reflow while the track animates. */}
        <div id={shelfId} ref={themeRef} data-theme={themeStamp} className={`min-w-0 overflow-hidden ${shelfBg}`}>
          <div className={`h-full ${padCls} flex flex-col justify-between items-start`} style={{ width: HORIZONTAL.shelf, ...padStyle }}>
            {lockup}
            <div className="flex flex-col gap-8">
              {contact}
              {rack}
            </div>
          </div>
        </div>
        {/* Photo — RIGHT: crops as the shelf comes in, the card never moves */}
        <div className="relative min-w-0 h-full overflow-hidden bg-surface-secondary">
          {photo}
          {control}
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${ramp.cap} rounded overflow-hidden ${className}`} style={{ boxShadow: SHADOW }}>
      {/* Photo — square */}
      <div className="relative w-full aspect-square overflow-hidden bg-surface-secondary">
        {photo}
        {control}
      </div>
      {/* Shelf — content-sized: the row track animates 0fr → 1fr and the browser
        * measures; `min-h-0 overflow-hidden` on the item is what lets 0fr close */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div id={shelfId} ref={themeRef} data-theme={themeStamp} className={`min-h-0 overflow-hidden ${shelfBg}`}>
          <div className={`${padCls} flex justify-between items-end`} style={padStyle}>
            <div className="self-stretch flex flex-col justify-between items-start">
              {lockup}
              {contact}
            </div>
            {rack}
          </div>
        </div>
      </div>
    </div>
  )
}
