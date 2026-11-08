import { SwatchCaption } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The text block under a swatch — name, value, meta. 'inline' is the tile's baseline row, 'stacked' the
 * lines one under the other; tone 'strong' is the grid cell's (name emphasised, truncating). */
export const layouts = ['inline', 'stacked']

export default function SwatchCaptionPreview({ layout = 'stacked' }) {
  return (
    <div className="flex w-48 flex-col items-start gap-1.5">
      <SwatchCaption name="Yellow 300" value="#FFCF33" meta="--kol-color-yellow-300" layout={layout} />
    </div>
  )
}
