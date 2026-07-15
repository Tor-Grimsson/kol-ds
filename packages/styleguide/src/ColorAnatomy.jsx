/**
 * ColorAnatomy — token-composition specimen.
 *
 * A figure that shows a color `sample`, the inline `<code>` token expression
 * that produced it (e.g. `color-mix(in srgb, var(--kol-fg-16), transparent)`
 * or a bare `--kol-fg-48`), and an italic figcaption describing it. Used in
 * the brand/style-guide to document how a composed color is built from tokens.
 *
 * The surviving CSS owns the type/chrome for the two text descendants — it is
 * fully token-based (var(--kol-fg-48), var(--kol-font-family-mono)) — so it is
 * reused as-is rather than re-declared inline (chrome lives in
 * @kolkrabbi/kol-theme → packages/framework/kol-framework.css):
 *   .kol-anatomy-sample figcaption — 12px, italic, var(--kol-fg-48)
 *   .kol-anatomy-sample code       — 11px mono chip, currentColor 18% tint, r3
 *
 * Props:
 *   sample  — sample node rendered as-is (full control of size/shape). When
 *             omitted, a DS <ColorSwatch> is rendered from `hex`.
 *   hex     — color string for the fallback ColorSwatch (ignored if `sample`).
 *   code    — token / color-mix expression string, shown in the inline <code>.
 *   caption — italic figcaption description. Author its casing at the call site.
 */
import { ColorSwatch } from '@kolkrabbi/kol-component'

export default function ColorAnatomy({ sample, hex, code, caption }) {
  return (
    <figure className="kol-anatomy-sample flex flex-col items-start gap-2">
      {sample ?? <ColorSwatch hex={hex} size={96} radius="sm" />}
      {code && <code>{code}</code>}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
