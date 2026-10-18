# SignalIconsFromMonitor — monitor's missing shapes into kol-icons' signal set, five KOL drawings corrected

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor

## The ask, in the user's words

> "those that arent shipped send them to DS for treatment and they will be added to signal. most others should use DS version"
> grad-rad "is too small in DS" · grid-03 "this is more correct in monitor" · clr-mono "this is missing one dot in DS" ·
> dith-melt "monitor is more right" · dith-xhatch "monitor is more right"

## Context

monitor's Dev → Icons tab (`src/pages/dev/IconsDiff.jsx`, on `CompareGrid`) now pairs each of the 115 icons the app
uses with the kol-icons icon that draws the **same shape**, whatever its name. monitor moves to kol-icons for
everything that has a match. Source SVGs: `~/dev/projects/kol-monitor/src/icons/svg/`.

## 1. Add to the signal set — no kol-icons icon draws these (20)

Redraw each to the icon guide (your treatment), from monitor's SVG. Several share a name with a kol-icons icon that
draws something else (e.g. kol-icons `ascii-back` is boxed, `clr-comp` is two rings) — naming is yours; say which
name each lands under.

| monitor icon | what it draws | source |
|---|---|---|
| ascii-back | unboxed `\` | `00-rack/ascii-back.svg` |
| ascii-dot | unboxed dot | `00-rack/ascii-dot.svg` |
| ascii-pipe | unboxed `\|` | `00-rack/ascii-pipe.svg` |
| clr-comp | circle, vertical diameter, dots at both ends | `00-rack/clr-comp.svg` |
| clr-tri | circle with a triangle of three dots | `00-rack/clr-tri.svg` |
| dith-cross | outlined plus/cross shape | `00-rack/dith-cross.svg` |
| dith-hex | dots in a hex arrangement | `00-rack/dith-hex.svg` |
| gen-color | square in a square | `00-rack/gen-color.svg` |
| gen-pattern | five small circles | `00-rack/gen-pattern.svg` |
| line-grid | square divided into four | `00-rack/line-grid.svg` |
| line-lissa | circle with a curve inside | `00-rack/line-lissa.svg` |
| line-spiral | single spiral | `00-rack/line-spiral.svg` |
| radial-default | blob outline | `00-rack/radial-default.svg` |
| radial-random | irregular blob outline | `00-rack/radial-random.svg` |
| ramp-down | single falling slope | `00-rack/ramp-down.svg` |
| seq-a · seq-b · seq-c · seq-d | letters A · B · C · D | `00-rack/seq-{a,b,c,d}.svg` |
| tr-carets | two filled carets ◀▶ | `00-rack/tr-carets.svg` |

## 2. Correct toward monitor's drawing (5)

| kol-icons icon | wrong | monitor's (the reference) |
|---|---|---|
| grad-rad | the rings sit too small in the frame | ring with a grey outer ring at full size — `00-rack/grad-rad.svg` |
| grid (monitor `grid-03`) | 2×2 squares | 3×3 grid in one frame — `09-layout-ui/grid-03.svg`; a new icon if `grid` stays 2×2 |
| clr-mono | missing the dot on top of the ring | `00-rack/clr-mono.svg` |
| dith-melt | a dripping box | three drip lines with balls on top — `00-rack/dith-melt.svg` |
| dith-xhatch | boxed X | unboxed X over a grey diamond hatch — `00-rack/dith-xhatch.svg` |

## Done means

All 25 in kol-icons; the receipt names the kol-icons name for each of section 1, so monitor can pair them in
`IconsDiff.jsx` and switch the app over.

## ✅ RESOLUTION — 2026-10-18 · kol-icons@0.40.0

kol-icons 0.40.0, approved on Development › Open questions › Round 12 (two review rounds). All 25 already had a kol-icons name — a KOL redraw that had drifted from monitor's (apps/rack uses the same names) — so each is redrawn IN PLACE to monitor's shape, to the icon guide (1.5 round strokes, the 3.5–20.5 live area, rings on the keyline circle, solid dots, no opacity). Names, monitor → kol-icons: ascii-back · ascii-dot · ascii-pipe · clr-comp · clr-tri · clr-mono · dith-cross · dith-hex · dith-melt · dith-xhatch · gen-color · gen-pattern · grad-rad · line-grid · line-lissa · line-spiral · radial-default · radial-random · ramp-down · seq-a · seq-b · seq-c · seq-d · tr-carets — same name; grid-03 → `grid-3x3` (new, layout; `grid` stays 2×2). Today's boxed ascii glyphs stay as `ascii-back-02` · `ascii-dot-02` · `ascii-pipe-02`. User's review changes vs monitor's drawing: radial-default/random are smooth outlines, line-spiral a true spiral, grad-rad two solid rings, dith-xhatch a plain crosshatch (no grey diamond), dith-melt's drips clear their balls, ramp-down is one sawtooth period (distinct from ascii-back).

**Remainder here:** none — kol-monitor bump kol-icons@0.40.0, pair the names in `IconsDiff.jsx`, switch the app over.
