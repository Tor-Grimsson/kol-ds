# Component audit — tiers, overlap, Button variants

**Run:** 2026-10-01, plan `plan-2026-10-01-showcase-review-round-2.md` W7. **Report only — nothing was moved or merged.** Every move is the user's ruling.

## 1. Atoms that are not one element

The test: an atom renders no other KOL component (the icon aside) and is one interface element. Sixty atoms were scanned for the components they render; the rows below fail the test or were named by the user.

| Atom | Package | What it nests | Proposed tier | Why |
|---|---|---|---|---|
| Chess Board | chess | `ChessPiece` (atom) × 32 | molecule | a board is pieces arranged; the piece is the atom |
| Close Button | component | `Button` or `IconFrame` | stays atom | it is one of the two with a fixed glyph — a preset, not a composition |
| Color Swatch | component | `TransparentX`, `Tooltip` | molecule | a swatch + its transparency mark + its tooltip |
| Action Button | component | `Tooltip` + its own confirm state | molecule | a button, a tooltip and a state machine (the "copied" hold) |
| Segmented Toggle | component | `Tooltip` | stays atom | the tooltip is per cell and optional; one control |
| View Toggle | component | `Tooltip` | stays atom | same |
| Image | component | `AssetPlaceholder` (fallback only) | stays atom | one element; the placeholder is its failure state |
| Textarea | component | `Input` | stays atom | it IS the input, multiline |
| Fader | hardware | `ParamSheet` (organism, touch only) | atom, minus the sheet | an atom opening an organism is upside down — the sheet belongs to whatever holds the fader |
| Knob | hardware | `ParamSheet` (organism, touch only) | atom, minus the sheet | same |
| Rotary Dial | component | none, but draws label + readout rows when `label` is set | atom | label and value are props of the one control, not nested components — but see § The label question |
| Audio Player | component | none — a native `<audio>` and a caption | atom | one native element; the "nested items" are the browser's own control strip |
| Rail Section | workshop | none; a header row that folds its children | molecule | a toggle + a link + a count + a body — nameable parts working as one unit |
| Clearspace Diagram | styleguide | none; three injected layers (grid, keyline, logo) | molecule | it composes three drawings into one figure; nothing about it is a single element |

**The label question (user: "aren't they 'control + value labels'? which would be a molecule?").** Three hardware/value controls draw their own label and readout: Rotary Dial, Knob, Fader. Two honest ways to cut it, and it is one ruling for all three: the bare control is the atom and "control + label + value" is a molecule (`LabeledControl` already exists in kol-component for app atoms); or label and value stay props of the atom. Today it is the second, inconsistently.

**Does the ladder need another rung?** The cases that do not fit are not sizes, they are *collections* — a rack, a mixer, a board with its controls. That is plan 7.5 (what "Set" was meant to be), not a new tier.

## 2. Overlap

| Pair | Finding |
|---|---|
| Audio Player · Hls Video | **Not the same component — the 2026-10-01 "MediaPlayer" ruling was made on my wrong description and I did not carry it out.** `AudioPlayer` is an operated control (native `<audio controls>`). `HlsVideo` is not a player: it is a muted, looping, inert background video with every control deliberately stripped (`pointer-events: none`, no PiP, no download, no fullscreen), used as hero, carousel and preview media in four components (SectionHero, FeaturedCarousel, TiltBento, KindPreview). The source says so in both files. What is wrong is the NAME: "Hls Video" names the transport, not the job. A rename to what it is (background video) fixes the confusion; a merge would produce a player whose video mode cannot be played. |
| Avatar · Profile Avatar | Not the same either. `Avatar` (kol-component) is a person: initials or a photo, on a size ladder. `ProfileAvatar` (kol-styleguide) is a brand-book mock: a brand mark in a round social-profile frame, taking a palette. Same shape, different subject; the long name exists because two packages cannot export `Avatar`. A clearer name (it is a *mock*) would stop the question. |
| Audio Player · Audio Preview · Audio Sheet · Playback Bar | Four audio components. `AudioPlayer` (native strip), `AudioPreview` (the media browser's preview), `AudioSheet` (audio in the Quick Look window) and `PlaybackBar` (play and scrub — the drawn transport). Worth one look together — this is where a real "media player" family is, if there is one. |
| Fader · Slider, Panel Dropdown · Dropdown, Panel Label · Labeled Control | Deliberate twins (ARCHITECTURE §3, kol-hardware): a rack control is a different tier of size from app chrome. Not overlap. |
| Close Button · Icon Button (hardware) · Button `iconOnly` | Three ways to draw an icon-only button. `CloseButton` is a preset of `Button`; hardware `IconButton` is the panel-tier twin. |

## 3. Button variants

`variant` has nine values: `primary · secondary · accent · outline · ghost · nav · danger · grey · control`. `tone` has seven: `primary · secondary · inverted · outline · ghost · grey · sunken`.

| Variant | Same as | Verdict |
|---|---|---|
| `primary` | tone `primary` | redundant — an alias (the CSS says so: the ground variants are aliases of `.kol-tone-*`) |
| `secondary` | tone `inverted` | redundant, and **misleading**: variant `secondary` paints what tone calls `inverted`; tone `secondary` is a different look |
| `outline` | tone `outline` | redundant |
| `ghost` | tone `ghost` | redundant |
| `grey` | tone `grey` | redundant |
| `control` | `ghost` | redundant — a legacy alias of an alias |
| `accent` | — | keeps: its own bundle, not a ground |
| `danger` | — | keeps: the destructive treatment |
| `nav` | — | keeps: the chrome rung |

Six of nine variants are tones under a second name. Left as its own axis, `variant` is three values: `accent · danger · nav` — an intent, where tone is the ground. Removing the six is a published-API change (aliases on the retirement ledger, 30 days), so it is a ruling, not a cleanup.

## 4. Components with no working preview

`pnpm validate:previews` (new, browser gate) — 81 of 325 component pages draw no preview. The list is the gate's output; `--list` prints bare names.

## 5. The four audio components — read 2026-10-01, one recommendation

Read in full: `AudioPlayer` (atoms), `AudioPreview` (molecules — the file also exports `AudioTile`, `VideoTile`, `formatLength`), `AudioSheet`, `PlaybackBar`, plus `usePlayback` and every importer in this repo.

| Component | What it is | Rendered by |
|---|---|---|
| `AudioPlayer` | the browser's native `<audio controls>` strip under a label | nothing in this repo |
| `AudioPreview` (the default export) | a drawn inline transport: play · seek `Slider` · volume popover | nothing in this repo — only its siblings `AudioTile` · `VideoTile` · `formatLength` are imported |
| `AudioSheet` | audio in the Quick Look window: artwork, time, the bar docked in the footer | `MediaLibraryPages` |
| `PlaybackBar` | the transport bar — play, skip, scrub, volume, speed; presentational over `usePlayback` | `AudioSheet`, `VideoSheet`, `QuickLookFrame`, the design editor |

**Recommendation: one transport, `PlaybackBar`. Retire `AudioPlayer` and `AudioPreview`'s player; keep `AudioTile` · `VideoTile` · `AudioSheet` · `PlaybackBar`.** The tile is the column's one-button preview, the sheet is the window, the bar is the transport both sheets share — three jobs, no overlap. The two that go are two more ways to play a file that nothing here draws any more: the live path has been tile → sheet → bar since 2026-09-23.

Before it is done: the importer scan on the MBP is a partial estate (memory: consumer scans run on the iMac) — the two would be deprecated with ledger rows, and drop only after the iMac's scan says nobody imports them. `AudioTile` / `VideoTile` / `formatLength` would move out of `AudioPreview.jsx` into a file named for what is left.
