/* plan 53 — register the Right Grotesk TTF cuts for the Node scripts (the editor loads them itself).
 * Keys match the ASCII style's font list: rg-<width>-<weight>. */
import { readFileSync, existsSync } from 'node:fs'
import opentype from 'opentype.js'
import { registerFont } from '../src/generate/fonts.js'

const WEIGHT = { 100: 'Fine', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Dark', 700: 'Bold', 900: 'Black' }
export function registerAll() {
  for (const width of ['base', 'Compact', 'Tight', 'Wide', 'Narrow', 'Tall', 'Spatial']) {
    for (const w of [400, 700, 900]) {
      const f = new URL(`../../../public/fonts/right-grotesk-ttf/PPRightGrotesk-${width === 'base' ? '' : width}${WEIGHT[w]}.ttf`, import.meta.url)
      if (existsSync(f)) registerFont(`rg-${width}-${w}`, opentype.parse(readFileSync(f).buffer))
    }
  }
}
