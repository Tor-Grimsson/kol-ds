import { familyFor } from './typographyCuts'

/**
 * TypeBlock — typography specimen primitive.
 *
 * Renders one sample string with a fully consumer-controlled type treatment:
 * cut (Right Grotesk width / mono), weight, italic, size, tracking,
 * line-height, case, alignment, colour, and an optional stroke. A pure,
 * stateless render — feed it props, it draws the specimen. Defaults land on
 * Right Grotesk regular so a bare `<TypeBlock />` shows a legible baseline.
 *
 * **Position + colour are the consumer's job.** TypeBlock owns no positioned
 * container, outline, or drag chrome, and inherits colour by default
 * (`currentColor`) so the surrounding surface / theme drives ink. Wrap it in
 * whatever tile, row, or frame the specimen page needs.
 *
 * The sample is intentionally *style-driven*, not a fixed `kol-*` type class —
 * previewing arbitrary cuts / sizes is the whole point. It is kept
 * wrap-capable (`overflow-wrap` + `white-space: pre-wrap`) so multi-line
 * samples flow, honouring the mono wrap-vs-nowrap fault line for wrapping text.
 *
 * Ported from the monorepo apps/brand styleguide TypeBlock (2026-07). The
 * source's contentEditable inline-edit / drag-select behaviour (Type-Lab editor
 * chrome) is dropped — a DS specimen is a presentational render. The source's
 * nested `value` object is flattened to discrete props.
 *
 * Props:
 *   text         sample string (default 'Right Grotesk')
 *   cut          Right Grotesk cut key or 'mono' — resolved via familyFor
 *   weight       numeric font-weight (100–900)
 *   italic       render the italic style
 *   size         font-size in px
 *   tracking     letter-spacing in em
 *   lineHeight   unitless line-height
 *   case         CSS text-transform keyword the CONSUMER opts into
 *                ('none' | 'uppercase' | 'lowercase' | 'capitalize').
 *                Default 'none' — never baked on; the sample is never mutated.
 *   align        text-align
 *   color        ink (default 'currentColor' — inherit from surface / theme)
 *   strokeWidth  outline width in px (0 = none)
 *   strokeColor  outline colour (required for stroke to render)
 *   className    extra classes on the sample element
 *   style        inline-style overrides merged last
 */
export default function TypeBlock({
  text = 'Right Grotesk',
  cut = 'base',
  weight = 400,
  italic = false,
  size = 48,
  tracking = 0,
  lineHeight = 1,
  case: textCase = 'none',
  align = 'left',
  color = 'currentColor',
  strokeWidth = 0,
  strokeColor,
  className = '',
  style,
  ...rest
}) {
  const hasStroke = strokeWidth > 0 && Boolean(strokeColor)
  return (
    <div
      className={className}
      style={{
        fontFamily: `'${familyFor(cut)}', 'Right Grotesk', sans-serif`,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: `${size}px`,
        letterSpacing: `${tracking}em`,
        lineHeight,
        textAlign: align,
        color,
        textTransform: textCase,
        WebkitTextStrokeColor: hasStroke ? strokeColor : undefined,
        WebkitTextStrokeWidth: hasStroke ? `${strokeWidth}px` : undefined,
        paintOrder: hasStroke ? 'stroke fill' : undefined,
        minHeight: '1em',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        ...style,
      }}
      {...rest}
    >
      {text}
    </div>
  )
}
