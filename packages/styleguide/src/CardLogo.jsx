import { useState } from 'react'
import ClearspaceDiagram, { hasFramework } from './ClearspaceDiagram.jsx'
import { ToggleSwitch } from '@kolkrabbi/kol-component'

/**
 * CardLogo — A logo specimen tile (LogoCard until 2026-10-31; the old name is an alias on the retirement ledger). framed logo specimen tile with a clearspace / grid toggle.
 *
 * A brand-manual logo plate: the mark centered in a padded frame, an optional
 * caption, and — when construction overlays are supplied — a toggle that reveals
 * the grid + x-height keyline over the mark.
 *
 * ASSET-AGNOSTIC: the mark and its construction overlays are CONSUMER-INJECTED
 * rendered nodes (`logo`, `grid`, `keyline`). The monorepo original imported a
 * specific `KolLogo` and resolved diagrams from `GRAPHIC_RAW.structure`; this
 * DS version bakes in neither — layering is delegated to <ClearspaceDiagram>,
 * which the consumer feeds with their own <Asset>/<Icon>/svg nodes.
 *
 *   import { CardLogo } from '@kolkrabbi/kol-styleguide'
 *   import { Asset } from '@kolkrabbi/kol-brand/svg'
 *   <CardLogo
 *     caption="Logomark"
 *     aspect="1 / 1"
 *     logo={<Asset name="kol-logomark" />}
 *     grid={<Asset name="diagram-grid-logomark" />}
 *     keyline={<Asset name="diagram-x-logomark" />}
 *   />
 *
 * `variant`: `figure` (default — the framed tile above) · `plate` (the mark on its ground, LayoutLogo's card).
 *
 * Caption text is authored in the case it should render — the component applies
 * no text-transform (KOL no-auto-casing rule).
 */
export default function CardLogo({
  logo,
  grid = null,
  keyline = null,
  caption,
  backdrop,
  aspect = '2 / 1',
  frame = true,
  toggleLabel = 'Clearspace',
  defaultFramework = true,
  className = '',
  variant = 'figure',
}) {
  const [showFramework, setShowFramework] = useState(defaultFramework)
  const canFramework = hasFramework({ grid, keyline })

  /* `variant="plate"` (2026-10-31, LayoutGroup — kol-atlas's logo board, class for class): the mark on the ground it was
   * drawn on, 10 round, centred; no caption, no toggle — the board's label sits under it. `logo` may carry a wordmark. */
  if (variant === 'plate') return (
    <div className={`flex w-full items-center justify-center rounded-[10px] ${className}`} style={{ background: backdrop }}>{logo}</div>
  )

  const figureStyle = aspect ? { aspectRatio: aspect } : undefined
  const frameStyle = frame && backdrop ? { background: backdrop } : undefined
  const frameChrome = frame
    ? `rounded-[4px] overflow-hidden p-8 ${backdrop ? '' : 'bg-fg-02 border border-fg-04'}`
    : ''
  const figureSizing = aspect ? '' : 'h-full'

  return (
    <figure
      className={`kol-logo-card flex flex-col ${figureSizing} ${className}`.trim()}
      style={figureStyle}
    >
      <div
        className={`kol-logo-card-frame flex-1 min-h-0 flex items-center justify-center ${frameChrome}`.trim()}
        style={frameStyle}
      >
        <ClearspaceDiagram
          logo={logo}
          grid={grid}
          keyline={keyline}
          framework={showFramework && canFramework}
        />
      </div>
      {(caption || canFramework) && (
        <div className="flex items-center justify-between mt-2">
          {caption ? (
            <figcaption className="kol-helper-12 tracking-wider text-meta">
              {caption}
            </figcaption>
          ) : (
            <span />
          )}
          {canFramework && (
            <ToggleSwitch
              variant="bare"
              label={toggleLabel}
              checked={showFramework}
              onToggle={setShowFramework}
            />
          )}
        </div>
      )}
    </figure>
  )
}
