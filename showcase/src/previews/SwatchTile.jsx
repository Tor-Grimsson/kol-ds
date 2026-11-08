import { SwatchTile } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* A ColorSwatch with its name and value under it — the form every swatch grid drew by hand. Each size is
 * one of those grids: 'tile' the documented specimen (BlockSwatch, the Foundations tokens), 'grid' the
 * ColorRamp cell, a number the fixed chip of the styleguide set. */
export const sizes = ['tile', 'grid', 48]

export default function SwatchTilePreview({ size = 'tile' }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <SwatchTile hex="#FFCF33" name="Yellow 300" meta="--kol-color-yellow-300" size={size} anchor />
      <SwatchTile hex="#AD5038" name="Red 200" size={size} />
      <SwatchTile hex="#222D3D" name="Blue 400" size={size} />
      <SwatchTile hex="#FCFBFB" name="Paper" size={size} />
    </div>
  )
}
