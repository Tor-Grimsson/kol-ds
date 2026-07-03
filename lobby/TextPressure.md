---
component: TextPressure
source: kol-monorepo/apps/web/src/components/react-bits/TextPressure.jsx#L1-L224
date: 2026-07-03
status: draft
deps: []
---

# TextPressure

## Purpose
Variable-font "pressure" text effect (ported from react-bits / JuanFuentes codepen): a single line of uppercase characters where each glyph's variable-font axes — **width (`wdth`)**, **weight (`wght`)**, **italic (`ital`)**, and optional **opacity/alpha** — respond in real time to the cursor's proximity. Characters nearest the pointer are widest/heaviest; distance falls off linearly. Driven by a `requestAnimationFrame` loop with a smoothed (lerped) mouse follower; no animation library. Requires a variable font supplying those axes.

## Anatomy
- Root `<div ref={containerRef}>` — `position: relative; width:100%; height:100%; background:transparent` (inline).
- Injected `<style>` block: an `@font-face` for `fontFamily`/`fontUrl`; `.flex { display:flex; justify-content:space-between }`; `.stroke span` / `.stroke span::after` (text-stroke duplicate layer); `.text-pressure-title { color: textColor }`.
- `<h1 ref={titleRef} className="text-pressure-title {className} {flex?'flex':''} {stroke?'stroke':''}">` — inline: `fontFamily`, `textTransform: uppercase`, `fontSize` (computed), `lineHeight`, `transform: scale(1, scaleY)`, `transformOrigin: center top`, `textAlign: center`, `whiteSpace: nowrap`, `fontWeight: 100`, `width: 100%`, `userSelect: none`.
  - One `<span ref data-char={char} style={{ display:'inline-block', color: stroke?undefined:textColor }}>` per character; `spansRef[]` collects them for the RAF loop.

## Variants
No `variant` prop; behavior toggled by booleans:
- **width / weight / italic / alpha** — which font axes react (each independently on/off).
- **flex** — space-between distribution vs natural spacing.
- **stroke** — adds an outlined ghost layer behind each glyph (`::after`, `-webkit-text-stroke`).
- **scale** — vertically scales the `<h1>` so text height fills the container (`scaleY = containerH / textHeight`).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| text | string | `'Compressa'` | The string; split into per-char `<span>`s. |
| fontFamily | string | `'Compressa VF'` | `@font-face` family + applied font. |
| fontUrl | string | Cloudinary Compressa demo `.woff2` | `@font-face src`. **DROP the default** (demo font, not for commercial use). |
| width | bool | `true` | Animate `wdth` axis (5–200). |
| weight | bool | `true` | Animate `wght` axis (100–900). |
| italic | bool | `true` | Animate `ital` axis (0–1). |
| alpha | bool | `false` | Animate per-glyph opacity (0–1). |
| flex | bool | `true` | `justify-content: space-between`. |
| stroke | bool | `false` | Outlined ghost layer. |
| scale | bool | `false` | Vertical fill-to-container scaling. |
| textColor | string (hex/CSS color) | `'#FFFFFF'` | Glyph color. **Swap to a KOL token.** |
| strokeColor | string | `'#FF0000'` | Stroke color. **Swap to a KOL token.** |
| className | string | `''` | Extra classes on the `<h1>`. |
| minFontSize | number | `24` | Floor for the responsive font size. |

## Styling
- Layout sizing is **JS-computed**, not Tailwind: `fontSize = max(minFontSize, containerW / (chars.length/2))`, recomputed on resize; optional `scaleY = containerH / titleHeight` when `scale`.
- Per-glyph axis update every RAF frame: `span.style.fontVariationSettings = \`'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}\``; `span.style.opacity = alphaVal`.
- Falloff: `getAttr(d, min, max) = max(min, (max - |max*d/maxDist|) + min)` where `d` = distance from smoothed mouse to glyph center and `maxDist = titleWidth/2`.
- **Inline `<style>` injection** for `@font-face` + helper classes.
- **App-specific / port bits to DROP or change:**
  - Hardcoded hex defaults `#FFFFFF` / `#FF0000` → **KOL tokens** (`var(--kol-fg-primary)` etc.).
  - The Cloudinary demo `fontUrl` default (explicitly "not for commercial projects") → require the consumer to supply a KOL variable font; the in-app wrappers point at `/fonts/TGRoot-TuneVF.ttf` (`fontFamily="TG Root-Tune"`).
  - `textTransform: 'uppercase'` — **violates the KOL no-auto-text-transform rule.** The DS version must NOT force uppercase; author the string uppercase at the call site (or expose it as an explicit opt-in prop, off by default).
  - Global `window` mousemove/touchmove listeners → the newer wrapper scopes them to the container (see below); DS should scope to the element.

## States & interactions
- **mouse/touch move (window):** writes raw cursor to `cursorRef`.
- **RAF loop:** smoothed follower `mouseRef += (cursorRef - mouseRef)/15` each frame (~lerp, exponential ease-in toward the cursor). For each glyph, compute distance → axis values → write `fontVariationSettings`/`opacity`. Loop never stops in this base version (runs continuously).
- **resize:** recompute `fontSize` (and `scaleY` if `scale`).
- Initializes the smoothed mouse at the container center on mount.

## Dependencies
- **None** — pure React (`useEffect/useRef/useState`) + RAF + a variable font. No animation library, no DS component deps.

## Recreation notes
- **Tier:** molecule (single text element, one self-contained effect).
- **Collapse the three variants into ONE.** Same directory ships `TextPressure.jsx` (this base), `TextPressureNew.jsx`, and `TextPressureHero.jsx`:
  - `TextPressureNew.jsx` is the evolved version — adds `maxFontSize` cap, `returnToDefault` (spring-coast back to `wght400/wdth100` on mouse-leave, `springStrength 0.05`, `damping 0.88`) vs freeze-in-place mode (`damping 0.75`), an `isHovering` gate, per-char velocity tracking, and **container-scoped** listeners (mouseenter/leave/move on the element, not `window`), plus it **stops the RAF loop once settled**. Its `wdth` range is 5–**150** (vs 200 in base).
  - `TextPressureHero.jsx` is a thin app preset: fixed 600×200 box, `TG Root-Tune` font, `textColor="var(--kol-fg-primary)"`, a **red debug border** (`2px solid red` — DROP), width+weight on, italic off, `minFontSize 32 / maxFontSize 100`.
  - **DS recreation = one component** built on `TextPressureNew`'s mechanics (container-scoped listeners, `maxFontSize`, `returnToDefault`, RAF auto-stop), exposing the `TextPressureHero` preset via props/defaults rather than a separate wrapper. Drop the debug border and the base `TextPressure.jsx` entirely.
- **Values that should become props** (some already are): the lerp factor `/15`, axis ranges (5–150 `wdth`, 100–900 `wght`), the spring/damping constants in the return-to-default logic, and the `fontSize` divisor (`chars.length/2`).
- **Animation library the DS must declare:** none (RAF-based). Just a **variable font** must be provided.
- **Tokens to swap:** `textColor`/`strokeColor` hex → KOL fg tokens; default `fontUrl`/`fontFamily` → KOL variable font.
- **KOL rule flag:** remove the hardcoded `text-transform: uppercase` (no-auto-text-transform); casing is authored at the call site.
- **Accessibility:** duplicated per-char `<span>`s + `whiteSpace:nowrap` + `userSelect:none` — fine for a display heading; keep the semantic text in the `<h1>` content (it is) so screen readers read it normally.
