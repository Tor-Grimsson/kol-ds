/* THE LAYOUTS (LayoutGroup, kol-atlas 2026-10-31 — the user: *"the identity lab's views are KOL layouts with Atlas's data in
 * them, not Atlas components"*). Each lays out one part of an identity from the data it is handed, in a `view`:
 *
 *   LayoutType    a type exploration    scale · styles · article · sheet · faces  (a TypeLab value + faces)
 *   LayoutColor   a colour exploration  palette · ramps · layouts · sheet  (a ColorLab value)
 *   LayoutLogo    the marks             marks · lockups                    ([{ id, svg, label, ground }] + a wordmark)
 *   LayoutText    voice and copy        lines · source                     (chapters, or a markdown source)
 *   LayoutGuide   the brand guide       (BrandGuide renamed)               (a manifest + a chapter list)
 *
 * Their building blocks are named group-word-first: BlockType, BlockSwatch, CardLogo. */
export { default as LayoutType, LAYOUT_TYPE_VIEWS, UI_FACES as LAYOUT_TYPE_FACES } from '../LayoutType.jsx'
export { default as LayoutColor, LAYOUT_COLOR_VIEWS } from '../LayoutColor.jsx'
export { default as LayoutLogo, LAYOUT_LOGO_VIEWS } from '../LayoutLogo.jsx'
export { default as LayoutText, LAYOUT_TEXT_VIEWS } from '../LayoutText.jsx'
export { default as LayoutGuide } from '../LayoutGuide.jsx'
export { default as BlockType } from '../BlockType.jsx'
export { default as BlockSwatch } from '../BlockSwatch.jsx'
export { default as CardLogo } from '../CardLogo.jsx'
