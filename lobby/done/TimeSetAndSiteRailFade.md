# TimeSetAndSiteRailFade — kol-atlas's Timeline · Month · Week plus a new Day, as one time set; and SiteLayout's rail fades where it scrolls

**Staged:** 2026-10-29 · from kol-website (user: *"in kol-atlas there are date components … we might just need day? and then we have a full 'time' set?"* · *"FADE WHAT VERTICALLY SCROLLS into clipping!!!"*)
**Files:** source, read in place: `~/dev/projects/kol-atlas/apps/workspace/src/timeline/{model.js,view.js,timeline.css}` and `components/Timeline.jsx`

## 1 — The time set

### The problem
record's dashboard (kol-website `apps/record`) has a calendar tab built by hand, and it is being rebuilt on DS parts. The DS has no date views. kol-atlas has three, working and themed: **Timeline** (phases, dated checkpoints, breaks, a Today line), **Month** (a grid) and **Week** ("running this week"), with a shared legend and a view switch. They live in an app (`apps/workspace/src/timeline/`) as a vanilla `mountTimeline(el, model)` plus a React wrapper that maps `--tl-*` tokens onto the workspace palette.

### The fix
- Copy the three views verbatim into the DS as one set (kol-component organisms or a new package, your call), with `--tl-*` mapped to KOL tokens instead of `--ws-*`.
- Add **Day**: the same model's items for one day, by hour, with the same legend and Today line.
- One switch: Timeline · Month · Week · Day. One model: `timelineModel` (kol-atlas `model.js`), so a consumer passes items, not markup.
- kol-atlas then consumes the package and retires its copy (its own remainder).

## 2 — The site rail fades where it scrolls

### The problem
On record (SiteLayout), the rail's list scrolls inside a fixed column and cuts hard at its foot, just above "Light mode", and at its head once scrolled. The app rail already fades (`kol-components-shell.css` `.kol-shell-rail-list--fade`: `mask-image: linear-gradient(to bottom, #000 calc(100% - 3rem), transparent)`), as does the workshop rail (`kol-components-workshop.css` `.shell-rail`, "THE RAIL FADES OUT AT ITS FOOT (2026-10-01)"). kol-framework's SiteLayout rail (SideNav) does not.

### The fix
- Give SiteLayout's scrolling rail the same fade. Fade the foot while more lies below, and the head once scrolled.
- One shared rule, so every vertically scrolling rail or list that clips fades the same way.

## Definition of done
- [ ] Timeline · Month · Week · Day run on a fixture in the reference app, in both themes
- [ ] published
- [ ] record's rail scrolled mid-way fades at both edges, in both themes
- [ ] published

**Remainder at kol-website:** bump; rebuild record's dashboard calendar on the time set; check record's rail.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-component 0.314.0 · kol-theme 0.197.0 · kol-framework 0.62.5 · kol-workshop 0.41.3**.

**1 — The time set.** `TimeSet` (kol-component): kol-atlas's `model.js` and `view.js` carried verbatim into `organisms/time/`. Atlas's `isOptional` is inlined, and an item may carry a `time`. The CSS is kol-theme's `kol-components-time.css`, verbatim, with `--tl-*` mapped to KOL. Milestones are three ink steps, since KOL's accent is its ink, and Today uses `--kol-status-danger`. **Day** is new: the phases running that day and its untimed checkpoints in an all-day lane, timed checkpoints on their hour, and the Today line at the hour now. On today the range stretches to reach the hour now, so the line always shows. One switch, Timeline · Month · Week · Day, one legend, one model (`timelineModel`, exported with `renderTimeline` · `mountTimeline` · `printTimeline`). The fixture is VOYAGER's Field Manual 2027 schedule (`voyager-fixture/timeline`), which runs through today. Walked in apps/layouts (SiteLayout and AppShell, Tools › TimeSet) and the showcase: all four views in dark and light, the December break, a checkpoint at 10:00 on today's Day, the Today line in each.

**2 — Rails fade where they scroll.** One rule: kol-theme's `.kol-scroll-fade` plus kol-component's `useScrollFade(ref)`. The head fades once scrolled and the foot while more lies below. The site rail, the app rail and both workshop rails wear it; their foot-only masks (kol-framework's `.kol-sidenav-scroll--fade`, the app rail's and the workshop rail's) are this rule now. Walked at 520px tall: the site rail at the top fades its foot only, mid-way both edges, at the end its head only, in both themes. The workshop TOC rail fades the same way.
