---
component: SignedOutStageStill
source: kol-fxr/src/components/HomeStage.jsx#L1-L100 · kol-fxr/src/loops/growth/engine.js#L1-L230
staged: 2026-10-30
status: draft
deps: [HubHome, GrowthLineStage, kol-growth]
---

# SignedOutStageStill

## Purpose
Two fixes found on fxr's signed-out Home (plan 44 W6), both for KOL code fxr does not own.

1. **HubHome: sign in overlays, never resizes the stage.** User 2026-10-30: *"this signin/signup shelf should not interfere with the growth, its just supposed to change bg color and overlay the home view... nothing should retrigger the growth."* Today the stage wrapper animates `left` to 672 when the column opens (`HubHome.jsx`, "the stage re-centres in what the column leaves") — any stage that sizes to its box reseeds. This supersedes FloatingStyleAndSignInDemos' "the stage re-centres".
2. **The growing line jitters once finished** — `@kolkrabbi/kol-growth` 0.1.0 and `GrowthLineStage` carry fxr's loop verbatim, bugs included. User 2026-10-30: *"when morph reaches the edges is just jitters, its very bugged … allow growth outside of viewport and limit it in some other way so it just sits still"*.

## Anatomy / changes
**HubHome (kol-shell)** — the stage wrapper stays `absolute inset-0` open or closed; the column (`surface-primary`, opaque) slides over it and the grey layer fades, nothing else moves.

**Growth engine (kol-growth)** — fxr's fixed `engine.js`:
- `bleed` param (default 0 = today's framed clamp): nodes may run `bleed` units past every edge; a node outside the frame is **frozen** — no force, no split, no merge, no growth split. The spatial hash spans the bled frame.
- `step(zone)` — `{ x, y, r }`: nodes outside the zone are frozen the same way, so a finished line moves only around the pointer.

**GrowthLineStage (kol-component)** — fxr's fixed `HomeStage.jsx` loop:
- **Finished once:** at the cap set a `full` flag; reading `x.length < cap` live is the bug — merges drop the count back under the cap and the WHOLE line steps forever.
- **Finished = local:** after the cap, step only `zone = { pointer, r: 0.36 · min(w, h) }`.
- **A resting pointer is not a force:** poke and wake only when the smoothed pointer moved > 0.3 px or is pressed; otherwise it sleeps ~1 s after the pointer stops.
- `bleed: 48` on the stage.

## Measured (fxr, Playwright 1440×900, canvas alpha diff)
| | before | after |
|---|---|---|
| finished line, pointer circling the centre — px changed in the 80 px edge band | 20 701 | 0 |
| pointer resting on the stage, 60 frames later | still churning | 0 |
| sign in opened mid-growth | reseeded | same line keeps growing, canvas 1440 wide throughout |

## Dependencies
None new.

## Recreation notes
Carry fxr's two files' changes as written; `bleed` default 0 keeps every framed consumer (fxr's effect and generator) unchanged. fxr keeps its local engine until it adopts kol-growth — that is not asked here.

## Built — 2026-10-30
- `packages/shell/src/HubHome.jsx` — the stage wrapper is `absolute inset-0` open or closed; the `left` re-centre animation is gone, the column only overlays.
- `packages/growth/src/engine.js` — fxr's fixed engine carried verbatim (`bleed`, frozen out-of-frame nodes, bled spatial hash, `step(zone)`).
- `packages/growth/src/selftest.mjs` — asserts for `step(zone)` freezing outside the zone and `bleed` holding the bled frame.
- `packages/growth/README.md` — `step(zone)` and `bleed` documented.
- `packages/component/src/organisms/GrowthLineStage.jsx` — `full` flag set once at the cap, zone-only steps after it (`r: 0.36 · min(w, h)`), poke/wake only on > 0.3 px moves or a press, `bleed: 48` (a `params.bleed` overrides).
- `docs/documentation/04-compositions/11-shell-system.md` — "the stage re-centres" replaced: the stage stays full-bleed, never resized.
- `docs/documentation/03-components/01-inventory.md` — GrowthLineStage row notes the resting pointer, local steps and bleed.

Verified: `pnpm --filter @kolkrabbi/kol-growth test` ok; validate:syntax · imports · vault-links · drift clean (validate:props has 3 pre-existing P1s in styleguide LockupLab, unrelated). Playwright 1440×900 — studio-hub: stage box 0/1440 closed, mid-slide and open; apps/growth: finished orb with a resting pointer, canvas unchanged over 1.5 s. Not published, versions not bumped.

## ✅ RESOLUTION — 2026-10-30 · kol-shell@0.91.2 · kol-component@0.319.1 · kol-growth@0.2.0

HubHome's stage stays absolute inset-0 with sign-in open or closed — the column overlays, the grey layer fades, nothing resizes (kol-shell 0.91.2). kol-growth 0.2.0 carries fxr's fixed engine verbatim: bleed (default 0) with off-frame nodes frozen and the hash spanning the bled frame, and step(zone). GrowthLineStage (kol-component 0.319.1): full flag set once at the cap, zone-only steps after it (r 0.36·min(w,h)), poke/wake only on a >0.3px move or a press, bleed 48 by default. Verified on Playwright 1440×900: studio-hub's stage box held 0/1440 closed, mid-slide and open; apps/growth's finished orb with a resting pointer was pixel-identical over 1.5s.

**Remainder here:** none — kol-fxr bump kol-shell 0.91.2 · kol-component 0.319.1 · kol-growth 0.2.0.


## Follow-up — 2026-10-30 (from the kol-fxr session, on the user's instruction: *"DS shipped a broken growth engine. I need you to package the growth engine like you have it"*)

0.2.0 / 0.319.1 / 0.91.2 carried what this ticket asked, and two of its asks were wrong: the pointer zone still jittered (a packed line never rests; growth split edges anywhere and shoved the whole line), and dropping the re-centre was a misreading — the user wants the growth centred in the grey that is left. Built in the source, **not published**:
- `packages/growth` **0.3.0** — kol-fxr's engine verbatim: `settle` (packed nodes cool and freeze, growth only at the front, `poke` re-heats); `step(zone)` retired; selftest asserts a grown line rests. 0.2.0's engine kept at `_tmp/2026-10-30-growth-0.2.0/engine.js`.
- `packages/component` **0.319.2** — GrowthLineStage `settle: 120`, one step a frame, the zone gone.
- `packages/shell` **0.91.3** — HubHome's stage slides `md:translate-x-[336px]` with the column open: centred in the grey, never resized.
- `docs/documentation/04-compositions/11-shell-system.md` — the line updated.
Checked: kol-growth selftest ok · validate:syntax · validate:imports clean. Measured in kol-fxr (same engine and loop): 98% of the line moving per step → 8–13% growing, 3% grown; sign in moves the centre 720 → 1056 with the canvas 1440 wide and no reseed. Not browser-checked inside kol-ds-ui.
