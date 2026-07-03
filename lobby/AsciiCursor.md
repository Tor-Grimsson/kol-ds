---
component: AsciiCursor
source: kol-monorepo/apps/web/src/components/ui/AsciiCursor.jsx#L1-L468
date: 2026-07-03
status: draft
deps: []
---

# AsciiCursor

## Purpose
Full-viewport overlay that replaces the native cursor with an ASCII-art crosshair and layers ambient/interactive effects on top of the whole page: a following crosshair, drifting "cursor stars", click-triggered ASCII fireworks, and a right-click-triggered Space Invader that drops in, fires bullets, and exits. Pure decoration — self-contained, no props, mounted once at the app root. Uses `framer-motion` for the motion-value-driven pieces (bullets, invader, star fades) and plain `setInterval`/RAF-free `setState` for the frame-by-frame ASCII sprites.

## Anatomy
Root `<div id="ascii-cursor-overlay">` — `fixed inset-0 z-[100] pointer-events-none`, `style={{ cursor: 'none' }}`. Contains, in order:
- **`<AsciiCrosshair />`** — the cursor replacement, a `fixed` ASCII glyph block that tracks `mousemove`. Two states: default (heavy ticks `╻ ╺·╸ ╹`) vs hover (diamond `◇ ◇·◇ ◇`). Hover is detected by hiding the overlay's pointer-events for one frame, calling `document.elementFromPoint`, and testing `el.closest('a, button, [role="button"], input, textarea, select, label[for]')`. Renders a 4-way 1px-offset dark backing layer (opacity 0.8) behind a foreground layer (opacity 0.5) for legibility on any background.
- **`<CursorStars />`** — spawns a single ASCII glyph (`· + * + · - ·`) at a random angle/distance (30–80px) from the cursor every 400–1200ms; each fades in-out over 1.2s then self-removes.
- **`fireworks[]`** — one `<Firework>` per click; a 5-frame ASCII sprite sequence.
- **`invaders[]`** — one `<Invader>` per right-click (rate-limited to one per 2500ms).

## Variants
No prop variants. Internal effect variants:
- **Firework type** picked by `Math.random()` on click: `type A` cross-burst (60%), `type B` ring-burst (20%), `type C` diamond-scatter (20%). Each type is a hardcoded array of 5 ASCII string-rows arrays.
- **Crosshair** default vs hover glyph set (interaction state, not a prop).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | Component takes no props. |

## Styling
- **Root:** `fixed inset-0 z-[100] pointer-events-none` + inline `cursor: none`.
- **Firework:** `fixed font-mono text-[14px] leading-none pointer-events-none select-none`; inline `left/top` = click coords, `transform: translate(-50%,-50%)`, `whiteSpace: pre`, `textAlign: center`, `color: var(--kol-surface-on-primary)`, `opacity: max(0.15, 1 - frame*0.2)` (fades per frame).
- **CursorStars:** each star `fixed font-mono pointer-events-none select-none`, inline `fontSize: 16px`, `color: var(--kol-surface-on-primary)`; framer-motion `animate={{ opacity: [0,0.35,0] }}` over `1.2s ease-in-out`.
- **AsciiCrosshair:** `fixed font-mono text-[10px] leading-[1.1] pointer-events-none select-none`, `transform: translate(-50%,-50%)`, `whiteSpace: pre`, `textAlign: center`. Backing layers `absolute inset-0`, `color: var(--kol-surface-primary)` opacity 0.8, offset `translate(±1px, ±1px)`. Foreground `color: var(--kol-surface-on-primary)` opacity 0.5.
- **Invader sprite:** `absolute font-mono text-[3px] leading-none ... whitespace-pre`, `<pre>` `color: var(--kol-surface-on-primary)` opacity 0.6, `translate(-50%,-50%)`.
- **Bullet:** `absolute font-mono text-[4px]`, glyph `│`, `color: var(--kol-surface-on-primary)`.
- **Tokens used:** `var(--kol-surface-on-primary)` (all glyph fills) and `var(--kol-surface-primary)` (crosshair backing). These are already KOL tokens — keep.
- **App-specific bits to DROP:** the global cursor-hiding side effect (injects a `<style id="ascii-cursor-hide">*, *::before, *::after { cursor: none !important; }` into `document.head`, toggled on `mouseenter`/`mouseleave`/`window blur`/`focus`) is app-global behavior — in the DS this should be opt-in / documented, not fired unconditionally on mount. The `document.getElementById('ascii-cursor-overlay')` lookup by hardcoded id couples the crosshair to the overlay's id string; a ref should replace it.

## States & interactions
- **mousemove (window):** crosshair follows cursor; recomputes hover state via `elementFromPoint`; CursorStars reads latest cursor pos from a ref.
- **click (window):** spawns a firework at `clientX/clientY`, random type; sprite advances one frame every **130ms** via `setInterval`; on last frame calls `onDone` to unmount.
- **contextmenu (window):** `preventDefault()`, rate-limited to 1/2500ms; spawns an Invader.
  - Invader `posY` drops from `y-60` to `y` over **0.3s easeOut** (framer `animate` on a motion value).
  - Fires 3 bullets at **250 / 450 / 650ms**; each bullet `y` animates `+300` over **0.5s linear**.
  - Exit at **800ms**: `posX` animates to `x + innerWidth*0.6` over **0.7s easeIn**.
  - Cleanup/unmount at **1800ms**.
- **CursorStars spawn loop:** first star at 500ms, then re-scheduled every `400 + random*800`ms; each star lives 1200ms.
- **window blur/focus:** restores/re-hides native cursor (so devtools is usable).

## Dependencies
- `framer-motion`: `motion`, `useMotionValue`, `animate` (drives Bullet `y`, Invader `posX/posY`, and CursorStars opacity keyframes).
- React `useState/useEffect/useCallback/useRef`.
- No DS component deps.

## Recreation notes
- **Tier:** organism (page-level overlay composed of 4 sub-effects; singleton).
- **Sub-components** (`Firework`, `Bullet`, `Invader`, `CursorStars`, `AsciiCrosshair`) are local — keep them co-located inside the DS component file, not exported.
- **Values that should become props / config** (currently all hardcoded): firework frame interval (130ms), firework type probabilities (0.6/0.8), star spawn cadence (400–1200ms) + lifetime (1200ms) + spawn radius (30–80px), invader rate-limit (2500ms) and its full timing sequence (0.3/0.25/0.45/0.65/0.8/1.8s), crosshair glyph sets, z-index (100). At minimum expose an on/off + an `enableCursorHide` flag.
- **Animation library the DS must declare:** `framer-motion`.
- **Tokens:** already on `--kol-surface-on-primary` / `--kol-surface-primary` — no swaps needed.
- **Drop app coupling:** the document-head cursor-hiding style injection and the id-string overlay lookup (`ascii-cursor-overlay`) — replace with a ref + opt-in prop.
- **Reduced-motion:** none present; DS version should gate the whole overlay behind `prefers-reduced-motion: no-preference`.
