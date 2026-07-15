/**
 * ClearspaceDiagram — layered logo construction overlay.
 *
 * Stacks up to three absolutely-positioned layers inside one box:
 *   grid (construction modules) → keyline (x-height / clearspace guides) → logo.
 *
 * All three layers are CONSUMER-INJECTED rendered nodes. The DS bakes in no
 * brand mark and no SVG registry — a generic grid can't align to an unknown
 * mark, so the consumer (who owns the mark) also owns the construction geometry,
 * authored to match that mark's viewBox. This is the asset-agnostic mirror of
 * the monorepo original, which pulled `GRAPHIC_RAW.structure` (diagram-grid-*,
 * diagram-x-*, diagram-logo-*) and injected the raw strings itself.
 *
 * `framework` toggles the two overlay layers; the logo always renders. Each
 * layer fills the box and its descendant <svg> is stretched to fit
 * (`[&_svg]:w-full [&_svg]:h-full`) — inject wrapped nodes (e.g. kol-brand
 * <Asset>, which renders <span><svg/></span>) or pre-sized svg nodes.
 *
 *   import { ClearspaceDiagram } from '@kolkrabbi/kol-styleguide'
 *   import { Asset } from '@kolkrabbi/kol-brand/svg'
 *   <ClearspaceDiagram
 *     framework
 *     logo={<Asset name="kol-logomark" />}
 *     grid={<Asset name="diagram-grid-logomark" />}
 *     keyline={<Asset name="diagram-x-logomark" />}
 *   />
 */

const LAYER = 'absolute inset-0 [&_svg]:w-full [&_svg]:h-full'

/**
 * True when both overlay layers are present — the injected-node equivalent of
 * the monorepo `hasFramework(variant)` (which checked the grid + x diagrams
 * existed for a variant). Consumers gate a clearspace toggle on this.
 */
export const hasFramework = ({ grid, keyline } = {}) => Boolean(grid && keyline)

export default function ClearspaceDiagram({
  logo,
  grid = null,
  keyline = null,
  framework = false,
  className = '',
}) {
  if (!logo) return null

  return (
    <div className={`kol-clearspace-diagram relative w-full h-full ${className}`.trim()}>
      {framework && grid && <span className={LAYER}>{grid}</span>}
      {framework && keyline && <span className={LAYER}>{keyline}</span>}
      <span className={LAYER}>{logo}</span>
    </div>
  )
}
