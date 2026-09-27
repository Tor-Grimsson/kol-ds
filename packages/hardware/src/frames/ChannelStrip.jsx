/**
 * ChannelStrip — a mixer channel's face (frames group, 2026-09-27). Lifted from kol-mirror's
 * SymphonyMixer strip: a plate one rung below the desk, a top row of controls beside a column of
 * actions, then the channel's sliders, then a footer. Slots only — which controls, which
 * actions, what they do, all stay in the consumer.
 *
 * @param {ReactNode} power     the power control, top-left (e.g. a hardware Toggle)
 * @param {ReactNode} controls  the control grid beside it (e.g. six dials, `grid-cols-3`)
 * @param {ReactNode} actions   the right-hand column (e.g. IconButtons)
 * @param {ReactNode} faders    the slider stack under the top row
 * @param {ReactNode} footer    the bottom row, under a hairline
 * @param {number}    width     plate width in px (default 320, mirror's)
 */
export default function ChannelStrip({ power, controls, actions, faders, footer, width = 320, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center gap-4 border border-oq-08 p-4 ${className}`}
      style={{ background: 'var(--kol-oq-04)', borderRadius: 4, width }}
    >
      <div className="flex w-full items-stretch gap-4">
        <div className="flex flex-1 flex-col gap-2">
          {power && <div className="self-start">{power}</div>}
          {controls}
        </div>
        {actions && <div className="flex flex-col gap-2">{actions}</div>}
      </div>
      {faders && <div className="flex w-full flex-col gap-1">{faders}</div>}
      {footer && <div className="w-full border-t border-oq-08 pt-2">{footer}</div>}
    </div>
  )
}
