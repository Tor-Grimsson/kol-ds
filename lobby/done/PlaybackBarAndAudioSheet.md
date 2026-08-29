# PlaybackBarAndAudioSheet — the QuickTime bar as its own molecule, video on it, audio in two variants

**Staged:** 2026-08-27 · from **kol-r2b2** `src/MediaSheets.jsx#L1-L130` + `src/index.css#L67-L76` (user rulings 2026-08-27 against two QuickTime references — video bar, audio window)
**Change:** kol-component `PlaybackBar` (new molecule, out of `VideoSheet`), `VideoSheet` on it, `AudioSheet` (new, `variant` cover | sheet), `utilities/id3.js` reachable · kol-icons `speaker`, `chevrons-right`, `music-note` · kol-theme the bar + scrubber rules

## The bar — ruled against the QuickTime video reference (supersedes 0.107.0's strip)

- Frosted strip over media: `bg-fg-absolute-48 backdrop-blur-xl`, inset 16 (`left-4 right-4 bottom-4`), **radius 12** (`rounded-xl` — replaces "radius 4, never more"), `h-16 px-8 flex items-center gap-7`.
- Glyphs white on media regardless of theme: the ghost `IconFrame` paints `--kol-oq-48` (a theme colour) — the bar sets `color: var(--kol-color-absolute-white)`, opacity .8, 1 on hover / focus-visible.
- Transport cluster `gap-5`: `skip-back-15` · `play` / `pause` · `skip-forward-15` (IconFrame ghost sm).
- Elapsed `kol-mono-16 tabular-nums opacity-80` as **`mm:ss`** (two-digit minutes: `00:12`).
- Scrubber = a native `<input type="range">` (`flex-1 min-w-0`): 2px track at white 40 % (`::-webkit-slider-runnable-track` / `::-moz-range-track`), knob a **4 × 28 white pill** (`margin-top: -13px` to centre on the track). Not the DS `Slider` — no readout box, no round knob.
- Right value = **total length** (`00:25`), not remaining: the reference reads 00:12 / 00:25 with the knob at 48 %.
- Volume behind its icon in the PopoverPanel (the vertical `slider-black` range) as today — the icon should be a **`speaker`** glyph (the set has none; `slider-01` stands in).
- **`>>`** at the far right = playback speed (cycle 1 → 1.5 → 2) — needs a **`chevrons-right`** glyph (the set has `chevron-right` only).
- Presentational: `{ playing, time, duration, onToggle, onSeek, onVolume, place }` — the sheet owns the media element (a `usePlayback(onLoaded)` hook returns `{ ref, handlers, bar }`; the React-compiler lint forbids mutating a ref passed as a prop, so the bar never touches the element).

## VideoSheet

As 0.107.0 — `<video autoPlay playsInline preload="metadata" className="max-w-full max-h-[78vh] rounded">`, click toggles, `onMeta({ w, h, len })` — on the new bar, `place="left-4 right-4 bottom-4 rounded-xl"`.

## AudioSheet — ruled against the QuickTime audio reference

| variant | look |
|---|---|
| `cover` | same as VideoSheet: the artwork is the frame — `w-[min(78vh,100vw_-_10rem)] aspect-square rounded overflow-hidden`, the bar floating (inset 16, radius 12) |
| `sheet` | the QuickTime window: plate `w-[min(100vw_-_10rem,1000px)] rounded overflow-hidden bg-fg-absolute-88`; inside `flex items-center gap-16 p-10 pb-24`: cover square `w-[min(50vh,380px)] aspect-square shrink-0` left, `Time: m:ss` beside it (`kol-mono-16 text-absolute-white`, label opacity .48, value bold .80); the bar flush `left-0 right-0 bottom-0`, no radius |

- Artwork = the ID3 `APIC` cover (`readCover`); no cover → a light square (`bg-absolute-white`) carrying a **`music-note`** glyph (the reference) — the set has none; the kind label stands in.
- `autoPlay`, `onDuration(len)` for the overlay's facts.
- The `10rem` in the widths is the overlay's arrow gutter (see `DocPageAndKindShowcase` (3)).

## `readCover` is unreachable from consumers

`utilities/id3.js` is real, but `package.json` `exports` maps `./utilities/*` → `./src/utilities/*.jsx` only, so `@kolkrabbi/kol-component/utilities/id3` resolves to a file that does not exist; the barrel is not an option (it drags `ExitPreview` → `react-router-dom`). Add `"./utilities/*.js"` (or an explicit `./utilities/id3` entry). kol-r2b2 carries a verbatim copy at `src/lib/id3.js` until then.

## Showcase

The video sheet and both audio variants on the showcase page (`DocPageAndKindShowcase` (5)) — "where we can view properly".

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.114.0 · kol-theme 0.75.0 · kol-icons 0.23.0

`PlaybackBar` is its own molecule, ruled against the reference: frosted `fg-absolute-48` + blur-xl, radius 12, white glyphs (`.kol-playback-bar`), `mm:ss` elapsed / TOTAL, the native scrubber with the 4 × 28 pill knob (`.kol-playback-scrub`), volume behind the new `speaker`, `>>` (`chevrons-right`) cycling 1 → 1.5 → 2 (`onRate`). Presentational — `usePlayback(onLoaded)` owns the element (`{ ref, handlers, bar }`, exported + `hooks/usePlayback`). `VideoSheet` rides it; `AudioSheet` new, `cover` | `sheet`, the ID3 cover via `readCover`, no cover → the `music-note` square. `readCover` reachable at `@kolkrabbi/kol-component/utilities/id3` (explicit exports entry) and on the barrel. Demos: PlaybackBar (simulated clock), AudioSheet (silent WAV, both variants); the video sheet on the `/sets/preview/kind-preview` page runs the bar over a poster — the showcase carries no video. 21 gates clean; verified in source only.

**Remainder here:** none — kol-r2b2: bump kol-component 0.114.0 · kol-theme 0.75.0 · kol-icons 0.23.0; delete `src/MediaSheets.jsx`, `src/lib/id3.js` and the `.r2b2-bar` / `.r2b2-scrub` rules; import `VideoSheet` / `AudioSheet` from the package.
