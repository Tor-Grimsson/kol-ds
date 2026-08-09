import { Icon } from '@kolkrabbi/kol-icons'
import { SOLO } from '../hooks/glyphLadders.js'

/**
 * IconFrame — a STATIC square frame holding one icon.
 *
 * The visual weight of a button rung with none of its interactivity: a heading
 * ornament, a label ornament, a legend swatch — anywhere an icon needs the
 * button's box and background but must not read or behave as a control.
 *
 * Promoted 2026-07-30 from kol-website's `SectionTitle`, where it lived as an
 * anonymous `<span className="kol-btn kol-btn-secondary kol-btn-md
 * kol-btn-icon">` (user ruling: *"span? that's fucked up, not even a button?
 * …take that span and make it a component for icons with no states."*).
 *
 * It owns `.kol-icon-frame*` rather than borrowing `kol-btn-*`, and that is the
 * entire point. Reusing button classes on a `<span>` suppresses hover/active/
 * focus/disabled **by element** — the "no states" property was an accident of
 * the tag, not a guarantee of the API, and would leak back the moment someone
 * changed the element or a rule stopped requiring `:hover` on a focusable. The
 * frame's own classes declare the same background, foreground and geometry and
 * simply have no state rules to inherit.
 *
 * `variant` borrows the kol-btn COLOUR SET verbatim so the frame sits in the
 * same visual system as real buttons; `primary` and `secondary` are inverse
 * pairs that flip with the theme, so light/dark comes free from the tokens with
 * no per-theme props.
 *
 * `size` moves the square and the glyph together on the solo-glyph ladder
 * (16/20/24 against the pinned squares 28/32/36) — that pairing is the DEFAULT,
 * and it is what every call site should take. `iconSize` unbinds the glyph for
 * the cases the ladder cannot serve, exactly as it does on `Button` and `Input`:
 * a `radius="full"` frame reads heavier than the square it was tuned against (a
 * circle inscribes ~78.5% of its bounding box), so an edge-straddling round
 * control wants a smaller glyph in the same pinned square. The square never
 * moves with it — that is the 2026-07-28 law, and it only means something if the
 * two are separable.
 *
 * IT TAKES A CLICK (2026-08-01 ruling) — *"you dont use a button… you use the
 * ICON COMPONENT… it has no interactive states."* This file used to say the
 * opposite, and called it "the entire point": no `onClick`, no `href`, and
 * *"wanting any of those means wanting a Button with iconOnly, not this."*
 *
 * That was one sentence too strong. Two separate things had been welded
 * together — **is it clickable** and **does it light up** — and only the second
 * was ever the point. The shell header proved it: six chrome controls all
 * needing a click, none wanting a hover wash, so every one of them hand-wrote
 * its own box and the row ended up on four different containers.
 *
 * So `onClick` renders a `<button>`, `href` renders an `<a>`, and neither
 * gains a state rule. The UA's own button chrome is reset in the theme
 * (`button.kol-icon-frame, a.kol-icon-frame`) so "no states" is a property of
 * the CLASS rather than of the tag — which is exactly the correction this
 * component's own docstring already argued for when it refused to borrow
 * `kol-btn-*` on a span.
 *
 * Still deliberately absent: `disabled` and `aria-pressed`. Both describe a
 * control that CHANGES appearance with state, which is the line that stays.
 * Want the wash, the pressed fill or the disabled dim? That is `Button`.
 *
 * @param {string} name       icon name (kol-icons)
 * @param {string} variant    primary|secondary|accent|outline|ghost|nav|grey|danger
 * @param {string} size       sm|md|lg — square + glyph together
 * @param {string} radius     sm (default, the system's 4px) | full (9999px).
 *                            Two values, nothing between: a round frame is its
 *                            own chrome idiom (edge-straddling controls, avatars),
 *                            and it is the only sanctioned exception to the hard
 *                            4px repo invariant.
 * @param {number} iconSize   glyph size in px — overrides the size-derived
 *                            default. Null (the default) keeps the ladder. The
 *                            square is unaffected; only the centred glyph moves.
 * @param {string} className  escape hatch
 */
// The solo-glyph ladder, from its one source. This was a local transcription
// until component 0.20.0 — see hooks/glyphLadders.js for why that mattered.
const GLYPH = SOLO

export default function IconFrame({
  name,
  variant = 'secondary',
  size = 'md',
  radius = 'sm',
  iconSize = null,
  onClick,
  href,
  className = '',
  ...rest
}) {
  if (!name) return null
  const radiusCls = radius === 'full' ? ' kol-icon-frame-radius-full' : ''
  const resolvedIconSize = iconSize ?? GLYPH[size] ?? GLYPH.md
  const cls = `kol-icon-frame kol-icon-frame-${variant} kol-icon-frame-${size}${radiusCls} ${className}`.trim()
  const glyph = <Icon name={name} size={resolvedIconSize} />

  /* The element follows the affordance, and the CLASS is identical in all three
   * branches — that is the whole contract. A frame that can be clicked must be
   * a real button or a real link (keyboard, focus order, middle-click, screen
   * readers); a frame that cannot must not be either, or it lands in the tab
   * order announcing itself as something to press. */
  if (href) {
    return (
      <a className={cls} href={href} {...rest}>
        {glyph}
      </a>
    )
  }
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} {...rest}>
        {glyph}
      </button>
    )
  }
  return (
    <span className={cls} {...rest}>
      {glyph}
    </span>
  )
}
