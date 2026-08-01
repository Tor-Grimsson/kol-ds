import { Icon } from '@kolkrabbi/kol-icons'

const ICON_SIZES = { sm: 10, md: 12, lg: 14 }

/**
 * Tag — the INTERACTIVE chip: filterable, selectable, removable.
 *
 * The chip family (documented at source, 2026-07-30):
 *   Pill  — static label. No states, no handlers. Reach for this for decoration.
 *   Tag   — interactive/filterable. THIS component. Its `active`/`onClick`/
 *           `onRemove` states are the point — a Tag with no handler renders a
 *           <span> and is a Pill wearing the wrong name.
 *   Badge — system status or a count.
 *
 * REBUILT ON PILL'S MODEL (user ruling 2026-08-01). What it was:
 *
 *   - FOUR declared variants (default/naked/inverse/solid) and exactly ONE
 *     `:hover` rule between them, on `.tag-control`. Every other path rendered
 *     dead.
 *   - `color` was a SECOND axis that silently swapped the base class from
 *     `tag-control` to `tag tag--{color}` — so passing a colour cost you the
 *     interaction state, invisibly. That is what shipped a solid blue pill you
 *     could not hover.
 *   - `variant="solid"` and a `solid` boolean did the same job.
 *   - FOUR class schemes for one component: `tag-control`, `tag`, `tag-naked`,
 *     `tag-control-inverse` — not a base plus modifiers, four unrelated bases
 *     picked by which prop you happened to pass.
 *
 * Now it is Pill's vocabulary — `primary` (filled) · `secondary` (outlined) ·
 * `inverse` — one size scale, ONE class scheme (`kol-tag--*`), and every
 * variant carries hover + active. Colour is not a prop: a chip's look is its
 * variant, exactly as it is on Pill and Button. Tag colour BY TAXONOMY returns
 * later as its own decision, on top of the variants rather than instead of them.
 *
 * @param {ReactNode} children   label content
 * @param {string}    text       content fallback when no children (brand SwatchControls)
 * @param {string}    variant    'primary' | 'secondary' | 'inverse'
 * @param {string}    size       'sm' | 'md' | 'lg' — `sm` is the default and
 *                               should stay the answer; `lg` needs a reason
 * @param {boolean}   active     selected state (filter chips)
 * @param {boolean}   hash       prepend `#` (default true); false for plain labels
 * @param {string}    icon       leading icon name
 * @param {Function}  onRemove   renders the dismiss affordance
 * @param {Function}  onClick    makes it a <button>
 */
export default function Tag({
  children,
  text,
  variant = 'primary',
  size = 'sm',
  active = false,
  hash = true,
  icon,
  onRemove,
  onClick,
  className = ''
}) {
  const isInteractive = !!(onClick || onRemove)
  const Element = isInteractive ? 'button' : 'span'
  const iconSize = ICON_SIZES[size] || 12
  const content = children ?? text

  /* ONE scheme. `variant` is the only thing that picks a look — there is no
   * second axis that can swap the base out from under it. */
  const VARIANTS = {
    primary: 'kol-tag--primary',
    secondary: 'kol-tag--secondary',
    inverse: 'kol-tag--inverse',
  }

  /* TYPE COMES FROM THE HELPER RAMP (user ruling 2026-08-01). The size classes
   * hardcoded font-size + font-weight and set no line-height, so a 10px chip
   * inherited the body's ~1.5 and stood 22px tall next to 14px rows. A chip is
   * SINGLE-LINE chrome — that is exactly the kol-helper-* ramp, whose defining
   * property is `line-height: 1`. The sizes match the scale 1:1 (10/12/14), so
   * this is adopting the existing system, not restating it. */
  const TYPE = { sm: 'kol-helper-10', md: 'kol-helper-12', lg: 'kol-helper-14' }

  const classes = [
    'kol-tag',
    VARIANTS[variant] ?? VARIANTS.primary,
    `kol-tag--${size}`,
    TYPE[size] ?? TYPE.sm,
    active ? 'is-active' : '',
    className
  ].filter(Boolean).join(' ')

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove?.(e)
  }

  return (
    <Element
      type={isInteractive ? 'button' : undefined}
      className={classes}
      onClick={onClick}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      <span>{hash ? '#' : ''}{content}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          className="kol-tag-dismiss"
          onClick={handleRemove}
        >
          <Icon name="x" size={iconSize} />
        </span>
      )}
    </Element>
  )
}
