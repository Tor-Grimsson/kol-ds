# FROZEN — colour-picker work, parked mid-arc for the ThemeToggle ruling

**Frozen:** 2026-07-30 15:28 GMT, on the user's instruction ("freeze this and unfreeze
when done with theme toggle mess"). Nothing here is broken or half-applied — every
piece below is landed, building and gated. This exists so the thread can be picked up
without re-deriving it.

## What is DONE and shipped (do not redo)

| Where | What | State |
|---|---|---|
| `kol-website/_tmp/accent-contrast-proposals/preview.html` | swatch → OS colour picker + editable hex on all six candidates; ratios compute live (WCAG 2.1), row flips to `FAILS 4.5` under the bar; everything downstream follows | done, verified in browser, 335 lines |
| `kol-ds-ui/showcase/src/lib/RampTuner.jsx` | rust-anchor tuner on `/foundations/color`, built over `SpectrumControls` + `ColorInputRow` | done, verified live |
| `kol-ds-ui/showcase/src/lib/color-math.js` | shared hex ⇄ HSV ⇄ HSL + WCAG contrast | done |
| `kol-ds-ui/_tmp/rust-anchor-picker.html` | the standalone artifact version, PARKED by user instruction — do not delete | parked |

## The lesson that got this frozen

The user asked for "a tool to adjust what is already there". Twice I built a new
section instead — a full artifact, then a large dial block bolted into his proposal
page — and the second one also dropped the page's initial `render()` call. His words:
*"you keep changing shit… you actually are being counter productive… ASK."*

**The standing correction: when the ask is a TOOL over existing content, the change is
additive and small. Ask before restructuring anything that already works.** What he
actually wanted was one line of behaviour: click the swatch, get the OS picker.

## To unfreeze

Nothing is pending. The colour work is complete as asked. If it resumes it will be a
NEW ask (e.g. the rust value he settles on getting written into
`packages/framework/kol-brand-color.css:35-39` — which is a source-file edit and needs
his explicit go).

## What took over

`lobby/ThemeToggleSystemState.md` — three findings, #1 a user ruling that contradicts
the 2-variant toggle spec shipped in framework 0.9.0 earlier the same day.
