/**
 * SpecimenSheet — The one Specimen layout. The library master `SpecimenSheet` (Styleguide page, Sheet section;
 * type-ramp plan 1.2, 1.4): a transparent row holding the dark `frame` (the `content` slot, a light sheet, over the
 * `footer` slot) and the `aside` slot beside it, outside the frame, its top offset so `SpecimenWeights` rows line up
 * with the `SpecimenRamp` rows inside. Dark is set once on the frame and Light once on the content and the aside
 * (plan 6.5); nothing inside pins a theme.
 *
 * Widths are the Figma frame's: 1600 frame, 120 side padding (1360 inner), 120 to the aside. The aside starts 800 down
 * (the master's 768 plus the frame's 32 top padding, which the measured rows need to meet 1:1).
 *
 * @param {ReactNode} [content]     the light sheet's items, stacked 128 apart (Figma slot `content`)
 * @param {ReactNode} [footer]      `SpecimenFooterGroup`s under the content (Figma slot `footer`)
 * @param {ReactNode} [aside]       beside the frame, e.g. `SpecimenWeights` (Figma slot `aside`)
 * @param {boolean}   [showContent] default true
 * @param {boolean}   [showFooter]  default true
 * @param {boolean}   [showAside]   default false
 * @param {string}    [className]
 */
export default function SpecimenSheet({
  content,
  footer,
  aside,
  showContent = true,
  showFooter = true,
  showAside = false,
  className = '',
}) {
  return (
    <div className={`flex items-start gap-30 ${className}`.trim()}>
      <div data-theme="dark" className="flex w-400 shrink-0 flex-col overflow-hidden bg-surface-primary px-30 py-8">
        {showContent && (
          <div data-theme="light" className="flex flex-col gap-32 overflow-hidden bg-surface-tertiary p-16">
            {content}
          </div>
        )}
        {showFooter && <div className="flex flex-col gap-8 pt-8">{footer}</div>}
      </div>
      {showAside && (
        <div data-theme="light" className="flex shrink-0 flex-col pt-200">
          {aside}
        </div>
      )}
    </div>
  )
}
