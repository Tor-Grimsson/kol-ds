import { Fragment } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { toneClass } from '../utilities/tone.js'
import { Tooltip } from '../utilities/Popover.jsx'

/**
 * ViewToggle — control for switching between view modes.
 *
 *   variant="text"   — segmented bare buttons; active uses kol-control--filled,
 *                      inactive is bare text-meta with text-emphasis on hover.
 *   variant="icon"   — bordered chip-row container holding square icon
 *                      buttons. Active uses bg-fg-ab-24.
 *   variant="single" — single button binary toggle. Click flips between the
 *                      two `options` values. The button shows the *current*
 *                      option's label; active = on (kol-control--filled),
 *                      inactive = off (bare text). Use for compact on/off
 *                      where a segmented two-button toggle is overkill.
 *   variant="float"  — the float rounds (float-everything W2 row 35, 2026-11-04): each option a 32 circle, 4 apart,
 *                      no well; a glyph (`icon`, 16) or a label (Inter 11/500 — a page number); the lit one fg-16
 *                      on the emphasis ink, the rest fg-64 with an fg-08 hover; the float focus ring. Pagination and
 *                      the view switch are one shape.
 *
 * Built on the .kol-control shell. Default options use grid / view-list
 * icons; consumers can pass `options` to override. `iconVariant` picks the
 * icon cut for variant="icon" ('stroke' default; 'solid' reads better at
 * 14px). For `variant="single"`, the FIRST option in `options` is the "off"
 * value; the SECOND is "on".
 *
 * `tone="sunken"` — `inverse` is its alias since 0.120.0 (ControlToneSunken,
 * 2026-08-28: the control does not invert, it sits BELOW its plane; the
 * active chip is `fg-08` now, down from `fg-16`). As first ruled:
 * (ControlToneInverse, kol-website 2026-08-27 — user: "a
 * flipped version of this color scheme, where the darker is background and grey
 * is the active … it would fit better on the light grey"): on a washed plane
 * (`pageWash`, `fg-04`) the default grey well reads as a second plate, so the
 * icon variant's two values swap — the well takes the dark chip
 * (`fg-ab-24`), the active chip the `fg-16` ink wash (user, on the live
 * page: "just use bg-fg-16"), the inactive hover a lighter wash. Theme rules on `.kol-tone-inverse`
 * (kol-theme ≥0.78.0); the same prop on `Dropdown` and `Input`.
 */
const ViewToggle = ({
  size = 'sm',
  viewMode,
  onViewChange,
  variant = 'text',
  iconVariant = 'stroke',
  tone = 'default',
  options = [
    { value: 'grid', label: 'Grid view', icon: 'grid' },
    { value: 'list', label: 'List view', icon: 'view-list' }
  ],
  className = ''
}) => {
  const isIconVariant   = variant === 'icon'
  const isSingleVariant = variant === 'single'

  if (variant === 'float') {
    return (
      <div className={`kol-view-toggle--float inline-flex items-center gap-1 ${className}`.trim()}>
        {options.map((option) => {
          const active = option.onClick ? !!option.pressed : viewMode === option.value
          const button = (
            <button
              key={option.value}
              type="button"
              onClick={option.onClick ?? (() => onViewChange(option.value))}
              aria-label={option.icon ? option.label : undefined}
              aria-pressed={option.onClick && option.pressed == null ? undefined : active}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer kol-float-label font-medium ${active ? 'bg-fg-16 text-fg-emphasis' : 'text-fg-64 hover:bg-fg-08 hover:text-fg-emphasis'}`}
            >
              {option.icon ? <IconLoader name={option.icon} size={16} variant={iconVariant} /> : option.label}
            </button>
          )
          return option.icon ? <Tooltip key={option.value} label={option.label}>{button}</Tooltip> : button
        })}
      </div>
    )
  }

  if (isSingleVariant) {
    const [offOpt, onOpt] = options
    const isOn = viewMode === onOpt.value
    const next = isOn ? offOpt.value : onOpt.value
    const cls  = isOn
      ? `kol-control kol-control--filled kol-control-sm kol-mono-12 ${className}`
      : `kol-control kol-control-sm kol-mono-12 text-meta hover:text-emphasis ${className}`
    /* Both labels stack in a single grid cell so the button width is fixed
     * to the longer label — flipping state never reflows the row. */
    return (
      <button
        type="button"
        onClick={() => onViewChange(next)}
        className={cls}
        aria-pressed={isOn}
      >
        <span className="grid">
          <span className={`col-start-1 row-start-1 ${isOn ? '' : 'invisible'}`}>{onOpt.label}</span>
          <span className={`col-start-1 row-start-1 ${isOn ? 'invisible' : ''}`}>{offOpt.label}</span>
        </span>
      </button>
    )
  }

  /* THE WELL IS INSET (ViewToggleWellGap, kol-website 2026-08-28): `p-1` put the box 4px past the
   * last chip on every side, so a row's `gap-4` read 20 on this side and 16 on the other, and every
   * consumer subtracted it with a `-ml-1` on the neighbour. `-mx-1` draws the padding inward from the
   * declared box — the chips sit where the box says, the well bleeds 4px into the gap. */
  const containerClasses = isIconVariant
    ? `kol-view-toggle inline-flex items-center gap-1 p-1 -mx-1 rounded ${toneClass(tone)} ${className}`.replace(/\s+/g, ' ').trim()
    : `flex gap-2 ${className}`

  const buttonClasses = (isActive) => {
    if (isIconVariant) {
      // Inset "well" pattern — container is bg-fg-04 (slight lift from page),
      // active button uses bg-fg-ab-24 (theme-invariant black, always
      // darkens regardless of theme) so it reads as recessed/pressed.
      return `inline-flex items-center justify-center p-1.5 rounded transition-colors text-emphasis cursor-pointer ${
        isActive ? 'bg-fg-ab-24' : 'hover:bg-fg-ab-08'
      }`
    }
    /* Active = filled chip. Inactive = bare-text on the shell base — no
     * border-reveal hover. (Earlier ghost variant revealed an outline on
     * hover; that's deliberately gone.) */
    return isActive
      ? `kol-control kol-control--filled kol-control-${size} kol-mono-${size === 'md' ? '14' : '12'}`
      : `kol-control kol-control--plain kol-control-${size} kol-mono-${size === 'md' ? '14' : '12'} text-meta hover:text-emphasis`
  }

  return (
    <div className={containerClasses}>
      {options.map((option) => {
        /* AN OPTION CAN BE ITS OWN BUTTON (2026-09-23): `onClick` (+ optional `pressed`) makes it an
         * independent action in the same well — the media pages' filter and search, which sit beside
         * the view switch and must be the same height and chip, not a second hand-built strip. */
        const active = option.onClick ? !!option.pressed : viewMode === option.value
        const button = (
          <button
            key={option.value}
            onClick={option.onClick ?? (() => onViewChange(option.value))}
            className={buttonClasses(active)}
            aria-label={option.label}
            aria-pressed={option.onClick && option.pressed == null ? undefined : active}
          >
            {isIconVariant && option.icon ? (
              <IconLoader name={option.icon} size={14} variant={iconVariant} />
            ) : (
              option.label
            )}
          </button>
        )
        /* THE DS TOOLTIP, NOT `title` (native-title-tooltips-in-ds-components, kol-client-olina
         * 2026-09-22). Only an ICON option gets one — a text option already shows its label, and
         * a tooltip repeating it is noise; the native `title` did exactly that. */
        const item = isIconVariant && option.icon
          ? <Tooltip key={option.value} label={option.label}>{button}</Tooltip>
          : button
        /* `dividerBefore` (2026-09-23): a hairline in the well between two options that are not the
         * same kind of thing — filter and search are two independent actions, and two bare chips
         * side by side read as one control. A light hairline (oq-16, opaque, flips with the theme) — the dark one vanished. */
        return isIconVariant && option.dividerBefore
          ? <Fragment key={option.value}><span aria-hidden="true" className="w-px h-4 shrink-0 bg-oq-16" />{item}</Fragment>
          : item
      })}
    </div>
  )
}

export default ViewToggle
