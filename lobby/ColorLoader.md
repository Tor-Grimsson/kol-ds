---
component: ColorLoader
source: kol-monorepo/apps/web/src/components/loaders/ColorLoader.jsx#L1-L171
date: 2026-07-03
status: draft
deps: [TextPressure]
---

# ColorLoader

## Purpose
The branded intro/loading screen — the centerpiece of the loader set. Fills its parent on a near-black brand backdrop, times-in the **KOLKRABBI** wordmark (rendered as a live variable-font `TextPressure` effect) after 1s, then reveals a bouncing scroll-down chevron after 2s. Any scroll/swipe/key gesture then slides the whole loader up out of view (a "scroll to enter" curtain) and fires `onEnter`. Hides the native cursor and paints its own `CursorTrail` on top.

## Anatomy
- Fragment root. Sibling `<CursorTrail />` (app cursor-follower overlay — **DROP**, see Styling).
- `Motion.div` main container — `w-full h-full flex flex-col`, inline `cursor: none` + `backgroundColor: #121215`; `animate={controls}`, `initial={{ y: 0 }}` (this is the element that slides up on exit).
  - **Top third** — `<div>` `self-stretch flex-1 flex justify-center items-end` (empty spacer).
  - **Middle third** — `self-stretch flex-1 flex flex-col items-center justify-center gap-12`:
    - **Wordmark block** — `Motion.div` (`w-full px-6`), opacity fade-in, wrapping a responsive box `w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] h-20 sm:h-24 md:h-32 mx-auto` → `TextPressure` (`text="KOLKRABBI"`, `fontFamily="TG Root-Tune"`, `fontUrl="/fonts/TGRoot-TuneVF.ttf"`, `textColor="#ffffff"`, `flex/width/weight` on, `italic` off, `minFontSize={40}`).
    - **Scroll chevron** — `Motion.div` (`mt-12`) with an inline 32×32 SVG chevron-down (`viewBox 0 0 24 24`, `polyline points="6 9 12 15 18 9"`, `stroke=currentColor`, `strokeWidth 2`, round caps/joins, `className="text-white"`).
  - **Bottom third** — `<div>` `self-stretch flex-1 flex justify-center items-end` (empty spacer).

## Variants
None. Single timed sequence; behavior is driven by two internal timers + an exit gesture, not props.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| onEnter | () => void | — | Fired after the slide-up exit tween resolves. |
| brand *(new)* | ReactNode | KOLKRABBI TextPressure | **Add** — slot for the brand mark (replaces the hardcoded wordmark). |
| bgColor *(new)* | string / token | `#121215` | **Add** — backdrop color (currently hardcoded brand near-black). |
| markColor *(new)* | string / token | `#ffffff` | **Add** — wordmark + chevron color (currently hardcoded white). |
| wordmarkDelay *(new)* | number (ms) | `1000` | **Add** — expose the reveal timer. |
| scrollDelay *(new)* | number (ms) | `2000` | **Add** — expose the reveal timer. |

## Styling
- **Tailwind** for all layout (three equal `flex-1` thirds, centered middle, `gap-12`, responsive `max-w`/`h` on the wordmark box). No component CSS file.
- **KOL tokens:** none currently — everything is hardcoded hex. Backdrop `#121215` → `var(--kol-bg-*)`; wordmark/chevron `#ffffff` → `var(--kol-fg-primary)`.
- **The animation (framer-motion, no keyframes):**
  - Two `setTimeout`s: `showKolkrabbi` at **1000ms**, `showScroll` at **2000ms** (cleared on unmount).
  - Wordmark: `initial opacity 0 → animate opacity (showKolkrabbi?1:0)`, `transition duration 0.5`.
  - Chevron: `initial {opacity 0, y 0} → animate {opacity showScroll?0.6:0, y showScroll?[0,12,0]:0}`; `transition opacity {duration 0.5}`, `y {duration 1.5, repeat Infinity, ease easeInOut}` (perpetual 12px vertical bounce).
  - Exit slide-up: `useAnimationControls().start({ y: '-100%', transition: { duration 1.8, ease easeInOut } }).then(onEnter)`; also calls `window.scrollTo(0,0)` up front.
  - The inner `TextPressure` runs its own rAF variable-font pressure loop (see TextPressure.md) — do not re-spec.
- **App-specific bits to DROP / convert:**
  - **Hardcoded KOLKRABBI wordmark** → a `brand` slot (default could compose DS `KolWordmark` or the staged `TextPressure`), not a literal string.
  - **Hardcoded brand colors** `#121215` (bg) and `#ffffff` (mark/chevron) → `bgColor` / `markColor` props on KOL tokens.
  - **`<CursorTrail />`** and `cursor: none` — app cursor-context coupling (reads `useCursor()` position, renders 4 chained spring followers). Drop from the DS loader; if a custom cursor is wanted, make it an opt-in slot.
  - **Global `window` gesture listeners** (wheel/touchstart/touchmove/keydown with `preventDefault`) that hijack the page to trigger exit — keep for a full-page "scroll-to-enter" loader, but for a plain loading spinner the exit should be driven by a `loading` prop instead (see RouteLoader.md).
  - Font `TG Root-Tune` / `/fonts/TGRoot-TuneVF.ttf` — app asset path; DS should take the variable font via the `brand` slot / TextPressure props.

## States & interactions
- **enter:** t=0 blank backdrop; **1s** wordmark fades in (0.5s); **2s** chevron fades to 0.6 and starts its infinite bounce.
- **loading:** perpetual chevron bounce + live TextPressure pressure effect; gesture listeners armed once `showScroll` is true.
- **exit-fade:** first qualifying gesture (scroll down / swipe up >50px / nav key) sets `isExiting`, slides the container to `y: -100%` over 1.8s (easeInOut), then resolves `onEnter`. Guarded so it fires once.

## Dependencies
- **TextPressure** (staged — `lobby/TextPressure.md`) for the animated wordmark.
- **framer-motion** (`motion`, `useAnimationControls`) — the reveal/bounce/slide tweens.
- App-only (drop): `CursorTrail` + `CursorContext`.

## Recreation notes
- **Tier:** organism (full-screen timed sequence composing an animated wordmark + gesture-driven exit).
- **Becomes props:** `brand` slot (drop the hardcoded KOLKRABBI + font), `bgColor` / `markColor` (drop the `#121215` / `#ffffff` hex → KOL tokens), `wordmarkDelay` / `scrollDelay` (expose the 1000/2000ms timers), and ideally the exit `duration` (1.8) + chevron bounce params.
- **Split the exit trigger:** the window gesture listeners are page-loader behavior; the reusable core is the timed reveal + slide-up tween. Let a parent (LoaderOverlay/RouteLoader) drive exit via a `loading`/gesture prop so the loader isn't hardwired to hijack `window` scroll.
- **Animation dep:** framer-motion (reveal, infinite bounce, slide-up). Inner variable-font effect needs a KOL variable font (via TextPressure).
- **Drop entirely:** `CursorTrail`, `cursor: none`, and the `#fefefe` cursor colors live in `CursorTrail` (app cursor system), unrelated to the loader's core.
